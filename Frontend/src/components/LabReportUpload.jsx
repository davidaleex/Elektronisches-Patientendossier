import { useState, useRef } from 'react';
import {
  FaCloudUploadAlt,
  FaCheck,
  FaExclamationTriangle,
  FaFileCode,
  FaFilePdf,
} from 'react-icons/fa';
import {
  uploadLabReport,
  extractFromPdf,
  importExtractedBundle,
} from '../api/labApi';
import ExtractionPreviewModal from './ExtractionPreviewModal';
import './LabReportUpload.css';

// Patienten-seitiger Upload eines Lab-Reports.
//
// Zwei Modi:
//   - FHIR-JSON: strukturiertes Bundle direkt importieren (M5)
//   - PDF: PDF an KI-Extraktion schicken, Vorschau-Modal, Bestätigung importieren (M6)
//
// Props:
//   backendPatientId – Backend-ID (undefined → keine Anbindung, Hinweis statt Form)
//   onUploaded       – Callback nach erfolgreichem Import (z. B. Labor-Tabelle neu laden)
function LabReportUpload({ backendPatientId, onUploaded }) {
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState('json'); // 'json' | 'pdf'
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // Backend-Antwort vom Import
  const [error, setError] = useState(null);
  // Vorschau-Modal nach KI-Extraktion (PDF-Pfad).
  const [preview, setPreview] = useState(null); // { bundle, mock, sourceName }

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

  const acceptAttr = mode === 'pdf' ? '.pdf,application/pdf' : '.json,application/json';
  const acceptLabel = mode === 'pdf' ? '.pdf' : '.json';

  const resetInput = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setError(null);
    setResult(null);
    resetInput();
  };

  const pickFile = (f) => {
    if (!f) return;
    const lower = f.name.toLowerCase();
    if (mode === 'json' && !lower.endsWith('.json')) {
      setError('Bitte eine FHIR-JSON-Datei (.json) auswählen.');
      setFile(null);
      return;
    }
    if (mode === 'pdf' && !lower.endsWith('.pdf')) {
      setError('Bitte eine PDF-Datei (.pdf) auswählen.');
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
      if (mode === 'json') {
        const res = await uploadLabReport(backendPatientId, file);
        setResult(res);
        if (res.imported > 0 && onUploaded) onUploaded();
        resetInput();
      } else {
        // PDF-Pfad: erst extrahieren, dann Vorschau anzeigen — Import erst nach Bestätigung.
        const extracted = await extractFromPdf(backendPatientId, file);
        setPreview({
          bundle: extracted.bundle,
          mock: extracted.mock,
          sourceName: extracted.source_filename || file.name,
        });
      }
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setBusy(false);
    }
  };

  const confirmImport = async () => {
    if (!preview) return;
    setBusy(true);
    setError(null);
    try {
      const res = await importExtractedBundle(
        backendPatientId,
        preview.bundle,
        preview.sourceName,
      );
      setResult(res);
      if (res.imported > 0 && onUploaded) onUploaded();
      setPreview(null);
      resetInput();
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="lab-upload">
        <div className="lab-upload-head">
          <FaCloudUploadAlt className="lab-upload-icon" />
          <div>
            <strong>Laborbericht importieren</strong>
            <p>
              {mode === 'json'
                ? 'FHIR-Bundle (.json) hochladen — Werte werden direkt importiert, Duplikate übersprungen.'
                : 'PDF-Befund hochladen — die KI extrahiert die Werte, Sie prüfen die Vorschau vor dem Import.'}
            </p>
          </div>
        </div>

        {/* Modus-Toggle: JSON vs PDF */}
        <div className="lab-upload-tabs">
          <button
            className={`lab-upload-tab ${mode === 'json' ? 'active' : ''}`}
            onClick={() => switchMode('json')}
          >
            <FaFileCode /> Strukturiert (FHIR-JSON)
          </button>
          <button
            className={`lab-upload-tab ${mode === 'pdf' ? 'active' : ''}`}
            onClick={() => switchMode('pdf')}
          >
            <FaFilePdf /> Unstrukturiert (PDF · KI)
          </button>
        </div>

        <div className="lab-upload-row">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptAttr}
            onChange={(e) => pickFile(e.target.files[0])}
          />
          <button className="lab-upload-btn" disabled={!file || busy} onClick={submit}>
            {busy
              ? mode === 'pdf' ? 'Analysiere …' : 'Importiere …'
              : mode === 'pdf' ? 'KI-Extraktion starten' : 'Importieren'}
          </button>
        </div>
        <div className="lab-upload-accept-hint">Akzeptiert: {acceptLabel}</div>

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

      {preview && (
        <ExtractionPreviewModal
          preview={preview}
          busy={busy}
          onConfirm={confirmImport}
          onCancel={() => setPreview(null)}
        />
      )}
    </>
  );
}

export default LabReportUpload;
