"""URL-Konfiguration für die lab_data-App (REST-Endpoints)."""

from django.urls import path

from . import views

urlpatterns = [
    path(
        "patients/<int:patient_id>/lab-values/",
        views.patient_lab_values,
        name="patient_lab_values",
    ),
    # Upload eines FHIR-Bundles (multipart) → Import via Service (Issue #21)
    path(
        "patients/<int:patient_id>/lab-reports/",
        views.patient_lab_reports,
        name="patient_lab_reports",
    ),
]
