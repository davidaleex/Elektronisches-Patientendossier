import { useState, useMemo, useEffect, useCallback } from 'react';
import './Pages.css';
import './Labor.css';
import { useUser } from '../context/UserContext';
import { labValuesData } from '../data/labValuesData';
import { BACKEND_PATIENT_MAP, fetchLabValues } from '../api/labApi';
import LabReportUpload from '../components/LabReportUpload';

// Backend führt die LabGroup-Namen auf Englisch (Decision #10);
// das UI war vorher deutsch — wir mappen für konsistente Anzeige.
const CATEGORY_DE = {
  'Hematology': 'Hämatologie',
  'Metabolism': 'Stoffwechsel',
  'Lipids': 'Lipide',
  'Inflammation': 'Entzündung',
  'Endocrinology': 'Endokrinologie',
  'Kidney & Liver': 'Niere & Leber',
  'Other': 'Sonstige',
};

function Labor() {
  const { currentUser } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [selectedLabValue, setSelectedLabValue] = useState(null);

  // Backend-Anbindung — nur für Personas mit Backend-ID (siehe Map oben).
  const [backendLabValues, setBackendLabValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendId = BACKEND_PATIENT_MAP[currentUser.id];

  // Lädt die Lab-Werte aus dem Backend. Als useCallback, weil die
  // Upload-Komponente sie nach erfolgreichem Import erneut auslöst (#25).
  const loadLabValues = useCallback(() => {
    if (!backendId) {
      setBackendLabValues(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetchLabValues(backendId)
      .then(data => {
        // Englische Backend-Kategorien auf Deutsch übersetzen für die UI.
        const mapped = data.map(lab => ({
          ...lab,
          category: CATEGORY_DE[lab.category] || lab.category,
        }));
        setBackendLabValues(mapped);
        setLoading(false);
      })
      .catch(err => {
        setError(String(err.message || err));
        setLoading(false);
      });
  }, [backendId]);

  useEffect(() => { loadLabValues(); }, [loadLabValues]);

  // Backend-Daten haben Vorrang; sonst Fallback auf Frontend-Mock.
  const userLabValues = backendLabValues ?? (labValuesData[currentUser.id] || []);

  // Medikamenten Timeline
  const medicationTimeline = currentUser.healthData?.medicationTimeline || [];

  // Kategorien extrahieren
  const categories = ['Alle', ...new Set(userLabValues.map(lab => lab.category))];

  // Gefilterte Labor-Werte
  const filteredLabValues = useMemo(() => {
    if (selectedCategory === 'Alle') return userLabValues;
    return userLabValues.filter(lab => lab.category === selectedCategory);
  }, [selectedCategory, userLabValues]);

  // Datums-Union über alle gefilterten Parameter: mehrere importierte Berichte
  // erscheinen als zusätzliche Spalten, auch wenn nicht jeder Parameter an jedem
  // Datum gemessen wurde. Neueste Messung links (#25).
  const parseLabDate = (d) => {
    const [day, month, year] = (d || '').split('.').map(Number);
    return new Date(year || 0, (month || 1) - 1, day || 1);
  };
  const allDates = useMemo(() => {
    const set = new Set();
    filteredLabValues.forEach(lab =>
      (lab.measurements || []).forEach(m => set.add(m.date))
    );
    return [...set].sort((a, b) => parseLabDate(b) - parseLabDate(a));
  }, [filteredLabValues]);

  // Funktion um Status-Farbe zu bestimmen
  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return '#27ae60';
      case 'elevated': return '#f39c12';
      case 'warning': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  // Funktion um Status-Icon zu bestimmen
  const getStatusIcon = (status) => {
    switch(status) {
      case 'good': return '✓';
      case 'elevated': return '⚠';
      case 'warning': return '🔴';
      default: return '';
    }
  };

  return (
    <div className="page-container">
      <h1>Laborwerte & Gesundheitsdaten</h1>
      <p>Ihre Laborwerte, Vitalzeichen und Medikamentenverlauf im Überblick</p>

      {/* Backend-Status — nur sichtbar, wenn diese Persona Backend-Anbindung hat */}
      {backendId && (
        <div style={{
          padding: '0.6rem 1rem',
          marginBottom: '1rem',
          borderRadius: 8,
          background: error ? '#fdecea' : (loading ? '#fff7e0' : '#e8f8f5'),
          color: error ? '#c0392b' : (loading ? '#8a6d3b' : '#117a65'),
          border: `1px solid ${error ? '#e74c3c' : (loading ? '#f5d76e' : '#76d7c4')}`,
          fontSize: '0.9rem'
        }}>
          {loading && '⏳ Lade Labordaten aus dem Backend …'}
          {error && `⚠ Backend nicht erreichbar: ${error}. Stelle sicher, dass Django auf :8000 läuft.`}
          {!loading && !error && backendLabValues && `✓ ${backendLabValues.length} Lab-Parameter aus dem Django-Backend geladen`}
        </div>
      )}

      {/* Patienten-Upload eines strukturierten Lab-Reports (#23) */}
      {backendId && (
        <LabReportUpload backendPatientId={backendId} onUploaded={loadLabValues} />
      )}

      {/* Kategorie-Filter */}
      <div className="labor-filters">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Laborwerte Tabelle */}
      <div className="labor-table-container">
        <div className="labor-table-wrapper">
          <table className="labor-table">
            <thead>
              <tr>
                <th className="sticky-col">Laborwert</th>
                {/* Spalten = Union aller Mess-Daten (neueste links) */}
                {allDates.map((date, index) => (
                  <th key={index}>{date}</th>
                ))}
                <th className="reference-col">Referenz</th>
              </tr>
            </thead>
            <tbody>
              {filteredLabValues.map((labValue, labIndex) => {
                // Messungen nach Datum indexieren, damit jede Spalte den
                // passenden Wert findet (oder leer bleibt).
                const byDate = Object.fromEntries(
                  (labValue.measurements || []).map(m => [m.date, m])
                );
                // Referenz/Einheit aus einer Messung mit Referenzbereich, sonst erste.
                const refM = (labValue.measurements || []).find(m => m.referenceRange)
                  || labValue.measurements?.[0];

                return (
                  <tr
                    key={labIndex}
                    onClick={() => setSelectedLabValue(selectedLabValue === labIndex ? null : labIndex)}
                    className={selectedLabValue === labIndex ? 'selected' : ''}
                  >
                    <td className="sticky-col lab-name-cell">
                      <div className="lab-name">{labValue.name}</div>
                      <div className="lab-category">{labValue.category}</div>
                    </td>
                    {allDates.map((date, di) => {
                      const measurement = byDate[date];
                      if (!measurement) {
                        return (
                          <td key={di} className="value-cell" style={{ textAlign: 'center', color: '#c0c7ce' }}>–</td>
                        );
                      }
                      const statusColor = getStatusColor(measurement.status);
                      const statusIcon = getStatusIcon(measurement.status);
                      return (
                        <td
                          key={di}
                          className={`value-cell status-${measurement.status}`}
                          style={{
                            backgroundColor: measurement.status !== 'good' ? `${statusColor}15` : 'transparent',
                            borderLeft: `3px solid ${statusColor}`
                          }}
                        >
                          <div className="value-wrapper">
                            <span className="value-number">{measurement.value}</span>
                            <span className="value-unit">{measurement.unit}</span>
                            <span className="status-icon">{statusIcon}</span>
                          </div>
                        </td>
                      );
                    })}
                    <td className="reference-col">
                      {refM?.referenceRange} {refM?.unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLabValues.length === 0 && (
          <div className="no-data">
            <p>Keine Laborwerte für diese Kategorie verfügbar</p>
          </div>
        )}
      </div>

      {/* Legende */}
      <div className="labor-legend">
        <h3>Legende</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#27ae60' }}></span>
            <span>Im Normbereich</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#f39c12' }}></span>
            <span>Leicht erhöht/erniedrigt</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#e74c3c' }}></span>
            <span>Deutlich außerhalb der Norm</span>
          </div>
        </div>
      </div>

      {/* Medikamenten Timeline (bleibt wie vorher) */}
      {medicationTimeline.length > 0 && (
        <div className="viz-card full-width">
          <h2>💊 Medikamenten Timeline</h2>
          <div className="medication-timeline">
            <div className="timeline-header">
              <div className="timeline-label">Medikament</div>
              <div className="timeline-chart">
                <span>2023</span>
                <span>2024</span>
                <span>2025</span>
              </div>
            </div>
            {medicationTimeline.map((med, index) => (
              <div key={index} className="timeline-row">
                <div className="timeline-med-name">
                  <span className={`status-dot ${med.periods[0].active ? 'active' : 'inactive'}`}></span>
                  {med.name}
                </div>
                <div className="timeline-bars">
                  {med.periods.map((period, pIndex) => {
                    const [startYear, startMonth] = period.start.split('-').map(Number);
                    const [endYear, endMonth] = period.end.split('-').map(Number);

                    const timelineStart = 2008;
                    const timelineEnd = 2026;
                    const totalMonths = (timelineEnd - timelineStart) * 12;

                    const startMonthsFromBegin = (startYear - timelineStart) * 12 + startMonth;
                    const endMonthsFromBegin = (endYear - timelineStart) * 12 + endMonth;
                    const duration = endMonthsFromBegin - startMonthsFromBegin;

                    const leftPercent = (startMonthsFromBegin / totalMonths) * 100;
                    const widthPercent = (duration / totalMonths) * 100;

                    const isActive = period.active;

                    return (
                      <div
                        key={pIndex}
                        className={`timeline-bar ${isActive ? 'active' : 'past'}`}
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`
                        }}
                        title={`${period.dosage} (${period.start} - ${period.end})`}
                      >
                        <span className="dosage-label">{period.dosage}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Labor;
