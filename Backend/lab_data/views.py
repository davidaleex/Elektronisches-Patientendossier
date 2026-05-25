"""
REST-Endpoints für die Frontend-Anbindung.

- GET  /api/patients/<id>/lab-values/   → Lab-Werte (parameter-gruppiert)
- POST /api/patients/<id>/lab-reports/  → FHIR-Bundle hochladen + importieren

Auth/Permission-Check kommt mit einer späteren Phase — für den PoC offen.
"""

import json
import uuid
from collections import OrderedDict
from datetime import datetime
from pathlib import Path

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .models import LabValue, Patient
from .services import import_fhir_bundle

# Ablageort für hochgeladene Original-Dateien (PoC: lokaler Ordner unter dem Backend).
UPLOAD_DIR = Path(settings.BASE_DIR) / "uploads" / "lab_reports"


def _add_cors(response):
    """CORS-Header für den Vite-Dev-Server (localhost:5173/5174)."""
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    return response


def _trim_decimal(d) -> str:
    """Decimal → kompakter Zahlen-String ohne nutzlose Nachkommastellen."""
    if d is None:
        return ""
    return f"{float(d):g}"


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
            f"{_trim_decimal(low)}-{_trim_decimal(high)}"
            if low is not None and high is not None
            else ""
        )
        grouped[key]["measurements"].append({
            "date": lv.measurement_date.strftime("%d.%m.%Y"),
            "value": float(lv.measured_value),
            "unit": lv.unit.abbreviation,
            "referenceRange": reference_range,
            "status": _status_from_interpretation(lv.interpretation_code),
        })

    return _add_cors(JsonResponse(list(grouped.values()), safe=False))


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def patient_lab_reports(request, patient_id: int):
    """
    POST /api/patients/<patient_id>/lab-reports/

    Nimmt ein FHIR-Bundle als Datei-Upload (multipart/form-data, Feld "file")
    entgegen und importiert es über den gemeinsamen Service. Antwort:
    {report_id, imported, duplicates, skipped_unknown, warnings}.

    csrf_exempt, weil das Frontend (PoC, kein Auth) kein CSRF-Token mitschickt.
    """
    # CORS-Preflight des Browsers (multipart kann je nach Browser eine OPTIONS-Anfrage auslösen).
    if request.method == "OPTIONS":
        return _add_cors(JsonResponse({}))

    try:
        patient = Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return _add_cors(JsonResponse({"detail": "Patient not found"}, status=404))

    upload = request.FILES.get("file")
    if upload is None:
        return _add_cors(JsonResponse(
            {"detail": "Kein File im Feld 'file' gefunden."}, status=400
        ))

    # Inhalt lesen und als JSON parsen.
    raw = upload.read()
    try:
        bundle = json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return _add_cors(JsonResponse(
            {"detail": "Datei ist kein gültiges JSON."}, status=400
        ))

    if not isinstance(bundle, dict) or bundle.get("resourceType") != "Bundle":
        return _add_cors(JsonResponse(
            {"detail": "FHIR-Bundle erwartet (resourceType muss 'Bundle' sein)."},
            status=400,
        ))

    # Original-Datei ablegen (Nachvollziehbarkeit; landet in LabReport.source_file_path).
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    stored_name = f"{datetime.now():%Y%m%d_%H%M%S}_{uuid.uuid4().hex[:8]}_{upload.name}"
    stored_path = UPLOAD_DIR / stored_name
    stored_path.write_bytes(raw)

    result = import_fhir_bundle(bundle, patient, str(stored_path))

    # Kein Report angelegt (Vollduplikat / nichts Verwertbares) → Datei nicht behalten.
    if result.report_id is None:
        stored_path.unlink(missing_ok=True)

    status = 201 if result.imported else 200
    return _add_cors(JsonResponse(result.as_dict(), status=status))
