# Master Data — Angelegte Instanzen

**Stand:** 15.05.2026
**Zweck:** Quellen-Beleg für die in `Unit`, `LabGroup` und `LabParameter` angelegten Master-Data-Instanzen (Neala-Anweisung 14.05.2026).
**Konformität:** UCUM für Einheiten, LOINC für Lab-Parameter, FHIR R4 / CH LAB-Report kompatibel.
**Geladen via:** `python manage.py loaddata master_data` aus `Backend/lab_data/fixtures/master_data.json`.

---

## LabGroups (4)

Alle vier Gruppen aus dem Frontend übernommen und auf Englisch übersetzt.

| group_id | name | description | Source |
|---|---|---|---|
| 1 | Hematology | Cell counts and blood composition (RBC, WBC, platelets) | Frontend `Frontend/src/data/labValuesData.js` Kategorie „Hämatologie" |
| 2 | Metabolism | Glucose regulation, lipid profile, related metabolic markers | Frontend Kategorie „Stoffwechsel" |
| 3 | Kidney & Liver | Renal and hepatic function markers | Frontend Kategorie „Niere & Leber" |
| 4 | Other | Hormones, vitamins, inflammation markers | Frontend Kategorie „Sonstiges" |

---

## Units (12, UCUM-konform)

Quelle: **UCUM (Unified Code for Units of Measure)** — https://ucum.org/ucum

| unit_id | abbreviation | name | Source |
|---|---|---|---|
| 1 | `g/dL` | Grams per deciliter | UCUM |
| 2 | `10*12/L` | Trillion per liter | UCUM |
| 3 | `%` | Percent | UCUM |
| 4 | `10*9/L` | Billion per liter | UCUM |
| 5 | `fL` | Femtoliter | UCUM |
| 6 | `mmol/L` | Millimoles per liter | UCUM |
| 7 | `µmol/L` | Micromoles per liter | UCUM |
| 8 | `mL/min/{1.73_m2}` | Milliliters per minute per 1.73 m² body surface area | UCUM (eGFR-Standard) |
| 9 | `U/L` | Enzyme units per liter | UCUM |
| 10 | `mIU/L` | Milli-international units per liter | UCUM |
| 11 | `nmol/L` | Nanomoles per liter | UCUM |
| 12 | `mg/L` | Milligrams per liter | UCUM |

---

## LabParameters (20, LOINC-konform)

Quelle: **LOINC (Logical Observation Identifiers Names and Codes)** — https://loinc.org
Jeweils einzelner Link in der Tabelle. Alle Codes spiegeln die im Frontend-Prototyp dargestellten Werte.

### Hematology (6)

| parameter_id | name | code | code_system | unit | LOINC-Link |
|---|---|---|---|---|---|
| 1 | Erythrocytes (RBC) | 789-8 | http://loinc.org | 10*12/L | https://loinc.org/789-8/ |
| 2 | Hemoglobin (Hb) | 718-7 | http://loinc.org | g/dL | https://loinc.org/718-7/ |
| 3 | Hematocrit (Hct) | 4544-3 | http://loinc.org | % | https://loinc.org/4544-3/ |
| 4 | Leukocytes (WBC) | 6690-2 | http://loinc.org | 10*9/L | https://loinc.org/6690-2/ |
| 5 | Thrombocytes | 777-3 | http://loinc.org | 10*9/L | https://loinc.org/777-3/ |
| 6 | MCV (Mean Corpuscular Volume) | 787-2 | http://loinc.org | fL | https://loinc.org/787-2/ |

### Metabolism (6)

| parameter_id | name | code | code_system | unit | LOINC-Link |
|---|---|---|---|---|---|
| 7 | Glucose (fasting) | 2345-7 | http://loinc.org | mmol/L | https://loinc.org/2345-7/ |
| 8 | HbA1c | 4548-4 | http://loinc.org | % | https://loinc.org/4548-4/ |
| 9 | Total Cholesterol | 2093-3 | http://loinc.org | mmol/L | https://loinc.org/2093-3/ |
| 10 | LDL Cholesterol | 2089-1 | http://loinc.org | mmol/L | https://loinc.org/2089-1/ |
| 11 | HDL Cholesterol | 2085-9 | http://loinc.org | mmol/L | https://loinc.org/2085-9/ |
| 12 | Triglycerides | 2571-8 | http://loinc.org | mmol/L | https://loinc.org/2571-8/ |

### Kidney & Liver (5)

| parameter_id | name | code | code_system | unit | LOINC-Link |
|---|---|---|---|---|---|
| 13 | Creatinine | 2160-0 | http://loinc.org | µmol/L | https://loinc.org/2160-0/ |
| 14 | eGFR (creatinine-based) | 62292-8 | http://loinc.org | mL/min/{1.73_m2} | https://loinc.org/62292-8/ |
| 15 | AST (ASAT/GOT) | 1920-8 | http://loinc.org | U/L | https://loinc.org/1920-8/ |
| 16 | ALT (ALAT/GPT) | 1742-6 | http://loinc.org | U/L | https://loinc.org/1742-6/ |
| 17 | GGT (Gamma-glutamyl transferase) | 2324-2 | http://loinc.org | U/L | https://loinc.org/2324-2/ |

### Other (3)

| parameter_id | name | code | code_system | unit | LOINC-Link |
|---|---|---|---|---|---|
| 18 | TSH (Thyroid stimulating hormone) | 3016-3 | http://loinc.org | mIU/L | https://loinc.org/3016-3/ |
| 19 | 25-OH Vitamin D | 14635-7 | http://loinc.org | nmol/L | https://loinc.org/14635-7/ |
| 20 | C-reactive protein (CRP) | 1988-5 | http://loinc.org | mg/L | https://loinc.org/1988-5/ |

---

## Anmerkungen

- **Frontend-Mapping:** Die englischen Parameter-Namen entsprechen 1:1 den deutschen Frontend-Werten (Erythrozyten → Erythrocytes, Hämoglobin → Hemoglobin, …). Im Frontend-UI können die deutschen Namen über eine zusätzliche Übersetzungs-Schicht angezeigt werden.
- **Gruppierung folgt der Frontend-Logik** auch wo medizinisch andere Gruppierungen üblich wären (z. B. Cholesterol/LDL/HDL/Triglyceride sind im Frontend unter „Stoffwechsel" statt „Lipide" — Neala-Anweisung 14.05.: „alle Gruppen aus dem UI übernehmen").
- **CH LAB-Report-Konformität:** alle Codes sind LOINC-basiert und entsprechen den im CH-LAB-Report-Profil (CH Core) referenzierten Observation-Codes.
- **Einheiten in CH-Praxis:** Die ausgewählten UCUM-Einheiten reflektieren die übliche Schweizer Labor-Praxis (z. B. mmol/L für Cholesterin und Glukose, nicht mg/dL wie im US-Standard).
- **Fixture-Anpassungen:** Änderungen an Master Data sollen im draw.io-Datenmodell-Dokument **gelb markiert** werden (Neala-Workflow-Anweisung).

---

*Erstellt im Rahmen von Issue #5 — Master data: Unit, LabParameter, LabGroup.*
