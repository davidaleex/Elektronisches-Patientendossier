import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserMd,
  FaSearch,
  FaFolderOpen,
  FaPaperPlane,
  FaCheck,
  FaCalendarAlt
} from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import RequestAccessModal from '../../components/RequestAccessModal';
import '../Pages.css';
import './DoctorDashboard.css';

function ageFromBirthDate(birthDate) {
  if (!birthDate) return null;
  const year = parseInt(birthDate.split('.')[2]);
  return new Date().getFullYear() - year;
}

function lastActivity(patient) {
  if (!patient?.documents?.length) return null;
  const sorted = [...patient.documents].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return sorted[0]?.date || null;
}

// Sammelt für einen Arzt alle Patienten aus `users` (statt aus einer
// doctor.activePatients-Liste). Single Source of Truth für Permissions
// ist patient.accessGrants — Doctor-UI ist nur eine Sicht darauf.
function derivePatientsForDoctor(users, doctorId) {
  return Object.values(users)
    .filter(u => u.role === 'patient')
    .map(patient => {
      const grant = (patient.accessGrants || []).find(
        g => g.doctorId === doctorId && g.isActive
      );
      if (!grant) return null;
      return { patient, grant };
    })
    .filter(Boolean);
}

function DoctorDashboard() {
  const { currentUser, users, accessRequests, requestAccess } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sentToast, setSentToast] = useState(null);
  const [requestModalPatient, setRequestModalPatient] = useState(null);

  // Patienten mit aktivem Grant — derived aus accessGrants in usersData.
  const activePatients = useMemo(
    () => derivePatientsForDoctor(users, currentUser.id),
    [users, currentUser.id]
  );

  // Eigene pending Requests aus shared state.
  const myPendingRequests = useMemo(
    () => accessRequests.filter(r => r.doctorId === currentUser.id && r.status === 'pending'),
    [accessRequests, currentUser.id]
  );

  // Set der Patient-IDs, zu denen Zugriff bereits besteht oder beantragt ist.
  const lockedPatientIds = useMemo(() => {
    const granted = activePatients.map(({ patient }) => patient.id);
    const pending = myPendingRequests.map(r => r.patientId);
    return new Set([...granted, ...pending]);
  }, [activePatients, myPendingRequests]);

  // Patient-Suche im Pool aller Patienten (Mock).
  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return Object.values(users).filter(p => {
      if (p.role !== 'patient') return false;
      if (lockedPatientIds.has(p.id)) return false;
      return p.name.toLowerCase().includes(term);
    });
  }, [searchTerm, users, lockedPatientIds]);

  // Klick auf 'Anfrage senden' öffnet das Modal — keine direkte Erstellung mehr.
  const openRequestModal = (patient) => {
    setRequestModalPatient(patient);
  };

  // Modal liefert die fertige Request-Konfiguration. Wir hängen doctorId an,
  // schreiben in den shared State und schliessen das Modal.
  const handleModalSubmit = (requestPayload) => {
    requestAccess({
      doctorId: currentUser.id,
      ...requestPayload
    });
    const patient = users[requestPayload.patientId];
    setSearchTerm('');
    setRequestModalPatient(null);
    setSentToast(`Anfrage an ${patient.name} gesendet`);
    setTimeout(() => setSentToast(null), 3000);
  };

  return (
    <div className="page-container doctor-dashboard">
      {sentToast && (
        <div className="toast-banner">
          <FaCheck /> {sentToast}
        </div>
      )}

      {requestModalPatient && (
        <RequestAccessModal
          patient={requestModalPatient}
          onClose={() => setRequestModalPatient(null)}
          onSubmit={handleModalSubmit}
        />
      )}

      <div className="dashboard-header">
        <div>
          <h1>
            <FaUserMd className="header-icon" /> Arzt-Dashboard
          </h1>
          <p className="subtitle">
            {currentUser.name} · {currentUser.specialty} · {currentUser.institution}
          </p>
        </div>
        <div className="dashboard-stats">
          <div className="stat-box">
            <div className="stat-number">{activePatients.length}</div>
            <div className="stat-label">Patienten mit Zugriff</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{myPendingRequests.length}</div>
            <div className="stat-label">Offene Anfragen</div>
          </div>
        </div>
      </div>

      {/* Patient-Suche */}
      <section className="dashboard-section">
        <h2>Neuen Patienten suchen</h2>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Patient nach Name suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchTerm && searchResults.length === 0 && (
          <p className="empty-state">Keine Patienten gefunden — oder bereits angefragt / freigegeben.</p>
        )}
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map(p => (
              <li key={p.id} className="search-result-item">
                <img src={p.profileImage} alt={p.name} className="result-avatar" />
                <div className="result-info">
                  <div className="result-name">{p.name}</div>
                  <div className="result-meta">{p.gender}, {ageFromBirthDate(p.birthDate)} Jahre</div>
                </div>
                <button
                  className="btn-request"
                  onClick={() => openRequestModal(p)}
                >
                  <FaPaperPlane /> Anfrage senden
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Offene Anfragen */}
      {myPendingRequests.length > 0 && (
        <section className="dashboard-section">
          <h2>Offene Zugriffsanfragen</h2>
          <ul className="pending-list">
            {myPendingRequests.map(req => {
              const p = users[req.patientId];
              if (!p) return null;
              return (
                <li key={req.requestId} className="pending-item">
                  <img src={p.profileImage} alt={p.name} className="result-avatar" />
                  <div className="result-info">
                    <div className="result-name">{p.name}</div>
                    <div className="result-meta">
                      Angefragt am {new Date(req.requestedAt).toLocaleDateString('de-CH')}
                      {req.grantType === 'treatment-period' && ' · Behandlungszeitraum'}
                    </div>
                  </div>
                  <span className="status-pill pending">Wartet auf Bestätigung</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Aktive Patienten */}
      <section className="dashboard-section">
        <h2>Meine Patienten</h2>
        {activePatients.length === 0 ? (
          <p className="empty-state">Noch keine Patienten freigegeben.</p>
        ) : (
          <div className="patient-grid">
            {activePatients.map(({ grant, patient }) => {
              const isTreatmentPeriod = grant.grantType === 'treatment-period';
              return (
                <div key={grant.id} className="patient-card">
                  <img src={patient.profileImage} alt={patient.name} className="patient-avatar" />
                  <div className="patient-info">
                    <h3>{patient.name}</h3>
                    <p className="patient-meta">{patient.gender}, {ageFromBirthDate(patient.birthDate)} Jahre</p>

                    {/* Grant-Type-Badge — visuell unterscheidbar, weil
                        treatment-period inhaltlich anders ist (Vollzugriff). */}
                    {isTreatmentPeriod ? (
                      <p className="grant-badge grant-treatment">
                        <FaCalendarAlt /> Behandlungszeitraum bis{' '}
                        {new Date(grant.validUntil).toLocaleDateString('de-CH')}
                      </p>
                    ) : (
                      <p className="grant-badge grant-specific">
                        Eingeschränkt: {grant.cases.join(', ')}
                      </p>
                    )}

                    <p className="patient-detail">
                      <span className="label">Seit:</span>{' '}
                      {new Date(grant.grantedDate).toLocaleDateString('de-CH')}
                    </p>
                    <p className="patient-detail">
                      <span className="label">Letzte Aktivität:</span>{' '}
                      {lastActivity(patient)
                        ? new Date(lastActivity(patient)).toLocaleDateString('de-CH')
                        : '—'}
                    </p>
                  </div>
                  <button
                    className="btn-open-record"
                    onClick={() => navigate(`/arzt/patient/${patient.id}`)}
                  >
                    <FaFolderOpen /> Akte öffnen
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default DoctorDashboard;
