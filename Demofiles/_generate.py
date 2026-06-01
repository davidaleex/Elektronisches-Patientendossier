"""
Generiert die Demo-FHIR-Bundles (strukturiert/) und die dazu passenden PDF-
Laborbefunde (unstrukturiert/) für die UI-Demos.

5 Bundles für Luca Frei (m, 20J), als kleiner klinischer Bogen:
  01  Jahrescheck beim Hausarzt           (alles normal)
  02  Sportmedizin / Mikronährstoffe       (Vitamin D niedrig-normal)
  03  Lipidprofil Prävention                (LDL grenzwertig)
  04  Infekt-Abklärung akut                 (CRP + Leuko deutlich erhöht)
  05  Verlaufskontrolle nach Infekt         (Werte normalisiert)

Jeder Bundle-Slug hat eine gleichnamige PDF — die Mock-KI-Extraktion mappt
PDF-Filename → Bundle, sodass „Upload X" auch wirklich „Vorschau X" zeigt.

Aufruf:
    python Demofiles/_generate.py
Voraussetzung: Google Chrome unter /Applications/.

Code-frei für die App — wenn du Bundles änderst, einfach erneut ausführen.
"""

import json
import shutil
import subprocess
from pathlib import Path

HERE = Path(__file__).parent
STRUKT = HERE / "strukturiert"
UNSTRUKT = HERE / "unstrukturiert"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

PATIENT_REF = "Patient/1"
PATIENT_NAME = "Luca Frei"
PATIENT_GEB = "14.03.2006"
PATIENT_GESCHLECHT = "männlich"
PROFILE_BUNDLE = "http://fhir.ch/ig/ch-lab-report/StructureDefinition/ch-lab-report-document"
PROFILE_OBS = "http://fhir.ch/ig/ch-lab-report/StructureDefinition/ch-lab-observation-results-laboratory"

# Lab-Anschrift pro Bundle. Für visuelle Variation im Demo.
LABS = {
    "hausarzt": ("Hausarzt-Labor Dr. M. Studer", "Spalenring 12 · 4055 Basel · +41 61 281 12 12"),
    "sportmed": ("Sportmedizin Basel SUVA", "Spitalstrasse 21 · 4031 Basel · +41 61 326 28 28"),
    "cardio":   ("Kardiologie-Labor Praxis Furrer", "Aeschenvorstadt 4 · 4051 Basel · +41 61 271 44 44"),
    "notfall":  ("Notfall-Labor Universitätsspital Basel", "Petersgraben 4 · 4031 Basel · +41 61 265 25 25"),
}

# (LOINC, Anzeigename DE, Wert, Unit (UCUM), low | None, high | None, Gruppe)
# Die Units MÜSSEN exakt zu den UCUM-Abbreviations in der Master Data passen,
# sonst wirft der Import "Unbekannte Einheit".
BUNDLES = [
    {
        "slug": "01_jahrescheck-hausarzt",
        "bundle_id": "luca-jahrescheck-2025-09-15",
        "datum_iso": "2025-09-15T08:00:00+02:00",
        "datum_display": "15.09.2025",
        "entnahme_display": "15.09.2025, 08:00",
        "lab_key": "hausarzt",
        "auftraggeber": "Dr. med. Markus Studer (Hausarzt, FMH Allgemein)",
        "befund_nr": "2025-0915-A",
        "titel": "Jahres-Check — Allgemein",
        "panels": [
            ("Kleines Blutbild", [
                ("718-7",   "Hämoglobin (Hb)",        15.2,  "g/dL",      13.5, 17.5),
                ("4544-3",  "Hämatokrit (Hct)",       45.0,  "%",         40.0, 50.0),
                ("789-8",   "Erythrozyten (RBC)",      5.1,  "10*12/L",    4.3,  5.8),
                ("6690-2",  "Leukozyten (WBC)",        6.8,  "10*9/L",     4.0, 10.0),
                ("787-2",   "MCV",                    88,    "fL",        80.0, 96.0),
                ("777-3",   "Thrombozyten",          245,    "10*9/L",   150.0,400.0),
            ]),
            ("Stoffwechsel & Niere/Leber", [
                ("2345-7",  "Glukose (nüchtern)",      4.7,  "mmol/L",     3.9,  5.6),
                ("2160-0",  "Kreatinin",              78,    "µmol/L",    62,  106),
                ("1742-6",  "ALT (GPT)",              24,    "U/L",     None,  50.0),
                ("1920-8",  "AST (GOT)",              22,    "U/L",     None,  40.0),
            ]),
        ],
        "kommentar": "Alle Parameter im Referenzbereich. Keine pathologischen Auffälligkeiten.",
        "signatur": "Dr. med. Markus Studer",
    },
    {
        "slug": "02_sportmedizin-mikronaehrstoffe",
        "bundle_id": "luca-sportmed-2026-03-05",
        "datum_iso": "2026-03-05T07:30:00+01:00",
        "datum_display": "05.03.2026",
        "entnahme_display": "05.03.2026, 07:30",
        "lab_key": "sportmed",
        "auftraggeber": "Dr. med. Sandra Egli (Sportmedizin SGSM)",
        "befund_nr": "2026-SPM-0305",
        "titel": "Sportmedizin — Mikronährstoff- und Belastungs-Status",
        "panels": [
            ("Mikronährstoffe", [
                ("14635-7", "25-OH Vitamin D",        58,    "nmol/L",    50,  150),
            ]),
            ("Entzündung & Blutbild", [
                ("1988-5",  "CRP",                     1.2,  "mg/L",    None,   5.0),
                ("718-7",   "Hämoglobin (Hb)",        15.5,  "g/dL",      13.5, 17.5),
                ("787-2",   "MCV",                    89,    "fL",        80.0, 96.0),
            ]),
            ("Belastungs-Leberenzyme", [
                ("1742-6",  "ALT (GPT)",              31,    "U/L",     None,  50.0),
                ("1920-8",  "AST (GOT)",              28,    "U/L",     None,  40.0),
            ]),
        ],
        "kommentar": (
            "Vitamin D im unteren Normbereich (BAG-Empfehlung: Suffizienz ≥ 50 nmol/L). "
            "Substitution in den Wintermonaten überlegenswert. "
            "Leberenzyme post-Belastung leicht erhöht, aber noch im Norm — typisch nach intensiver Trainingsphase."
        ),
        "signatur": "Dr. med. Sandra Egli",
    },
    {
        "slug": "03_lipidprofil-praevention",
        "bundle_id": "luca-lipid-2026-04-20",
        "datum_iso": "2026-04-20T09:15:00+02:00",
        "datum_display": "20.04.2026",
        "entnahme_display": "20.04.2026, 09:15",
        "lab_key": "cardio",
        "auftraggeber": "Dr. med. Anna Furrer (Kardiologie FMH)",
        "befund_nr": "2026-CARD-04020",
        "titel": "Lipidprofil — Präventive Risiko-Abklärung",
        "panels": [
            ("Lipide", [
                ("2093-3",  "Cholesterin gesamt",      5.1,  "mmol/L",  None,   5.0),
                ("2089-1",  "LDL-Cholesterin",         3.2,  "mmol/L",  None,   3.0),
                ("2085-9",  "HDL-Cholesterin",         1.5,  "mmol/L",     1.0, None),
                ("2571-8",  "Triglyceride",            0.9,  "mmol/L",  None,   1.7),
            ]),
            ("Stoffwechsel", [
                ("2345-7",  "Glukose (nüchtern)",      4.9,  "mmol/L",     3.9,  5.6),
                ("4548-4",  "HbA1c",                   5.2,  "%",       None,   5.7),
            ]),
        ],
        "kommentar": (
            "Cholesterin gesamt und LDL knapp über den Zielwerten der ESC/EAS-Guidelines für "
            "Niedrig-Risiko-Personen. Klinisch unauffällig — Lebensstil-Massnahmen empfohlen, "
            "Kontrolle in 12 Monaten. Glukose und HbA1c unauffällig."
        ),
        "signatur": "Dr. med. Anna Furrer",
    },
    {
        "slug": "04_infektabklaerung-akut",
        "bundle_id": "luca-infekt-2026-05-10",
        "datum_iso": "2026-05-10T14:40:00+02:00",
        "datum_display": "10.05.2026",
        "entnahme_display": "10.05.2026, 14:40 (Notfallambulanz)",
        "lab_key": "notfall",
        "auftraggeber": "Notfallzentrum USB (Dr. med. K. Reinhardt)",
        "befund_nr": "2026-NF-10052",
        "titel": "Akut-Bluttest bei febrilem Infekt",
        "panels": [
            ("Entzündung", [
                ("1988-5",  "CRP",                    38,    "mg/L",    None,   5.0),
                ("6690-2",  "Leukozyten (WBC)",       13.2,  "10*9/L",     4.0, 10.0),
            ]),
            ("Sicherheitsparameter", [
                ("718-7",   "Hämoglobin (Hb)",        14.8,  "g/dL",      13.5, 17.5),
                ("2160-0",  "Kreatinin",              81,    "µmol/L",    62,  106),
                ("1742-6",  "ALT (GPT)",              26,    "U/L",     None,  50.0),
            ]),
        ],
        "kommentar": (
            "Klinisch febriler Infekt der oberen Atemwege. CRP deutlich erhöht (38 mg/L) und "
            "Leukozytose vereinbar mit bakterieller Komponente. Nieren- und Leberwerte unauffällig. "
            "Antibiotikum erwogen, Verlaufskontrolle in 14 Tagen."
        ),
        "signatur": "Dr. med. K. Reinhardt",
    },
    {
        "slug": "05_verlaufskontrolle-nach-infekt",
        "bundle_id": "luca-verlauf-2026-05-25",
        "datum_iso": "2026-05-25T08:45:00+02:00",
        "datum_display": "25.05.2026",
        "entnahme_display": "25.05.2026, 08:45",
        "lab_key": "hausarzt",
        "auftraggeber": "Dr. med. Markus Studer (Hausarzt, FMH Allgemein)",
        "befund_nr": "2026-0525-V",
        "titel": "Verlaufskontrolle nach Infekt",
        "panels": [
            ("Entzündung — Verlauf", [
                ("1988-5",  "CRP",                     2.1,  "mg/L",    None,   5.0),
                ("6690-2",  "Leukozyten (WBC)",        7.5,  "10*9/L",     4.0, 10.0),
            ]),
            ("Sicherheitsparameter", [
                ("718-7",   "Hämoglobin (Hb)",        15.0,  "g/dL",      13.5, 17.5),
            ]),
        ],
        "kommentar": (
            "CRP und Leukozyten erfreulich normalisiert (vorher 10.05.: CRP 38, WBC 13.2). "
            "Infekt klinisch ausgeheilt, keine weiteren Massnahmen erforderlich."
        ),
        "signatur": "Dr. med. Markus Studer",
    },
]


def trim(x):
    """Hübsche Anzeige für Zahlen ohne nutzlose Nachkommastellen."""
    if x is None:
        return ""
    f = float(x)
    return f"{f:g}"


def fmt_range(low, high):
    if low is not None and high is not None:
        return f"{trim(low)}–{trim(high)}"
    if high is not None:
        return f"< {trim(high)}"
    if low is not None:
        return f"> {trim(low)}"
    return ""


def status_flag(value, low, high):
    """Demo-Flag im PDF (n/H/L) — App leitet das produktiv aus den kuratierten
    Referenzbereichen ab, hier reicht der naive Vergleich gegen den Bundle-Range."""
    if low is not None and value < low:
        return ("L", "low")
    if high is not None and value > high:
        return ("H", "high")
    return ("n", "normal")


def build_bundle(spec: dict) -> dict:
    """FHIR-R4-Bundle aus der Spec — exakt die Form, die der M5-Import frisst."""
    entries = []
    seq = 0
    for _panel_name, rows in spec["panels"]:
        for loinc, name_de, value, unit_ucum, low, high in rows:
            seq += 1
            obs_id = f"{spec['bundle_id']}-{seq:02d}"
            ref_range = []
            range_dict = {}
            if low is not None:
                range_dict["low"] = {"value": low, "unit": unit_ucum}
            if high is not None:
                range_dict["high"] = {"value": high, "unit": unit_ucum}
            if range_dict:
                ref_range.append(range_dict)

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
                "subject": {"reference": PATIENT_REF, "display": PATIENT_NAME},
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
  body {{
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #1d2733;
    font-size: 11pt;
    line-height: 1.45;
  }}
  .header {{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid {accent};
    padding-bottom: 10px;
    margin-bottom: 18px;
  }}
  .clinic {{ font-weight: 700; font-size: 14pt; color: {accent}; letter-spacing: 0.3px; }}
  .clinic-sub {{ font-size: 9pt; color: #5b6b7b; }}
  .meta {{ text-align: right; font-size: 9.5pt; color: #3b4a5b; }}
  h1 {{ font-size: 16pt; margin: 12px 0 18px; color: {accent}; }}
  .patient-box {{
    background: #f4f7fb;
    border: 1px solid #d8e1ec;
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
    row-gap: 4px;
    font-size: 10pt;
  }}
  .patient-box .label {{ color: #5b6b7b; }}
  .patient-box .value {{ font-weight: 600; }}
  table {{ width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 10pt; }}
  thead th {{
    background: {accent};
    color: #fff;
    text-align: left;
    padding: 7px 9px;
    font-weight: 600;
    font-size: 9.5pt;
  }}
  tbody td {{ padding: 6px 9px; border-bottom: 1px solid #e3e8ee; }}
  tbody tr:nth-child(even) td {{ background: #fafbfc; }}
  .val {{ font-weight: 700; }}
  .flag {{
    display: inline-block;
    font-size: 8.5pt;
    padding: 1px 6px;
    border-radius: 3px;
    margin-left: 5px;
  }}
  .flag.normal {{ background: #e8f5ee; color: #1d6a3a; }}
  .flag.high {{ background: #fde2e2; color: #b3261e; }}
  .flag.low {{ background: #fde2e2; color: #b3261e; }}
  .panel-head {{
    background: #eef3f8;
    color: {accent};
    font-weight: 700;
    padding: 5px 9px;
    border-left: 3px solid {accent};
    margin-top: 10px;
  }}
  .comment {{
    background: #fffdf3;
    border: 1px solid #f0e1a8;
    color: #4d3b00;
    padding: 10px 14px;
    border-radius: 6px;
    margin-top: 14px;
    font-size: 10pt;
  }}
  .footer {{
    margin-top: 22px;
    padding-top: 10px;
    border-top: 1px solid #d8e1ec;
    font-size: 9pt;
    color: #5b6b7b;
    display: flex;
    justify-content: space-between;
  }}
  .sig {{ margin-top: 30px; font-size: 10pt; }}
  .sig .line {{
    margin-top: 26px;
    border-top: 1px solid #1d2733;
    width: 60mm;
    padding-top: 4px;
    font-size: 9pt;
    color: #3b4a5b;
  }}
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

# Akzent-Farbe je Lab — gibt jedem Bericht einen erkennbar anderen Look.
LAB_ACCENT = {
    "hausarzt": "#1f4e79",  # blau
    "sportmed": "#2e7d32",  # grün
    "cardio":   "#a83232",  # rot
    "notfall":  "#5e35b1",  # violett
}


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


def build_html(spec: dict) -> str:
    panels_html = "\n".join(render_panel_html(name, rows) for name, rows in spec["panels"])
    lab_name, lab_address = LABS[spec["lab_key"]]
    return HTML_TEMPLATE.format(
        titel=spec["titel"],
        accent=LAB_ACCENT[spec["lab_key"]],
        lab_name=lab_name,
        lab_address=lab_address,
        befund_nr=spec["befund_nr"],
        datum_display=spec["datum_display"],
        entnahme_display=spec["entnahme_display"],
        auftraggeber=spec["auftraggeber"],
        patient_name=PATIENT_NAME,
        patient_geb=PATIENT_GEB,
        patient_geschlecht=PATIENT_GESCHLECHT,
        panels_html=panels_html,
        kommentar=spec["kommentar"],
        signatur=spec["signatur"],
    )


def render_pdf(html_path: Path, pdf_path: Path) -> None:
    if not Path(CHROME).exists():
        raise FileNotFoundError(
            f"Google Chrome nicht unter {CHROME} gefunden — PDF-Render-Schritt überspringen."
        )
    subprocess.run(
        [
            CHROME, "--headless", "--disable-gpu", "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}", html_path.as_uri(),
        ],
        check=True,
        capture_output=True,
    )


def main() -> None:
    STRUKT.mkdir(parents=True, exist_ok=True)
    UNSTRUKT.mkdir(parents=True, exist_ok=True)

    for spec in BUNDLES:
        slug = spec["slug"]

        # JSON-Bundle schreiben (Form = was der M5-Import erwartet)
        bundle = build_bundle(spec)
        json_path = STRUKT / f"{slug}.json"
        with json_path.open("w", encoding="utf-8") as f:
            json.dump(bundle, f, ensure_ascii=False, indent=2)
        print(f"  JSON  → {json_path.relative_to(HERE)}  ({len(bundle['entry'])} Observations)")

        # HTML + PDF (gleicher Slug, damit Mock-AI sie zuordnen kann)
        html_path = UNSTRUKT / f"{slug}.html"
        pdf_path = UNSTRUKT / f"{slug}.pdf"
        html_path.write_text(build_html(spec), encoding="utf-8")
        try:
            render_pdf(html_path, pdf_path)
            print(f"  PDF   → {pdf_path.relative_to(HERE)}")
        except FileNotFoundError as e:
            print(f"  ⚠ PDF übersprungen: {e}")

    print(f"\nFertig — {len(BUNDLES)} Bundles + PDFs erzeugt.")
    print(f"  strukturiert/  → {STRUKT}")
    print(f"  unstrukturiert/ → {UNSTRUKT}")


if __name__ == "__main__":
    main()
