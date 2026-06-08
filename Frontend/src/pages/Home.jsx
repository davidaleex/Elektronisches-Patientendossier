import './Pages.css';
import './Home.css';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  FaCalendarDay,
  FaHeartbeat,
  FaPills,
  FaFlask,
  FaFileMedical,
  FaShieldAlt,
  FaLeaf,
  FaPhoneAlt,
  FaChevronRight,
} from 'react-icons/fa';

// Ruhige, fokussierte Startseite (Neala-Feedback 09.06.2026): nur das
// Wichtigste, kein Alarm-Ton. Bewusst entfernt wurden der grosse rote
// „Kritische Werte – Handlungsbedarf"-BarChart (mischte mmHg/%/ml-min auf
// einer Achse), die Panik-Alerts und der veraltete Aktivitäts-Feed.

const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

// „28.11.2024" → „Nov"
function monthShort(dateStr) {
  const m = parseInt((dateStr || '').split('.')[1], 10);
  return MONTHS[m - 1] || '';
}

function Home() {
  const { currentUser } = useUser();
  const firstName = currentUser.name.split(' ')[0];

  // Nächster Termin = erster Eintrag der (chronologischen) Liste.
  const nextAppointment = currentUser.upcomingAppointments?.[0] || null;

  // Werte ruhig zusammenfassen — sanfte Ampel (ok/beobachten), kein Chart.
  const values = currentUser.criticalValues || [];
  const toObserve = values.filter(v => v.status === 'warning' || v.status === 'elevated');

  const medications = currentUser.currentMedications || [];

  // Schnellzugriff auf die meistgenutzten Bereiche.
  const quickLinks = [
    { to: '/labor', icon: <FaFlask />, label: 'Laborwerte' },
    { to: '/dokumente', icon: <FaFileMedical />, label: 'Dokumente' },
    { to: '/praevention', icon: <FaLeaf />, label: 'Prävention' },
    { to: '/freigaben', icon: <FaShieldAlt />, label: 'Freigaben' },
  ];

  return (
    <div className="page-container home">
      <header className="home-greeting">
        <h1>Guten Tag, {firstName}</h1>
        <p>Schön, dass Sie da sind. Hier sehen Sie das Wichtigste auf einen Blick.</p>
      </header>

      <div className="home-grid">
        {/* Nächster Termin */}
        <section className="home-card">
          <div className="home-card-head">
            <FaCalendarDay className="home-card-icon" />
            <h2>Nächster Termin</h2>
          </div>
          {nextAppointment ? (
            <div className="home-appt">
              <div className="home-appt-date">
                <span className="home-appt-day">{nextAppointment.date.split('.')[0]}</span>
                <span className="home-appt-mon">{monthShort(nextAppointment.date)}</span>
              </div>
              <div className="home-appt-info">
                <strong>{nextAppointment.type}</strong>
                <span>{nextAppointment.doctor}</span>
                <span className="home-appt-time">{nextAppointment.time} Uhr</span>
              </div>
            </div>
          ) : (
            <p className="home-empty">Aktuell keine anstehenden Termine.</p>
          )}
        </section>

        {/* Werte im Blick */}
        <section className="home-card">
          <div className="home-card-head">
            <FaHeartbeat className="home-card-icon" />
            <h2>Werte im Blick</h2>
          </div>
          {values.length > 0 ? (
            <>
              <ul className="home-value-list">
                {values.map((v, i) => {
                  const watch = v.status === 'warning' || v.status === 'elevated';
                  return (
                    <li key={i} className="home-value">
                      <span className={`home-dot ${watch ? 'watch' : 'ok'}`} />
                      <span className="home-value-name">{v.name}</span>
                      <span className="home-value-num">{v.value}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="home-note">
                {toObserve.length > 0
                  ? `${toObserve.length} ${toObserve.length === 1 ? 'Wert' : 'Werte'} zum Beobachten — besprechen Sie diese in Ruhe mit Ihrer Ärztin oder Ihrem Arzt.`
                  : 'Alle Werte liegen im Zielbereich.'}
              </p>
            </>
          ) : (
            <p className="home-empty">Keine aktuellen Werte hinterlegt.</p>
          )}
        </section>

        {/* Medikation — nur wenn vorhanden */}
        {medications.length > 0 && (
          <section className="home-card">
            <div className="home-card-head">
              <FaPills className="home-card-icon" />
              <h2>Medikation</h2>
            </div>
            <ul className="home-med-list">
              {medications.slice(0, 3).map((m, i) => (
                <li key={i}>
                  <strong>{m.name}</strong>
                  <span>{m.dosage} · {m.frequency}</span>
                </li>
              ))}
            </ul>
            {medications.length > 3 && (
              <p className="home-note">und {medications.length - 3} weitere</p>
            )}
          </section>
        )}

        {/* Schnellzugriff */}
        <section className="home-card">
          <div className="home-card-head">
            <h2>Schnellzugriff</h2>
          </div>
          <div className="home-quick-grid">
            {quickLinks.map(q => (
              <Link key={q.to} to={q.to} className="home-quick-link">
                <span className="home-quick-icon">{q.icon}</span>
                <span className="home-quick-label">{q.label}</span>
                <FaChevronRight className="home-quick-arrow" />
              </Link>
            ))}
          </div>
        </section>

        {/* Im Notfall — kompakt, informativ statt alarmierend */}
        <section className="home-card home-emergency">
          <div className="home-card-head">
            <FaPhoneAlt className="home-card-icon" />
            <h2>Im Notfall</h2>
          </div>
          <div className="home-emergency-grid">
            {currentUser.emergencyContact && (
              <div className="home-emergency-item">
                <span className="home-emergency-label">Notfallkontakt</span>
                <strong>{currentUser.emergencyContact.name}</strong>
                <a href={`tel:${currentUser.emergencyContact.phone}`} className="home-emergency-phone">
                  {currentUser.emergencyContact.phone}
                </a>
              </div>
            )}
            {currentUser.primaryDoctor && (
              <div className="home-emergency-item">
                <span className="home-emergency-label">Hausarzt</span>
                <strong>{currentUser.primaryDoctor.name}</strong>
                <a href={`tel:${currentUser.primaryDoctor.phone}`} className="home-emergency-phone">
                  {currentUser.primaryDoctor.phone}
                </a>
              </div>
            )}
          </div>
          <Link to={`/notfall/${currentUser.id}`} className="home-emergency-link">
            Notfallinformationen öffnen
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Home;
