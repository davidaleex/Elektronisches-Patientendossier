import './Pages.css';
import './Home.css';
import { useUser } from '../context/UserContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Home() {
  const { currentUser } = useUser();

  // Berechne nächsten Termin
  const nextAppointment = currentUser.upcomingAppointments && currentUser.upcomingAppointments.length > 0
    ? currentUser.upcomingAppointments[0]
    : null;

  // Alerts berechnen
  const alerts = [];
  if (nextAppointment) {
    alerts.push({ type: 'appointment', message: `Termin heute: ${nextAppointment.type} um ${nextAppointment.time}`, icon: '📅' });
  }

  // Kritische Werte identifizieren
  const criticalValuesWarning = currentUser.criticalValues.filter(v => v.status === 'warning' || v.status === 'elevated');
  if (criticalValuesWarning.length > 0) {
    alerts.push({
      type: 'danger',
      message: `${criticalValuesWarning.length} Gesundheitswert${criticalValuesWarning.length > 1 ? 'e' : ''} außerhalb der Norm`,
      icon: '🚨'
    });
  }

  // Aktivitäts-Feed (Mock-Daten)
  const recentActivities = [
    { date: '03.12.2024', type: 'document', message: 'Neuer Laborbefund hochgeladen' },
    { date: '01.12.2024', type: 'message', message: `Nachricht von ${currentUser.primaryDoctor.name}` },
    { date: '28.11.2024', type: 'appointment', message: 'Termin wahrgenommen' },
    { date: '20.11.2024', type: 'health', message: 'Gesundheitswerte aktualisiert' },
  ];

  return (
    <div className="page-container">
      {/* Header mit Begrüßung */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Willkommen zurück, {currentUser.name.split(' ')[0]}!</h1>
          <p className="dashboard-subtitle">Hier ist Ihre Gesundheitsübersicht</p>
        </div>
      </div>

      {/* Alert-Bereich */}
      {alerts.length > 0 && (
        <div className="alerts-container">
          {alerts.map((alert, index) => (
            <div key={index} className={`alert alert-${alert.type}`}>
              <span className="alert-icon">{alert.icon}</span>
              <span className="alert-message">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Kritische Werte Visualisierung - nur wenn kritische Werte vorhanden */}
        {criticalValuesWarning.length > 0 && (
          <div className="dashboard-widget critical-values-widget critical-widget-priority">
            <div className="widget-header">
              <h2>🚨 Kritische Werte - Handlungsbedarf</h2>
            </div>
            <div className="widget-content">
              <ResponsiveContainer width="100%" height={criticalValuesWarning.length * 60 + 40}>
                <BarChart
                  data={criticalValuesWarning.map(v => ({
                    name: v.name,
                    wert: parseFloat(v.value.match(/-?[\d.]+/)?.[0] || 0),
                    referenz: parseFloat(v.reference.match(/-?[\d.]+/)?.[0] || 0)
                  }))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={180} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="wert" fill="#f44336" name="Aktueller Wert" />
                  <Bar dataKey="referenz" fill="#4CAF50" name="Zielwert" />
                </BarChart>
              </ResponsiveContainer>
              <div className="critical-values-note">
                <p><strong>Hinweis:</strong> Diese Werte liegen außerhalb des empfohlenen Bereichs. Bitte kontaktieren Sie Ihren Arzt.</p>
              </div>
            </div>
          </div>
        )}

        {/* Nächste Termine Widget */}
        <div className="dashboard-widget appointments-widget">
          <div className="widget-header">
            <h2>📅 Anstehende Termine</h2>
            <button className="widget-action">Alle anzeigen</button>
          </div>
          <div className="widget-content">
            {currentUser.upcomingAppointments && currentUser.upcomingAppointments.length > 0 ? (
              currentUser.upcomingAppointments.slice(0, 3).map((appointment, index) => (
                <div key={index} className="appointment-card">
                  <div className="appointment-date-badge">
                    <span className="date-day">{appointment.date.split('.')[0]}</span>
                    <span className="date-month">{appointment.date.split('.')[1]}</span>
                  </div>
                  <div className="appointment-info">
                    <div className="appointment-type">{appointment.type}</div>
                    <div className="appointment-meta">
                      <span>{appointment.doctor}</span>
                      <span className="appointment-time">{appointment.time} Uhr</span>
                    </div>
                    {appointment.source && (
                      <div className="appointment-source">
                        Quelle: {appointment.source}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Keine anstehenden Termine</p>
            )}
          </div>
        </div>

        {/* Aktuelle Gesundheitswerte */}
        <div className="dashboard-widget health-values-widget">
          <div className="widget-header">
            <h2>⚕️ Aktuelle Werte</h2>
          </div>
          <div className="widget-content">
            {currentUser.criticalValues && currentUser.criticalValues.map((value, index) => (
              <div key={index} className={`health-value-item status-${value.status}`}>
                <div className="value-info">
                  <span className="value-name">{value.name}</span>
                  <span className="value-date">{value.date}</span>
                </div>
                <div className="value-display">
                  <span className="value-number">{value.value}</span>
                  {value.status === 'good' && <span className="status-icon">✓</span>}
                  {value.status === 'warning' && <span className="status-icon">⚠️</span>}
                  {value.status === 'elevated' && <span className="status-icon">📈</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medikation Widget */}
        {currentUser.currentMedications && currentUser.currentMedications.length > 0 && (
          <div className="dashboard-widget medication-widget">
            <div className="widget-header">
              <h2>💊 Aktuelle Medikation</h2>
              <button className="widget-action export-btn">📄 Exportieren</button>
            </div>
            <div className="widget-content">
              {currentUser.currentMedications.slice(0, 3).map((med, index) => (
                <div key={index} className="medication-card">
                  <div className="med-icon">💊</div>
                  <div className="med-info">
                    <div className="med-name">{med.name}</div>
                    <div className="med-dosage">{med.dosage} - {med.frequency}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aktivitäts-Feed */}
        <div className="dashboard-widget activity-widget">
          <div className="widget-header">
            <h2>🕐 Letzte Aktivitäten</h2>
          </div>
          <div className="widget-content">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon activity-${activity.type}`}>
                  {activity.type === 'document' && '📄'}
                  {activity.type === 'message' && '💬'}
                  {activity.type === 'appointment' && '📅'}
                  {activity.type === 'health' && '⚕️'}
                </div>
                <div className="activity-info">
                  <div className="activity-message">{activity.message}</div>
                  <div className="activity-date">{activity.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notfall-Widget */}
        <div className="dashboard-widget emergency-widget">
          <div className="widget-header">
            <h2>🚨 Notfall</h2>
          </div>
          <div className="widget-content">
            <div className="emergency-info">
              <div className="emergency-contact">
                <span className="contact-label">Notfallkontakt:</span>
                <span className="contact-name">{currentUser.emergencyContact.name}</span>
                <span className="contact-phone">{currentUser.emergencyContact.phone}</span>
              </div>
              <button className="emergency-call-btn">Anrufen</button>
            </div>
            <div className="emergency-divider"></div>
            <div className="emergency-doctor">
              <span className="contact-label">Hausarzt:</span>
              <span className="contact-name">{currentUser.primaryDoctor.name}</span>
              <span className="contact-phone">{currentUser.primaryDoctor.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
