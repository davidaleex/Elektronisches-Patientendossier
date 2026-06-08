import { useState, useMemo } from 'react';
import './LabValuesTable.css';

// Wide date-union Tabelle für Lab-Werte. Wird sowohl auf der Patient-Sicht
// (Labor-Tab) als auch in der Arzt-Patient-Detail-Sicht verwendet — beide
// lesen dieselben Backend-Daten, also macht eine geteilte Komponente Sinn.
//
// Erwartete Form von `labs` (= Response von GET /api/patients/<id>/lab-values/):
//   [{ name, category, ageReference?, measurements: [
//        { date, value, unit, referenceRange, status }
//   ]}]
// Statische Frontend-Mocks (für Personas ohne Backend) haben dieselbe Form.

// Englische Backend-Kategorien → deutsche Anzeige (Decision #10).
const CATEGORY_DE = {
  'Hematology': 'Hämatologie',
  'Metabolism': 'Stoffwechsel',
  'Lipids': 'Lipide',
  'Inflammation': 'Entzündung',
  'Endocrinology': 'Endokrinologie',
  'Kidney & Liver': 'Niere & Leber',
  'Other': 'Sonstige',
};

const STATUS_COLOR = {
  good: '#27ae60',
  elevated: '#f39c12',
  warning: '#e74c3c',
};
const STATUS_ICON = {
  good: '✓',
  elevated: '⚠',
  warning: '🔴',
};

function parseLabDate(d) {
  const [day, month, year] = (d || '').split('.').map(Number);
  return new Date(year || 0, (month || 1) - 1, day || 1);
}

function LabValuesTable({ labs, showLegend = true }) {
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  const normalizedLabs = useMemo(
    () => labs.map(l => ({ ...l, category: CATEGORY_DE[l.category] || l.category })),
    [labs],
  );

  const categories = useMemo(
    () => ['Alle', ...new Set(normalizedLabs.map(l => l.category))],
    [normalizedLabs],
  );

  const filteredLabs = useMemo(() => {
    if (selectedCategory === 'Alle') return normalizedLabs;
    return normalizedLabs.filter(l => l.category === selectedCategory);
  }, [selectedCategory, normalizedLabs]);

  // Datums-Union über alle gefilterten Parameter — neueste Spalte links.
  const allDates = useMemo(() => {
    const set = new Set();
    filteredLabs.forEach(lab =>
      (lab.measurements || []).forEach(m => set.add(m.date)),
    );
    return [...set].sort((a, b) => parseLabDate(b) - parseLabDate(a));
  }, [filteredLabs]);

  return (
    <>
      {categories.length > 1 && (
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
      )}

      <div className="labor-table-container">
        <div className="labor-table-wrapper">
          <table className="labor-table">
            <thead>
              <tr>
                <th className="sticky-col">Laborwert</th>
                {allDates.map((date, i) => <th key={i}>{date}</th>)}
                <th className="reference-col">Referenz</th>
              </tr>
            </thead>
            <tbody>
              {filteredLabs.map((labValue, labIndex) => {
                const byDate = Object.fromEntries(
                  (labValue.measurements || []).map(m => [m.date, m]),
                );
                const refM = (labValue.measurements || []).find(m => m.referenceRange)
                  || labValue.measurements?.[0];

                return (
                  <tr key={labIndex}>
                    <td className="sticky-col lab-name-cell">
                      <div className="lab-name">{labValue.name}</div>
                      <div className="lab-category">{labValue.category}</div>
                    </td>
                    {allDates.map((date, di) => {
                      const m = byDate[date];
                      if (!m) {
                        return (
                          <td
                            key={di}
                            className="value-cell"
                            style={{ textAlign: 'center', color: '#c0c7ce' }}
                          >–</td>
                        );
                      }
                      const color = STATUS_COLOR[m.status] || '#95a5a6';
                      const icon = STATUS_ICON[m.status] || '';
                      return (
                        <td
                          key={di}
                          className={`value-cell status-${m.status}`}
                          style={{
                            backgroundColor: m.status !== 'good' ? `${color}15` : 'transparent',
                            borderLeft: `3px solid ${color}`,
                          }}
                        >
                          <div className="value-wrapper">
                            <span className="value-number">{m.value}</span>
                            <span className="value-unit">{m.unit}</span>
                            <span className="status-icon">{icon}</span>
                          </div>
                        </td>
                      );
                    })}
                    <td className="reference-col">
                      {labValue.ageReference ? (
                        <>
                          <div>{labValue.ageReference.range} {labValue.ageReference.unit}</div>
                          <div
                            className="ref-agegroup"
                            style={{ fontSize: '0.72rem', color: '#7a8794', cursor: 'help' }}
                            title={`Quelle: ${labValue.ageReference.source}`}
                          >
                            ({labValue.ageReference.ageGroup}) ⓘ
                          </div>
                        </>
                      ) : (
                        <span>{refM?.referenceRange} {refM?.unit}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLabs.length === 0 && (
          <div className="no-data">
            <p>Keine Laborwerte für diese Kategorie verfügbar</p>
          </div>
        )}
      </div>

      {showLegend && (
        <div className="labor-legend">
          <h3>Legende</h3>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: STATUS_COLOR.good }} />
              <span>Im Normbereich</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: STATUS_COLOR.elevated }} />
              <span>Leicht erhöht/erniedrigt</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: STATUS_COLOR.warning }} />
              <span>Deutlich ausserhalb der Norm</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LabValuesTable;
