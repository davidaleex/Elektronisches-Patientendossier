"""
Unstrukturierter Import: PDF-Laborbericht -> vorgeschlagenes FHIR-Bundle.

Zwei-Stufen-Pipeline für unstrukturierte Befunde (Brodbeck-Scope: "etwa durch
Parsing oder KI-basierte Ansätze"):

1.  EXTRAKT (hier): rohes PDF -> strukturiertes FHIR-Bundle. Liefer-Pfad ist ein
    **deterministischer Parser**: pdfplumber liest den Text-Layer des PDF, eine
    zeilenbasierte Erkennung holt pro Tabellenzeile Parameter, Wert, Einheit,
    Referenzbereich und (falls vorhanden) LOINC heraus. Es wird nichts erfunden:
    Was sich nicht eindeutig als Messzeile erkennen lässt, wird ignoriert; was
    sich nicht gegen die Master Data auflösen lässt, fällt später im Import-
    Service als `skipped_unknown` heraus.

    Bewusst regelbasiert statt KI: für ein kontrolliertes Layout (die Demo-PDFs)
    ist das verlustfrei, nachvollziehbar und halluzinationsfrei. Für beliebige
    Real-Labor-PDFs mit variablem Layout bleibt der KI-/Claude-Pfad die Antwort
    — als Ausblick (M6.1) in `_call_claude_api` skizziert, nicht aktiviert.

2.  REVIEW + IMPORT (Frontend + bestehender Service): das vorgeschlagene Bundle
    wird im UI gezeigt, der/die Nutzer:in bestätigt, dann läuft es durch
    denselben `import_fhir_bundle` wie der strukturierte FHIR-Pfad (Master-Data-
    Matching via LOINC/UCUM, Duplikat-Erkennung auf Mess-Ebene). So kann ein
    Fehlparse nicht unkontrolliert in die DB rutschen.

Master-Data-gestütztes Matching: Steht in der PDF-Zeile ein LOINC-Code, wird er
direkt übernommen. Fehlt er (realistischer Fall), versucht der Parser, den
Parameter über seinen **Namen** gegen die Master Data aufzulösen und den dort
hinterlegten LOINC zu setzen. Damit trägt das Master-Data-"Template" auch ohne
LOINC im PDF — und beweist gleichzeitig seinen Wert.
"""

import io
import re
import shutil
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from .models import LabParameter

# Schweizer Zeitzone — lokalisiert den Mess-Zeitpunkt korrekt inkl. Sommerzeit
# (Mai -> +02:00, Januar -> +01:00), damit der Import-Service eine aware
# datetime mit Offset bekommt (USE_TZ=True).
_TZ = ZoneInfo("Europe/Zurich")

_LOINC_SYSTEM = "http://loinc.org"
_UCUM_SYSTEM = "http://unitsofmeasure.org"

# Eine LOINC-Notation am Zeilenende: 1-6 Ziffern, Bindestrich, Prüfziffer.
_LOINC_RE = re.compile(r"^\d{1,6}-\d$")

# Mess-Zeitpunkt aus dem Kopf: "Entnahme: 10.05.2026, 14:40 (...)".
_ENTNAHME_RE = re.compile(
    r"Entnahme:?\s*(\d{2})\.(\d{2})\.(\d{4})(?:,?\s*(\d{1,2}):(\d{2}))?"
)
# Fallback-Datum, falls keine "Entnahme"-Zeile da ist.
_ANY_DATE_RE = re.compile(r"(\d{2})\.(\d{2})\.(\d{4})")

# Eine Messzeile: Name | Wert [Flag] | Einheit | Referenzbereich | [LOINC].
# Rechtsbündig gedacht: LOINC optional am Ende, davor Referenzbereich, davor
# Einheit (zusammenhängend, z. B. "10*9/L", "µmol/L"), davor Wert + optionaler
# Flag-Buchstabe (H/L/N), der Rest ist der Parametername.
_ROW_RE = re.compile(
    r"""^
    (?P<name>.+?)\s+
    (?P<value>-?\d+(?:[.,]\d+)?)\s*
    (?P<flag>[HhLlNn])?\s+
    (?P<unit>\S+)\s+
    (?P<ref>.+?)
    (?:\s+(?P<loinc>\d{1,6}-\d))?
    \s*$
    """,
    re.VERBOSE,
)

# Referenzbereich-Notationen: "<5", "< 50", ">1.0", "4–10", "13.5–17.5".
# Bindestrich/En-Dash beide zulassen.
_REF_HIGH_RE = re.compile(r"^<\s*([\d.,]+)$")
_REF_LOW_RE = re.compile(r"^>\s*([\d.,]+)$")
_REF_RANGE_RE = re.compile(r"^([\d.,]+)\s*[–-]\s*([\d.,]+)$")


def extract_fhir_bundle_from_pdf(pdf_bytes: bytes, filename: str | None = None) -> dict:
    """
    Extrahiert aus einem PDF-Befund ein FHIR-Bundle (Form wie ein strukturiertes
    Upload-Bundle, damit es durch denselben Import-Service läuft).

    Wirft ValueError, wenn der Text-Layer leer ist oder keine einzige Messzeile
    erkannt wurde — dann soll der Aufrufer dem/der Nutzer:in eine klare Rückmeldung
    geben statt ein leeres Bundle zu importieren.
    """
    text = _pdf_to_text(pdf_bytes)
    if not text.strip():
        raise ValueError(
            "PDF enthält keinen lesbaren Text-Layer (vermutlich gescanntes Bild). "
            "Für solche Befunde wäre der KI-/OCR-Pfad nötig."
        )

    effective_dt = _parse_effective_datetime(text)
    patient_name = _parse_patient_name(text)

    observations = []
    for line in text.splitlines():
        parsed = _parse_row(line)
        if parsed is not None:
            observations.append(parsed)

    if not observations:
        raise ValueError(
            "Keine Messzeile im PDF erkannt — Layout nicht parsebar."
        )

    return _build_bundle(observations, effective_dt, patient_name, filename)


def _pdf_to_text(pdf_bytes: bytes) -> str:
    """
    Liest den Text-Layer eines PDF. Backend-agnostisch: bevorzugt das
    pure-python `pdfplumber` (falls installiert), fällt sonst auf das
    System-Binary `pdftotext` (poppler) zurück. Beide liefern zeilenweise
    denselben Tabelleninhalt, den der Zeilenparser danach erkennt.
    """
    text = _text_via_pdfplumber(pdf_bytes)
    if text is not None:
        return text
    text = _text_via_pdftotext(pdf_bytes)
    if text is not None:
        return text
    raise RuntimeError(
        "Kein PDF-Text-Extraktor verfügbar — weder pdfplumber (pip) noch "
        "pdftotext (poppler) gefunden."
    )


def _text_via_pdfplumber(pdf_bytes: bytes):
    """Extraktion via pdfplumber; None, wenn das Paket nicht installiert ist."""
    try:
        import pdfplumber  # lazy: optionales Dependency
    except ImportError:
        return None
    parts = []
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            parts.append(page.extract_text() or "")
    return "\n".join(parts)


def _text_via_pdftotext(pdf_bytes: bytes):
    """Extraktion via `pdftotext -layout`; None, wenn das Binary fehlt."""
    binary = shutil.which("pdftotext")
    if binary is None:
        return None
    with tempfile.TemporaryDirectory() as tmp:
        pdf_path = Path(tmp) / "in.pdf"
        pdf_path.write_bytes(pdf_bytes)
        result = subprocess.run(
            [binary, "-layout", str(pdf_path), "-"],
            capture_output=True,
            timeout=30,
        )
    return result.stdout.decode("utf-8", errors="replace")


def _parse_effective_datetime(text: str) -> datetime:
    """Mess-Zeitpunkt aus dem Kopf; lokalisiert auf Europe/Zurich."""
    m = _ENTNAHME_RE.search(text) or _ANY_DATE_RE.search(text)
    if not m:
        raise ValueError("Kein Mess-/Ausstellungsdatum im PDF gefunden.")
    day, month, year = int(m.group(1)), int(m.group(2)), int(m.group(3))
    hour = int(m.group(4)) if m.lastindex and m.lastindex >= 4 and m.group(4) else 0
    minute = int(m.group(5)) if m.lastindex and m.lastindex >= 5 and m.group(5) else 0
    return datetime(year, month, day, hour, minute, tzinfo=_TZ)


def _parse_patient_name(text: str) -> str | None:
    """Patientenname aus dem Kopf (nur fürs Anzeige-display; Patient kommt
    im Import ohnehin aus dem Endpoint, nicht aus dem Bundle)."""
    m = re.search(r"Patient:?\s+(.+)", text)
    return m.group(1).strip() if m else None


def _parse_row(line: str):
    """
    Versucht, eine Textzeile als Messzeile zu deuten. Gibt ein dict mit den
    fertigen Observation-Bausteinen zurück, oder None wenn die Zeile keine
    erkennbare Messung ist (Kopf, Panel-Titel, Kommentar, Leerzeile).
    """
    m = _ROW_RE.match(line.strip())
    if not m:
        return None

    name = m.group("name").strip()
    # Kopf-/Strukturzeilen aussortieren, die zufällig dem Muster ähneln.
    if not name or name.lower() in ("parameter", "wert"):
        return None

    raw_value = m.group("value").replace(",", ".")
    try:
        value = float(raw_value)
    except ValueError:
        return None
    # Ganzzahl ohne Nachkomma als int ausgeben (sauberes FHIR wie in den
    # kuratierten Bundles: 38 statt 38.0).
    if value.is_integer():
        value = int(value)

    unit = m.group("unit").strip()
    loinc = m.group("loinc")
    low, high = _parse_reference(m.group("ref").strip())

    # LOINC: aus der Zeile, sonst über den Namen aus der Master Data ableiten.
    code = loinc or _loinc_for_name(name)
    if code is None:
        # Ohne auflösbaren LOINC kann der Import-Service nicht matchen — die
        # Zeile wird übersprungen (lieber weglassen als raten).
        return None

    return {
        "name": name,
        "loinc": code,
        "value": value,
        "unit": unit,
        "low": low,
        "high": high,
    }


def _parse_reference(ref: str):
    """Referenzbereich-Text -> (low, high), je optional float/None."""
    m = _REF_RANGE_RE.match(ref)
    if m:
        return float(m.group(1).replace(",", ".")), float(m.group(2).replace(",", "."))
    m = _REF_HIGH_RE.match(ref)
    if m:
        return None, float(m.group(1).replace(",", "."))
    m = _REF_LOW_RE.match(ref)
    if m:
        return float(m.group(1).replace(",", ".")), None
    return None, None


def _loinc_for_name(name: str) -> str | None:
    """
    Master-Data-Fallback: Parametername -> hinterlegter LOINC. Greift, wenn das
    PDF keinen LOINC mitführt (realistischer Fall). Erst exakter Name, dann
    case-insensitive; bei Mehrdeutigkeit kein Rateversuch.
    """
    qs = LabParameter.objects.filter(name__iexact=name, code_system=_LOINC_SYSTEM)
    if qs.count() == 1:
        return qs.first().code
    return None


def _build_bundle(observations, effective_dt, patient_name, filename) -> dict:
    """Baut das FHIR-Bundle in der Form, die `import_fhir_bundle` erwartet."""
    iso_dt = effective_dt.isoformat()
    bundle_id = (filename or "pdf-import").rsplit(".", 1)[0]

    entries = []
    for i, obs in enumerate(observations, start=1):
        ref_range = {}
        if obs["low"] is not None:
            ref_range["low"] = {"value": obs["low"], "unit": obs["unit"]}
        if obs["high"] is not None:
            ref_range["high"] = {"value": obs["high"], "unit": obs["unit"]}

        resource = {
            "resourceType": "Observation",
            "id": f"{bundle_id}-{i:02d}",
            "status": "final",
            "category": [{
                "coding": [{
                    "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                    "code": "laboratory",
                }]
            }],
            "code": {
                "coding": [{
                    "system": _LOINC_SYSTEM,
                    "code": obs["loinc"],
                    "display": obs["name"],
                }]
            },
            "effectiveDateTime": iso_dt,
            "valueQuantity": {
                "value": obs["value"],
                "unit": obs["unit"],
                "system": _UCUM_SYSTEM,
                "code": obs["unit"],
            },
        }
        if patient_name:
            resource["subject"] = {"display": patient_name}
        if ref_range:
            resource["referenceRange"] = [ref_range]

        entries.append({"resource": resource})

    return {
        "resourceType": "Bundle",
        "id": bundle_id,
        "type": "collection",
        "timestamp": iso_dt,
        "entry": entries,
    }


def _call_claude_api(pdf_bytes: bytes) -> dict:
    """
    Ausblick (M6.1) — KI-Pfad für beliebige, nicht parsebare Layouts. Bewusst
    nicht aktiviert: kein API-Key im PoC, und für die kontrollierten Demo-PDFs
    ist der deterministische Parser oben verlustfrei und halluzinationsfrei.

    Skizze des produktiven Aufrufs (Claude Sonnet, PDF nativ, Tool-Use erzwingt
    die JSON-Form, sodass keine Freitext-Halluzination möglich ist):

        client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        resp = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            tools=[FHIR_BUNDLE_TOOL_SCHEMA],
            tool_choice={"type": "tool", "name": "submit_fhir_bundle"},
            messages=[{
                "role": "user",
                "content": [
                    {"type": "document",
                     "source": {"type": "base64",
                                "media_type": "application/pdf",
                                "data": base64.b64encode(pdf_bytes).decode()}},
                    {"type": "text", "text": EXTRACTION_PROMPT},
                ],
            }],
        )
        return resp.content[0].input  # tool-use payload = das Bundle

    Der Prompt liefert das Master-Data-Template (LabParameter mit LOINC +
    erwartbare Units) und verbietet erfundene Parameter.
    """
    raise NotImplementedError(
        "KI-Pfad (M6.1) ist als Ausblick skizziert, aber nicht aktiviert. "
        "Der deterministische Parser ist der Liefer-Pfad."
    )
