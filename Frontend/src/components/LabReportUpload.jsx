import { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { uploadLabReport } from '../api/labApi';
import './LabReportUpload.css';

// Patienten-seitiger Upload eines strukturierten FHIR-Lab-Reports.
// Wird sowohl auf der Labor- als auch auf der Dokumente-Seite eingebunden.
//
// Props:
//   backendPatientId – Backend-ID (undefined → keine Anbindung, Hinweis statt Form)
//   onUploaded       – Callback nach erfolgreichem Import (z. B. Labor-Tabelle neu laden)
function LabReportUpload({ backendPatientId, onUploaded }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // Backend-Antwort
  const [error, setError] = useState(null);

  // Ohne Backend-Anbindung (z. B. Markus, Nina, Elisa) nur ein Hinweis.
  if (!backendPatientId) {
    return (
      <div className="lab-upload lab-upload--disabled">
        <FaCloudUploadAlt />
        <span>
          Strukturierter Lab-Import ist in dieser Demo nur für Luca Frei verfügbar
          (Backend-Anbindung).
        </span>
      </div>
    );
  }

  const pickFile = (f) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.json')) {
      setError('Bitte eine FHIR-JSON-Datei (.json) auswählen.');
      setFile(null);
      return;
    }
    setError(null);
    setResult(null);
    setFile(f);
  };

  const submit = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await uploadLabReport(backendPatientId, file);
      setResult(res);
      if (res.imported > 0 && onUploaded) onUploaded();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="lab-upload">
      <div className="lab-upload-head">
        <FaCloudUploadAlt className="lab-upload-icon" />
        <div>
          <strong>Strukturierten Laborbericht importieren</strong>
          <p>
            FHIR-Bundle (.json) hochladen — Werte werden automatisch erkannt,
            bereits vorhandene Messungen als Duplikate übersprungen.
          </p>
        </div>
      </div>

      <div className="lab-upload-row">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={(e) => pickFile(e.target.files[0])}
        />
        <button className="lab-upload-btn" disabled={!file || busy} onClick={submit}>
          {busy ? 'Importiere …' : 'Importieren'}
        </button>
      </div>

      {error && (
        <div className="lab-upload-banner err">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className={`lab-upload-banner ${result.imported > 0 ? 'ok' : 'info'}`}>
          {result.imported > 0 ? <FaCheck /> : <FaExclamationTriangle />}
          <span>
            <strong>{result.imported} neu importiert</strong> ·{' '}
            {result.duplicates} Duplikate übersprungen
            {result.skipped_unknown > 0 && <> · {result.skipped_unknown} unbekannt</>}
            {result.warnings?.length > 0 && (
              <span className="lab-upload-warns"> — {result.warnings.join(' ')}</span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

export default LabReportUpload;
