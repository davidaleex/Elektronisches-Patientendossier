"""
KI-Extraktion: PDF-Befund → vorgeschlagenes FHIR-Bundle.

Zwei-Stufen-Pipeline für unstrukturierte Befunde (Brodbeck-Scope, optional):

1.  EXTRAKT (hier): rohes PDF → strukturiertes FHIR-Bundle. Wäre produktiv
    ein Aufruf an Claude (Sonnet 4.6, PDF nativ) mit Master-Data-Template
    + Tool-Use-erzwungenem JSON-Output. Im PoC ein Mock, der ein kuratiertes
    Demo-Bundle zurückgibt — Architektur und Endpoint-Form sind identisch
    zur echten Integration. Umschalten = `USE_FAKE_AI=False` und die
    `_call_claude_api`-Funktion ausimplementieren.

2.  REVIEW + IMPORT (Frontend + bestehender Service): das vorgeschlagene
    Bundle wird im UI gezeigt, der/die Nutzer:in bestätigt, dann läuft es
    durch denselben `import_fhir_bundle` wie der strukturierte FHIR-Pfad
    (Master-Data-Matching, Duplikat-Erkennung auf Mess-Ebene). So können
    Halluzinationen nicht unkontrolliert in die DB rutschen.

Demo-Ehrlichkeit: Die Antwort enthält `mock=True`, damit das Frontend einen
Badge anzeigen kann. Damit der Mock nicht täuscht („egal welche PDF, immer
dasselbe Ergebnis"), wird der Filename auf das gleichnamige Bundle in
`Demofiles/strukturiert/` gemappt — Upload `04_infektabklaerung-akut.pdf`
liefert auch wirklich die Werte aus `04_infektabklaerung-akut.json`. Passt
keiner, fällt der Mock auf das erste Demo-Bundle zurück.
"""

import json
from pathlib import Path

from django.conf import settings

# Ordner mit den kuratierten Bundles. Der Mock zieht hier seine Antworten her.
_DEMO_BUNDLE_DIR = (
    Path(settings.BASE_DIR).parent / "Demofiles" / "strukturiert"
)

# Fallback-Bundle, wenn der Filename keinem Demo-Slug entspricht.
_DEFAULT_MOCK_SLUG = "01_jahrescheck-hausarzt"


def extract_fhir_bundle_from_pdf(pdf_bytes: bytes, filename: str | None = None) -> dict:
    """
    Extrahiert aus einem PDF-Befund ein FHIR-Bundle (Form wie ein strukturiertes
    Upload-Bundle).

    Im Mock-Modus (default, `USE_FAKE_AI=True`) wird `pdf_bytes` ignoriert und
    anhand des `filename` das passende Demo-Bundle aus `Demofiles/strukturiert/`
    geladen. Wird auf echte Claude-Integration umgestellt, bleibt die Signatur
    gleich und liefert dieselbe Bundle-Form zurück — die Aufrufer ändern sich nicht.
    """
    if getattr(settings, "USE_FAKE_AI", True):
        return _load_mock_bundle(filename)
    return _call_claude_api(pdf_bytes)


def _load_mock_bundle(filename: str | None) -> dict:
    """
    Wählt das Demo-Bundle, das zum hochgeladenen PDF passt:
    Stem des Filenames (`04_infektabklaerung-akut`) → `<stem>.json`.
    Findet sich kein Match, fällt der Mock auf den Default zurück.
    """
    slug = Path(filename).stem if filename else None
    candidate = _DEMO_BUNDLE_DIR / f"{slug}.json" if slug else None
    bundle_path = candidate if candidate and candidate.exists() else (
        _DEMO_BUNDLE_DIR / f"{_DEFAULT_MOCK_SLUG}.json"
    )
    with bundle_path.open("r", encoding="utf-8") as f:
        return json.load(f)


def _call_claude_api(pdf_bytes: bytes) -> dict:
    """
    Echter Pfad — Platzhalter bis ANTHROPIC_API_KEY verfügbar ist (Issue #28
    zurückkommen lassen). Skizze des produktiven Aufrufs:

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
    erwartbare Units) und verbietet erfundene Parameter. Tool-Use erzwingt
    die JSON-Form — keine Freitext-Halluzinationen.
    """
    raise NotImplementedError(
        "Echte Claude-Integration ist vorbereitet, aber kein API-Key gesetzt. "
        "Setze USE_FAKE_AI=True oder implementiere _call_claude_api(...)."
    )
