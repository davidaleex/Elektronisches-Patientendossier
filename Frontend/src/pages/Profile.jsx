import './Pages.css';
import './Profile.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { QRCodeSVG } from 'qrcode.react';

function Profile() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    return currentUser.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const calculateAge = () => {
    const birth = new Date(currentUser.birthDate.split('.').reverse().join('-'));
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = () => {
    const heightM = parseInt(currentUser.height) / 100;
    const weightKg = parseInt(currentUser.weight);
    const bmi = (weightKg / (heightM * heightM)).toFixed(1);
    return bmi;
  };

  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5) return { category: 'Untergewicht', color: '#3498db' };
    if (bmi < 25) return { category: 'Normalgewicht', color: '#27ae60' };
    if (bmi < 30) return { category: 'Übergewicht', color: '#f39c12' };
    return { category: 'Adipositas', color: '#e74c3c' };
  };

  const displayImage = uploadedImage || currentUser.profileImage;

  return (
    <div className="page-container">
      <div className="profile-header">
        <div className="profile-banner">
          <div className="profile-image-section">
            <div className="profile-image-container">
              {displayImage ? (
                <img src={displayImage} alt="Profilbild" className="profile-image" />
              ) : (
                <div className="profile-initials">{getInitials()}</div>
              )}
              <label className="image-upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                📷
              </label>
            </div>
          </div>
          <div className="profile-info-header">
            <h1>{currentUser.name}</h1>
            <div className="profile-meta">
              <span>{calculateAge()} Jahre</span>
              <span>•</span>
              <span>{currentUser.gender}</span>
              <span>•</span>
              <span>AHV: {currentUser.ahvNumber}</span>
            </div>
            <div className="profile-actions">
              <button className="btn-edit-profile" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? '✓ Speichern' : '✏️ Profil bearbeiten'}
              </button>
              <button className="btn-settings" onClick={() => navigate('/einstellungen')}>
                ⚙️ Einstellungen
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-grid">

        {/* Persönliche Daten */}
        <div className="profile-section">
          <h2>📋 Persönliche Daten</h2>
          <div className="data-rows">
            <div className="data-row">
              <span className="data-label">Geburtsdatum:</span>
              <span className="data-value">{currentUser.birthDate}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Geschlecht:</span>
              <span className="data-value">{currentUser.gender}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Adresse:</span>
              <span className="data-value address-value">
                {currentUser.address.street}<br/>
                {currentUser.address.city}<br/>
                {currentUser.address.country}
              </span>
            </div>
            <div className="data-row">
              <span className="data-label">Telefon:</span>
              <span className="data-value">{currentUser.phone}</span>
            </div>
            <div className="data-row">
              <span className="data-label">E-Mail:</span>
              <span className="data-value">{currentUser.email}</span>
            </div>
          </div>
        </div>

        {/* Medizinische Basisdaten */}
        <div className="profile-section">
          <h2>⚕️ Medizinische Daten</h2>
          <div className="medical-grid">
            <div className="medical-item">
              <div className="medical-label">Blutgruppe</div>
              <div className="medical-value blood-type">{currentUser.bloodType}</div>
            </div>
            <div className="medical-item">
              <div className="medical-label">Größe</div>
              <div className="medical-value">{currentUser.height}</div>
            </div>
            <div className="medical-item">
              <div className="medical-label">Gewicht</div>
              <div className="medical-value">{currentUser.weight}</div>
            </div>
            <div className="medical-item">
              <div className="medical-label">BMI</div>
              <div className="medical-value" style={{ color: getBMICategory().color }}>
                {calculateBMI()}
                <span className="bmi-category"> ({getBMICategory().category})</span>
              </div>
            </div>
          </div>

          {currentUser.allergies.length > 0 && (
            <div className="allergies-warning">
              <h3>⚠️ Allergien</h3>
              <div className="allergy-list">
                {currentUser.allergies.map((allergy, idx) => (
                  <span key={idx} className="allergy-badge">{allergy}</span>
                ))}
              </div>
            </div>
          )}

          {currentUser.chronicConditions.length > 0 && (
            <div className="conditions-info">
              <h3>📋 Chronische Erkrankungen</h3>
              <ul className="conditions-list">
                {currentUser.chronicConditions.map((condition, idx) => (
                  <li key={idx}>{condition}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Krankenversicherung */}
        <div className="profile-section">
          <h2>🏥 Krankenversicherung</h2>
          <div className="data-rows">
            <div className="data-row highlight">
              <span className="data-label">Krankenkasse:</span>
              <span className="data-value primary">{currentUser.insuranceData.healthInsurance}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Versicherungsnummer:</span>
              <span className="data-value">{currentUser.insuranceData.insuranceNumber}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Versicherungsmodell:</span>
              <span className="data-value">{currentUser.insuranceData.insuranceType}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Versichert seit:</span>
              <span className="data-value">{currentUser.insuranceData.validSince}</span>
            </div>
          </div>

          {currentUser.insuranceData.additionalInsurances.length > 0 && (
            <div className="additional-insurance">
              <h3>Zusatzversicherungen</h3>
              <ul>
                {currentUser.insuranceData.additionalInsurances.map((ins, idx) => (
                  <li key={idx}>{ins}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Hausarzt */}
        <div className="profile-section">
          <h2>👨‍⚕️ Hausarzt</h2>
          <div className="doctor-card">
            <h3>{currentUser.primaryDoctor.name}</h3>
            <p className="doctor-specialty">{currentUser.primaryDoctor.specialty}</p>
            <div className="doctor-contact-info">
              <div className="contact-row">
                <span>📞</span>
                <span>{currentUser.primaryDoctor.phone}</span>
              </div>
              <div className="contact-row">
                <span>📧</span>
                <span>{currentUser.primaryDoctor.email}</span>
              </div>
              <div className="contact-row">
                <span>📍</span>
                <span>{currentUser.primaryDoctor.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notfallkontakt */}
        <div className="profile-section emergency-section">
          <h2>🚨 Notfallkontakt</h2>
          <div className="emergency-card">
            <h3>{currentUser.emergencyContact.name}</h3>
            <p className="relationship">{currentUser.emergencyContact.relationship}</p>
            <div className="emergency-contact-info">
              <div className="contact-row">
                <span>📱</span>
                <span><strong>{currentUser.emergencyContact.phone}</strong></span>
              </div>
              <div className="contact-row">
                <span>☎️</span>
                <span>{currentUser.emergencyContact.alternativePhone}</span>
              </div>
              <div className="contact-row">
                <span>📧</span>
                <span>{currentUser.emergencyContact.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notfall-QR-Code */}
        <div className="profile-section qr-section">
          <h2>📱 Notfall-QR-Code</h2>
          <p className="section-description">
            Scannen Sie diesen QR-Code, um im Notfall schnell auf wichtige medizinische Informationen zuzugreifen (Allergien, Blutgruppe, Medikamente, Notfallkontakte).
          </p>
          <div className="qr-code-container">
            <div className="qr-code-wrapper">
              <QRCodeSVG
                value={`${window.location.origin}/notfall/${currentUser.id}`}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="qr-code-info">
              <div className="qr-warning">
                <strong>⚠️ Wichtig:</strong> Dieser QR-Code gewährt Zugriff auf Ihre Notfalldaten ohne Login. Bewahren Sie ihn sicher auf.
              </div>
              <div className="qr-actions">
                <button
                  className="btn-download-qr"
                  onClick={() => {
                    const svg = document.querySelector('.qr-code-wrapper svg');
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    img.onload = () => {
                      canvas.width = img.width;
                      canvas.height = img.height;
                      ctx.drawImage(img, 0, 0);
                      const pngFile = canvas.toDataURL('image/png');
                      const downloadLink = document.createElement('a');
                      downloadLink.download = `notfall-qr-${currentUser.name.replace(/\s+/g, '-')}.png`;
                      downloadLink.href = pngFile;
                      downloadLink.click();
                    };
                    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                  }}
                >
                  💾 QR-Code herunterladen
                </button>
                <button
                  className="btn-print-qr"
                  onClick={() => window.print()}
                >
                  🖨️ QR-Code drucken
                </button>
              </div>
              <div className="qr-usage-tips">
                <h4>Verwendungsempfehlungen:</h4>
                <ul>
                  <li>Speichern Sie den QR-Code auf Ihrem Smartphone-Sperrbildschirm</li>
                  <li>Drucken Sie ihn aus und tragen Sie ihn bei sich</li>
                  <li>Bewahren Sie eine Kopie in Ihrer Brieftasche auf</li>
                  <li>Geben Sie eine Kopie an Vertrauenspersonen weiter</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Gesundheitsziele */}
        <div className="profile-section goals-section">
          <h2>🎯 Gesundheitsziele</h2>
          <div className="goals-list">
            {currentUser.healthGoals.map((goal, idx) => (
              <div key={idx} className="goal-item">
                <div className="goal-header">
                  <span className="goal-name">{goal.goal}</span>
                  <span className="goal-percentage">{goal.progress}%</span>
                </div>
                <div className="goal-progress-bar">
                  <div
                    className="goal-progress-fill"
                    style={{
                      width: `${goal.progress}%`,
                      backgroundColor: goal.progress >= 80 ? '#27ae60' : goal.progress >= 50 ? '#f39c12' : '#e74c3c'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-add-goal">+ Neues Ziel hinzufügen</button>
        </div>

      </div>
    </div>
  );
}

export default Profile;
