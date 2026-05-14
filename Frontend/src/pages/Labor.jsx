import { useState, useMemo } from 'react';
import './Pages.css';
import './Labor.css';
import { useUser } from '../context/UserContext';
import { labValuesData } from '../data/labValuesData';

function Labor() {
  const { currentUser } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [selectedLabValue, setSelectedLabValue] = useState(null);

  // Labor-Daten für aktuellen User
  const userLabValues = labValuesData[currentUser.id] || [];

  // Medikamenten Timeline
  const medicationTimeline = currentUser.healthData?.medicationTimeline || [];

  // Kategorien extrahieren
  const categories = ['Alle', ...new Set(userLabValues.map(lab => lab.category))];

  // Gefilterte Labor-Werte
  const filteredLabValues = useMemo(() => {
    if (selectedCategory === 'Alle') return userLabValues;
    return userLabValues.filter(lab => lab.category === selectedCategory);
  }, [selectedCategory, userLabValues]);

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
                {/* Dynamische Datums-Spalten basierend auf ersten Eintrag */}
                {filteredLabValues.length > 0 && filteredLabValues[0].measurements.map((measurement, index) => (
                  <th key={index}>{measurement.date}</th>
                ))}
                <th className="reference-col">Referenz</th>
              </tr>
            </thead>
            <tbody>
              {filteredLabValues.map((labValue, labIndex) => (
                <tr
                  key={labIndex}
                  onClick={() => setSelectedLabValue(selectedLabValue === labIndex ? null : labIndex)}
                  className={selectedLabValue === labIndex ? 'selected' : ''}
                >
                  <td className="sticky-col lab-name-cell">
                    <div className="lab-name">{labValue.name}</div>
                    <div className="lab-category">{labValue.category}</div>
                  </td>
                  {labValue.measurements.map((measurement, measurementIndex) => {
                    const statusColor = getStatusColor(measurement.status);
                    const statusIcon = getStatusIcon(measurement.status);

                    return (
                      <td
                        key={measurementIndex}
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
                    {labValue.measurements[0].referenceRange} {labValue.measurements[0].unit}
                  </td>
                </tr>
              ))}
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
