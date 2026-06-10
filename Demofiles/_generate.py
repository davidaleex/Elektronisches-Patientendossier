"""
Generiert pro Persona je 5 Demo-FHIR-Bundles und die dazu passenden PDF-Befunde.
Struktur: Demofiles/<Patientenname>/{strukturiert,unstrukturiert}/ für die UX-Demos.

Jede der vier App-Personas bekommt einen kleinen, klinisch stimmigen Befund-Bogen:

  luca   (m, 20, sportlich)        — Jahrescheck, Sportmed, Lipid, Infekt-akut, Verlauf
  nina   (w, 30, schwanger)        — Erstuntersuchung, Anämie, oGTT, Schilddrüse, Verlauf Hb
  markus (m, 50, kardiovaskulär)   — Lipid hoch, Diabetes-Screen, Leber/Niere, Blutbild, Lipid-Verlauf
  elisa  (w, 90, geriatrisch)      — Basislabor, Diabetes-Verlauf, Niere, Lipid, Infekt

Die LOINC-Codes + UCUM-Units MÜSSEN exakt zur Master Data passen (20 Parameter),
sonst skippt der Import die Observation mit Warnung. Der echte PDF-Parser (M6)
liest den Text-Layer inhaltlich — der Dateiname spielt fürs Matching keine Rolle.

Aufruf:
    python Demofiles/_generate.py
Voraussetzung: Google Chrome unter /Applications/ (für den PDF-Render-Schritt).
"""

import json
import subprocess
from pathlib import Path

HERE = Path(__file__).parent
# Struktur: Demofiles/<Patientenname>/{strukturiert,unstrukturiert}/
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

PROFILE_BUNDLE = "http://fhir.ch/ig/ch-lab-report/StructureDefinition/ch-lab-report-document"
PROFILE_OBS = "http://fhir.ch/ig/ch-lab-report/StructureDefinition/ch-lab-observation-results-laboratory"

# App-Persona → Stammdaten. Die Patient-Referenz entspricht der Backend-patient_id
# (luca=1, nina=2, markus=3, elisa=4) — kosmetisch, da der Import den Empfänger
# aus dem Aufruf-Argument nimmt, nicht aus dem Bundle.
# folder = Unterordner-Name (nach Patientenname), key = interner Slug.
PATIENTS = {
    "luca":   {"ref": "Patient/1", "name": "Luca Frei",    "folder": "Luca-Frei",    "geb": "14.03.2006", "geschlecht": "männlich"},
    "nina":   {"ref": "Patient/2", "name": "Nina Baumann", "folder": "Nina-Baumann", "geb": "22.08.1994", "geschlecht": "weiblich"},
    "markus": {"ref": "Patient/3", "name": "Markus Huber", "folder": "Markus-Huber", "geb": "15.04.1974", "geschlecht": "männlich"},
    "elisa":  {"ref": "Patient/4", "name": "Elisa Meier",  "folder": "Elisa-Meier",  "geb": "08.12.1934", "geschlecht": "weiblich"},
}

# Lab-Anschrift + Akzentfarbe pro Schlüssel — gibt den Berichten einen erkennbar
# unterschiedlichen Look.
LABS = {
    "hausarzt":  ("Hausarzt-Labor Dr. M. Studer", "Spalenring 12 · 4055 Basel · +41 61 281 12 12", "#1f4e79"),
    "sportmed":  ("Sportmedizin Basel SUVA", "Spitalstrasse 21 · 4031 Basel · +41 61 326 28 28", "#2e7d32"),
    "cardio":    ("Kardiologie-Labor Praxis Furrer", "Aeschenvorstadt 4 · 4051 Basel · +41 61 271 44 44", "#a83232"),
    "notfall":   ("Notfall-Labor Universitätsspital Basel", "Petersgraben 4 · 4031 Basel · +41 61 265 25 25", "#5e35b1"),
    "chemie":    ("Klinisch-chemisches Labor Viollier", "Hagenholzstrasse 16 · 4002 Basel · +41 61 486 11 11", "#00838f"),
    "gyn":       ("Frauenarztpraxis Dr. C. Weber", "Frauenstrasse 23 · 8001 Zürich · +41 44 321 45 67", "#c2185b"),
    "geriatrie": ("Geriatrie-Labor Felix Platter", "Burgfelderstrasse 101 · 4055 Basel · +41 61 326 41 41", "#6d4c41"),
}

# (LOINC, Anzeigename DE, Wert, Unit (UCUM exakt), low|None, high|None)
# Verfügbare Master-Data-Parameter (20):
#   Hämatologie: 718-7 Hb g/dL · 4544-3 Hct % · 789-8 RBC 10*12/L · 6690-2 WBC 10*9/L · 787-2 MCV fL · 777-3 Thrombo 10*9/L
#   Metabolism:  2345-7 Glukose mmol/L · 2093-3 Chol mmol/L · 2089-1 LDL mmol/L · 2085-9 HDL mmol/L · 2571-8 Trigl mmol/L · 4548-4 HbA1c %
#   Niere/Leber: 2160-0 Kreatinin µmol/L · 1742-6 ALT U/L · 1920-8 AST U/L · 2324-2 GGT U/L · 62292-8 eGFR mL/min/{1.73_m2}
#   Other:       14635-7 Vit D nmol/L · 1988-5 CRP mg/L · 3016-3 TSH mIU/L
BUNDLES = {
    # ---------------- LUCA (m, 20, sportlich) ----------------
    "luca": [
        {
            "slug": "01_jahrescheck-hausarzt", "bundle_id": "luca-jahrescheck-2025-09-15",
            "datum_iso": "2025-09-15T08:00:00+02:00", "datum_display": "15.09.2025",
            "entnahme_display": "15.09.2025, 08:00", "lab_key": "hausarzt",
            "auftraggeber": "Dr. med. Markus Studer (Hausarzt, FMH Allgemein)", "befund_nr": "2025-0915-A",
            "titel": "Jahres-Check — Allgemein",
            "panels": [
                ("Kleines Blutbild", [
                    ("718-7", "Hämoglobin (Hb)", 15.2, "g/dL", 13.5, 17.5),
                    ("4544-3", "Hämatokrit (Hct)", 45.0, "%", 40.0, 50.0),
                    ("789-8", "Erythrozyten (RBC)", 5.1, "10*12/L", 4.3, 5.8),
                    ("6690-2", "Leukozyten (WBC)", 6.8, "10*9/L", 4.0, 10.0),
                    ("787-2", "MCV", 88, "fL", 80.0, 96.0),
                    ("777-3", "Thrombozyten", 245, "10*9/L", 150.0, 400.0),
                ]),
                ("Stoffwechsel & Niere/Leber", [
                    ("2345-7", "Glukose (nüchtern)", 4.7, "mmol/L", 3.9, 5.6),
                    ("2160-0", "Kreatinin", 78, "µmol/L", 62, 106),
                    ("1742-6", "ALT (GPT)", 24, "U/L", None, 50.0),
                    ("1920-8", "AST (GOT)", 22, "U/L", None, 40.0),
                ]),
            ],
            "kommentar": "Alle Parameter im Referenzbereich. Keine pathologischen Auffälligkeiten.",
            "signatur": "Dr. med. Markus Studer",
        },
        {
            "slug": "02_sportmedizin-mikronaehrstoffe", "bundle_id": "luca-sportmed-2026-03-05",
            "datum_iso": "2026-03-05T07:30:00+01:00", "datum_display": "05.03.2026",
            "entnahme_display": "05.03.2026, 07:30", "lab_key": "sportmed",
            "auftraggeber": "Dr. med. Sandra Egli (Sportmedizin SGSM)", "befund_nr": "2026-SPM-0305",
            "titel": "Sportmedizin — Mikronährstoff- und Belastungs-Status",
            "panels": [
                ("Mikronährstoffe", [
                    ("14635-7", "25-OH Vitamin D", 58, "nmol/L", 50, 150),
                ]),
                ("Entzündung & Blutbild", [
                    ("1988-5", "CRP", 1.2, "mg/L", None, 5.0),
                    ("718-7", "Hämoglobin (Hb)", 15.5, "g/dL", 13.5, 17.5),
                    ("787-2", "MCV", 89, "fL", 80.0, 96.0),
                ]),
                ("Belastungs-Leberenzyme", [
                    ("1742-6", "ALT (GPT)", 31, "U/L", None, 50.0),
                    ("1920-8", "AST (GOT)", 28, "U/L", None, 40.0),
                ]),
            ],
            "kommentar": (
                "Vitamin D im unteren Normbereich (BAG-Empfehlung: Suffizienz ≥ 50 nmol/L). "
                "Leberenzyme post-Belastung leicht erhöht, aber im Norm — typisch nach intensiver Trainingsphase."
            ),
            "signatur": "Dr. med. Sandra Egli",
        },
        {
            "slug": "03_lipidprofil-praevention", "bundle_id": "luca-lipid-2026-04-20",
            "datum_iso": "2026-04-20T09:15:00+02:00", "datum_display": "20.04.2026",
            "entnahme_display": "20.04.2026, 09:15", "lab_key": "cardio",
            "auftraggeber": "Dr. med. Anna Furrer (Kardiologie FMH)", "befund_nr": "2026-CARD-04020",
            "titel": "Lipidprofil — Präventive Risiko-Abklärung",
            "panels": [
                ("Lipide", [
                    ("2093-3", "Cholesterin gesamt", 5.1, "mmol/L", None, 5.0),
                    ("2089-1", "LDL-Cholesterin", 3.2, "mmol/L", None, 3.0),
                    ("2085-9", "HDL-Cholesterin", 1.5, "mmol/L", 1.0, None),
                    ("2571-8", "Triglyceride", 0.9, "mmol/L", None, 1.7),
                ]),
                ("Stoffwechsel", [
                    ("2345-7", "Glukose (nüchtern)", 4.9, "mmol/L", 3.9, 5.6),
                    ("4548-4", "HbA1c", 5.2, "%", None, 5.7),
                ]),
            ],
            "kommentar": (
                "Cholesterin gesamt und LDL knapp über den Zielwerten für Niedrig-Risiko-Personen. "
                "Klinisch unauffällig — Lebensstil-Massnahmen empfohlen, Kontrolle in 12 Monaten."
            ),
            "signatur": "Dr. med. Anna Furrer",
        },
        {
            "slug": "04_infektabklaerung-akut", "bundle_id": "luca-infekt-2026-05-10",
            "datum_iso": "2026-05-10T14:40:00+02:00", "datum_display": "10.05.2026",
            "entnahme_display": "10.05.2026, 14:40 (Notfallambulanz)", "lab_key": "notfall",
            "auftraggeber": "Notfallzentrum USB (Dr. med. K. Reinhardt)", "befund_nr": "2026-NF-10052",
            "titel": "Akut-Bluttest bei febrilem Infekt",
            "panels": [
                ("Entzündung", [
                    ("1988-5", "CRP", 38, "mg/L", None, 5.0),
                    ("6690-2", "Leukozyten (WBC)", 13.2, "10*9/L", 4.0, 10.0),
                ]),
                ("Sicherheitsparameter", [
                    ("718-7", "Hämoglobin (Hb)", 14.8, "g/dL", 13.5, 17.5),
                    ("2160-0", "Kreatinin", 81, "µmol/L", 62, 106),
                    ("1742-6", "ALT (GPT)", 26, "U/L", None, 50.0),
                ]),
            ],
            "kommentar": (
                "Febriler Infekt der oberen Atemwege. CRP deutlich erhöht (38 mg/L) und Leukozytose "
                "vereinbar mit bakterieller Komponente. Nieren- und Leberwerte unauffällig."
            ),
            "signatur": "Dr. med. K. Reinhardt",
        },
        {
            "slug": "05_verlaufskontrolle-nach-infekt", "bundle_id": "luca-verlauf-2026-05-25",
            "datum_iso": "2026-05-25T08:45:00+02:00", "datum_display": "25.05.2026",
            "entnahme_display": "25.05.2026, 08:45", "lab_key": "hausarzt",
            "auftraggeber": "Dr. med. Markus Studer (Hausarzt, FMH Allgemein)", "befund_nr": "2026-0525-V",
            "titel": "Verlaufskontrolle nach Infekt",
            "panels": [
                ("Entzündung — Verlauf", [
                    ("1988-5", "CRP", 2.1, "mg/L", None, 5.0),
                    ("6690-2", "Leukozyten (WBC)", 7.5, "10*9/L", 4.0, 10.0),
                ]),
                ("Sicherheitsparameter", [
                    ("718-7", "Hämoglobin (Hb)", 15.0, "g/dL", 13.5, 17.5),
                ]),
            ],
            "kommentar": (
                "CRP und Leukozyten erfreulich normalisiert (vorher 10.05.: CRP 38, WBC 13.2). "
                "Infekt klinisch ausgeheilt, keine weiteren Massnahmen erforderlich."
            ),
            "signatur": "Dr. med. Markus Studer",
        },
    ],

    # ---------------- NINA (w, 30, schwanger) ----------------
    "nina": [
        {
            "slug": "01_erstuntersuchung-schwangerschaft", "bundle_id": "nina-erst-2025-05-12",
            "datum_iso": "2025-05-12T09:00:00+02:00", "datum_display": "12.05.2025",
            "entnahme_display": "12.05.2025, 09:00", "lab_key": "gyn",
            "auftraggeber": "Dr. med. Christine Weber (Gynäkologie FMH)", "befund_nr": "2025-GYN-0512",
            "titel": "Erstuntersuchung Schwangerschaft — Basislabor",
            "panels": [
                ("Blutbild", [
                    ("718-7", "Hämoglobin (Hb)", 12.4, "g/dL", 12.0, 16.0),
                    ("4544-3", "Hämatokrit (Hct)", 37.0, "%", 36.0, 46.0),
                    ("789-8", "Erythrozyten (RBC)", 4.3, "10*12/L", 4.0, 5.2),
                    ("6690-2", "Leukozyten (WBC)", 9.2, "10*9/L", 4.0, 10.0),
                    ("787-2", "MCV", 86, "fL", 80.0, 96.0),
                ]),
                ("Stoffwechsel & Schilddrüse", [
                    ("2345-7", "Glukose (nüchtern)", 4.5, "mmol/L", 3.9, 5.6),
                    ("3016-3", "TSH", 1.8, "mIU/L", 0.4, 4.0),
                    ("2160-0", "Kreatinin", 60, "µmol/L", 45, 84),
                ]),
            ],
            "kommentar": (
                "Schwangerschafts-Basislabor unauffällig. Hb im unteren Normbereich — bei steigendem "
                "Plasmavolumen im Verlauf engmaschig kontrollieren. TSH im Zielbereich für die Frühschwangerschaft."
            ),
            "signatur": "Dr. med. Christine Weber",
        },
        {
            "slug": "02_eisenmangel-anaemie", "bundle_id": "nina-anaemie-2025-07-20",
            "datum_iso": "2025-07-20T08:30:00+02:00", "datum_display": "20.07.2025",
            "entnahme_display": "20.07.2025, 08:30", "lab_key": "gyn",
            "auftraggeber": "Dr. med. Christine Weber (Gynäkologie FMH)", "befund_nr": "2025-GYN-0720",
            "titel": "Anämie-Abklärung in der Schwangerschaft",
            "panels": [
                ("Blutbild — Anämie", [
                    ("718-7", "Hämoglobin (Hb)", 10.8, "g/dL", 12.0, 16.0),
                    ("4544-3", "Hämatokrit (Hct)", 33.0, "%", 36.0, 46.0),
                    ("789-8", "Erythrozyten (RBC)", 3.9, "10*12/L", 4.0, 5.2),
                    ("787-2", "MCV", 78, "fL", 80.0, 96.0),
                    ("6690-2", "Leukozyten (WBC)", 9.8, "10*9/L", 4.0, 10.0),
                ]),
            ],
            "kommentar": (
                "Mikrozytäre Anämie (Hb 10.8 g/dL, MCV 78 fL) vereinbar mit Eisenmangel — in der "
                "Schwangerschaft häufig. Orale Eisensubstitution eingeleitet, Verlaufskontrolle in 6 Wochen."
            ),
            "signatur": "Dr. med. Christine Weber",
        },
        {
            "slug": "03_glukosetoleranz-screening", "bundle_id": "nina-ogtt-2025-09-08",
            "datum_iso": "2025-09-08T08:00:00+02:00", "datum_display": "08.09.2025",
            "entnahme_display": "08.09.2025, 08:00 (nüchtern)", "lab_key": "chemie",
            "auftraggeber": "Dr. med. Christine Weber (Gynäkologie FMH)", "befund_nr": "2025-CHEM-0908",
            "titel": "Screening Schwangerschaftsdiabetes (24.–28. SSW)",
            "panels": [
                ("Glukose-Stoffwechsel", [
                    ("2345-7", "Glukose (nüchtern)", 4.8, "mmol/L", 3.9, 5.1),
                    ("4548-4", "HbA1c", 5.3, "%", None, 5.7),
                ]),
            ],
            "kommentar": (
                "Nüchternglukose und HbA1c im Normbereich — kein Hinweis auf einen "
                "Schwangerschaftsdiabetes. Routine-Schwangerschaftsvorsorge fortführen."
            ),
            "signatur": "Dr. med. Christine Weber",
        },
        {
            "slug": "04_schilddruese-routine", "bundle_id": "nina-tsh-2025-10-15",
            "datum_iso": "2025-10-15T09:30:00+02:00", "datum_display": "15.10.2025",
            "entnahme_display": "15.10.2025, 09:30", "lab_key": "hausarzt",
            "auftraggeber": "Dr. med. Christine Weber (Gynäkologie FMH)", "befund_nr": "2025-0925-TSH",
            "titel": "Schilddrüsen- und Entzündungskontrolle",
            "panels": [
                ("Schilddrüse", [
                    ("3016-3", "TSH", 2.2, "mIU/L", 0.4, 4.0),
                ]),
                ("Blutbild & Entzündung", [
                    ("718-7", "Hämoglobin (Hb)", 11.5, "g/dL", 12.0, 16.0),
                    ("1988-5", "CRP", 3.0, "mg/L", None, 5.0),
                ]),
            ],
            "kommentar": (
                "TSH stabil im Zielbereich. Hb unter Eisensubstitution leicht ansteigend (11.5 g/dL). "
                "CRP unauffällig."
            ),
            "signatur": "Dr. med. Christine Weber",
        },
        {
            "slug": "05_verlaufskontrolle-haemoglobin", "bundle_id": "nina-verlauf-2025-11-20",
            "datum_iso": "2025-11-20T08:15:00+01:00", "datum_display": "20.11.2025",
            "entnahme_display": "20.11.2025, 08:15", "lab_key": "gyn",
            "auftraggeber": "Dr. med. Christine Weber (Gynäkologie FMH)", "befund_nr": "2025-GYN-1120",
            "titel": "Verlaufskontrolle Hämoglobin unter Eisensubstitution",
            "panels": [
                ("Blutbild — Verlauf", [
                    ("718-7", "Hämoglobin (Hb)", 11.8, "g/dL", 12.0, 16.0),
                    ("4544-3", "Hämatokrit (Hct)", 35.0, "%", 36.0, 46.0),
                    ("789-8", "Erythrozyten (RBC)", 4.1, "10*12/L", 4.0, 5.2),
                    ("787-2", "MCV", 82, "fL", 80.0, 96.0),
                ]),
            ],
            "kommentar": (
                "Hb und MCV unter Eisensubstitution erfreulich ansteigend (Hb 10.8 → 11.8 g/dL, "
                "MCV 78 → 82 fL). Substitution fortführen bis zur Geburt."
            ),
            "signatur": "Dr. med. Christine Weber",
        },
    ],

    # ---------------- MARKUS (m, 50, kardiovaskulär) ----------------
    "markus": [
        {
            "slug": "01_lipidprofil-erstbefund", "bundle_id": "markus-lipid-2025-01-20",
            "datum_iso": "2025-01-20T08:00:00+01:00", "datum_display": "20.01.2025",
            "entnahme_display": "20.01.2025, 08:00 (nüchtern)", "lab_key": "cardio",
            "auftraggeber": "Dr. med. Peter Furrer (Kardiologie FMH)", "befund_nr": "2025-CARD-0120",
            "titel": "Lipidprofil — kardiovaskuläre Risiko-Erstabklärung",
            "panels": [
                ("Lipide", [
                    ("2093-3", "Cholesterin gesamt", 6.8, "mmol/L", None, 5.0),
                    ("2089-1", "LDL-Cholesterin", 4.6, "mmol/L", None, 3.0),
                    ("2085-9", "HDL-Cholesterin", 0.95, "mmol/L", 1.0, None),
                    ("2571-8", "Triglyceride", 2.4, "mmol/L", None, 1.7),
                ]),
                ("Stoffwechsel", [
                    ("2345-7", "Glukose (nüchtern)", 5.8, "mmol/L", 3.9, 5.6),
                ]),
            ],
            "kommentar": (
                "Deutliche kombinierte Hyperlipidämie (LDL 4.6 mmol/L, Triglyceride 2.4 mmol/L, HDL "
                "erniedrigt). Erhöhtes kardiovaskuläres Risiko — Statintherapie und Lebensstil-Intervention empfohlen."
            ),
            "signatur": "Dr. med. Peter Furrer",
        },
        {
            "slug": "02_diabetes-screening", "bundle_id": "markus-diab-2025-02-18",
            "datum_iso": "2025-02-18T08:10:00+01:00", "datum_display": "18.02.2025",
            "entnahme_display": "18.02.2025, 08:10 (nüchtern)", "lab_key": "hausarzt",
            "auftraggeber": "Dr. med. Markus Studer (Hausarzt, FMH Allgemein)", "befund_nr": "2025-0218-DM",
            "titel": "Diabetes-Screening",
            "panels": [
                ("Glukose-Stoffwechsel", [
                    ("2345-7", "Glukose (nüchtern)", 6.1, "mmol/L", 3.9, 5.6),
                    ("4548-4", "HbA1c", 6.0, "%", None, 5.7),
                ]),
            ],
            "kommentar": (
                "Nüchternglukose und HbA1c im Prädiabetes-Bereich (HbA1c 6.0 %). Lebensstil-Beratung, "
                "Gewichtsreduktion und Kontrolle in 3 Monaten empfohlen."
            ),
            "signatur": "Dr. med. Markus Studer",
        },
        {
            "slug": "03_leber-niere-statin-monitoring", "bundle_id": "markus-leberniere-2025-03-25",
            "datum_iso": "2025-03-25T08:30:00+01:00", "datum_display": "25.03.2025",
            "entnahme_display": "25.03.2025, 08:30", "lab_key": "chemie",
            "auftraggeber": "Dr. med. Peter Furrer (Kardiologie FMH)", "befund_nr": "2025-CHEM-0325",
            "titel": "Leber- und Nierenwerte — Statin-Verträglichkeit",
            "panels": [
                ("Leberenzyme", [
                    ("1742-6", "ALT (GPT)", 42, "U/L", None, 50.0),
                    ("1920-8", "AST (GOT)", 38, "U/L", None, 40.0),
                    ("2324-2", "GGT", 65, "U/L", None, 60.0),
                ]),
                ("Nierenfunktion", [
                    ("2160-0", "Kreatinin", 95, "µmol/L", 62, 106),
                    ("62292-8", "eGFR (CKD-EPI)", 82, "mL/min/{1.73_m2}", 60, None),
                ]),
            ],
            "kommentar": (
                "Leberenzyme unter Statintherapie im Norm; GGT grenzwertig erhöht (65 U/L) — Alkohol-"
                "karenz empfohlen. Nierenfunktion normal (eGFR 82). Statin gut verträglich."
            ),
            "signatur": "Dr. med. Peter Furrer",
        },
        {
            "slug": "04_grosses-blutbild", "bundle_id": "markus-blutbild-2025-04-15",
            "datum_iso": "2025-04-15T08:00:00+02:00", "datum_display": "15.04.2025",
            "entnahme_display": "15.04.2025, 08:00", "lab_key": "hausarzt",
            "auftraggeber": "Dr. med. Markus Studer (Hausarzt, FMH Allgemein)", "befund_nr": "2025-0415-BB",
            "titel": "Grosses Blutbild — Routine",
            "panels": [
                ("Blutbild", [
                    ("718-7", "Hämoglobin (Hb)", 15.4, "g/dL", 13.5, 17.5),
                    ("4544-3", "Hämatokrit (Hct)", 46.0, "%", 40.0, 50.0),
                    ("789-8", "Erythrozyten (RBC)", 5.2, "10*12/L", 4.3, 5.8),
                    ("6690-2", "Leukozyten (WBC)", 7.8, "10*9/L", 4.0, 10.0),
                    ("787-2", "MCV", 90, "fL", 80.0, 96.0),
                    ("777-3", "Thrombozyten", 260, "10*9/L", 150.0, 400.0),
                ]),
            ],
            "kommentar": "Blutbild vollständig unauffällig. Keine Hinweise auf Anämie oder Entzündung.",
            "signatur": "Dr. med. Markus Studer",
        },
        {
            "slug": "05_lipid-verlauf-unter-statin", "bundle_id": "markus-lipidverlauf-2025-11-10",
            "datum_iso": "2025-11-10T08:00:00+01:00", "datum_display": "10.11.2025",
            "entnahme_display": "10.11.2025, 08:00 (nüchtern)", "lab_key": "cardio",
            "auftraggeber": "Dr. med. Peter Furrer (Kardiologie FMH)", "befund_nr": "2025-CARD-1110",
            "titel": "Lipid-Verlaufskontrolle unter Statintherapie",
            "panels": [
                ("Lipide — Verlauf", [
                    ("2093-3", "Cholesterin gesamt", 5.0, "mmol/L", None, 5.0),
                    ("2089-1", "LDL-Cholesterin", 2.8, "mmol/L", None, 3.0),
                    ("2085-9", "HDL-Cholesterin", 1.1, "mmol/L", 1.0, None),
                    ("2571-8", "Triglyceride", 1.6, "mmol/L", None, 1.7),
                ]),
            ],
            "kommentar": (
                "Deutliche Besserung unter Statin (LDL 4.6 → 2.8 mmol/L, jetzt im Zielbereich; "
                "Triglyceride normalisiert). Therapie fortführen, Jahres-Kontrolle."
            ),
            "signatur": "Dr. med. Peter Furrer",
        },
    ],

    # ---------------- ELISA (w, 90, geriatrisch) ----------------
    "elisa": [
        {
            "slug": "01_geriatrisches-basislabor", "bundle_id": "elisa-basis-2025-01-14",
            "datum_iso": "2025-01-14T09:00:00+01:00", "datum_display": "14.01.2025",
            "entnahme_display": "14.01.2025, 09:00", "lab_key": "geriatrie",
            "auftraggeber": "Dr. med. R. Fischer (Geriatrie)", "befund_nr": "2025-GER-0114",
            "titel": "Geriatrisches Basislabor",
            "panels": [
                ("Blutbild", [
                    ("718-7", "Hämoglobin (Hb)", 11.5, "g/dL", 12.0, 16.0),
                    ("4544-3", "Hämatokrit (Hct)", 35.0, "%", 36.0, 46.0),
                    ("789-8", "Erythrozyten (RBC)", 4.0, "10*12/L", 4.0, 5.2),
                    ("6690-2", "Leukozyten (WBC)", 6.5, "10*9/L", 4.0, 10.0),
                    ("787-2", "MCV", 88, "fL", 80.0, 96.0),
                    ("777-3", "Thrombozyten", 220, "10*9/L", 150.0, 400.0),
                ]),
                ("Nierenfunktion", [
                    ("2160-0", "Kreatinin", 98, "µmol/L", 45, 84),
                    ("62292-8", "eGFR (CKD-EPI)", 48, "mL/min/{1.73_m2}", 60, None),
                ]),
            ],
            "kommentar": (
                "Leichte normozytäre Anämie (Hb 11.5 g/dL) — im hohen Alter häufig. Eingeschränkte "
                "Nierenfunktion (eGFR 48 mL/min, CKD-Stadium G3a). Medikamenten-Dosierungen anpassen."
            ),
            "signatur": "Dr. med. R. Fischer",
        },
        {
            "slug": "02_diabetes-verlauf", "bundle_id": "elisa-diab-2025-03-10",
            "datum_iso": "2025-03-10T08:45:00+01:00", "datum_display": "10.03.2025",
            "entnahme_display": "10.03.2025, 08:45 (nüchtern)", "lab_key": "hausarzt",
            "auftraggeber": "Dr. med. R. Fischer (Geriatrie)", "befund_nr": "2025-0310-DM",
            "titel": "Diabetes-Verlaufskontrolle",
            "panels": [
                ("Glukose-Stoffwechsel", [
                    ("2345-7", "Glukose (nüchtern)", 7.2, "mmol/L", 3.9, 5.6),
                    ("4548-4", "HbA1c", 7.6, "%", None, 7.0),
                ]),
            ],
            "kommentar": (
                "HbA1c 7.6 % — im geriatrischen Kontext (Ziel 7–8 % bei Hochbetagten) tolerabel. "
                "Strenge Einstellung wegen Hypoglykämie-Gefahr bewusst vermieden."
            ),
            "signatur": "Dr. med. R. Fischer",
        },
        {
            "slug": "03_nierenfunktion-kontrolle", "bundle_id": "elisa-niere-2025-06-18",
            "datum_iso": "2025-06-18T09:15:00+02:00", "datum_display": "18.06.2025",
            "entnahme_display": "18.06.2025, 09:15", "lab_key": "chemie",
            "auftraggeber": "Dr. med. R. Fischer (Geriatrie)", "befund_nr": "2025-CHEM-0618",
            "titel": "Nierenfunktion — Verlaufskontrolle",
            "panels": [
                ("Nierenfunktion", [
                    ("2160-0", "Kreatinin", 105, "µmol/L", 45, 84),
                    ("62292-8", "eGFR (CKD-EPI)", 44, "mL/min/{1.73_m2}", 60, None),
                ]),
            ],
            "kommentar": (
                "Nierenfunktion leicht weiter rückläufig (eGFR 48 → 44 mL/min). Stabiles CKD-Stadium "
                "G3a–b. Nephrotoxische Medikamente meiden, ausreichende Hydratation."
            ),
            "signatur": "Dr. med. R. Fischer",
        },
        {
            "slug": "04_lipidprofil", "bundle_id": "elisa-lipid-2025-07-22",
            "datum_iso": "2025-07-22T08:30:00+02:00", "datum_display": "22.07.2025",
            "entnahme_display": "22.07.2025, 08:30 (nüchtern)", "lab_key": "cardio",
            "auftraggeber": "Dr. med. R. Fischer (Geriatrie)", "befund_nr": "2025-CARD-0722",
            "titel": "Lipidprofil",
            "panels": [
                ("Lipide", [
                    ("2093-3", "Cholesterin gesamt", 5.4, "mmol/L", None, 5.0),
                    ("2089-1", "LDL-Cholesterin", 3.1, "mmol/L", None, 3.0),
                    ("2085-9", "HDL-Cholesterin", 1.4, "mmol/L", 1.2, None),
                    ("2571-8", "Triglyceride", 1.5, "mmol/L", None, 1.7),
                ]),
            ],
            "kommentar": (
                "Lipide grenzwertig (LDL 3.1 mmol/L). Im hohen Alter Primärprävention zurückhaltend "
                "bewerten — Therapieentscheid im Gesamtkontext und nach Patientenwunsch."
            ),
            "signatur": "Dr. med. R. Fischer",
        },
        {
            "slug": "05_infekt-screening", "bundle_id": "elisa-infekt-2025-09-30",
            "datum_iso": "2025-09-30T15:20:00+02:00", "datum_display": "30.09.2025",
            "entnahme_display": "30.09.2025, 15:20", "lab_key": "notfall",
            "auftraggeber": "Notfallzentrum USB (Dr. med. K. Reinhardt)", "befund_nr": "2025-NF-0930",
            "titel": "Infekt-Screening bei Verdacht auf Harnwegsinfekt",
            "panels": [
                ("Entzündung", [
                    ("1988-5", "CRP", 22, "mg/L", None, 5.0),
                    ("6690-2", "Leukozyten (WBC)", 11.5, "10*9/L", 4.0, 10.0),
                ]),
                ("Sicherheitsparameter", [
                    ("718-7", "Hämoglobin (Hb)", 11.4, "g/dL", 12.0, 16.0),
                    ("2160-0", "Kreatinin", 102, "µmol/L", 45, 84),
                ]),
            ],
            "kommentar": (
                "CRP (22 mg/L) und Leukozyten erhöht — vereinbar mit einem Harnwegsinfekt, im Alter "
                "häufig. Antibiotische Therapie eingeleitet, Verlaufskontrolle empfohlen."
            ),
            "signatur": "Dr. med. K. Reinhardt",
        },
    ],
}


def trim(x):
    if x is None:
        return ""
    return f"{float(x):g}"


def fmt_range(low, high):
    if low is not None and high is not None:
        return f"{trim(low)}–{trim(high)}"
    if high is not None:
        return f"< {trim(high)}"
    if low is not None:
        return f"> {trim(low)}"
    return ""


def status_flag(value, low, high):
    """Demo-Flag im PDF (n/H/L) — naiver Vergleich gegen den Bundle-Range. Die App
    leitet die Ampel produktiv aus den kuratierten, alters-/geschlechtsabhängigen
    Referenzbereichen ab."""
    if low is not None and value < low:
        return ("L", "low")
    if high is not None and value > high:
        return ("H", "high")
    return ("n", "normal")


def build_bundle(spec: dict, patient: dict) -> dict:
    """FHIR-R4-Bundle aus der Spec — exakt die Form, die der M5-Import frisst."""
    entries = []
    seq = 0
    for _panel_name, rows in spec["panels"]:
        for loinc, name_de, value, unit_ucum, low, high in rows:
            seq += 1
            obs_id = f"{spec['bundle_id']}-{seq:02d}"
            range_dict = {}
            if low is not None:
                range_dict["low"] = {"value": low, "unit": unit_ucum}
            if high is not None:
                range_dict["high"] = {"value": high, "unit": unit_ucum}
            ref_range = [range_dict] if range_dict else []

            entries.append({"resource": {
                "resourceType": "Observation",
                "id": obs_id,
                "meta": {"profile": [PROFILE_OBS]},
                "status": "final",
                "category": [{"coding": [{
                    "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                    "code": "laboratory",
                }]}],
                "code": {"coding": [{
                    "system": "http://loinc.org",
                    "code": loinc,
                    "display": name_de,
                }]},
                "subject": {"reference": patient["ref"], "display": patient["name"]},
                "effectiveDateTime": spec["datum_iso"],
                "valueQuantity": {
                    "value": value,
                    "unit": unit_ucum,
                    "system": "http://unitsofmeasure.org",
                    "code": unit_ucum,
                },
                **({"referenceRange": ref_range} if ref_range else {}),
            }})

    return {
        "resourceType": "Bundle",
        "id": spec["bundle_id"],
        "meta": {"profile": [PROFILE_BUNDLE]},
        "type": "collection",
        "timestamp": spec["datum_iso"],
        "entry": entries,
    }


HTML_TEMPLATE = """<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<title>{titel} — {patient_name} — {datum_display}</title>
<style>
  @page {{ size: A4; margin: 18mm 16mm; }}
  body {{ font-family: 'Helvetica Neue', Arial, sans-serif; color: #1d2733; font-size: 11pt; line-height: 1.45; }}
  .header {{ display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid {accent}; padding-bottom: 10px; margin-bottom: 18px; }}
  .clinic {{ font-weight: 700; font-size: 14pt; color: {accent}; letter-spacing: 0.3px; }}
  .clinic-sub {{ font-size: 9pt; color: #5b6b7b; }}
  .meta {{ text-align: right; font-size: 9.5pt; color: #3b4a5b; }}
  h1 {{ font-size: 16pt; margin: 12px 0 18px; color: {accent}; }}
  .patient-box {{ background: #f4f7fb; border: 1px solid #d8e1ec; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; display: grid; grid-template-columns: 1fr 1fr; column-gap: 16px; row-gap: 4px; font-size: 10pt; }}
  .patient-box .label {{ color: #5b6b7b; }}
  .patient-box .value {{ font-weight: 600; }}
  table {{ width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 10pt; }}
  thead th {{ background: {accent}; color: #fff; text-align: left; padding: 7px 9px; font-weight: 600; font-size: 9.5pt; }}
  tbody td {{ padding: 6px 9px; border-bottom: 1px solid #e3e8ee; }}
  tbody tr:nth-child(even) td {{ background: #fafbfc; }}
  .val {{ font-weight: 700; }}
  .flag {{ display: inline-block; font-size: 8.5pt; padding: 1px 6px; border-radius: 3px; margin-left: 5px; }}
  .flag.normal {{ background: #e8f5ee; color: #1d6a3a; }}
  .flag.high {{ background: #fde2e2; color: #b3261e; }}
  .flag.low {{ background: #fde2e2; color: #b3261e; }}
  .panel-head {{ background: #eef3f8; color: {accent}; font-weight: 700; padding: 5px 9px; border-left: 3px solid {accent}; margin-top: 10px; }}
  .comment {{ background: #fffdf3; border: 1px solid #f0e1a8; color: #4d3b00; padding: 10px 14px; border-radius: 6px; margin-top: 14px; font-size: 10pt; }}
  .footer {{ margin-top: 22px; padding-top: 10px; border-top: 1px solid #d8e1ec; font-size: 9pt; color: #5b6b7b; display: flex; justify-content: space-between; }}
  .sig {{ margin-top: 30px; font-size: 10pt; }}
  .sig .line {{ margin-top: 26px; border-top: 1px solid #1d2733; width: 60mm; padding-top: 4px; font-size: 9pt; color: #3b4a5b; }}
</style>
</head>
<body>

<div class="header">
  <div>
    <div class="clinic">{lab_name}</div>
    <div class="clinic-sub">{lab_address}</div>
  </div>
  <div class="meta">
    Befund-Nr. {befund_nr}<br>
    Ausstellungsdatum: {datum_display}<br>
    Auftraggeber: {auftraggeber}
  </div>
</div>

<h1>{titel}</h1>

<div class="patient-box">
  <div class="label">Patient:</div><div class="value">{patient_name}</div>
  <div class="label">Geburtsdatum:</div><div class="value">{patient_geb}</div>
  <div class="label">Geschlecht:</div><div class="value">{patient_geschlecht}</div>
  <div class="label">Probenmaterial:</div><div class="value">Serum / EDTA-Vollblut</div>
  <div class="label">Entnahme:</div><div class="value">{entnahme_display}</div>
  <div class="label">Eingang Labor:</div><div class="value">{datum_display}</div>
</div>

{panels_html}

<div class="comment"><strong>Befundinterpretation:</strong> {kommentar}</div>

<div class="sig">
  <div class="line">{signatur}</div>
</div>

<div class="footer">
  <span>{lab_name}</span>
  <span>Demo-Befund — Entwicklungsumgebung BSc EPD</span>
</div>

</body>
</html>
"""


def render_panel_html(panel_name: str, rows: list) -> str:
    body = []
    for loinc, name_de, value, unit_ucum, low, high in rows:
        flag_code, flag_class = status_flag(value, low, high)
        body.append(
            "<tr>"
            f"<td>{name_de}</td>"
            f'<td><span class="val">{trim(value)}</span>'
            f'<span class="flag {flag_class}">{flag_code}</span></td>'
            f"<td>{unit_ucum}</td>"
            f"<td>{fmt_range(low, high)}</td>"
            f"<td>{loinc}</td>"
            "</tr>"
        )
    return (
        f'<div class="panel-head">{panel_name}</div>'
        '<table>'
        '<thead><tr><th>Parameter</th><th>Wert</th><th>Einheit</th>'
        '<th>Referenzbereich</th><th>LOINC</th></tr></thead>'
        f'<tbody>{"".join(body)}</tbody>'
        '</table>'
    )


def build_html(spec: dict, patient: dict) -> str:
    panels_html = "\n".join(render_panel_html(name, rows) for name, rows in spec["panels"])
    lab_name, lab_address, accent = LABS[spec["lab_key"]]
    return HTML_TEMPLATE.format(
        titel=spec["titel"], accent=accent, lab_name=lab_name, lab_address=lab_address,
        befund_nr=spec["befund_nr"], datum_display=spec["datum_display"],
        entnahme_display=spec["entnahme_display"], auftraggeber=spec["auftraggeber"],
        patient_name=patient["name"], patient_geb=patient["geb"], patient_geschlecht=patient["geschlecht"],
        panels_html=panels_html, kommentar=spec["kommentar"], signatur=spec["signatur"],
    )


def render_pdf(html_path: Path, pdf_path: Path) -> None:
    if not Path(CHROME).exists():
        raise FileNotFoundError(f"Google Chrome nicht unter {CHROME} gefunden.")
    subprocess.run(
        [CHROME, "--headless", "--disable-gpu", "--no-pdf-header-footer",
         f"--print-to-pdf={pdf_path}", html_path.as_uri()],
        check=True, capture_output=True,
    )


def main() -> None:
    total = 0
    for pkey, patient in PATIENTS.items():
        base = HERE / patient["folder"]
        strukt_dir = base / "strukturiert"
        unstrukt_dir = base / "unstrukturiert"
        strukt_dir.mkdir(parents=True, exist_ok=True)
        unstrukt_dir.mkdir(parents=True, exist_ok=True)

        print(f"\n=== {patient['name']} ({pkey}) ===")
        for spec in BUNDLES[pkey]:
            slug = spec["slug"]

            bundle = build_bundle(spec, patient)
            json_path = strukt_dir / f"{slug}.json"
            with json_path.open("w", encoding="utf-8") as f:
                json.dump(bundle, f, ensure_ascii=False, indent=2)

            html_path = unstrukt_dir / f"{slug}.html"
            pdf_path = unstrukt_dir / f"{slug}.pdf"
            html_path.write_text(build_html(spec, patient), encoding="utf-8")
            try:
                render_pdf(html_path, pdf_path)
                print(f"  {slug}  ({len(bundle['entry'])} Obs)  JSON + PDF")
            except FileNotFoundError as e:
                print(f"  {slug}  JSON ✓ · ⚠ PDF übersprungen: {e}")
            total += 1

    print(f"\nFertig — {total} Bundles + PDFs erzeugt (4 Personas × 5).")
    print(f"  Struktur: Demofiles/<Patientenname>/{{strukturiert,unstrukturiert}}/")


if __name__ == "__main__":
    main()
