import { FaTimes, FaFileAlt } from 'react-icons/fa';
import './LabReportUpload.css';

// Vorschau-Modal nach der PDF-Extraktion (Issue #31/#32/#33).
// Zeigt die aus dem PDF-Text-Layer geparsten Observations als Tabelle.
// Bestätigung löst den Import durch denselben Service wie M5 aus.
//
// Props:
//   preview   – { bundle, method, sourceName }
//   busy      – während eines laufenden Import-Calls disabled-Buttons
//   onConfirm – wird auf Klick „In Akte übernehmen" gerufen
//   onCancel  – Modal schliessen ohne Aktion
function ExtractionPreviewModal({ preview, busy, onConfirm, onCancel }) {
  const rows = bundleToRows(preview.bundle);

  return (
    <div className="lab-modal-overlay" onClick={onCancel}>
      <div className="lab-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lab-modal-head">
          <div>
            <strong>Extraktion prüfen</strong>
            <p className="lab-modal-sub">
              Quelle: {preview.sourceName}{' '}
              · {rows.length} Messung{rows.length === 1 ? '' : 'en'} erkannt
            </p>
          </div>
          <span
            className="lab-modal-badge"
            title="Automatisch aus dem PDF-Text-Layer extrahiert — bitte vor Übernahme prüfen."
          >
            <FaFileAlt /> PDF-Parser
          </span>
          <button className="lab-modal-close" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>

        <div className="lab-modal-body">
          {rows.length === 0 ? (
            <p className="lab-modal-empty">Keine Messungen im extrahierten Bundle.</p>
          ) : (
            <table className="lab-modal-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Wert</th>
                  <th>Einheit</th>
                  <th>Datum</th>
                  <th>LOINC</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td className="lab-modal-val">{r.value}</td>
                    <td>{r.unit}</td>
                    <td>{r.date}</td>
                    <td className="lab-modal-loinc">{r.loinc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="lab-modal-hint">
            Werte erst in die Akte übernehmen, nachdem Sie die Erkennung geprüft haben.
            Duplikate werden beim Import automatisch erkannt.
          </p>
        </div>

        <div className="lab-modal-foot">
          <button className="lab-modal-btn-cancel" onClick={onCancel} disabled={busy}>
            Abbrechen
          </button>
          <button
            className="lab-modal-btn-confirm"
            onClick={onConfirm}
            disabled={busy || rows.length === 0}
          >
            {busy ? 'Importiere …' : 'In Akte übernehmen'}
          </button>
        </div>
      </div>
    </div>
  );
}

function bundleToRows(bundle) {
  const entries = bundle?.entry || [];
  const rows = [];
  for (const e of entries) {
    const obs = e.resource;
    if (!obs || obs.resourceType !== 'Observation') continue;
    const coding = obs.code?.coding?.[0] || {};
    const vq = obs.valueQuantity || {};
    rows.push({
      name: coding.display || coding.code || '—',
      loinc: coding.code || '—',
      value: vq.value ?? '—',
      unit: vq.code || vq.unit || '',
      date: formatDate(obs.effectiveDateTime),
    });
  }
  return rows;
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('de-CH');
}

export default ExtractionPreviewModal;
