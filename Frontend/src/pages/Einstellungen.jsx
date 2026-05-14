import './Pages.css';
import './Einstellungen.css';
import { useUser } from '../context/UserContext';

function Einstellungen() {
  const { settings, updateSettings, resetSettingsToDefault, currentUser } = useUser();

  const fontSizes = [
    { value: 'klein', label: 'Klein', size: '14px' },
    { value: 'mittel', label: 'Mittel (Standard)', size: '16px' },
    { value: 'gross', label: 'Groß', size: '18px' },
    { value: 'sehr-gross', label: 'Sehr Groß', size: '20px' }
  ];

  const languages = [
    { value: 'de', label: 'Deutsch' },
    { value: 'fr', label: 'Français' },
    { value: 'it', label: 'Italiano' },
    { value: 'en', label: 'English' }
  ];

  const handleFontSizeChange = (size) => {
    updateSettings({ ...settings, fontSize: size });
  };

  const handleNotificationChange = (key) => {
    updateSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: !settings.notifications[key] }
    });
  };

  const handleDataSharingChange = (key) => {
    updateSettings({
      ...settings,
      dataSharing: { ...settings.dataSharing, [key]: !settings.dataSharing[key] }
    });
  };

  const handleHighContrastChange = (checked) => {
    updateSettings({ ...settings, highContrast: checked });
  };

  const handleLanguageChange = (lang) => {
    updateSettings({ ...settings, language: lang });
  };

  const handleTwoFactorAuthChange = (checked) => {
    updateSettings({ ...settings, twoFactorAuth: checked });
  };

  const handleAutoLogoutChange = (value) => {
    updateSettings({ ...settings, autoLogout: value });
  };

  const handleExportData = (format) => {
    alert(`Datenexport als ${format} wird vorbereitet...`);
  };

  const handleDeleteAccount = () => {
    if (confirm('Möchten Sie Ihr Konto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      alert('Konto-Löschung initiiert. Sie erhalten eine Bestätigungs-E-Mail.');
    }
  };

  return (
    <div className="page-container">
      <div className="settings-header">
        <h1>Einstellungen</h1>
        <p>Passen Sie das EPD an Ihre Bedürfnisse an</p>
        <p className="settings-hint">
          Aktuelles Profil: <strong>{currentUser.name}</strong> - Diese Einstellungen sind personalisiert
        </p>
        <button className="btn-reset-settings" onClick={resetSettingsToDefault}>
          Auf Standard zurücksetzen
        </button>
      </div>

      <div className="settings-grid">

        {/* Barrierefreiheit */}
        <div className="settings-section">
          <h2>♿ Barrierefreiheit</h2>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Schriftgröße</strong>
              <span className="setting-description">Passen Sie die Textgröße für bessere Lesbarkeit an</span>
            </div>
            <div className="font-size-options">
              {fontSizes.map(size => (
                <button
                  key={size.value}
                  className={`font-size-btn ${settings.fontSize === size.value ? 'active' : ''}`}
                  onClick={() => handleFontSizeChange(size.value)}
                  style={{ fontSize: size.size }}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Hoher Kontrast</strong>
              <span className="setting-description">Verbessert die Sichtbarkeit für Menschen mit Sehschwäche</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => handleHighContrastChange(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Sprache & Region */}
        <div className="settings-section">
          <h2>🌍 Sprache & Region</h2>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Anzeigesprache</strong>
              <span className="setting-description">Wählen Sie Ihre bevorzugte Sprache</span>
            </div>
            <select value={settings.language} onChange={(e) => handleLanguageChange(e.target.value)} className="setting-select">
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Datumsformat</strong>
              <span className="setting-description">Wie Daten angezeigt werden</span>
            </div>
            <select className="setting-select">
              <option value="dd.mm.yyyy">TT.MM.JJJJ (Schweizer Format)</option>
              <option value="mm/dd/yyyy">MM/DD/YYYY (US Format)</option>
              <option value="yyyy-mm-dd">JJJJ-MM-TT (ISO Format)</option>
            </select>
          </div>
        </div>

        {/* Benachrichtigungen */}
        <div className="settings-section">
          <h2>🔔 Benachrichtigungen</h2>

          <div className="setting-item">
            <div className="setting-label">
              <strong>E-Mail Benachrichtigungen</strong>
              <span className="setting-description">Erhalten Sie Updates per E-Mail</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={() => handleNotificationChange('email')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Push-Benachrichtigungen</strong>
              <span className="setting-description">Sofortige Benachrichtigungen auf Ihrem Gerät</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={() => handleNotificationChange('push')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Termin-Erinnerungen</strong>
              <span className="setting-description">Erinnern Sie sich an anstehende Arzttermine</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications.appointments}
                onChange={() => handleNotificationChange('appointments')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Neue Laborergebnisse</strong>
              <span className="setting-description">Bei neuen Laborberichten benachrichtigen</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications.labResults}
                onChange={() => handleNotificationChange('labResults')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Medikamenten-Erinnerungen</strong>
              <span className="setting-description">Erinnerung zur Medikamenteneinnahme</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications.medications}
                onChange={() => handleNotificationChange('medications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Datenschutz & Sicherheit */}
        <div className="settings-section">
          <h2>🔒 Datenschutz & Sicherheit</h2>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Zwei-Faktor-Authentifizierung</strong>
              <span className="setting-description">Zusätzliche Sicherheit für Ihr Konto</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleTwoFactorAuthChange(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Automatischer Logout</strong>
              <span className="setting-description">Nach Inaktivität automatisch abmelden</span>
            </div>
            <select value={settings.autoLogout} onChange={(e) => handleAutoLogoutChange(e.target.value)} className="setting-select">
              <option value="15">15 Minuten</option>
              <option value="30">30 Minuten</option>
              <option value="60">1 Stunde</option>
              <option value="never">Nie</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Daten für Forschung teilen</strong>
              <span className="setting-description">Anonymisierte Daten für medizinische Forschung</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.dataSharing.research}
                onChange={() => handleDataSharingChange('research')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Qualitätssicherung</strong>
              <span className="setting-description">Daten zur Verbesserung der Versorgungsqualität teilen</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.dataSharing.quality}
                onChange={() => handleDataSharingChange('quality')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <strong>Anonyme Nutzungsstatistiken</strong>
              <span className="setting-description">Helfen Sie uns die App zu verbessern</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.dataSharing.statistics}
                onChange={() => handleDataSharingChange('statistics')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Datenexport */}
        <div className="settings-section">
          <h2>📥 Datenexport</h2>
          <p className="section-description">Exportieren Sie Ihre Gesundheitsdaten in verschiedenen Formaten</p>

          <div className="export-buttons">
            <button className="export-btn" onClick={() => handleExportData('PDF')}>
              <span className="export-icon">📄</span>
              <span>Als PDF exportieren</span>
            </button>
            <button className="export-btn" onClick={() => handleExportData('CSV')}>
              <span className="export-icon">📊</span>
              <span>Als CSV exportieren</span>
            </button>
            <button className="export-btn" onClick={() => handleExportData('JSON')}>
              <span className="export-icon">💾</span>
              <span>Als JSON exportieren</span>
            </button>
            <button className="export-btn" onClick={() => handleExportData('FHIR')}>
              <span className="export-icon">🏥</span>
              <span>Als FHIR exportieren</span>
            </button>
          </div>
        </div>

        {/* Aktive Sitzungen */}
        <div className="settings-section">
          <h2>📱 Aktive Sitzungen</h2>
          <p className="section-description">Geräte, die aktuell mit Ihrem EPD verbunden sind</p>

          <div className="sessions-list">
            <div className="session-item active-session">
              <div className="session-info">
                <div className="session-device">💻 MacBook Pro</div>
                <div className="session-details">
                  <span>Zürich, Schweiz</span>
                  <span>•</span>
                  <span>Aktuelle Sitzung</span>
                </div>
              </div>
              <span className="session-badge current">Aktuell</span>
            </div>
            <div className="session-item">
              <div className="session-info">
                <div className="session-device">📱 iPhone 15</div>
                <div className="session-details">
                  <span>Zürich, Schweiz</span>
                  <span>•</span>
                  <span>Zuletzt aktiv: vor 2 Stunden</span>
                </div>
              </div>
              <button className="session-logout">Abmelden</button>
            </div>
            <div className="session-item">
              <div className="session-info">
                <div className="session-device">💻 Windows PC</div>
                <div className="session-details">
                  <span>Bern, Schweiz</span>
                  <span>•</span>
                  <span>Zuletzt aktiv: vor 1 Tag</span>
                </div>
              </div>
              <button className="session-logout">Abmelden</button>
            </div>
          </div>

          <button className="btn-logout-all">Alle anderen Sitzungen abmelden</button>
        </div>

        {/* Konto-Verwaltung */}
        <div className="settings-section danger-zone">
          <h2>⚠️ Gefahrenbereich</h2>

          <div className="danger-item">
            <div className="danger-label">
              <strong>Passwort ändern</strong>
              <span className="setting-description">Aktualisieren Sie Ihr Passwort</span>
            </div>
            <button className="btn-secondary">Passwort ändern</button>
          </div>

          <div className="danger-item">
            <div className="danger-label">
              <strong>Alle Freigaben widerrufen</strong>
              <span className="setting-description">Entfernt alle Zugriffsberechtigungen für Ärzte und Institutionen</span>
            </div>
            <button className="btn-warning">Alle Freigaben widerrufen</button>
          </div>

          <div className="danger-item">
            <div className="danger-label">
              <strong>Konto löschen</strong>
              <span className="setting-description">Löscht Ihr Konto und alle Daten permanent</span>
            </div>
            <button className="btn-danger" onClick={handleDeleteAccount}>Konto löschen</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Einstellungen;
