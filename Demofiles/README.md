# Demofiles — Asset-Sammlung für Demos & Tests

Hier liegen die Files, die du im UI hochlädst, um den Import-Flow live zu zeigen.
**Code-frei** — wer hier Bundles oder PDFs ergänzt, ändert keine Anwendung.

| Ordner | Inhalt | Wofür |
|---|---|---|
| `strukturiert/` | FHIR-R4-Bundles (`.json`) für CH-LAB-Reports | Direkter Import via Patient-/Arzt-Upload („Strukturiert (FHIR-JSON)") — testet M5 |
| `unstrukturiert/` | PDF-Befund (gerenderter Schein-Befund) | KI-Extraktions-Flow: PDF rauf → Vorschau-Modal → Import — testet M6 |

Details + erwartetes Verhalten in den jeweiligen Unterordner-READMEs.

> Die Mock-KI (M6) lädt intern eines der Bundles aus `strukturiert/` als „extrahiertes
> Ergebnis", solange `USE_FAKE_AI=True` ist — siehe `Backend/lab_data/ai_extraction.py`.
> Verschiebt man die Datei, muss der Pfad dort mitwandern.
