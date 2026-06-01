# Demofiles — Asset-Sammlung für Demos & Tests

Hier liegen die Files, die du im UI hochlädst, um den Import-Flow live zu zeigen.
**App-Code wird nicht berührt** — wer hier Bundles oder PDFs ändert, ändert nur Demo-Daten.

| Ordner | Inhalt | Wofür |
|---|---|---|
| `strukturiert/` | 5 FHIR-R4-Bundles (`.json`) für CH-LAB-Reports | Direkter Import via Patient-/Arzt-Upload („Strukturiert (FHIR-JSON)") — testet M5 |
| `unstrukturiert/` | 5 PDF-Befunde (gerenderte Schein-Befunde + HTML-Quellen) | KI-Extraktions-Flow: PDF rauf → Vorschau-Modal → Import — testet M6 |
| `_generate.py` | Single Source of Truth — produziert beide Ordner aus 5 Bundle-Specs | `python Demofiles/_generate.py` |

Inhaltlicher Bogen über die 5 Befunde — kleine klinische Story für Luca Frei:

1. **Jahres-Check Hausarzt** (15.09.2025) — alles normal
2. **Sportmedizin Mikronährstoffe** (05.03.2026) — Vitamin D niedrig-normal
3. **Lipidprofil Prävention** (20.04.2026) — Cholesterin/LDL grenzwertig
4. **Infekt-Abklärung akut** (10.05.2026) — CRP/Leuko deutlich erhöht
5. **Verlaufskontrolle** (25.05.2026) — Erholung nach Infekt

Details + erwartetes Verhalten in den jeweiligen Unterordner-READMEs.

## Wie der Mock-KI-Pfad damit zusammenspielt

Beim PDF-Upload mappt der Mock den Filename auf das gleichnamige Bundle —
`04_infektabklaerung-akut.pdf` liefert auch wirklich die Werte aus
`04_infektabklaerung-akut.json`. So ist die Vorschau ehrlich.
Pfad-Logik in `Backend/lab_data/ai_extraction.py`.
