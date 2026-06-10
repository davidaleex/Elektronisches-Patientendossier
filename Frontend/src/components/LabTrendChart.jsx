import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import './LabTrendChart.css';

// Verlaufskurven aus DENSELBEN Messdaten wie die Tabelle (Prop `labs`), damit die
// Datenpunkte exakt zu den echten Laborwerten passen. Jeder Parameter mit mind.
// zwei Messungen wird als kleine Verlaufskurve mit gestrichelten Referenz-Strichen
// gezeichnet.

// "DD.MM.YYYY" → Date (zum Sortieren).
function parseDate(s) {
  const [d, m, y] = String(s).split('.').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

// Referenzbereich-String → { low, high }. Deckt "12-16", "12–16", "< 50", "> 1.0" ab.
function parseRange(str) {
  if (!str) return {};
  const s = String(str).replace(',', '.');
  if (s.includes('<')) {
    const n = parseFloat(s.replace('<', ''));
    return Number.isFinite(n) ? { high: n } : {};
  }
  if (s.includes('>')) {
    const n = parseFloat(s.replace('>', ''));
    return Number.isFinite(n) ? { low: n } : {};
  }
  const parts = s.split(/[-–]/).map((p) => parseFloat(p.trim()));
  if (parts.length === 2 && parts.every(Number.isFinite)) {
    return { low: parts[0], high: parts[1] };
  }
  return {};
}

function TrendCard({ param }) {
  // Messungen chronologisch sortieren.
  const points = [...(param.measurements || [])]
    .map((m) => ({ date: m.date, value: m.value }))
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));

  if (points.length < 2) return null; // ohne ≥2 Punkte kein Verlauf

  const unit = param.measurements[0]?.unit || '';
  // Referenz primär aus der (alters-/geschlechtsabhängigen) ageReference, sonst aus dem Mess-Range.
  const refStr = param.ageReference?.range || param.measurements[0]?.referenceRange;
  const { low, high } = parseRange(refStr);

  return (
    <div className="trend-card">
      <h3>
        {param.name} <span className="trend-unit">{unit}</span>
      </h3>
      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={points} margin={{ top: 10, right: 18, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          {/* Y-Achse immer bei 0 starten — sonst spreizt Recharts auf den
              kleinsten Wert und täuscht eine grössere Differenz vor. */}
          <YAxis tick={{ fontSize: 11 }} domain={[0, 'auto']} />
          <Tooltip formatter={(v) => [`${v} ${unit}`, param.name]} />

          <Line
            type="monotone"
            dataKey="value"
            name={param.name}
            stroke="#2980b9"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />

          {/* Referenz-Striche (gestrichelt grün) */}
          {low !== undefined && (
            <ReferenceLine
              y={low}
              stroke="#27ae60"
              strokeDasharray="6 4"
              label={{ value: `Unter ${low}`, position: 'insideBottomRight', fontSize: 10, fill: '#27ae60' }}
            />
          )}
          {high !== undefined && (
            <ReferenceLine
              y={high}
              stroke="#e74c3c"
              strokeDasharray="6 4"
              label={{ value: `Über ${high}`, position: 'insideTopRight', fontSize: 10, fill: '#e74c3c' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// labs = dasselbe Array wie in der Tabelle: [{ name, measurements:[{date,value,unit,referenceRange}], ageReference }]
function LabTrendChart({ labs }) {
  const params = (labs || []).filter((p) => (p.measurements || []).length >= 2);

  if (params.length === 0) {
    return (
      <div className="trend-empty">
        Für diese Person gibt es noch keine Werte mit mehreren Messzeitpunkten —
        ein Verlauf braucht mindestens zwei Messungen desselben Parameters.
      </div>
    );
  }

  return (
    <div className="trend-grid">
      {params.map((p) => (
        <TrendCard key={p.loinc || p.name} param={p} />
      ))}
    </div>
  );
}

export default LabTrendChart;
