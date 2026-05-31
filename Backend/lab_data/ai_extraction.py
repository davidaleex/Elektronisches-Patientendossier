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
Badge anzeigen kann. Auch in der BA-Doku ist diese Stufe klar als „echte
Integration vorbereitet, im PoC durch Mock ersetzt" zu markieren.
"""

import json
from pathlib import Path

from django.conf import settings

# Pfad zum kuratierten Bundle, das der Mock zurückspielt. demo_b wurde gewählt,
# weil es 8 Observations über mehrere Panels abdeckt (Hämatologie/Lipide/
# Stoffwechsel/Entzündung) — gibt im Vorschau-Modal eine aussagekräftige Tabelle.
_MOCK_BUNDLE_PATH = (
    Path(settings.BASE_DIR)
    / "lab_data"
    / "demo_bundles"
    / "demo_b_folge_2026-06-12.json"
)


def extract_fhir_bundle_from_pdf(pdf_bytes: bytes) -> dict:
    """
    Extrahiert aus einem PDF-Befund ein FHIR-Bundle (Form wie demo_a/b/c.json).

    Im Mock-Modus (default, `USE_FAKE_AI=True`) wird `pdf_bytes` ignoriert und
    ein vordefiniertes Bundle zurückgegeben. Wird auf echte Claude-Integration
    umgestellt, erwartet die Funktion immer noch dieselbe Signatur und liefert
    dieselbe Bundle-Form zurück — die Aufrufer (Endpoint + Frontend) ändern
    sich nicht.
    """
    if getattr(settings, "USE_FAKE_AI", True):
        return _load_mock_bundle()
    return _call_claude_api(pdf_bytes)


def _load_mock_bundle() -> dict:
    """Lädt das kuratierte Demo-Bundle und gibt es als dict zurück."""
    with _MOCK_BUNDLE_PATH.open("r", encoding="utf-8") as f:
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
