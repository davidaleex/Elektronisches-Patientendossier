import { useState, useEffect, useCallback } from 'react';
import './Pages.css';
import './Labor.css';
import { useUser } from '../context/UserContext';
import { labValuesData } from '../data/labValuesData';
import { BACKEND_PATIENT_MAP, fetchLabValues } from '../api/labApi';
import LabReportUpload from '../components/LabReportUpload';
import LabValuesTable from '../components/LabValuesTable';
import LabTrendChart from '../components/LabTrendChart';

function Labor() {
  const { currentUser } = useUser();

  // Ansicht der Laborwerte: Tabelle (Detail) vs. Verlauf (Trend-Kurven).
  const [view, setView] = useState('table'); // 'table' | 'chart'

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
        setBackendLabValues(data);
        setLoading(false);
      })
      .catch(err => {
        setError(String(err.message || err));
        setLoading(false);
      });
  }, [backendId]);

  useEffect(() => { loadLabValues(); }, [loadLabValues]);

  // Backend ist Source of Truth, sobald erreichbar — auch wenn (noch) leer.
  // So startet eine Persona ohne Daten leer und ein Live-Upload füllt Tabelle +
  // Verlauf sichtbar. Der Mock greift nur als Offline-Fallback (Django aus → null).
  const mockLabValues = labValuesData[currentUser.id] || [];
  const userLabValues = backendLabValues ?? mockLabValues;

  // Medikamenten Timeline
  const medicationTimeline = currentUser.healthData?.medicationTimeline || [];

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

      {/* Umschalter Tabelle / Verlauf — oberhalb der Laborwerte. */}
      <div className="lab-view-toggle">
        <button
          className={view === 'table' ? 'active' : ''}
          onClick={() => setView('table')}
        >
          📊 Tabelle
        </button>
        <button
          className={view === 'chart' ? 'active' : ''}
          onClick={() => setView('chart')}
        >
          📈 Verlauf
        </button>
      </div>

      {view === 'table' ? (
        /* Geteilte Tabelle (Filter + Datums-Union + Legende) — auch in der Arzt-Sicht. */
        <LabValuesTable labs={userLabValues} />
      ) : (
        /* Verlaufskurven aus denselben Messdaten wie die Tabelle (passt 1:1). */
        <LabTrendChart labs={userLabValues} />
      )}

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
