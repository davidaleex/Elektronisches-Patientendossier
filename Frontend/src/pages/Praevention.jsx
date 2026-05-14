import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { FaCheckCircle, FaExclamationTriangle, FaClock, FaHeartbeat, FaStethoscope, FaEye, FaTooth, FaLungs, FaPhone, FaCalendarAlt, FaPlus, FaTimes, FaSyringe, FaTrash } from 'react-icons/fa';
import './Pages.css';
import './Praevention.css';

function Praevention() {
  const { currentUser, addPreventionItem, deletePreventionItem } = useUser();

  // Prävention-Daten des aktuellen Users
  const preventionData = currentUser.preventionData || [];

  // Modal States
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Add Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Vorsorge');
  const [newItemInterval, setNewItemInterval] = useState('1 Jahr');
  const [newItemLastDate, setNewItemLastDate] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('primary');
  const [newItemDoctor, setNewItemDoctor] = useState('');
  const [newItemDoctorPhone, setNewItemDoctorPhone] = useState('');
  const [newItemDoctorSpecialty, setNewItemDoctorSpecialty] = useState('');

  // Booking State
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  // Erstelle Ärzte-Liste aus allen verfügbaren Quellen
  const availableDoctors = [
    {
      id: 'none',
      name: 'Kein Arzt',
      phone: '',
      specialty: ''
    },
    {
      id: 'primary',
      name: currentUser.primaryDoctor.name,
      phone: currentUser.primaryDoctor.phone,
      specialty: currentUser.primaryDoctor.specialty
    },
    ...(currentUser.accessGrants || []).map((grant, index) => ({
      id: `grant-${index}`,
      name: grant.name,
      phone: grant.phone,
      specialty: grant.specialty
    })),
    ...(currentUser.doctorsFromDocuments || [])
      .filter(doc => !doc.hasAccess)
      .map((doc, index) => ({
        id: `doc-${index}`,
        name: doc.name,
        phone: '',
        specialty: doc.specialty
      }))
  ];

  const handleDoctorChange = (doctorId) => {
    setSelectedDoctorId(doctorId);
    const doctor = availableDoctors.find(d => d.id === doctorId);
    if (doctor) {
      if (doctorId === 'none') {
        setNewItemDoctor('');
        setNewItemDoctorPhone('');
        setNewItemDoctorSpecialty('');
      } else {
        setNewItemDoctor(doctor.name);
        setNewItemDoctorPhone(doctor.phone);
        setNewItemDoctorSpecialty(doctor.specialty);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'aktuell': return <FaCheckCircle />;
      case 'überfällig': return <FaExclamationTriangle />;
      case 'bald_fällig': return <FaClock />;
      case 'empfohlen': return <FaHeartbeat />;
      default: return <FaHeartbeat />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'aktuell': return '#27ae60';
      case 'überfällig': return '#e74c3c';
      case 'bald_fällig': return '#f39c12';
      case 'empfohlen': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'aktuell': return 'Aktuell';
      case 'überfällig': return 'Überfällig';
      case 'bald_fällig': return 'Bald fällig';
      case 'empfohlen': return 'Empfohlen';
      default: return status;
    }
  };

  // Automatische Status-Berechnung basierend auf letztem Datum + Intervall
  const calculateStatus = (lastDate, interval) => {
    if (!lastDate) {
      return 'empfohlen'; // Noch nicht durchgeführt
    }

    const last = new Date(lastDate);
    const today = new Date();
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

    // Intervall in Tage umrechnen
    const intervalMap = {
      '3 Monate': 90,
      '6 Monate': 180,
      '1 Jahr': 365,
      '2 Jahre': 730,
      '3 Jahre': 1095,
      '5 Jahre': 1825,
      '10 Jahre': 3650
    };

    const intervalDays = intervalMap[interval] || 365;
    const warningThreshold = intervalDays * 0.9; // 90% des Intervalls = "bald fällig"

    if (diffDays > intervalDays) {
      return 'überfällig';
    } else if (diffDays > warningThreshold) {
      return 'bald_fällig';
    } else {
      return 'aktuell';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Impfungen': return <FaSyringe />;
      case 'Vorsorge': return <FaStethoscope />;
      case 'Screening': return <FaEye />;
      case 'Dental': return <FaTooth />;
      case 'Check-up': return <FaLungs />;
      default: return <FaHeartbeat />;
    }
  };

  const handleBookAppointment = (item) => {
    setSelectedItem(item);
    setShowBookingModal(true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
    setBookingTime('09:00');
    setBookingNotes('');
  };

  const handleCallDoctor = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleConfirmBooking = () => {
    alert(`Terminanfrage gesendet!\n\nUntersuchung: ${selectedItem.name}\nArzt: ${selectedItem.doctor}\nDatum: ${new Date(bookingDate).toLocaleDateString('de-DE')}\nUhrzeit: ${bookingTime}\n\nSie erhalten eine Bestätigung per E-Mail.`);
    setShowBookingModal(false);
  };

  const handleAddItem = () => {
    setShowAddItemModal(true);
    setNewItemName('');
    setNewItemCategory('Vorsorge');
    setNewItemInterval('1 Jahr');
    setNewItemLastDate('');
    setSelectedDoctorId('primary');
    setNewItemDoctor(currentUser.primaryDoctor.name);
    setNewItemDoctorPhone(currentUser.primaryDoctor.phone);
    setNewItemDoctorSpecialty(currentUser.primaryDoctor.specialty);
  };

  const handleSaveNewItem = () => {
    if (!newItemName || !newItemInterval) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    // Status automatisch berechnen
    const calculatedStatus = calculateStatus(newItemLastDate, newItemInterval);

    // Nächstes Fälligkeitsdatum berechnen
    let nextDue = null;
    let daysUntilDue = null;
    if (newItemLastDate) {
      const last = new Date(newItemLastDate);
      const intervalMap = {
        '3 Monate': 90,
        '6 Monate': 180,
        '1 Jahr': 365,
        '2 Jahre': 730,
        '3 Jahre': 1095,
        '5 Jahre': 1825,
        '10 Jahre': 3650
      };
      const intervalDays = intervalMap[newItemInterval] || 365;
      const next = new Date(last);
      next.setDate(next.getDate() + intervalDays);
      nextDue = next.toISOString().split('T')[0];

      const today = new Date();
      daysUntilDue = Math.floor((next - today) / (1000 * 60 * 60 * 24));
    }

    const newItem = {
      name: newItemName,
      category: newItemCategory,
      status: calculatedStatus,
      lastDate: newItemLastDate || null,
      nextDue: nextDue,
      daysUntilDue: daysUntilDue,
      interval: newItemInterval,
      description: 'Benutzerdefiniertes Präventions-Item',
      doctor: newItemDoctor || null,
      doctorPhone: newItemDoctorPhone || null,
      doctorSpecialty: newItemDoctorSpecialty || null
    };

    addPreventionItem(newItem);
    setShowAddItemModal(false);

    // Reset Form
    setNewItemName('');
    setNewItemCategory('Vorsorge');
    setNewItemInterval('1 Jahr');
    setNewItemLastDate('');
    setSelectedDoctorId('primary');
  };

  const handleDeleteItem = (index) => {
    if (confirm('Möchten Sie dieses Präventions-Item wirklich löschen?')) {
      deletePreventionItem(index);
    }
  };

  // Gruppiere nach Status
  const groupedData = {
    überfällig: preventionData.filter(item => item.status === 'überfällig'),
    bald_fällig: preventionData.filter(item => item.status === 'bald_fällig'),
    empfohlen: preventionData.filter(item => item.status === 'empfohlen'),
    aktuell: preventionData.filter(item => item.status === 'aktuell')
  };

  const renderPreventionCard = (item, index) => (
    <div
      key={index}
      className={`prevention-card ${item.status === 'überfällig' ? 'urgent-card' : ''}`}
      style={{ borderLeft: `5px solid ${getStatusColor(item.status)}` }}
    >
      <div className="prevention-card-header">
        <div className="prevention-icon" style={{ color: getStatusColor(item.status) }}>
          {getCategoryIcon(item.category)}
        </div>
        <div
          className="prevention-status-badge"
          style={{
            backgroundColor: `${getStatusColor(item.status)}15`,
            color: getStatusColor(item.status)
          }}
        >
          {getStatusIcon(item.status)}
          <span>{getStatusLabel(item.status)}</span>
        </div>
      </div>

      <div className="prevention-card-body">
        <div className="prevention-title-row">
          <h3>{item.name}</h3>
          <button
            className="btn-delete-item"
            onClick={() => handleDeleteItem(index)}
            title="Item löschen"
          >
            <FaTrash />
          </button>
        </div>
        <div className="prevention-category">{item.category}</div>

        <div className="prevention-details">
          {item.lastDate && (
            <div className="prevention-detail-item">
              <span className="detail-label">{item.status === 'überfällig' ? 'Letzte Durchführung:' : 'Durchgeführt am:'}</span>
              <span className="detail-value">{item.lastDate}</span>
            </div>
          )}
          {item.status === 'überfällig' && item.daysUntilDue !== undefined && (
            <div className="prevention-detail-item urgent-detail">
              <span className="detail-label">Überfällig seit:</span>
              <span className="detail-value urgent-text">
                {Math.abs(item.daysUntilDue)} Tagen
              </span>
            </div>
          )}
          {item.nextDue && item.status !== 'überfällig' && (
            <div className="prevention-detail-item">
              <span className="detail-label">Nächster Termin:</span>
              <span className="detail-value">{item.nextDue}</span>
            </div>
          )}
          {item.daysUntilDue !== undefined && item.daysUntilDue > 0 && (
            <div className="prevention-detail-item">
              <span className="detail-label">Noch:</span>
              <span className="detail-value">{item.daysUntilDue} Tage</span>
            </div>
          )}
          {item.interval && (
            <div className="prevention-detail-item">
              <span className="detail-label">Intervall:</span>
              <span className="detail-value">{item.interval}</span>
            </div>
          )}
        </div>

        {item.description && (
          <div className="prevention-description">
            {item.description}
          </div>
        )}

        {item.doctor && (
          <div className="prevention-doctor-info">
            <div className="doctor-name">
              <FaStethoscope />
              <span>{item.doctor}</span>
            </div>
            {item.doctorSpecialty && (
              <div className="doctor-specialty">{item.doctorSpecialty}</div>
            )}
            {item.doctorPhone && (
              <div className="doctor-phone">
                <FaPhone />
                <span>{item.doctorPhone}</span>
              </div>
            )}
          </div>
        )}

        <div className="prevention-actions">
          {item.doctor && (
            <>
              <button
                className={`btn-book-appointment ${item.status === 'überfällig' ? 'primary' : ''}`}
                onClick={() => handleBookAppointment(item)}
              >
                <FaCalendarAlt /> Termin buchen
              </button>
              {item.doctorPhone && (
                <button
                  className={`btn-call-doctor ${item.status !== 'überfällig' ? 'secondary' : ''}`}
                  onClick={() => handleCallDoctor(item.doctorPhone)}
                >
                  <FaPhone /> Anrufen
                </button>
              )}
            </>
          )}
          {!item.doctor && (
            <div className="no-doctor-info">
              Kein Arzt zugeordnet
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="praevention-header">
        <div>
          <h1>Prävention & Vorsorge</h1>
          <p>Ihre Vorsorgeuntersuchungen, Screenings und Impfungen im Überblick</p>
        </div>
        <button className="btn-add-prevention" onClick={handleAddItem}>
          <FaPlus /> Eigenes Item hinzufügen
        </button>
      </div>

      {/* Statistiken */}
      <div className="prevention-stats">
        <div className="stat-card urgent">
          <div className="stat-number">{groupedData.überfällig.length}</div>
          <div className="stat-label">Überfällig</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-number">{groupedData.bald_fällig.length}</div>
          <div className="stat-label">Bald fällig</div>
        </div>
        <div className="stat-card info">
          <div className="stat-number">{groupedData.empfohlen.length}</div>
          <div className="stat-label">Empfohlen</div>
        </div>
        <div className="stat-card success">
          <div className="stat-number">{groupedData.aktuell.length}</div>
          <div className="stat-label">Aktuell</div>
        </div>
      </div>

      {/* Überfällige Items */}
      {groupedData.überfällig.length > 0 && (
        <div className="prevention-section urgent-section">
          <h2>🚨 Dringend - Überfällige Untersuchungen</h2>
          <div className="prevention-grid">
            {groupedData.überfällig.map((item, index) =>
              renderPreventionCard(item, preventionData.indexOf(item))
            )}
          </div>
        </div>
      )}

      {/* Bald fällige Items */}
      {groupedData.bald_fällig.length > 0 && (
        <div className="prevention-section">
          <h2>⏰ Demnächst fällig</h2>
          <div className="prevention-grid">
            {groupedData.bald_fällig.map((item, index) =>
              renderPreventionCard(item, preventionData.indexOf(item))
            )}
          </div>
        </div>
      )}

      {/* Empfohlene Items */}
      {groupedData.empfohlen.length > 0 && (
        <div className="prevention-section">
          <h2>💡 Empfohlen</h2>
          <div className="prevention-grid">
            {groupedData.empfohlen.map((item, index) =>
              renderPreventionCard(item, preventionData.indexOf(item))
            )}
          </div>
        </div>
      )}

      {/* Aktuelle Items - Collapsed */}
      {groupedData.aktuell.length > 0 && (
        <details className="prevention-section-collapsed">
          <summary>
            <h2>✅ Aktuell ({groupedData.aktuell.length})</h2>
          </summary>
          <div className="prevention-grid">
            {groupedData.aktuell.map((item, index) =>
              renderPreventionCard(item, preventionData.indexOf(item))
            )}
          </div>
        </details>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Termin buchen</h2>
              <button className="modal-close-btn" onClick={() => setShowBookingModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="booking-summary">
                <h3>{selectedItem.name}</h3>
                <div className="booking-doctor">
                  <FaStethoscope />
                  <div>
                    <div className="doctor-name">{selectedItem.doctor}</div>
                    {selectedItem.doctorSpecialty && (
                      <div className="doctor-specialty">{selectedItem.doctorSpecialty}</div>
                    )}
                    {selectedItem.doctorPhone && (
                      <div className="doctor-phone">
                        <FaPhone /> {selectedItem.doctorPhone}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Wunschdatum *</label>
                <input
                  type="date"
                  className="form-input"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Wunschuhrzeit *</label>
                <select
                  className="form-select"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                >
                  <option value="08:00">08:00 Uhr</option>
                  <option value="09:00">09:00 Uhr</option>
                  <option value="10:00">10:00 Uhr</option>
                  <option value="11:00">11:00 Uhr</option>
                  <option value="13:00">13:00 Uhr</option>
                  <option value="14:00">14:00 Uhr</option>
                  <option value="15:00">15:00 Uhr</option>
                  <option value="16:00">16:00 Uhr</option>
                  <option value="17:00">17:00 Uhr</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notizen (optional)</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="z.B. Bevorzugte Vormittags-Termine, besondere Anliegen..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                />
              </div>

              <div className="booking-note">
                <strong>Hinweis:</strong> Dies ist eine Terminanfrage. Sie erhalten eine Bestätigung per E-Mail, sobald die Praxis Ihre Anfrage bearbeitet hat.
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowBookingModal(false)}>
                Abbrechen
              </button>
              <button className="btn-submit" onClick={handleConfirmBooking}>
                Terminanfrage senden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="modal-overlay" onClick={() => setShowAddItemModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Eigenes Präventions-Item hinzufügen</h2>
              <button className="modal-close-btn" onClick={() => setShowAddItemModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <p className="section-description">
                Fügen Sie Ihre eigenen Vorsorge-Untersuchungen hinzu, z.B. jährliche medizinische Massage, Osteopathie, etc.
              </p>

              <div className="form-group">
                <label>Bezeichnung *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="z.B. Medizinische Massage"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Kategorie *</label>
                <select
                  className="form-select"
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                >
                  <option value="Vorsorge">Vorsorge</option>
                  <option value="Screening">Screening</option>
                  <option value="Check-up">Check-up</option>
                  <option value="Dental">Dental</option>
                  <option value="Impfungen">Impfungen</option>
                </select>
              </div>

              <div className="form-group">
                <label>Intervall *</label>
                <select
                  className="form-select"
                  value={newItemInterval}
                  onChange={(e) => setNewItemInterval(e.target.value)}
                >
                  <option value="3 Monate">Alle 3 Monate</option>
                  <option value="6 Monate">Alle 6 Monate</option>
                  <option value="1 Jahr">Jährlich</option>
                  <option value="2 Jahre">Alle 2 Jahre</option>
                  <option value="3 Jahre">Alle 3 Jahre</option>
                  <option value="5 Jahre">Alle 5 Jahre</option>
                  <option value="10 Jahre">Alle 10 Jahre</option>
                </select>
              </div>

              <div className="form-group">
                <label>Letztes Datum (optional)</label>
                <input
                  type="date"
                  className="form-input"
                  value={newItemLastDate}
                  onChange={(e) => setNewItemLastDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                <small className="form-hint">Wann wurde dies zuletzt durchgeführt? Leer = noch nicht durchgeführt</small>
              </div>

              <div className="form-group">
                <label>Arzt/Spezialist</label>
                <select
                  className="form-select"
                  value={selectedDoctorId}
                  onChange={(e) => handleDoctorChange(e.target.value)}
                >
                  {availableDoctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                      {doctor.specialty && doctor.id !== 'none' && ` (${doctor.specialty})`}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctorId === 'none' && (
                <div className="no-doctor-warning">
                  <strong>Hinweis:</strong> Ohne zugeordneten Arzt können Sie für dieses Item keine Termine buchen.
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddItemModal(false)}>
                Abbrechen
              </button>
              <button
                className="btn-submit"
                onClick={handleSaveNewItem}
                disabled={!newItemName || !newItemInterval}
              >
                Item hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Praevention;
