# Strukturierte FHIR-Bundles — Demo-Daten für Luca Frei

Fünf FHIR-R4-Bundles (CH-LAB-Report-orientiert, `meta.profile` referenziert das
CH-LAB-Report-Profil) für die Upload-Demo des **strukturierten** Imports (M5).
Alle Werte sind für **Luca Frei** (`patient_id = 1`), nutzen LOINC-Codes + UCUM-Units,
die 1:1 in der Master Data hinterlegt sind.

## Die fünf Berichte

| Datei | Datum | Werte | Story / Auffälligkeiten |
|---|---|---|---|
| `01_jahrescheck-hausarzt.json` | 15.09.2025 | 10 | Routine-Jahres-Check beim Hausarzt — alles normal (Klein. BB + Glu + Krea + ALT/AST) |
| `02_sportmedizin-mikronaehrstoffe.json` | 05.03.2026 | 6 | Sportmedizin vor Trainingslager — Vitamin D im **unteren Normbereich**, ALT/AST belastungsbedingt hoch-normal |
| `03_lipidprofil-praevention.json` | 20.04.2026 | 6 | Präventive Risiko-Abklärung — **Cholesterin & LDL grenzwertig** über Zielwert (ESC/EAS) |
| `04_infektabklaerung-akut.json` | 10.05.2026 | 5 | Notfall-Bluttest bei febrilem Infekt — **CRP 38 (deutlich erhöht) + Leukozytose** |
| `05_verlaufskontrolle-nach-infekt.json` | 25.05.2026 | 3 | Hausarzt-Kontrolle 2 Wochen später — Werte normalisiert |
| `06_grosses-laborprofil-ueberblick.json` | 30.05.2026 | **12 (→ 6+6)** | Realistisches grosses Chemie-Profil — enthält Na/K/Ca/Albumin/LDH/Harnstoff, die **nicht in der Master Data** sind. Import zeigt: 6 importiert, **6 mit Warnung übersprungen**. Demonstriert die Master-Data-Disziplin. |

**Total = 36 Messungen, davon 30 importierbar (6 in #06 werden bewusst geskippt).**

## Demo-Story

Schöner Bogen für Live-Demos:

1. Erst `01` → Baseline ist gesetzt
2. Dann `02–03` → unterschiedliche Panels, sukzessiv mehr Werte im Verlauf
3. `04` → Ampel springt auf rot (CRP/Leuko erhöht) — zeigt Status-Logik
4. `05` → Erholung sichtbar, vergleichbar mit `04`

Optional: ein bereits importierter Bericht erneut hochladen → Banner „0 neu, N Duplikate"
(belegt die Mess-Ebene-Dedup).

## Hintergrund

Duplikat-Erkennung auf **Mess-Ebene**: eine Messung ist eindeutig über
`(Patient, Parameter, Mess-Zeitpunkt)`. Unterschiedet sich auch nur der Zeitstempel,
zählt sie als eigene neue Messung. Der Import (Observation → LabParameter via LOINC,
Unit via UCUM) liegt in `Backend/lab_data/services.py` und wird sowohl vom
Management-Command `import_fhir_bundle` als auch vom Upload-Endpoint
`POST /api/patients/<id>/lab-reports/` genutzt.

> Diese Bundles werden auch von der Mock-KI-Extraktion (M6) als Vorschau-Ergebnis
> ausgeliefert — der Filename des hochgeladenen PDFs (gleicher Slug) entscheidet,
> welches Bundle die Mock zurückgibt. Siehe `Backend/lab_data/ai_extraction.py`.

## Neu generieren

Bei Änderungen an den Werten:

```sh
python Demofiles/_generate.py
```

Das Script ist Single Source of Truth — produziert sowohl die JSONs als auch
die passenden PDFs in `../unstrukturiert/`.
