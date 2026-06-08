import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaLock,
  FaFileMedical,
  FaVial,
  FaUser,
  FaCalendarAlt,
  FaInfoCircle,
  FaSyncAlt
} from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { usersData } from '../../data/usersData';
import { labValuesData } from '../../data/labValuesData';
import { fetchLabValues, BACKEND_PATIENT_MAP } from '../../api/labApi';
import LabValuesTable from '../../components/LabValuesTable';
import '../Pages.css';
import './DoctorPatientDetail.css';

function ageFromBirthDate(birthDate) {
  if (!birthDate) return null;
  const year = parseInt(birthDate.split('.')[2]);
  return new Date().getFullYear() - year;
}

// Mapping zwischen Grant-documentTypes (Patient-Sicht) und Doc-Kategorien
// im Frontend. Im Backend wäre das eine Lookup-Tabelle — hier reicht's
// als Hash, damit Filter mit der bestehenden Patient-Datenbasis funktioniert.
const DOC_TYPE_TO_CATEGORY = {
  'Laborberichte': ['Labor'],
  'Labor': ['Labor'],
  'Bildgebung': ['Bildgebung'],
  'Arztbriefe': ['Diagnosen', 'Vorsorge'],
  'Rezepte': ['Medikamente'],
  'Medikamente': ['Medikamente'],
  'Impfungen': ['Impfungen'],
  'Vorsorge': ['Vorsorge'],
  'Diagnosen': ['Diagnosen'],
  // Speziell, ohne 1:1-Pendant im Frontend → leer = nichts erlaubt.
  'Mutterpass': [],
  'Ultraschall': ['Bildgebung'],
  'Physiotherapie': ['Diagnosen']
};

// Prüft, ob ein Grant uneingeschränkten Zugriff bedeutet — Vollzugriff,
// Treatment-Period oder 'Alle' in documentTypes.
function isUnrestricted(grant) {
  if (!grant) return false;
  if (grant.grantType === 'treatment-period') return true;
  if (grant.accessLevel === 'Vollzugriff' && grant.documentTypes?.includes('Alle')) return true;
  return false;
}

// Sind Labordaten überhaupt sichtbar mit diesem Grant?
function canSeeLabs(grant) {
  if (!grant) return false;
  if (isUnrestricted(grant)) return true;
  const dt = grant.documentTypes || [];
  return dt.includes('Alle') || dt.includes('Laborberichte') || dt.includes('Labor');
}

// Tokenisiere Case-Titel grob, damit wir Docs heuristisch dem Fall zuordnen
// können (Frontend-Daten haben keinen expliziten caseId an Documents).
function caseKeywords(caseTitle) {
  return (caseTitle || '')
    .toLowerCase()
    .replace(/[^a-z0-9äöüß\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 3); // Stoppwörter wie 'der', 'die', 'und' raus
}

// Filtert die Dokumentenliste des Patienten nach dem Grant-Scope:
// - Vollzugriff / treatment-period / 'Alle' → keine Filterung
// - documentTypes → erlaubt nur Kategorien aus dem Mapping
// - cases (≠ 'Alle Fälle') → schnürt zusätzlich auf Docs ein, deren
//   Tags oder Titel ein Stichwort des Falls enthalten (heuristisch)
function filterDocs(docs, grant) {
  if (!grant || !docs?.length) return [];
  if (isUnrestricted(grant)) return docs;
  const dt = grant.documentTypes || [];
  const allowedCategories = new Set();
  if (dt.includes('Alle')) {
    // Alle Kategorien erlaubt — wirkt wie unrestricted für die Kategorien-Achse.
    docs.forEach(d => allowedCategories.add(d.category));
  } else {
    dt.forEach(t => (DOC_TYPE_TO_CATEGORY[t] || []).forEach(c => allowedCategories.add(c)));
  }
  let filtered = docs.filter(d => allowedCategories.has(d.category));

  const cases = grant.cases || [];
  if (cases.length && !cases.includes('Alle Fälle')) {
    const keywords = cases.flatMap(caseKeywords);
    filtered = filtered.filter(doc => {
      const haystack = `${doc.title || ''} ${(doc.tags || []).join(' ')}`.toLowerCase();
      return keywords.some(k => haystack.includes(k));
    });
  }
  return filtered;
}

function DoctorPatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState('stammdaten');

  const patient = usersData[id];
  const grant = (patient?.accessGrants || []).find(
    g => g.doctorId === currentUser.id && g.isActive
  );

  // Lab-Daten: bei Backend-Anbindung live aus der DB (gleicher Endpoint wie
  // Patient-Sicht — Single Source of Truth), sonst Fallback auf statischen
  // Frontend-Mock. So sieht der Arzt das, was nach M5/M6-Uploads in der DB liegt.
  const backendId = BACKEND_PATIENT_MAP[id];
  const [labs, setLabs] = useState(backendId ? [] : (labValuesData[id] || []));
  const [labsLoading, setLabsLoading] = useState(Boolean(backendId));
  const [labsError, setLabsError] = useState(null);

  const reloadLabs = () => {
    if (!backendId) return;
    setLabsLoading(true);
    setLabsError(null);
    fetchLabValues(backendId)
      .then(setLabs)
      .catch(e => setLabsError(String(e.message || e)))
      .finally(() => setLabsLoading(false));
  };

  useEffect(() => {
    if (!backendId) return;
    reloadLabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendId]);

  if (!patient || !grant) {
    return (
      <div className="page-container">
        <div className="no-access-card">
          <FaLock className="lock-icon" />
          <h2>Kein Zugriff auf diese Akte</h2>
          <p>
            {!patient
              ? 'Patient nicht gefunden.'
              : 'Du hast keine aktive Zugriffsberechtigung für diesen Patienten.'}
          </p>
          <Link to="/arzt" className="btn-back">
            <FaArrowLeft /> Zurück zum Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Anwendung der Scope-Filter (Issue #15).
  const labsVisible = canSeeLabs(grant);
  const visibleDocs = useMemo(
    () => filterDocs(patient.documents || [], grant),
    [patient.documents, grant]
  );
  const visibleLabs = labsVisible ? labs : [];


  // Scope-Banner-Text — Form je nach Grant-Typ.
  const scopeBanner = useMemo(() => {
    if (grant.grantType === 'treatment-period') {
      return {
        kind: 'treatment',
        text: `Vollzugriff für Behandlungszeitraum bis ${new Date(grant.validUntil).toLocaleDateString('de-CH')}` +
          (grant.treatmentReason ? ` · ${grant.treatmentReason}` : '')
      };
    }
    if (isUnrestricted(grant)) {
      return { kind: 'full', text: 'Vollzugriff auf alle Daten' };
    }
    const docs = (grant.documentTypes || []).join(', ');
    const cases = grant.cases?.includes('Alle Fälle')
      ? 'alle Fälle'
      : `Fall: ${grant.cases.join(', ')}`;
    return { kind: 'specific', text: `Eingeschränkter Zugriff — ${cases}; Dokumente: ${docs}` };
  }, [grant]);

  return (
    <div className="page-container doctor-patient-detail">
      <button className="btn-back-inline" onClick={() => navigate('/arzt')}>
        <FaArrowLeft /> Zurück zum Dashboard
      </button>

      {/* Patient-Header */}
      <header className="patient-detail-header">
        <img src={patient.profileImage} alt={patient.name} className="patient-detail-avatar" />
        <div className="patient-detail-info">
          <h1>{patient.name}</h1>
          <p className="patient-detail-meta">
            {patient.gender} · {ageFromBirthDate(patient.birthDate)} Jahre · geb. {patient.birthDate}
          </p>
          <p className="access-info">
            <FaLock /> Zugriff aktiv seit{' '}
            {new Date(grant.grantedDate).toLocaleDateString('de-CH')}{' '}
            ({grant.accessLevel})
          </p>
        </div>
        <div className="readonly-pill">Read-Only-Ansicht</div>
      </header>

      {/* Scope-Banner — macht jederzeit transparent, was sichtbar ist. */}
      <div className={`scope-banner scope-${scopeBanner.kind}`}>
        {scopeBanner.kind === 'treatment' ? <FaCalendarAlt /> : <FaInfoCircle />}
        <span>{scopeBanner.text}</span>
      </div>

      {/* Tabs — Counts spiegeln gefilterte Anzahl. */}
      <nav className="detail-tabs">
        <button
          className={`tab ${activeTab === 'stammdaten' ? 'active' : ''}`}
          onClick={() => setActiveTab('stammdaten')}
        >
          <FaUser /> Stammdaten
        </button>
        <button
          className={`tab ${activeTab === 'labor' ? 'active' : ''}`}
          onClick={() => setActiveTab('labor')}
        >
          <FaVial /> Labordaten ({visibleLabs.length})
        </button>
        <button
          className={`tab ${activeTab === 'dokumente' ? 'active' : ''}`}
          onClick={() => setActiveTab('dokumente')}
        >
          <FaFileMedical /> Dokumente ({visibleDocs.length})
        </button>
      </nav>

      {activeTab === 'stammdaten' && (
        <section className="detail-section">
          <h2>Stammdaten</h2>
          <div className="stammdaten-grid">
            <div><span className="label">Blutgruppe:</span> {patient.bloodType || '—'}</div>
            <div><span className="label">Grösse:</span> {patient.height || '—'}</div>
            <div><span className="label">Gewicht:</span> {patient.weight || '—'}</div>
            <div><span className="label">AHV-Nummer:</span> {patient.ahvNumber || '—'}</div>
            <div><span className="label">E-Mail:</span> {patient.email || '—'}</div>
            <div><span className="label">Telefon:</span> {patient.phone || '—'}</div>
            <div className="full-row">
              <span className="label">Adresse:</span>{' '}
              {patient.address
                ? `${patient.address.street}, ${patient.address.city}`
                : '—'}
            </div>
          </div>

          {patient.allergies?.length > 0 && (
            <div className="info-block">
              <h3>Allergien</h3>
              <ul>{patient.allergies.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
          )}
          {patient.chronicConditions?.length > 0 && (
            <div className="info-block">
              <h3>Chronische Diagnosen</h3>
              <ul>{patient.chronicConditions.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </div>
          )}
          {patient.currentMedications?.length > 0 && (
            <div className="info-block">
              <h3>Aktuelle Medikation</h3>
              <ul>
                {patient.currentMedications.map((m, i) => (
                  <li key={i}>{typeof m === 'string' ? m : `${m.name} ${m.dosage || ''}`}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {activeTab === 'labor' && (
        <section className="detail-section">
          <div className="lab-section-head">
            <h2>Labordaten</h2>
            {backendId && (
              <button
                className="btn-reload-labs"
                onClick={reloadLabs}
                disabled={labsLoading}
                title="Labordaten neu vom Backend laden"
              >
                <FaSyncAlt className={labsLoading ? 'spin' : ''} />
                {labsLoading ? 'Lade …' : 'Aktualisieren'}
              </button>
            )}
          </div>
          {!labsVisible ? (
            <p className="empty-state">
              <FaLock /> Labordaten sind im aktuellen Zugriffsumfang nicht enthalten.
            </p>
          ) : labsLoading ? (
            <p className="empty-state">Lade Labordaten aus dem Backend …</p>
          ) : labsError ? (
            <p className="empty-state error">
              Fehler beim Laden: {labsError}
            </p>
          ) : visibleLabs.length === 0 ? (
            <p className="empty-state">
              Keine Labordaten verfügbar.
              {backendId && ' Nach einem Upload „Aktualisieren" klicken.'}
            </p>
          ) : (
            <LabValuesTable labs={visibleLabs} />
          )}
        </section>
      )}

      {activeTab === 'dokumente' && (
        <section className="detail-section">
          <h2>Dokumente</h2>
          {visibleDocs.length === 0 ? (
            <p className="empty-state">
              <FaLock /> Keine Dokumente im aktuellen Zugriffsumfang.
            </p>
          ) : (
            <ul className="doc-list">
              {visibleDocs.map(doc => (
                <li key={doc.id} className="doc-item">
                  <div className="doc-icon">{doc.thumbnail?.[0]?.toUpperCase() || '📄'}</div>
                  <div className="doc-info">
                    <div className="doc-title">{doc.title}</div>
                    <div className="doc-meta">
                      {doc.category} · {doc.type} · {new Date(doc.date).toLocaleDateString('de-CH')}
                    </div>
                  </div>
                  <span className={`doc-status status-${doc.status}`}>{doc.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

export default DoctorPatientDetail;
