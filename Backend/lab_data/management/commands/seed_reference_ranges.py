"""
Management Command: Referenzbereiche aus reference_ranges_data.json seeden (Issue #26).

Liest das editierbare Arbeitsblatt `lab_data/reference_ranges_data.json`, löst
LabParameter (via LOINC-Code) und Unit (via UCUM-Abkürzung) auf und legt die
ReferenceRange-Master-Data an. Idempotent über update_or_create.

Aufruf:
    python manage.py seed_reference_ranges          # anlegen/aktualisieren
    python manage.py seed_reference_ranges --flush   # vorher alle löschen
"""

import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from lab_data.models import LabParameter, Unit, ReferenceRange

DEFAULT_PATH = Path(__file__).resolve().parents[2] / "reference_ranges_data.json"


class Command(BaseCommand):
    help = "Seedet ReferenceRange-Master-Data aus reference_ranges_data.json."

    def add_arguments(self, parser):
        parser.add_argument("--path", default=str(DEFAULT_PATH), help="Pfad zum JSON-Arbeitsblatt")
        parser.add_argument("--flush", action="store_true", help="Bestehende Referenzbereiche zuerst löschen")

    def handle(self, *args, **options):
        path = Path(options["path"])
        if not path.exists():
            raise CommandError(f"Daten-File nicht gefunden: {path}")

        data = json.loads(path.read_text(encoding="utf-8"))
        entries = data.get("ranges", data) if isinstance(data, dict) else data

        if options["flush"]:
            deleted = ReferenceRange.objects.all().delete()[0]
            self.stdout.write(self.style.WARNING(f"{deleted} bestehende Referenzbereiche gelöscht."))

        created = updated = skipped = 0
        for e in entries:
            try:
                parameter = LabParameter.objects.get(code=e["loinc"])
            except LabParameter.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"  Skip: LOINC {e.get('loinc')} unbekannt."))
                skipped += 1
                continue
            try:
                unit = Unit.objects.get(abbreviation=e["unit"])
            except Unit.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"  Skip: Unit '{e.get('unit')}' unbekannt."))
                skipped += 1
                continue

            _, was_created = ReferenceRange.objects.update_or_create(
                parameter=parameter,
                sex=e.get("sex", "any"),
                age_min_years=e.get("age_min_years"),
                age_max_years=e.get("age_max_years"),
                defaults={
                    "unit": unit,
                    "low": e.get("low"),
                    "high": e.get("high"),
                    "source": e["source"],
                    "note": e.get("note", ""),
                },
            )
            created += was_created
            updated += not was_created

        self.stdout.write(self.style.SUCCESS(
            f"\nFertig: {created} neu, {updated} aktualisiert, {skipped} übersprungen."
        ))
