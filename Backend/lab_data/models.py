"""
Datenmodell der Patienten-App — Lab-Bereich.

Basiert auf:
- ER-Diagramm: ../Doc/datenmodell-v5.drawio (Stand 14.05.2026)
- Mapping-Tabelle: ../Doc/mapping-v5.drawio + ../Doc/mapping-v5-neala.docx (Nealas Vorgabe)

Alle Klassen- und Attributnamen sind 1:1 mit der Mapping-Tabelle abgeglichen.
"""

import uuid

from django.db import models


# ---------------------------------------------------------------------------
# Master-Daten (Lookup-Tabellen) — vordefiniert, beim Import gegen diese matchen
# ---------------------------------------------------------------------------


class LabGroup(models.Model):
    """UI-Gruppe für Laborparameter (z. B. Hematology, Metabolism, Lipids)."""

    # Primary Key wie im Datenmodell explizit benannt
    group_id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Lab group"
        verbose_name_plural = "Lab groups"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Unit(models.Model):
    """Messeinheit (z. B. g/dL, mmol/L, %). Abbreviation = UCUM-String."""

    unit_id = models.AutoField(primary_key=True)

    # Menschenlesbarer Name (z. B. „Grams per deciliter")
    name = models.CharField(max_length=100)
    # UCUM-konforme Abkürzung — wird im UI direkt angezeigt und für Match beim Import benutzt
    abbreviation = models.CharField(max_length=30, unique=True)

    class Meta:
        verbose_name = "Unit"
        verbose_name_plural = "Units"
        ordering = ["abbreviation"]

    def __str__(self):
        return f"{self.abbreviation} ({self.name})"


class LabParameter(models.Model):
    """Was wurde gemessen — LOINC-Code & ggf. SNOMED. Match-Key beim Import."""

    parameter_id = models.AutoField(primary_key=True)

    # Zuordnung zur UI-Gruppe (Hematology, Metabolism, …)
    group = models.ForeignKey(
        LabGroup,
        on_delete=models.PROTECT,
        related_name="parameters",
    )
    # Anzeigename im UI (z. B. „Hemoglobin")
    name = models.CharField(max_length=120)
    # LOINC-Code o.ä. (z. B. „718-7" für Hb)
    code = models.CharField(max_length=50)
    # Code-System (Default LOINC); offen für SNOMED-CT-Erweiterungen
    code_system = models.CharField(max_length=200, default="http://loinc.org")

    class Meta:
        verbose_name = "Lab parameter"
        verbose_name_plural = "Lab parameters"
        ordering = ["group", "name"]
        # Ein Code je System darf nur einmal existieren
        constraints = [
            models.UniqueConstraint(
                fields=["code", "code_system"],
                name="unique_parameter_per_code_system",
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"


# ---------------------------------------------------------------------------
# Patient — Source of Truth ist die App-Patientendatenbank,
# NICHT aus Lab-Dokumenten importiert (Neala-Vorgabe 14.05.2026)
# ---------------------------------------------------------------------------


class Patient(models.Model):
    """Patient — App ist Source of Truth, kommt nicht aus Lab-Bundles."""

    patient_id = models.AutoField(primary_key=True)

    # Externe Identifier für Match mit EPD/E-GD-Systemen (optional)
    mpi_id = models.CharField(max_length=64, blank=True)
    ahv_number = models.CharField(max_length=20, blank=True)

    name = models.CharField(max_length=200)
    date_of_birth = models.DateField()

    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
        ("unknown", "Unknown"),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    class Meta:
        verbose_name = "Patient"
        verbose_name_plural = "Patients"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.date_of_birth})"


# ---------------------------------------------------------------------------
# Lab-Hauptobjekte
# ---------------------------------------------------------------------------


class LabReport(models.Model):
    """Eingehender Bericht (FHIR-Bundle oder PDF) — Container für LabValues."""

    # UUID, weil Reports unabhängig generiert werden (siehe Mapping v5: „uuid()")
    lab_report_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    # Zuordnung zum App-Patienten (aktuell ausgewählter Patient beim Upload)
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="lab_reports",
    )

    # Speicherort der Original-Datei (PDF oder FHIR-JSON)
    source_file_path = models.CharField(max_length=500)

    # Format der Quelle (siehe Nealas Mapping-Tabelle)
    SOURCE_TYPE_CHOICES = [
        ("FHIR_JSON", "FHIR JSON"),
        ("PDF", "PDF"),
    ]
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPE_CHOICES)

    # Strukturierte Zwischenschicht — bei FHIR direkt das Bundle,
    # bei PDF die extrahierte Struktur. Aus diesem JSON werden
    # die einzelnen LabValues beim Import abgeleitet.
    structured_data_json = models.JSONField()

    # Backend-Timestamp, automatisch beim Anlegen
    received_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Lab report"
        verbose_name_plural = "Lab reports"
        ordering = ["-received_at"]

    def __str__(self):
        return f"Report {self.lab_report_id} · {self.patient.name} · {self.received_at:%d.%m.%Y}"


class LabValue(models.Model):
    """Einzelner Messwert, abgeleitet aus LabReport.structured_data_json."""

    lab_value_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    lab_report = models.ForeignKey(
        LabReport,
        on_delete=models.CASCADE,
        related_name="values",
    )

    # Was wurde gemessen — Match über LOINC-Code beim Import
    parameter = models.ForeignKey(
        LabParameter,
        on_delete=models.PROTECT,
        related_name="measurements",
    )

    # In welcher Einheit — Match über UCUM-String beim Import
    unit = models.ForeignKey(
        Unit,
        on_delete=models.PROTECT,
        related_name="measurements",
    )

    # Messzeitpunkt (aus Observation.effectiveDateTime)
    measurement_date = models.DateTimeField()

    # Messwert — flexibel dimensioniert für medizinische Werte
    measured_value = models.DecimalField(max_digits=12, decimal_places=4)

    # Referenzbereich, optional (falls im Bundle nicht enthalten, bleibt leer)
    reference_range_low = models.DecimalField(
        max_digits=12, decimal_places=4, null=True, blank=True,
    )
    reference_range_high = models.DecimalField(
        max_digits=12, decimal_places=4, null=True, blank=True,
    )

    # Interpretations-Code:
    # - Falls Observation.interpretation.coding.code im Bundle → übernehmen
    # - Sonst aus Referenzbereich abgeleitet (L < low < N < high < H)
    INTERPRETATION_CHOICES = [
        ("L", "Low"),
        ("N", "Normal"),
        ("H", "High"),
        ("LL", "Critical low"),
        ("HH", "Critical high"),
        ("A", "Abnormal"),
    ]
    interpretation_code = models.CharField(
        max_length=2,
        choices=INTERPRETATION_CHOICES,
        blank=True,
    )

    class Meta:
        verbose_name = "Lab value"
        verbose_name_plural = "Lab values"
        ordering = ["lab_report", "parameter"]

    def __str__(self):
        return f"{self.parameter.name}: {self.measured_value} {self.unit.abbreviation}"


# ---------------------------------------------------------------------------
# Referenzbereiche — alters-/geschlechtsabhängige Master Data (Issue #26)
# ---------------------------------------------------------------------------


class ReferenceRange(models.Model):
    """
    Alters- und geschlechtsabhängiger Referenzbereich für einen LabParameter.

    Kuratierte Master Data: Referenzintervalle sind klinisches Wissen
    (assay-/methodenabhängig) — es gibt keine fertige FHIR-Quelle dafür.
    Darum werden sie hier hinterlegt, jeweils MIT Quellenangabe (`source`).
    Die App wählt anhand von Alter (aus `Patient.date_of_birth`) und
    Geschlecht den passenden Bereich für die Anzeige.
    """

    reference_range_id = models.AutoField(primary_key=True)

    parameter = models.ForeignKey(
        LabParameter,
        on_delete=models.CASCADE,
        related_name="reference_ranges",
    )
    unit = models.ForeignKey(
        Unit,
        on_delete=models.PROTECT,
        related_name="reference_ranges",
    )

    SEX_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("any", "Any"),
    ]
    # Für welches Geschlecht der Bereich gilt; "any" = geschlechtsunabhängig.
    sex = models.CharField(max_length=10, choices=SEX_CHOICES, default="any")

    # Altersband in Jahren. null = offene Grenze (z. B. age_min=18, age_max=null → ab 18).
    # Konvention: gültig für age_min_years <= Alter < age_max_years.
    age_min_years = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    age_max_years = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Bereichsgrenzen, optional (einseitige Bereiche wie "< 3.0" → nur high).
    low = models.DecimalField(max_digits=12, decimal_places=4, null=True, blank=True)
    high = models.DecimalField(max_digits=12, decimal_places=4, null=True, blank=True)

    # PFLICHT: Beleg/Quelle für diesen Bereich (Recherche-Nachweis).
    source = models.CharField(max_length=500)
    note = models.CharField(max_length=300, blank=True)

    class Meta:
        verbose_name = "Reference range"
        verbose_name_plural = "Reference ranges"
        ordering = ["parameter", "sex", "age_min_years"]

    def age_group_label(self) -> str:
        """Menschenlesbares Altersband, z. B. „18–40 J." / „ab 65 J." / „alle Alter"."""
        lo = float(self.age_min_years) if self.age_min_years is not None else None
        hi = float(self.age_max_years) if self.age_max_years is not None else None
        if lo is None and hi is None:
            return "alle Alter"
        if lo is not None and hi is not None:
            return f"{lo:g}–{hi:g} J."
        if lo is not None:
            return f"ab {lo:g} J."
        return f"bis {hi:g} J."

    def __str__(self):
        return f"{self.parameter.name} [{self.sex}, {self.age_group_label()}]"
