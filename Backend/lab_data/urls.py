"""URL-Konfiguration für die lab_data-App (REST-Endpoints)."""

from django.urls import path

from . import views

urlpatterns = [
    path(
        "patients/<int:patient_id>/lab-values/",
        views.patient_lab_values,
        name="patient_lab_values",
    ),
]
