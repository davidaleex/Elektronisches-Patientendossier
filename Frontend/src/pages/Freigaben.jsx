import './Pages.css';
import './Freigaben.css';
import { useState } from 'react';
import { useUser } from '../context/UserContext';

function Freigaben() {
  const { currentUser } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('alle');
  const [showAddAccess, setShowAddAccess] = useState(false);

  // User-spezifische Daten
  const [activeAccess, setActiveAccess] = useState(currentUser.accessGrants || []);
  const doctorsFromDocuments = currentUser.doctorsFromDocuments || [];

  // Verfügbare Fachbereiche
  const specialties = [
    'Alle Fachbereiche',
    'Allgemeinmedizin',
    'Kardiologie',
    'Orthopädie',
    'Dermatologie',
    'Urologie',
    'Gynäkologie',
    'Neurologie',
    'Radiologie',
    'Labormedizin',
    'Chirurgie',
    'Diabetologie'
  ];

  // Suchbare Ärzte/Spezialisten
  const availableDoctors = [
    { name: 'Dr. med. Hans Meier', specialty: 'Urologie', institution: 'Urologisches Zentrum' },
    { name: 'Dr. med. Julia Schmidt', specialty: 'Gynäkologie', institution: 'Frauenklinik' },
    { name: 'Dr. med. Peter Hofmann', specialty: 'Neurologie', institution: 'Neurologie-Praxis' },
    { name: 'Dr. med. Sandra Bauer', specialty: 'Orthopädie', institution: 'Orthopädie Plus' },
    { name: 'Dr. med. Robert Klein', specialty: 'Chirurgie', institution: 'Chirurgische Klinik' }
  ];

  const toggleAccess = (id) => {
    setActiveAccess(activeAccess.map(access =>
      access.id === id ? { ...access, isActive: !access.isActive } : access
    ));
  };

  const revokeAccess = (id) => {
    if (confirm('Möchten Sie diese Freigabe wirklich widerrufen?')) {
      setActiveAccess(activeAccess.filter(access => access.id !== id));
    }
  };

  const filteredDoctors = availableDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'alle' ||
                            selectedSpecialty === 'Alle Fachbereiche' ||
                            doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="page-container">
      <div className="freigaben-header">
        <h1>Freigaben verwalten</h1>
        <p>Kontrollieren Sie, wer Zugriff auf Ihre Gesundheitsdaten hat</p>
      </div>

      {/* Aktive Freigaben */}
      <div className="active-access-section">
        <div className="section-header">
          <h2>👥 Wer hat Zugriff auf meine Daten</h2>
          <div className="access-summary">
            <span className="active-count">{activeAccess.filter(a => a.isActive).length} Aktiv</span>
            <span className="inactive-count">{activeAccess.filter(a => !a.isActive).length} Inaktiv</span>
            <span className="total-count">Total: {activeAccess.length}</span>
          </div>
        </div>
        <div className="access-list">
          {activeAccess.map(access => (
            <div key={access.id} className={`access-card ${!access.isActive ? 'inactive' : ''}`}>
              <div className="access-header">
                <div className="access-doctor-info">
                  <h3>{access.name}</h3>
                  <p className="specialty">{access.specialty}</p>
                  <p className="institution">{access.institution}</p>
                </div>
                <div className="access-toggle">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={access.isActive}
                      onChange={() => toggleAccess(access.id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className={`status-label ${access.isActive ? 'active' : 'inactive'}`}>
                    {access.isActive ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </div>
              </div>

              <div className="access-details">
                <div className="detail-row">
                  <span className="label">Zugriffsebene:</span>
                  <span className={`access-level ${access.accessLevel.toLowerCase()}`}>
                    {access.accessLevel}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Freigegeben seit:</span>
                  <span>{new Date(access.grantedDate).toLocaleDateString('de-CH')}</span>
                </div>
                {access.expiryDate && (
                  <div className="detail-row">
                    <span className="label">Gültig bis:</span>
                    <span className="expiry">{new Date(access.expiryDate).toLocaleDateString('de-CH')}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">Zugriff auf Fälle:</span>
                  <div className="cases-list">
                    {access.cases.map((c, idx) => (
                      <span key={idx} className="case-tag">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="detail-row">
                  <span className="label">Dokumenttypen:</span>
                  <div className="doc-types-list">
                    {access.documentTypes.map((doc, idx) => (
                      <span key={idx} className="doc-type-tag">{doc}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="access-actions">
                <button className="btn-edit">Bearbeiten</button>
                <button className="btn-revoke" onClick={() => revokeAccess(access.id)}>Zugriff widerrufen</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Behandelnde Ärzte aus Dokumenten */}
      <div className="doctors-from-docs-section">
        <h2>👨‍⚕️ Behandelnde Ärzte (aus Dokumenten erkannt)</h2>
        <div className="doctors-grid">
          {doctorsFromDocuments.map((doctor, idx) => (
            <div key={idx} className="doctor-card">
              <div className="doctor-name">{doctor.name}</div>
              <div className="doctor-specialty">{doctor.specialty}</div>
              {doctor.hasAccess ? (
                <span className="has-access-badge">✓ Hat Zugriff</span>
              ) : (
                <button className="btn-grant-access">Zugriff erteilen</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Neue Freigabe erstellen */}
      <div className="add-access-section">
        <h2>➕ Zugriff erteilen</h2>
        <p className="section-description">Erteilen Sie Ärzten, Spitälern oder anderen Gesundheitseinrichtungen Zugriff auf Ihre Daten</p>

        <div className="search-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Arzt oder Institution suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="specialty-filter">
            <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
              {specialties.map((spec, idx) => (
                <option key={idx} value={spec === 'Alle Fachbereiche' ? 'alle' : spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-results">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor, idx) => (
              <div key={idx} className="search-result-card">
                <div className="result-info">
                  <h4>{doctor.name}</h4>
                  <p className="specialty">{doctor.specialty}</p>
                  <p className="institution">{doctor.institution}</p>
                </div>
                <button className="btn-add-access">Freigabe erstellen</button>
              </div>
            ))
          ) : (
            <div className="no-results">
              Keine Ärzte gefunden. Verfeinern Sie Ihre Suche.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Freigaben;
