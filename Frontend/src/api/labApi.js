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

// PDF zur KI-Extraktion schicken. Antwort:
//   { bundle: <FHIR Bundle>, mock: true|false, source_filename: string }
// Wird vom Vorschau-Modal aufgerufen — nichts gespeichert; der Nutzer
// bestätigt anschliessend und das Bundle geht durch uploadLabReport().
export async function extractFromPdf(backendPatientId, file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(
    `${API_BASE}/api/patients/${backendPatientId}/lab-reports/extract/`,
    { method: 'POST', body: form }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || `HTTP ${res.status}`);
  }
  return data;
}

// Helper: nach erfolgter KI-Extraktion das bestätigte Bundle als JSON-Datei
// an den bestehenden Import-Endpoint (M5) weiterreichen — gleiche Pipeline
// wie ein strukturiertes FHIR-Upload, gleicher Service, gleiche Dedup-Logik.
export async function importExtractedBundle(backendPatientId, bundle, sourceName) {
  const json = JSON.stringify(bundle);
  const blob = new Blob([json], { type: 'application/json' });
  const file = new File([blob], sourceName || 'extracted_bundle.json', {
    type: 'application/json',
  });
  return uploadLabReport(backendPatientId, file);
}
