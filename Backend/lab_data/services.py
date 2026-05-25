"""
Import-Service für strukturierte FHIR-Bundles.

Gemeinsame Logik für den CLI-Pfad (Management Command `import_fhir_bundle`)
und den HTTP-Upload-Endpoint. So teilen beide Eingänge exakt dieselbe
Matching- und Duplikat-Logik — eine einzige Quelle der Wahrheit.

Konzept (Nealas „Template befüllen", Stand 25.05.2026):
- Die Master Data (LabParameter via LOINC, Unit via UCUM) ist die Vorlage.
- Jede Observation eines Bundles füllt diese Vorlage = wird gegen die
  Master Data gematcht. Was nicht matcht, wird übersprungen (skipped_unknown).
- Duplikat-Erkennung auf MESS-Ebene: eine Messung ist eindeutig über
  (Patient, Parameter, Mess-Zeitpunkt). Unterscheidet sich auch nur der
  Zeitstempel, ist es eine eigene neue Messung. Ist exakt dieselbe Messung
  schon vorhanden, wird sie übersprungen.
- Enthält ein Bundle KEINE einzige neue Messung, wird auch kein (leerer)
  LabReport angelegt — nur eine Warnung zurückgegeben.
"""

from dataclasses import dataclass, field
from datetime import date

from django.db import transaction
from django.utils.dateparse import parse_datetime

from .models import LabParameter, LabReport, LabValue, Unit


# ---------------------------------------------------------------------------
# Referenzbereiche — Alter berechnen + passenden Bereich auswählen (Issue #26)
# ---------------------------------------------------------------------------


def age_in_years(date_of_birth, on_date=None) -> int:
    """Vollendete Lebensjahre zwischen Geburtsdatum und Stichtag (default heute)."""
    on_date = on_date or date.today()
    return (
        on_date.year
        - date_of_birth.year
        - ((on_date.month, on_date.day) < (date_of_birth.month, date_of_birth.day))
    )


def reference_range_for(parameter, age_years, sex):
    """
    Wählt den passenden ReferenceRange für Parameter + Alter + Geschlecht.

    Geschlechtsspezifischer Eintrag hat Vorrang vor 'any'. Gibt None zurück,
    wenn (noch) kein passender Bereich hinterlegt ist.
    """
    candidates = []
    for r in parameter.reference_ranges.all():
        lo_ok = r.age_min_years is None or age_years >= float(r.age_min_years)
        hi_ok = r.age_max_years is None or age_years < float(r.age_max_years)
        if lo_ok and hi_ok:
            candidates.append(r)
    sex_specific = [r for r in candidates if r.sex == sex]
    pool = sex_specific or [r for r in candidates if r.sex == "any"]
    return pool[0] if pool else None


@dataclass
class ImportResult:
    """Ergebnis eines Bundle-Imports — direkt JSON-serialisierbar für die API."""

    report_id: object = None
    imported: int = 0          # neu angelegte LabValues
    duplicates: int = 0        # Messungen, die schon existierten
    skipped_unknown: int = 0   # Observations ohne Master-Data-Match
    warnings: list = field(default_factory=list)

    def as_dict(self) -> dict:
        return {
            "report_id": str(self.report_id) if self.report_id else None,
            "imported": self.imported,
            "duplicates": self.duplicates,
            "skipped_unknown": self.skipped_unknown,
            "warnings": self.warnings,
        }


def import_fhir_bundle(bundle: dict, patient, source_file_path: str) -> ImportResult:
    """
    Importiert ein FHIR-Bundle als LabReport + LabValues für `patient`.

    Gibt ein ImportResult mit Zählern und Warnungen zurück. Legt den
    LabReport nur an, wenn mindestens eine neue Messung enthalten ist.
    """
    result = ImportResult()

    # 1. Observations gegen die Master Data auflösen (Template befüllen).
    candidates = []
    for entry in bundle.get("entry", []):
        obs = entry.get("resource", {})
        if obs.get("resourceType") != "Observation":
            continue
        parsed = _resolve_observation(obs, result)
        if parsed is not None:
            candidates.append(parsed)

    # 2. Duplikate auf Mess-Ebene aussortieren — gegen bestehende Werte des
    #    Patienten UND gegen Doppel innerhalb desselben Bundles.
    new_values = []
    seen_in_bundle = set()
    for cand in candidates:
        dedup_key = (cand["parameter"].parameter_id, cand["measurement_date"])

        already_in_db = LabValue.objects.filter(
            lab_report__patient=patient,
            parameter=cand["parameter"],
            measurement_date=cand["measurement_date"],
        ).exists()

        if dedup_key in seen_in_bundle or already_in_db:
            result.duplicates += 1
            continue

        seen_in_bundle.add(dedup_key)
        new_values.append(cand)

    # 3. Keine neue Messung → kein leerer Report (Vorgabe David 25.05.2026).
    if not new_values:
        result.warnings.append(
            "Bericht enthält keine neuen Messungen — bereits vollständig vorhanden."
        )
        return result

    # 4. Report + neue Werte atomar anlegen.
    with transaction.atomic():
        report = LabReport.objects.create(
            patient=patient,
            source_file_path=source_file_path,
            source_type="FHIR_JSON",
            structured_data_json=bundle,
        )
        LabValue.objects.bulk_create(
            LabValue(lab_report=report, **cand) for cand in new_values
        )

    result.report_id = report.lab_report_id
    result.imported = len(new_values)
    return result


def _resolve_observation(obs: dict, result: ImportResult):
    """
    Löst eine einzelne Observation gegen die Master Data auf.

    Gibt ein dict mit fertigen LabValue-Feldern zurück, oder None wenn die
    Observation nicht verwertbar ist (in dem Fall wird `result` ergänzt).
    """
    # Match LabParameter via LOINC-Code.
    coding = (obs.get("code", {}).get("coding") or [{}])[0]
    code = coding.get("code")
    code_system = coding.get("system", "http://loinc.org")
    try:
        parameter = LabParameter.objects.get(code=code, code_system=code_system)
    except LabParameter.DoesNotExist:
        result.skipped_unknown += 1
        result.warnings.append(f"Unbekannter Parameter (LOINC {code}) — übersprungen.")
        return None

    # Match Unit via UCUM-Abkürzung.
    value_quantity = obs.get("valueQuantity", {})
    unit_str = value_quantity.get("code") or value_quantity.get("unit")
    try:
        unit = Unit.objects.get(abbreviation=unit_str)
    except Unit.DoesNotExist:
        result.skipped_unknown += 1
        result.warnings.append(
            f"Unbekannte Einheit '{unit_str}' bei {parameter.name} — übersprungen."
        )
        return None

    measured_value = value_quantity.get("value")
    if measured_value is None:
        result.skipped_unknown += 1
        result.warnings.append(f"Kein Messwert bei {parameter.name} — übersprungen.")
        return None

    # effectiveDateTime → aware datetime (Bundles tragen TZ-Offset, USE_TZ=True).
    measurement_date = parse_datetime(obs.get("effectiveDateTime") or "")
    if measurement_date is None:
        result.skipped_unknown += 1
        result.warnings.append(
            f"Fehlender/ungültiger Zeitpunkt bei {parameter.name} — übersprungen."
        )
        return None

    # Referenzbereich (optional — low/high können einzeln fehlen).
    low = high = None
    ref_ranges = obs.get("referenceRange", [])
    if ref_ranges:
        rr = ref_ranges[0]
        if rr.get("low"):
            low = rr["low"].get("value")
        if rr.get("high"):
            high = rr["high"].get("value")

    # Interpretation: Override aus dem Bundle, sonst aus Referenzbereich ableiten.
    interpretation = ""
    interp_list = obs.get("interpretation", [])
    if interp_list:
        interpretation = (interp_list[0].get("coding") or [{}])[0].get("code", "")
    elif low is not None and measured_value < low:
        interpretation = "L"
    elif high is not None and measured_value > high:
        interpretation = "H"
    elif low is not None or high is not None:
        interpretation = "N"

    return {
        "parameter": parameter,
        "unit": unit,
        "measurement_date": measurement_date,
        "measured_value": measured_value,
        "reference_range_low": low,
        "reference_range_high": high,
        "interpretation_code": interpretation,
    }
