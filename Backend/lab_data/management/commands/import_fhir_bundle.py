"""
Management Command: FHIR-Bundle in die Datenbank importieren.

Dünner CLI-Wrapper um `lab_data.services.import_fhir_bundle` — die eigentliche
Matching- und Duplikat-Logik liegt im Service, damit CLI und HTTP-Upload
(POST /api/patients/<id>/lab-reports/) exakt denselben Pfad nutzen.

Aufruf:
    python manage.py import_fhir_bundle <pfad-zum-bundle> --patient-id <id>

Beispiel:
    python manage.py import_fhir_bundle lab_data/fixtures/fake_lab_report_luca.json --patient-id 1
"""

import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from lab_data.models import Patient
from lab_data.services import import_fhir_bundle


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

        if not bundle_path.exists():
            raise CommandError(f"Bundle nicht gefunden: {bundle_path}")
        bundle = json.loads(bundle_path.read_text(encoding="utf-8"))

        try:
            patient = Patient.objects.get(patient_id=patient_id)
        except Patient.DoesNotExist:
            raise CommandError(f"Patient mit id={patient_id} existiert nicht.")

        result = import_fhir_bundle(bundle, patient, str(bundle_path))

        for warning in result.warnings:
            self.stdout.write(self.style.WARNING(f"  {warning}"))

        if result.report_id:
            self.stdout.write(self.style.SUCCESS(
                f"LabReport {result.report_id} angelegt für {patient.name}."
            ))

        self.stdout.write(self.style.SUCCESS(
            f"\nFertig: {result.imported} neu importiert, "
            f"{result.duplicates} Duplikate übersprungen, "
            f"{result.skipped_unknown} unbekannt."
        ))
