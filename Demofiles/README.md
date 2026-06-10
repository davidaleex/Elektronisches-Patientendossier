# Demofiles — Asset-Sammlung für Demos & UX-Test

Hier liegen die Files, die im UI hochgeladen werden, um den Import-Flow live zu zeigen.
**App-Code wird nicht berührt** — wer hier Bundles oder PDFs ändert, ändert nur Demo-Daten.

## Struktur — pro Patient ein Ordner, darin strukturiert + unstrukturiert

```
<Patientenname>/
├── strukturiert/    5 FHIR-R4-Bundles (.json)          → Upload „Strukturiert (FHIR-JSON)" (M5)
└── unstrukturiert/  5 PDF-Befunde (.pdf + .html-Quelle) → Upload PDF → Parser-Vorschau → Import (M6)
```

Patienten-Ordner: `Luca-Frei/`, `Nina-Baumann/`, `Markus-Huber/`, `Elisa-Meier/`
→ **4 Personas × (5 strukturiert + 5 unstrukturiert) = 40 Dateien.**

Der echte PDF-Parser (M6) liest den **Text-Layer inhaltlich** — der Dateiname spielt
fürs Matching keine Rolle. Jede Persona kann ihre eigenen Befunde hochladen.

## Klinischer Bogen je Persona (passend zur App-Persona)

| Persona | 5 Befunde (Kurz) |
|---|---|
| **Luca Frei** (m, 20, sportlich) | Jahrescheck · Sportmed/Vit-D · Lipid grenzwertig · Infekt akut (CRP↑) · Verlauf erholt |
| **Nina Baumann** (w, 30, schwanger) | Erstuntersuchung · Eisenmangel-Anämie (Hb↓ MCV↓) · oGTT-Screening · Schilddrüse/TSH · Hb-Verlauf unter Eisen |
| **Markus Huber** (m, 50, kardiovaskulär) | Lipid hoch (LDL 4.6) · Diabetes-Screen (HbA1c 6.0) · Leber/Niere (GGT, eGFR) · Blutbild · Lipid-Verlauf unter Statin (LDL→2.8) |
| **Elisa Meier** (w, 90, geriatrisch) | Basislabor (Anämie, eGFR↓) · HbA1c-Verlauf · Nierenfunktion · Lipide · Infekt/HWI (CRP↑) |

Die Werte erzählen klinische Geschichten mit Verläufen (z. B. Markus' LDL fällt unter Statin,
Ninas Hb steigt unter Eisensubstitution) — passend für die Verlaufs-Ansicht und den UX-Test.

## Regenerieren

```
python Demofiles/_generate.py        # erzeugt alle 40 Dateien neu (braucht Google Chrome für PDF)
python manage.py seed_demo_patients  # spielt die Bundles ins Backend (aus dem Backend/-Ordner)
```

`_generate.py` ist Single Source of Truth: LOINC-Codes + UCUM-Units müssen exakt zur
Master Data passen (20 Parameter), sonst skippt der Import die Observation mit Warnung.
