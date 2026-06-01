# Demo-Bundles — strukturierte FHIR CH-LAB-Reports

Drei FHIR-R4-Bundles (CH-LAB-Report-orientiert, `meta.profile` referenziert das
CH-LAB-Report-Profil) zum Testen des Upload-Imports über das UI. Alle Werte sind
für Patient **Luca Frei** (`patient_id = 1`) und nutzen LOINC-Codes + UCUM-Units,
die 1:1 in der Master Data hinterlegt sind.

## Die drei Berichte

| Datei | Datum | Inhalt |
|---|---|---|
| `demo_a_basis_2026-05-04.json` | 04.05.2026 | Basis-Befund, 12 Werte (Hämatologie + Stoffwechsel + Leber/Niere + CRP). Chol, LDL und CRP leicht erhöht. |
| `demo_b_folge_2026-06-12.json` | 12.06.2026 | Folge-Befund, 8 Werte. Gleiche Parameter wie ein Teil von A, **anderes Datum** → alles neue Messungen (zeigt den Verlauf, Lipide verbessert). |
| `demo_c_teilduplikat_2026-05-04.json` | 04.05.2026 | Teil-Überlappung mit A: 3 Werte mit identischem Parameter **und** Zeitstempel wie A (= Duplikate) + 3 neue Parameter (HbA1c, TSH, Vitamin D). |

## Erwartetes Verhalten (Upload-Reihenfolge A → C → B)

| Upload | Erwartung |
|---|---|
| A | 12 neu importiert |
| C | **3 neu, 3 Duplikate** übersprungen (Hb / Glucose / LDL sind identisch zu A) |
| B | 8 neu importiert (anderes Datum = neue Messungen) |
| A erneut | 0 neu, 12 Duplikate (Vollduplikat → kein zweiter Report) |

## Hintergrund

Die Duplikat-Erkennung greift auf **Mess-Ebene**: eine Messung ist eindeutig über
`(Patient, Parameter, Mess-Zeitpunkt)`. Unterscheidet sich auch nur der Zeitstempel,
zählt sie als eigene neue Messung. Der Import (Observation → LabParameter via LOINC,
Unit via UCUM) liegt in `lab_data/services.py` und wird sowohl vom Management-Command
`import_fhir_bundle` als auch vom Upload-Endpoint `POST /api/patients/<id>/lab-reports/`
genutzt.
