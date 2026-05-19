import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaSearch, FaFolderOpen, FaPaperPlane, FaCheck } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { usersData } from '../../data/usersData';
import '../Pages.css';
import './DoctorDashboard.css';

// Berechnung des Alters in Jahren aus 'DD.MM.YYYY' (Schweizer Format).
function ageFromBirthDate(birthDate) {
  if (!birthDate) return null;
  const year = parseInt(birthDate.split('.')[2]);
  return new Date().getFullYear() - year;
}

// Datum des neuesten Dokuments eines Patienten als 'letzte Aktivität'.
function lastActivity(patient) {
  if (!patient?.documents?.length) return null;
  const sorted = [...patient.documents].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return sorted[0]?.date || null;
}

function DoctorDashboard() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingRequests, setPendingRequests] = useState(currentUser.pendingRequests || []);
  const [sentToast, setSentToast] = useState(null);

  // Patienten mit aktivem Zugriff: aus activePatients + Lookup in usersData.
  const activePatients = useMemo(() => {
    return (currentUser.activePatients || [])
      .map(grant => {
        const patient = usersData[grant.patientId];
        if (!patient) return null;
        return { grant, patient };
      })
      .filter(Boolean);
  }, [currentUser]);

  // Set der Patient-IDs, zu denen Arzt bereits Zugriff hat oder eine
  // Anfrage offen ist — diese werden in der Such-Liste ausgeblendet.
  const lockedPatientIds = useMemo(() => {
    const granted = (currentUser.activePatients || []).map(g => g.patientId);
    const pending = pendingRequests.map(r => r.patientId);
    return new Set([...granted, ...pending]);
  }, [currentUser, pendingRequests]);

  // Suche im Patient-Pool (Mock: alle Patienten aus usersData), gefiltert
  // nach Suchbegriff und ohne die bereits zugänglichen.
  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return Object.values(usersData).filter(p => {
      if (lockedPatientIds.has(p.id)) return false;
      return p.name.toLowerCase().includes(term);
    });
  }, [searchTerm, lockedPatientIds]);

  // Mock-Anfrage: erzeugt ein Pending-Request-Objekt clientseitig,
  // kein echter Backend-Call. Toast bestätigt die Aktion.
  const handleRequestAccess = (patient) => {
    const newReq = {
      requestId: `req-${Date.now()}`,
      patientId: patient.id,
      requestedAt: new Date().toISOString().slice(0, 10),
      message: 'Zugriff angefragt'
    };
    setPendingRequests(prev => [...prev, newReq]);
    setSearchTerm('');
    setSentToast(`Anfrage an ${patient.name} gesendet`);
    setTimeout(() => setSentToast(null), 3000);
  };

  return (
    <div className="page-container doctor-dashboard">
      {/* Toast-Banner für Mock-Anfrage-Bestätigung */}
      {sentToast && (
        <div className="toast-banner">
          <FaCheck /> {sentToast}
        </div>
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
            <div className="stat-number">{pendingRequests.length}</div>
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
                  onClick={() => handleRequestAccess(p)}
                >
                  <FaPaperPlane /> Anfrage senden
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Offene Anfragen */}
      {pendingRequests.length > 0 && (
        <section className="dashboard-section">
          <h2>Offene Zugriffsanfragen</h2>
          <ul className="pending-list">
            {pendingRequests.map(req => {
              const p = usersData[req.patientId];
              if (!p) return null;
              return (
                <li key={req.requestId} className="pending-item">
                  <img src={p.profileImage} alt={p.name} className="result-avatar" />
                  <div className="result-info">
                    <div className="result-name">{p.name}</div>
                    <div className="result-meta">Angefragt am {new Date(req.requestedAt).toLocaleDateString('de-CH')}</div>
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
            {activePatients.map(({ grant, patient }) => (
              <div key={grant.accessGrantId} className="patient-card">
                <img src={patient.profileImage} alt={patient.name} className="patient-avatar" />
                <div className="patient-info">
                  <h3>{patient.name}</h3>
                  <p className="patient-meta">{patient.gender}, {ageFromBirthDate(patient.birthDate)} Jahre</p>
                  <p className="patient-detail">
                    <span className="label">Zugriff:</span> {grant.accessLevel}
                  </p>
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DoctorDashboard;
