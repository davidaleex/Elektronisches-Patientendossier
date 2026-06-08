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

from .ai_extraction import extract_fhir_bundle_from_pdf
from .models import LabValue, Patient
from .services import age_in_years, import_fhir_bundle, reference_range_for

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


def _status_from_reference(value: float, ref) -> str:
    """
    Ampel-Status (good/warning) aus dem kuratierten, alters-/geschlechts-
    abhängigen Referenzbereich. Ohne hinterlegten Bereich → neutral ('good').
    """
    if ref is None:
        return "good"
    if ref.low is not None and value < float(ref.low):
        return "warning"
    if ref.high is not None and value > float(ref.high):
        return "warning"
    return "good"


def _format_range(low, high) -> str:
    """Referenzbereich als kompakter String — auch einseitig (< / >)."""
    if low is not None and high is not None:
        return f"{_trim_decimal(low)}–{_trim_decimal(high)}"
    if high is not None:
        return f"< {_trim_decimal(high)}"
    if low is not None:
        return f"> {_trim_decimal(low)}"
    return ""


def _age_reference(ref):
    """Anzeige-dict aus einem kuratierten ReferenceRange-Objekt (oder None)."""
    if ref is None:
        return None
    sex_symbol = {"male": "♂", "female": "♀"}.get(ref.sex, "")
    return {
        "range": _format_range(ref.low, ref.high),
        "unit": ref.unit.abbreviation,
        "ageGroup": f"{sex_symbol} {ref.age_group_label()}".strip(),
        "source": ref.source,
    }


@require_GET
def patient_lab_values(request, patient_id: int):
    """
    GET /api/patients/<patient_id>/lab-values/

    Liefert alle LabValues eines Patienten gruppiert nach LabParameter.
    Form deckt sich mit `Frontend/src/data/labValuesData.js`.
    """
    try:
        patient = Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return _add_cors(JsonResponse({"detail": "Patient not found"}, status=404))

    # Alter + Geschlecht des Patienten → für den passenden Referenzbereich.
    age = age_in_years(patient.date_of_birth)
    sex = patient.gender

    # select_related gegen N+1; prefetch der Referenzbereiche je Parameter.
    qs = (
        LabValue.objects
        .filter(lab_report__patient=patient)
        .select_related("parameter", "parameter__group", "unit")
        .prefetch_related("parameter__reference_ranges", "parameter__reference_ranges__unit")
        .order_by("parameter__name", "-measurement_date")
    )

    # Gruppiert: pro LabParameter eine Liste von Messungen + alters-passender Referenzbereich.
    grouped: OrderedDict[int, dict] = OrderedDict()
    ref_by_param: dict = {}
    for lv in qs:
        key = lv.parameter_id
        if key not in grouped:
            # Passenden Referenzbereich einmal je Parameter bestimmen.
            ref = reference_range_for(lv.parameter, age, sex)
            ref_by_param[key] = ref
            grouped[key] = {
                "name": lv.parameter.name,
                # LOINC-Code, damit Konsumenten (z. B. Prävention-Empfehlungen)
                "loinc": lv.parameter.code,
                "category": lv.parameter.group.name,
                # Kuratierter, alters-/geschlechtsabhängiger Bereich (oder None).
                "ageReference": _age_reference(ref),
                "measurements": [],
            }
        ref = ref_by_param[key]
        grouped[key]["measurements"].append({
            "date": lv.measurement_date.strftime("%d.%m.%Y"),
            "value": float(lv.measured_value),
            "unit": lv.unit.abbreviation,
            # Referenzbereich aus dem Bundle (Labor), einseitig-fähig formatiert.
            "referenceRange": _format_range(lv.reference_range_low, lv.reference_range_high),
            # Ampel jetzt aus dem kuratierten Alters-/Geschlechts-Referenzbereich.
            "status": _status_from_reference(float(lv.measured_value), ref),
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


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def patient_lab_reports_extract(request, patient_id: int):
    """
    POST /api/patients/<patient_id>/lab-reports/extract/

    Nimmt eine PDF (multipart/form-data, Feld "file") entgegen, parst den
    Text-Layer und gibt das *vorgeschlagene* FHIR-Bundle zurück. Speichert
    nichts — der Review-Schritt im Frontend entscheidet, ob das Bundle
    anschliessend an `patient_lab_reports` weitergereicht wird.

    Response: {"bundle": <FHIR Bundle>, "method": "pdf-parser", "mock": false}.
    `method`/`mock` signalisieren dem Frontend die Herkunft (Hinweis statt
    Badge). Der deterministische Parser ist der Liefer-Pfad; der KI-Pfad
    (M6.1) ist als Ausblick skizziert, aber nicht aktiviert.
    """
    if request.method == "OPTIONS":
        return _add_cors(JsonResponse({}))

    try:
        Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return _add_cors(JsonResponse({"detail": "Patient not found"}, status=404))

    upload = request.FILES.get("file")
    if upload is None:
        return _add_cors(JsonResponse(
            {"detail": "Kein File im Feld 'file' gefunden."}, status=400
        ))

    pdf_bytes = upload.read()
    try:
        bundle = extract_fhir_bundle_from_pdf(pdf_bytes, filename=upload.name)
    except NotImplementedError as e:
        return _add_cors(JsonResponse({"detail": str(e)}, status=503))
    except ValueError as e:
        # Erwartbarer Fehler: kein Text-Layer / Layout nicht parsebar. Dem/der
        # Nutzer:in als 422 mit klarer Meldung zurückgeben (nicht als 500).
        return _add_cors(JsonResponse({"detail": str(e)}, status=422))
    except Exception as e:
        return _add_cors(JsonResponse(
            {"detail": f"Extraktion fehlgeschlagen: {e}"}, status=500
        ))

    return _add_cors(JsonResponse({
        "bundle": bundle,
        "method": "pdf-parser",   # deterministischer Parser (KI-Pfad = M6.1, inaktiv)
        "mock": False,
        "source_filename": upload.name,
    }))
