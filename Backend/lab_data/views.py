"""
REST-Endpoints für die Frontend-Anbindung.

Aktuell minimal: ein Endpoint, der die Lab-Values eines Patienten in
der vom Frontend erwarteten Form (parameter-gruppiert) zurückgibt.
Auth/Permission-Check kommt mit M5/M6 — für den PoC offen.
"""

from collections import OrderedDict

from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import LabValue, Patient


def _add_cors(response):
    """CORS-Header für den Vite-Dev-Server (localhost:5173/5174)."""
    response["Access-Control-Allow-Origin"] = "*"
    return response


def _status_from_interpretation(code: str) -> str:
    """Mappt FHIR-Interpretations-Code auf das Frontend-Statusfeld."""
    if code in ("L", "H"):
        return "warning"
    if code in ("LL", "HH", "A"):
        return "critical"
    return "good"


@require_GET
def patient_lab_values(request, patient_id: int):
    """
    GET /api/patients/<patient_id>/lab-values/

    Liefert alle LabValues eines Patienten gruppiert nach LabParameter.
    Form deckt sich mit `Frontend/src/data/labValuesData.js`.
    """
    if not Patient.objects.filter(pk=patient_id).exists():
        return _add_cors(JsonResponse({"detail": "Patient not found"}, status=404))

    # select_related, um N+1 Queries auf Parameter/Group/Unit zu vermeiden.
    qs = (
        LabValue.objects
        .filter(lab_report__patient_id=patient_id)
        .select_related("parameter", "parameter__group", "unit")
        .order_by("parameter__name", "-measurement_date")
    )

    # Gruppiert: pro LabParameter eine Liste von Messungen.
    grouped: OrderedDict[int, dict] = OrderedDict()
    for lv in qs:
        key = lv.parameter_id
        if key not in grouped:
            grouped[key] = {
                "name": lv.parameter.name,
                "category": lv.parameter.group.name,
                "measurements": [],
            }
        low = lv.reference_range_low
        high = lv.reference_range_high
        reference_range = (
            f"{low}-{high}" if low is not None and high is not None else ""
        )
        grouped[key]["measurements"].append({
            "date": lv.measurement_date.strftime("%d.%m.%Y"),
            "value": float(lv.measured_value),
            "unit": lv.unit.abbreviation,
            "referenceRange": reference_range,
            "status": _status_from_interpretation(lv.interpretation_code),
        })

    return _add_cors(JsonResponse(list(grouped.values()), safe=False))
