import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usersData } from '../data/usersData';
import { FaExclamationTriangle, FaHeartbeat, FaPills, FaPhone, FaUserMd, FaTint, FaAllergies, FaHospital } from 'react-icons/fa';
import './Notfall.css';

function Notfall() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuliere API-Call - in Production würde das über eine sichere API laufen
    setTimeout(() => {
      const userData = usersData[userId];
      setUser(userData);
      setLoading(false);
    }, 500);
  }, [userId]);

  if (loading) {
    return (
      <div className="notfall-container loading">
        <div className="loading-spinner"></div>
        <p>Notfalldaten werden geladen...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="notfall-container error">
        <FaExclamationTriangle className="error-icon" />
        <h2>Notfalldaten nicht gefunden</h2>
        <p>Der angeforderte Notfall-QR-Code ist ungültig oder abgelaufen.</p>
      </div>
    );
  }

  const calculateAge = () => {
    const birth = new Date(user.birthDate.split('.').reverse().join('-'));
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="notfall-container">
      <div className="notfall-header">
        <div className="emergency-badge">
          <FaExclamationTriangle />
          <span>NOTFALL</span>
        </div>
        <h1>Medizinische Notfallinformationen</h1>
        <p className="warning-text">
          Diese Seite enthält kritische medizinische Informationen für Notfallsituationen
        </p>
      </div>

      {/* Patient Info */}
      <div className="notfall-section patient-info">
        <h2>👤 Patient</h2>
        <div className="info-grid">
          <div className="info-item large">
            <span className="info-label">Name:</span>
            <span className="info-value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Geburtsdatum:</span>
            <span className="info-value">{user.birthDate} ({calculateAge()} Jahre)</span>
          </div>
          <div className="info-item">
            <span className="info-label">Geschlecht:</span>
            <span className="info-value">{user.gender}</span>
          </div>
          <div className="info-item">
            <span className="info-label">AHV-Nummer:</span>
            <span className="info-value">{user.ahvNumber}</span>
          </div>
        </div>
      </div>

      {/* Kritische Informationen */}
      <div className="critical-info-grid">

        {/* Blutgruppe */}
        <div className="notfall-section critical">
          <div className="section-header critical-header">
            <FaTint />
            <h2>Blutgruppe</h2>
          </div>
          <div className="blood-type-display">
            {user.bloodType}
          </div>
        </div>

        {/* Allergien */}
        <div className="notfall-section critical">
          <div className="section-header critical-header">
            <FaAllergies />
            <h2>Allergien</h2>
          </div>
          {user.allergies && user.allergies.length > 0 ? (
            <div className="allergies-list">
              {user.allergies.map((allergy, index) => (
                <div key={index} className="allergy-badge">
                  <FaExclamationTriangle />
                  <span>{allergy}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">Keine bekannten Allergien</div>
          )}
        </div>

      </div>

      {/* Chronische Erkrankungen */}
      {user.chronicConditions && user.chronicConditions.length > 0 && (
        <div className="notfall-section">
          <div className="section-header">
            <FaHeartbeat />
            <h2>Chronische Erkrankungen</h2>
          </div>
          <div className="conditions-list">
            {user.chronicConditions.map((condition, index) => (
              <div key={index} className="condition-badge">
                {condition}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aktuelle Medikamente */}
      <div className="notfall-section">
        <div className="section-header">
          <FaPills />
          <h2>Aktuelle Medikamente</h2>
        </div>
        {user.currentMedications && user.currentMedications.length > 0 ? (
          <div className="medications-grid">
            {user.currentMedications.map((med, index) => (
              <div key={index} className="medication-card">
                <div className="med-name">{med.name}</div>
                <div className="med-dosage">{med.dosage}</div>
                {med.frequency && <div className="med-frequency">{med.frequency}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">Keine aktuellen Medikamente</div>
        )}
      </div>

      {/* Notfallkontakt */}
      <div className="notfall-section contact-section">
        <div className="section-header">
          <FaPhone />
          <h2>Notfallkontakt</h2>
        </div>
        <div className="contact-card emergency-contact">
          <div className="contact-name">{user.emergencyContact.name}</div>
          <div className="contact-relationship">{user.emergencyContact.relationship}</div>
          <div className="contact-details">
            <a href={`tel:${user.emergencyContact.phone}`} className="contact-phone primary">
              <FaPhone />
              <span>{user.emergencyContact.phone}</span>
            </a>
            {user.emergencyContact.alternativePhone && (
              <a href={`tel:${user.emergencyContact.alternativePhone}`} className="contact-phone">
                <FaPhone />
                <span>{user.emergencyContact.alternativePhone}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hausarzt */}
      <div className="notfall-section contact-section">
        <div className="section-header">
          <FaUserMd />
          <h2>Hausarzt</h2>
        </div>
        <div className="contact-card">
          <div className="contact-name">{user.primaryDoctor.name}</div>
          <div className="contact-specialty">{user.primaryDoctor.specialty}</div>
          <div className="contact-details">
            <a href={`tel:${user.primaryDoctor.phone}`} className="contact-phone">
              <FaPhone />
              <span>{user.primaryDoctor.phone}</span>
            </a>
            <div className="contact-address">
              <FaHospital />
              <span>{user.primaryDoctor.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Krankenversicherung */}
      <div className="notfall-section">
        <div className="section-header">
          <FaHeartbeat />
          <h2>Krankenversicherung</h2>
        </div>
        <div className="insurance-info">
          <div className="info-item">
            <span className="info-label">Krankenkasse:</span>
            <span className="info-value">{user.insuranceData.healthInsurance}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Versicherungsnummer:</span>
            <span className="info-value">{user.insuranceData.insuranceNumber}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="notfall-footer">
        <p>
          <FaExclamationTriangle />
          Diese Informationen sind nur für medizinisches Notfallpersonal bestimmt
        </p>
        <p className="timestamp">
          Abgerufen am: {new Date().toLocaleString('de-DE')}
        </p>
      </div>
    </div>
  );
}

export default Notfall;
