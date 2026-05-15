"""
Management Command: FHIR-Bundle in die Datenbank importieren.

Setzt das Mapping v5 von Neala Rohner technisch um:
- legt einen LabReport an (Container)
- iteriert über alle Observations im Bundle
- macht Match auf LabParameter (LOINC) und Unit (UCUM)
- berechnet interpretation_code (L / N / H) falls nicht im Bundle vorhanden

Aufruf:
    python manage.py import_fhir_bundle <pfad-zum-bundle> --patient-id <id>

Beispiel:
    python manage.py import_fhir_bundle lab_data/fixtures/fake_lab_report_luca.json --patient-id 1
"""

import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from lab_data.models import Patient, LabReport, LabValue, LabParameter, Unit


class Command(BaseCommand):
    help = "Importiert ein FHIR-Bundle (Observations) als LabReport + LabValues."

    def add_arguments(self, parser):
        parser.add_argument("bundle_path", type=str, help="Pfad zum FHIR-Bundle (JSON)")
        parser.add_argument(
            "--patient-id",
            type=int,
            required=True,
            help="patient_id des Empfängers (currently selected Patient in der App)",
        )

    def handle(self, *args, **options):
        bundle_path = Path(options["bundle_path"])
        patient_id = options["patient_id"]

        # --- Bundle lesen ---
        if not bundle_path.exists():
            raise CommandError(f"Bundle nicht gefunden: {bundle_path}")
        bundle = json.loads(bundle_path.read_text(encoding="utf-8"))

        try:
            patient = Patient.objects.get(patient_id=patient_id)
        except Patient.DoesNotExist:
            raise CommandError(f"Patient mit id={patient_id} existiert nicht.")

        # --- LabReport anlegen ---
        report = LabReport.objects.create(
            patient=patient,
            source_file_path=str(bundle_path),
            source_type="FHIR_JSON",
            structured_data_json=bundle,
        )
        self.stdout.write(self.style.SUCCESS(
            f"LabReport {report.lab_report_id} angelegt für {patient.name}."
        ))

        # --- Observations iterieren ---
        entries = bundle.get("entry", [])
        imported = 0
        skipped = 0

        for entry in entries:
            obs = entry.get("resource", {})
            if obs.get("resourceType") != "Observation":
                skipped += 1
                continue

            # Match LabParameter via LOINC-Code
            coding = obs.get("code", {}).get("coding", [{}])[0]
            code = coding.get("code")
            code_system = coding.get("system", "http://loinc.org")
            try:
                parameter = LabParameter.objects.get(code=code, code_system=code_system)
            except LabParameter.DoesNotExist:
                self.stdout.write(self.style.WARNING(
                    f"  Skip: LabParameter ({code}, {code_system}) unbekannt."
                ))
                skipped += 1
                continue

            # Match Unit via UCUM-Code/Abkürzung
            value_quantity = obs.get("valueQuantity", {})
            unit_str = value_quantity.get("code") or value_quantity.get("unit")
            try:
                unit = Unit.objects.get(abbreviation=unit_str)
            except Unit.DoesNotExist:
                self.stdout.write(self.style.WARNING(
                    f"  Skip: Unit '{unit_str}' unbekannt."
                ))
                skipped += 1
                continue

            measured_value = value_quantity.get("value")
            measurement_date = obs.get("effectiveDateTime")

            # Referenzbereich (optional)
            ref_ranges = obs.get("referenceRange", [])
            low = high = None
            if ref_ranges:
                rr = ref_ranges[0]
                if rr.get("low"):
                    low = rr["low"].get("value")
                if rr.get("high"):
                    high = rr["high"].get("value")

            # Interpretation: Override aus Bundle, sonst abgeleitete Formel
            interpretation = ""
            interp_list = obs.get("interpretation", [])
            if interp_list:
                interpretation = interp_list[0].get("coding", [{}])[0].get("code", "")
            else:
                if low is not None and measured_value < low:
                    interpretation = "L"
                elif high is not None and measured_value > high:
                    interpretation = "H"
                elif low is not None or high is not None:
                    interpretation = "N"

            LabValue.objects.create(
                lab_report=report,
                parameter=parameter,
                unit=unit,
                measurement_date=measurement_date,
                measured_value=measured_value,
                reference_range_low=low,
                reference_range_high=high,
                interpretation_code=interpretation,
            )
            self.stdout.write(
                f"  + {parameter.name}: {measured_value} {unit.abbreviation} [{interpretation or '-'}]"
            )
            imported += 1

        self.stdout.write(self.style.SUCCESS(
            f"\nFertig: {imported} LabValues importiert, {skipped} übersprungen."
        ))
