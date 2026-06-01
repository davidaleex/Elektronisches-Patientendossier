# Demo-PDFs für die KI-Extraktion (M6)

`demo_b_befund.pdf` ist ein gerenderter Schein-Befund (HTML → Headless-Chrome → PDF),
gedacht zum Vorzeigen des Upload-Flows: PDF rauf → Mock-AI extrahiert ein FHIR-Bundle
→ Vorschau-Modal → Bestätigen → Import.

Inhalt entspricht 1:1 `demo_bundles/demo_b_folge_2026-06-12.json` (8 Observations).
Solange `USE_FAKE_AI=True` ist, ist der Inhalt der hochgeladenen PDF egal — der Mock
spuckt immer dieses Bundle aus.

## Regenerieren

```sh
cd Backend/lab_data/demo_pdfs
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=demo_b_befund.pdf \
  "file://$PWD/demo_b_befund.html"
```
