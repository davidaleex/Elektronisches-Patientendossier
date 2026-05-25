// Zentrale Anbindung ans Django-Backend für Labordaten.
// Vorher waren API-Base und die Persona→Backend-Map in Labor.jsx vergraben;
// hier gebündelt, weil jetzt mehrere Stellen (Labor, Dokumente, Arzt-Upload)
// dieselben Endpoints brauchen.

export const API_BASE = 'http://localhost:8000';

// Frontend-Persona-ID → Backend-Patient-ID. Nur Personas in dieser Map haben
// eine Backend-Anbindung; alle anderen bleiben im PoC auf Mock-Daten.
export const BACKEND_PATIENT_MAP = {
  'luca-frei': 1,
};

// Lab-Werte eines Patienten holen (parameter-gruppiert, vom GET-Endpoint).
export async function fetchLabValues(backendPatientId) {
  const res = await fetch(`${API_BASE}/api/patients/${backendPatientId}/lab-values/`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// FHIR-Bundle hochladen → Import via Service. Liefert das Ergebnis-Objekt
// { report_id, imported, duplicates, skipped_unknown, warnings } zurück.
export async function uploadLabReport(backendPatientId, file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/patients/${backendPatientId}/lab-reports/`, {
    method: 'POST',
    body: form,
  });
  // Backend antwortet auch bei Fehlern mit JSON (detail-Feld).
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || `HTTP ${res.status}`);
  }
  return data;
}
