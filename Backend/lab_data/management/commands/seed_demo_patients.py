"""
Management Command: Die vier Demo-Patienten anlegen.

Damit für die UX-Evaluation **alle** App-Personas dieselben Funktionen haben
(Verlauf, strukturierter/PDF-Upload, backend-gestützte Tabelle), legt dieser Command
Luca (1), Nina (2), Markus (3) und Elisa (4) an.

Standard: die Patienten starten **leer**, sodass im Demo/UX-Test ein Live-Upload die
Tabelle + Verlaufskurve sichtbar füllt. Bestehende LabReports werden dabei entfernt
(sauberer Reset — auch nach manuellen Test-Uploads).

    python manage.py seed_demo_patients              # leere Patienten (Default)
    python manage.py seed_demo_patients --with-data  # zusätzlich die 5 Demo-Bundles je Persona importieren
"""

from datetime import date
from pathlib import Path
import json

from django.conf import settings
from django.core.management.base import BaseCommand

from lab_data.models import Patient
from lab_data.services import import_fhir_bundle

# Demofiles liegen neben dem Backend-Ordner: <repo>/Demofiles/<Name>/strukturiert/
DEMO_ROOT = Path(settings.BASE_DIR).parent / "Demofiles"

# Persona-Stammdaten + Unterordner (nach Patientenname). patient_id wird explizit
# gesetzt, damit die Frontend-Map (BACKEND_PATIENT_MAP) deterministisch bleibt.
PERSONAS = [
    {"patient_id": 1, "name": "Luca Frei",    "date_of_birth": date(2006, 3, 14), "gender": "male",   "folder": "Luca-Frei"},
    {"patient_id": 2, "name": "Nina Baumann", "date_of_birth": date(1994, 8, 22), "gender": "female", "folder": "Nina-Baumann"},
    {"patient_id": 3, "name": "Markus Huber", "date_of_birth": date(1974, 4, 15), "gender": "male",   "folder": "Markus-Huber"},
    {"patient_id": 4, "name": "Elisa Meier",  "date_of_birth": date(1934, 12, 8), "gender": "female", "folder": "Elisa-Meier"},
]


class Command(BaseCommand):
    help = "Legt die 4 Demo-Patienten an (leer; optional mit --with-data befüllt)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--with-data",
            action="store_true",
            help="Zusätzlich die 5 Demo-Bundles je Persona importieren (statt leer zu lassen).",
        )

    def handle(self, *args, **options):
        with_data = options["with_data"]

        for p in PERSONAS:
            patient, created = Patient.objects.get_or_create(
                patient_id=p["patient_id"],
                defaults={
                    "name": p["name"],
                    "date_of_birth": p["date_of_birth"],
                    "gender": p["gender"],
                },
            )
            tag = "angelegt" if created else "vorhanden"

            # Reset: bestehende Reports löschen (sauberer Ausgangszustand).
            removed = patient.lab_reports.count()
            patient.lab_reports.all().delete()

            self.stdout.write(f"\nPatient {patient.patient_id} – {patient.name} ({tag}, {removed} alte Reports entfernt)")

            if not with_data:
                self.stdout.write("  leer — bereit für Live-Upload")
                continue

            folder = DEMO_ROOT / p["folder"] / "strukturiert"
            bundles = sorted(folder.glob("*.json")) if folder.exists() else []
            if not bundles:
                self.stdout.write(self.style.WARNING(f"  keine Bundles in {folder}"))
                continue

            total = 0
            for path in bundles:
                bundle = json.loads(path.read_text(encoding="utf-8"))
                result = import_fhir_bundle(bundle, patient, str(path))
                total += result.imported
                self.stdout.write(f"  {path.name}: {result.imported} neu, {result.duplicates} Duplikate")
            self.stdout.write(self.style.SUCCESS(f"  → {total} Werte für {patient.name}"))

        mode = "mit Demo-Daten" if with_data else "leer (Upload-bereit)"
        self.stdout.write(self.style.SUCCESS(f"\nFertig — Patienten {mode}. Map: luca=1, nina=2, markus=3, elisa=4"))
