# Unstrukturierte PDF-Befunde — Demo-Daten für die KI-Extraktion (M6)

Fünf gerenderte Labor-Befunde als PDF — Eingang für den **KI-Extraktions-Flow**:
PDF rauf → Mock-AI extrahiert ein FHIR-Bundle → Vorschau-Modal → Bestätigen → Import
via den gleichen Service wie M5.

| Datei | Datum | Werte | Lab-Look | Inhalt |
|---|---|---|---|---|
| `01_jahrescheck-hausarzt.pdf` | 15.09.2025 | 10 | Hausarzt, blau | Jahres-Check |
| `02_sportmedizin-mikronaehrstoffe.pdf` | 05.03.2026 | 6 | Sportmedizin, grün | Mikronährstoffe + Belastung |
| `03_lipidprofil-praevention.pdf` | 20.04.2026 | 6 | Kardiologie, rot | Lipidprofil |
| `04_infektabklaerung-akut.pdf` | 10.05.2026 | 5 | Notfall, violett | CRP/Leuko erhöht (Infekt) |
| `05_verlaufskontrolle-nach-infekt.pdf` | 25.05.2026 | 3 | Hausarzt, blau | Erholung nach Infekt |

Jeder Befund nutzt eine eigene Akzentfarbe + ein eigenes Lab-Briefkopf, damit man
in der Demo verschiedene „Quellen" zeigen kann. Die HTML-Dateien daneben sind die
Render-Quellen — die PDFs werden per Headless-Chrome daraus generiert.

## Wichtig — wie der Mock auf die PDFs reagiert

Solange `USE_FAKE_AI=True` (Default, kein Anthropic-Key nötig), wird der PDF-Inhalt
**nicht analysiert**. Stattdessen liest die Mock-Funktion den **Filename** und lädt
das gleichnamige Bundle aus `../strukturiert/`. Damit zeigt die Vorschau immer genau
die Werte, die auch auf der PDF stehen — die Demo bleibt ehrlich.

Andere PDFs (z. B. ein vom Nutzer mitgebrachtes Befund-PDF) → Mock fällt auf
`01_jahrescheck-hausarzt.json` zurück.

## Regenerieren

PDFs werden vom zentralen Generator-Script erzeugt:

```sh
python Demofiles/_generate.py
```

Das Script produziert sowohl die strukturierten JSONs als auch die PDFs aus
einer Spec — kein Drift möglich.
