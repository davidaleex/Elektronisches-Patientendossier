"""Admin-Registrierung für lab_data — Übersichtliche Admin-UI für alle 6 Klassen."""

from django.contrib import admin

from .models import (
    LabGroup, Unit, LabParameter, Patient, LabReport, LabValue, ReferenceRange,
)


@admin.register(LabGroup)
class LabGroupAdmin(admin.ModelAdmin):
    list_display = ("group_id", "name", "description")
    search_fields = ("name",)


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ("unit_id", "abbreviation", "name")
    search_fields = ("name", "abbreviation")


@admin.register(LabParameter)
class LabParameterAdmin(admin.ModelAdmin):
    list_display = ("parameter_id", "name", "code", "code_system", "group")
    list_filter = ("group", "code_system")
    search_fields = ("name", "code")


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ("patient_id", "name", "date_of_birth", "gender", "ahv_number")
    list_filter = ("gender",)
    search_fields = ("name", "ahv_number", "mpi_id")


@admin.register(LabReport)
class LabReportAdmin(admin.ModelAdmin):
    list_display = ("lab_report_id", "patient", "source_type", "received_at")
    list_filter = ("source_type", "received_at")
    search_fields = ("patient__name",)
    readonly_fields = ("received_at",)
    autocomplete_fields = ("patient",)


@admin.register(LabValue)
class LabValueAdmin(admin.ModelAdmin):
    list_display = (
        "lab_value_id",
        "parameter",
        "measured_value",
        "unit",
        "interpretation_code",
        "measurement_date",
    )
    list_filter = ("parameter__group", "interpretation_code")
    search_fields = ("parameter__name",)
    autocomplete_fields = ("lab_report", "parameter", "unit")


@admin.register(ReferenceRange)
class ReferenceRangeAdmin(admin.ModelAdmin):
    list_display = (
        "parameter",
        "sex",
        "age_min_years",
        "age_max_years",
        "low",
        "high",
        "unit",
        "source",
    )
    list_filter = ("sex", "parameter__group")
    search_fields = ("parameter__name", "source")
    autocomplete_fields = ("parameter", "unit")
