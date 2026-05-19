import { useState, useMemo } from 'react';
import { FaTimes, FaCalendarAlt, FaListUl } from 'react-icons/fa';
import './RequestAccessModal.css';

// Standard-DocumentTypes für die Specific-Variante. Bleibt im Frontend-Mock
// hardcoded — im Backend käme das aus einer Lookup-Tabelle (Coding-System).
const DOC_TYPE_OPTIONS = [
  'Laborberichte',
  'Bildgebung',
  'Arztbriefe',
  'Rezepte',
  'Impfungen'
];

function todayPlusMonths(months) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

// Modal für die Zugriffsanfrage des Arztes an einen Patienten.
// Zwei Granularitätsstufen: Treatment-Period (Vollzugriff, zeitlich begrenzt)
// oder Specific (ausgewählte Fälle + Dokumenttypen).
function RequestAccessModal({ patient, onClose, onSubmit }) {
  const [grantType, setGrantType] = useState('treatment-period');
  const [validUntil, setValidUntil] = useState(todayPlusMonths(6));
  const [treatmentReason, setTreatmentReason] = useState('');
  const [selectedCases, setSelectedCases] = useState(['Alle Fälle']);
  const [selectedDocTypes, setSelectedDocTypes] = useState(['Laborberichte', 'Arztbriefe']);

  // Patient.cases sind Objekte mit { id, title, ... }. Wir bieten ausserdem
  // die globale Option 'Alle Fälle' an, die alle aktuellen und künftigen abdeckt.
  const caseOptions = useMemo(() => {
    const titles = (patient.cases || []).map(c => c.title);
    return ['Alle Fälle', ...titles];
  }, [patient]);

  const toggleCase = (title) => {
    setSelectedCases(prev => {
      if (prev.includes(title)) return prev.filter(t => t !== title);
      return [...prev, title];
    });
  };

  const toggleDocType = (type) => {
    setSelectedDocTypes(prev => {
      if (prev.includes(type)) return prev.filter(t => t !== type);
      return [...prev, type];
    });
  };

  const handleSubmit = () => {
    if (grantType === 'treatment-period') {
      onSubmit({
        patientId: patient.id,
        grantType: 'treatment-period',
        validFrom: new Date().toISOString().slice(0, 10),
        validUntil,
        accessLevel: 'Vollzugriff',
        cases: ['Alle Fälle'],
        documentTypes: ['Alle'],
        treatmentReason: treatmentReason || 'Aktive Behandlung'
      });
    } else {
      onSubmit({
        patientId: patient.id,
        grantType: 'specific',
        accessLevel: 'Eingeschränkt',
        cases: selectedCases.length ? selectedCases : ['Alle Fälle'],
        documentTypes: selectedDocTypes.length ? selectedDocTypes : ['Laborberichte']
      });
    }
  };

  const isValid = grantType === 'treatment-period'
    ? !!validUntil
    : selectedCases.length > 0 && selectedDocTypes.length > 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Zugriff anfragen — {patient.name}</h2>
          <button className="modal-close" onClick={onClose}><FaTimes /></button>
        </header>

        <div className="modal-body">
          <div className="grant-type-switch">
            <button
              className={`type-option ${grantType === 'treatment-period' ? 'active' : ''}`}
              onClick={() => setGrantType('treatment-period')}
            >
              <FaCalendarAlt />
              <div>
                <div className="type-name">Behandlungszeitraum</div>
                <div className="type-hint">Vollzugriff für laufende Behandlung</div>
              </div>
            </button>
            <button
              className={`type-option ${grantType === 'specific' ? 'active' : ''}`}
              onClick={() => setGrantType('specific')}
            >
              <FaListUl />
              <div>
                <div className="type-name">Spezifisch</div>
                <div className="type-hint">Einzelne Fälle und Dokumenttypen</div>
              </div>
            </button>
          </div>

          {grantType === 'treatment-period' ? (
            <>
              <label className="field-label">Gültig bis</label>
              <input
                type="date"
                value={validUntil}
                onChange={e => setValidUntil(e.target.value)}
                className="modal-input"
              />
              <label className="field-label">Behandlungsgrund (optional)</label>
              <input
                type="text"
                placeholder="z. B. Hausärztliche Mitbetreuung"
                value={treatmentReason}
                onChange={e => setTreatmentReason(e.target.value)}
                className="modal-input"
              />
              <p className="modal-info">
                Während der Behandlung sieht der Arzt alle Fälle und Dokumente
                des Patienten — wie bei einer stationären Behandlung.
              </p>
            </>
          ) : (
            <>
              <label className="field-label">Fälle</label>
              <div className="checkbox-group">
                {caseOptions.map(title => (
                  <label key={title} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedCases.includes(title)}
                      onChange={() => toggleCase(title)}
                    />
                    <span>{title}</span>
                  </label>
                ))}
                {caseOptions.length === 1 && (
                  <p className="empty-hint">Keine spezifischen Fälle beim Patienten.</p>
                )}
              </div>

              <label className="field-label">Dokumenttypen</label>
              <div className="checkbox-group">
                {DOC_TYPE_OPTIONS.map(type => (
                  <label key={type} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedDocTypes.includes(type)}
                      onChange={() => toggleDocType(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        <footer className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Abbrechen</button>
          <button
            className="btn-primary"
            disabled={!isValid}
            onClick={handleSubmit}
          >
            Anfrage senden
          </button>
        </footer>
      </div>
    </div>
  );
}

export default RequestAccessModal;
