import { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileCode,
  FaFileImage,
  FaCheck,
  FaExclamationTriangle,
  FaTimes
} from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { uploadLabReport, BACKEND_PATIENT_MAP } from '../../api/labApi';
import '../Pages.css';
import './DoctorUpload.css';

// Akzeptierte Dateitypen für den Upload — entspricht dem FHIR-JSON-Pfad
// und dem unstrukturierten Befund-Pfad (PDF + Bild) aus Brodbecks Scope.
const ACCEPTED_EXTENSIONS = ['.json', '.pdf', '.png', '.jpg', '.jpeg'];

// Schwellenwert für die Mock-Ähnlichkeits-Erkennung beim Duplikat-Check.
// Sehr simpel: Jaccard-Ähnlichkeit auf Tokenisierter Titel-Form.
const DUPLICATE_THRESHOLD = 0.5;

function detectFileKind(fileName) {
  const ext = '.' + fileName.split('.').pop().toLowerCase();
  if (ext === '.json') return 'fhir';
  if (ext === '.pdf') return 'pdf';
  if (['.png', '.jpg', '.jpeg'].includes(ext)) return 'image';
  return 'unknown';
}

function fileIcon(kind) {
  if (kind === 'fhir') return <FaFileCode />;
  if (kind === 'pdf') return <FaFilePdf />;
  if (kind === 'image') return <FaFileImage />;
  return <FaCloudUploadAlt />;
}

// Sehr einfache String-Ähnlichkeit für den Mock-Duplikat-Check.
// Backend würde später Hash oder strukturierte Identifier vergleichen.
function tokenize(s) {
  return new Set(
    (s || '')
      .toLowerCase()
      .replace(/[^a-z0-9äöüß\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
  );
}

function jaccardSimilarity(a, b) {
  const sa = tokenize(a);
  const sb = tokenize(b);
  if (!sa.size || !sb.size) return 0;
  const intersection = [...sa].filter(t => sb.has(t)).length;
  const union = new Set([...sa, ...sb]).size;
  return intersection / union;
}

function DoctorUpload() {
  const { currentUser, users } = useUser();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);     // geparste Metadaten
  const [selectedPatient, setSelectedPatient] = useState('');
  const [parseError, setParseError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResult, setUploadResult] = useState(null); // { type: 'success' | 'warning', message }
  const [busy, setBusy] = useState(false);

  // Patienten, zu denen der Arzt aktuell Zugriff hat — derived aus
  // patient.accessGrants (Issue #14). Nur die dürfen im Selector erscheinen.
  const accessiblePatients = useMemo(() => {
    return Object.values(users)
      .filter(u => u.role === 'patient')
      .filter(p => (p.accessGrants || []).some(g => g.doctorId === currentUser.id && g.isActive));
  }, [users, currentUser.id]);

  // Duplikat-Erkennung: vergleiche Dateiname und ggf. parsed Titel
  // gegen alle Dokument-Titel des ausgewählten Patienten.
  const duplicateWarning = useMemo(() => {
    if (!file || !selectedPatient) return null;
    const patient = users[selectedPatient];
    if (!patient?.documents?.length) return null;
    const candidates = patient.documents.map(d => d.title);
    const compareString = (fileMeta?.title || file.name).replace(/\.[a-z]+$/i, '');
    let bestMatch = null;
    let bestScore = 0;
    for (const t of candidates) {
      const score = jaccardSimilarity(compareString, t);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = t;
      }
    }
    if (bestScore >= DUPLICATE_THRESHOLD) {
      return { score: bestScore, match: bestMatch };
    }
    return null;
  }, [file, fileMeta, selectedPatient]);

  // FHIR-JSON clientseitig lesen und resourceType / Counts extrahieren.
  // Nur das Allernötigste — kein Validator, kein Schema-Check.
  const parseFhirFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const resourceType = data.resourceType || 'unknown';
        let entries = 0;
        let observations = 0;
        if (resourceType === 'Bundle' && Array.isArray(data.entry)) {
          entries = data.entry.length;
          observations = data.entry.filter(
            e => e.resource?.resourceType === 'Observation'
          ).length;
        }
        setFileMeta({
          kind: 'fhir',
          resourceType,
          entries,
          observations,
          title: data.id || data.resourceType || file.name
        });
        setParseError(null);
      } catch (err) {
        setParseError(`JSON konnte nicht geparst werden: ${err.message}`);
        setFileMeta({ kind: 'fhir', resourceType: '—', title: file.name });
      }
    };
    reader.readAsText(file);
  };

  const handleFile = (incoming) => {
    if (!incoming) return;
    const ext = '.' + incoming.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setParseError(`Dateityp ${ext} wird nicht unterstützt.`);
      return;
    }
    setFile(incoming);
    setUploadResult(null);
    setParseError(null);
    const kind = detectFileKind(incoming.name);
    if (kind === 'fhir') {
      parseFhirFile(incoming);
    } else {
      setFileMeta({ kind, title: incoming.name });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !selectedPatient) {
      setUploadResult({ type: 'warning', message: 'Bitte Datei und Patient auswählen.' });
      return;
    }
    const patient = users[selectedPatient];

    // Unstrukturierte Befunde (PDF/Bild) sind noch nicht ans Backend angebunden.
    if (fileMeta?.kind !== 'fhir') {
      setUploadResult({
        type: 'warning',
        message: 'Aktuell werden nur strukturierte FHIR-Bundles (.json) importiert. '
          + 'PDF/Bild (unstrukturiert) folgt in einer späteren Phase.'
      });
      return;
    }

    const backendId = BACKEND_PATIENT_MAP[selectedPatient];
    if (!backendId) {
      setUploadResult({
        type: 'warning',
        message: `Für ${patient.name} besteht keine Backend-Anbindung (Demo: nur Luca Frei).`
      });
      return;
    }

    // Echter Upload an den Django-Endpoint (gleicher Pfad wie Patienten-Upload).
    setBusy(true);
    setUploadResult(null);
    try {
      const res = await uploadLabReport(backendId, file);
      const parts = [
        `${res.imported} neu importiert`,
        `${res.duplicates} Duplikate übersprungen`,
      ];
      if (res.skipped_unknown > 0) parts.push(`${res.skipped_unknown} unbekannt`);
      const warns = res.warnings?.length ? ` — ${res.warnings.join(' ')}` : '';
      setUploadResult({
        type: res.imported > 0 ? 'success' : 'warning',
        message: `Befund für ${patient.name}: ${parts.join(' · ')}${warns}`
      });
      // Form zurücksetzen
      setFile(null);
      setFileMeta(null);
      setSelectedPatient('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) {
      setUploadResult({
        type: 'warning',
        message: `Upload fehlgeschlagen: ${String(e.message || e)}`
      });
    } finally {
      setBusy(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileMeta(null);
    setParseError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="page-container doctor-upload">
      <Link to="/arzt" className="btn-back-inline">
        <FaArrowLeft /> Zurück zum Dashboard
      </Link>

      <h1><FaCloudUploadAlt className="header-icon" /> Befund hochladen</h1>
      <p className="subtitle">
        FHIR-JSON, PDF oder Bild für einen Patienten mit aktivem Zugriff.
      </p>

      {/* Erfolgs- oder Warn-Banner */}
      {uploadResult && (
        <div className={`result-banner result-${uploadResult.type}`}>
          {uploadResult.type === 'success' ? <FaCheck /> : <FaExclamationTriangle />}
          <span>{uploadResult.message}</span>
          <button className="close-btn" onClick={() => setUploadResult(null)}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* Patient-Selector */}
      <section className="upload-section">
        <label className="field-label">Patient</label>
        <select
          className="patient-select"
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">— Patient auswählen —</option>
          {accessiblePatients.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.gender}, geb. {p.birthDate})
            </option>
          ))}
        </select>
        {accessiblePatients.length === 0 && (
          <p className="empty-state">
            Keine Patienten mit aktivem Zugriff. Anfrage zuerst über das Dashboard senden.
          </p>
        )}
      </section>

      {/* Drag-and-Drop-Zone */}
      <section className="upload-section">
        <label className="field-label">Datei</label>
        <div
          className={`dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(',')}
            onChange={(e) => handleFile(e.target.files[0])}
            style={{ display: 'none' }}
          />
          {!file ? (
            <>
              <FaCloudUploadAlt className="dropzone-icon" />
              <p>Datei hier ablegen oder klicken zum Auswählen</p>
              <p className="dropzone-hint">Akzeptiert: {ACCEPTED_EXTENSIONS.join(' · ')}</p>
            </>
          ) : (
            <div className="file-preview">
              <div className="file-icon">{fileIcon(fileMeta?.kind)}</div>
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-meta">
                  {(file.size / 1024).toFixed(1)} KB · {fileMeta?.kind?.toUpperCase()}
                </div>
                {fileMeta?.kind === 'fhir' && !parseError && (
                  <div className="file-fhir-info">
                    Ressource: <strong>{fileMeta.resourceType}</strong>
                    {fileMeta.resourceType === 'Bundle' && (
                      <> · {fileMeta.entries} Einträge ({fileMeta.observations} Observations)</>
                    )}
                  </div>
                )}
                {parseError && <div className="file-error">{parseError}</div>}
              </div>
              <button className="btn-clear-file" onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                <FaTimes />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Duplikat-Warnung */}
      {duplicateWarning && (
        <div className="duplicate-warning">
          <FaExclamationTriangle />
          <div>
            <strong>Möglicher Duplikat-Befund.</strong> Ähnlichkeit{' '}
            {(duplicateWarning.score * 100).toFixed(0)}% zu vorhandenem Dokument:
            „{duplicateWarning.match}". Trotzdem hochladen?
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="submit-row">
        <button
          className="btn-submit"
          disabled={!file || !selectedPatient || busy}
          onClick={handleSubmit}
        >
          {busy ? 'Importiere …' : (duplicateWarning ? 'Trotzdem hochladen' : 'Hochladen')}
        </button>
      </div>
    </div>
  );
}

export default DoctorUpload;
