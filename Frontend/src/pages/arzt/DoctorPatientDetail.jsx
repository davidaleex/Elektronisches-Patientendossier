import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaLock, FaFileMedical, FaVial, FaUser } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { usersData } from '../../data/usersData';
import { labValuesData } from '../../data/labValuesData';
import '../Pages.css';
import './DoctorPatientDetail.css';

function ageFromBirthDate(birthDate) {
  if (!birthDate) return null;
  const year = parseInt(birthDate.split('.')[2]);
  return new Date().getFullYear() - year;
}

function DoctorPatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState('stammdaten');

  const patient = usersData[id];
  const grant = (currentUser.activePatients || []).find(g => g.patientId === id);
  const labs = labValuesData[id] || [];

  // Zugriffs-Check: ohne aktiven Grant darf der Arzt nicht reinschauen.
  // Im PoC ist das ein clientseitiger Block — im Backend (M6) macht das
  // der AccessGrant-Check vor der API-Antwort.
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

  // Gruppiere Labordaten nach Category für übersichtliche Darstellung.
  const labsByCategory = useMemo(() => {
    return labs.reduce((acc, lab) => {
      const cat = lab.category || 'Ohne Kategorie';
      (acc[cat] = acc[cat] || []).push(lab);
      return acc;
    }, {});
  }, [labs]);

  // Letzte Messung extrahieren (Liste ist neu→alt sortiert in den Daten).
  const latestMeasurement = (lab) => lab.measurements?.[0];

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

      {/* Tabs */}
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
          <FaVial /> Labordaten ({labs.length})
        </button>
        <button
          className={`tab ${activeTab === 'dokumente' ? 'active' : ''}`}
          onClick={() => setActiveTab('dokumente')}
        >
          <FaFileMedical /> Dokumente ({patient.documents?.length || 0})
        </button>
      </nav>

      {/* Stammdaten-Tab */}
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
              <ul>
                {patient.allergies.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}

          {patient.chronicConditions?.length > 0 && (
            <div className="info-block">
              <h3>Chronische Diagnosen</h3>
              <ul>
                {patient.chronicConditions.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}

          {patient.currentMedications?.length > 0 && (
            <div className="info-block">
              <h3>Aktuelle Medikation</h3>
              <ul>
                {patient.currentMedications.map((m, i) => (
                  <li key={i}>
                    {typeof m === 'string' ? m : `${m.name} ${m.dosage || ''}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Labor-Tab */}
      {activeTab === 'labor' && (
        <section className="detail-section">
          <h2>Labordaten</h2>
          {labs.length === 0 ? (
            <p className="empty-state">
              Keine Labordaten verfügbar.{' '}
              {patient.id === 'luca-frei' && '(Werden ab Backend-Anbindung aus der DB geladen.)'}
            </p>
          ) : (
            Object.entries(labsByCategory).map(([category, items]) => (
              <div key={category} className="lab-category">
                <h3>{category}</h3>
                <table className="lab-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Wert</th>
                      <th>Einheit</th>
                      <th>Referenz</th>
                      <th>Datum</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(lab => {
                      const m = latestMeasurement(lab);
                      if (!m) return null;
                      return (
                        <tr key={lab.name}>
                          <td>{lab.name}</td>
                          <td className="value">{m.value}</td>
                          <td>{m.unit}</td>
                          <td>{m.referenceRange}</td>
                          <td>{m.date}</td>
                          <td>
                            <span className={`status-dot status-${m.status}`} title={m.status} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </section>
      )}

      {/* Dokumente-Tab */}
      {activeTab === 'dokumente' && (
        <section className="detail-section">
          <h2>Dokumente</h2>
          {!patient.documents?.length ? (
            <p className="empty-state">Keine Dokumente verfügbar.</p>
          ) : (
            <ul className="doc-list">
              {patient.documents.map(doc => (
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
