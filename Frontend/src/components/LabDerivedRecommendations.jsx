import { useEffect, useState, useMemo } from 'react';
import { FaFlask, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { BACKEND_PATIENT_MAP, fetchLabValues } from '../api/labApi';
import './LabDerivedRecommendations.css';

// Vom Lab → Prävention abgeleitete Empfehlungen.
//
// Idee (Demo-Niveau, noch nicht produktiv): aus dem letzten Lab-Wert pro
// Parameter wird eine kleine Regel ausgewertet, die — wenn sie zutrifft —
// eine konkrete Vorsorge-Empfehlung mit Quelle und vorgeschlagenem Intervall
// vorschlägt. Bewusst hardcodiert + quellenbasiert (keine Halluzinationen),
// damit Brodbeck/Neala die Kuratierung diskutieren können.
//
// Erweitern = neue Regel ins RULES-Array. Voraussetzung: der Parameter muss
// im Backend-Endpoint mit `loinc` ausgeliefert werden (passiert seit dieser
// Phase). Empfehlungen sind explizit *demonstrativ* — produktiv würde das
// von einem klinischen Decision-Support-Modul kommen, nicht von einer App.

const RULES = [
  {
    id: 'lipid-ldl-borderline',
    loinc: '2089-1',
    label: 'LDL-Cholesterin',
    matches: (m) => m.value > 3.0,
    title: 'Lipidkontrolle in 6 Monaten',
    rationale: (m) =>
      `LDL ${m.value} ${m.unit} liegt über dem ESC/EAS-Zielwert für gesunde Erwachsene (< 3,0 mmol/L).`,
    recommendation:
      'Re-Check Lipidprofil + Beratung zu Ernährung, Bewegung und ggf. Rauchstopp.',
    source: 'ESC/EAS-Leitlinie 2019 (Dyslipidämie)',
    interval: '6 Monate',
    category: 'Vorsorge',
  },
  {
    id: 'chol-borderline',
    loinc: '2093-3',
    label: 'Cholesterin gesamt',
    matches: (m) => m.value > 5.0,
    title: 'Gesamt-Cholesterin grenzwertig',
    rationale: (m) =>
      `Gesamt-Cholesterin ${m.value} ${m.unit} überschreitet den Zielwert (< 5,0 mmol/L). Bei kardiovaskulärem Risiko detailliertes Lipidprofil sinnvoll.`,
    recommendation:
      'Lebensstil-Beratung; bei Familienanamnese oder Risikofaktoren erweitertes Lipidpanel.',
    source: 'NCEP / ESC 2019',
    interval: '6 Monate',
    category: 'Vorsorge',
  },
  {
    id: 'vitd-suboptimal',
    loinc: '14635-7',
    label: '25-OH Vitamin D',
    matches: (m) => m.value < 75,
    title: 'Vitamin-D-Substitution erwägen',
    rationale: (m) =>
      `25-OH Vitamin D ${m.value} ${m.unit} liegt unter dem optimalen Bereich (BAG/EEK: ≥ 75 nmol/L). Bei < 50 nmol/L gilt Mangel.`,
    recommendation:
      'Substitution in den Wintermonaten (z. B. 800–2000 IE/Tag) + Re-Kontrolle in 3 Monaten.',
    source: 'BAG / Eidg. Ernährungskommission 2021',
    interval: '3 Monate',
    category: 'Vorsorge',
  },
  {
    id: 'hba1c-prediabetes',
    loinc: '4548-4',
    label: 'HbA1c',
    matches: (m) => m.value >= 5.7,
    title: 'Glukose-Monitoring + Lebensstil',
    rationale: (m) =>
      `HbA1c ${m.value} ${m.unit} fällt in den Prädiabetes-Bereich (5,7–6,4 %).`,
    recommendation:
      'Ernährungs- und Bewegungs-Intervention; HbA1c-Re-Kontrolle in 6 Monaten.',
    source: 'ADA / SGED Konsensus',
    interval: '6 Monate',
    category: 'Screening',
  },
  {
    id: 'crp-elevated',
    loinc: '1988-5',
    label: 'CRP',
    matches: (m) => m.value > 5,
    title: 'CRP-Re-Kontrolle',
    rationale: (m) =>
      `CRP ${m.value} ${m.unit} ist erhöht. Hinweis auf akute Entzündung — Verlauf prüfen.`,
    recommendation:
      'Re-Kontrolle in 2–4 Wochen. Bei Persistenz Abklärung der Entzündungsursache.',
    source: 'Klinische Standardpraxis',
    interval: '4 Wochen',
    category: 'Check-up',
  },
  {
    id: 'hb-low',
    loinc: '718-7',
    label: 'Hämoglobin',
    matches: (m) => m.value < 13.5, // hier vereinfacht ohne Geschlecht
    title: 'Eisenstatus prüfen',
    rationale: (m) =>
      `Hämoglobin ${m.value} ${m.unit} unter der Norm. Eisenmangel als häufige Ursache abklären.`,
    recommendation:
      'Ergänzendes Eisen-Panel (Ferritin, Transferrin-Sättigung) + Ernährungsanamnese.',
    source: 'WHO-Anämie-Kriterien',
    interval: '1 Monat',
    category: 'Check-up',
  },
];

const CATEGORY_COLOR = {
  Vorsorge: '#9c27b0',
  Screening: '#3498db',
  'Check-up': '#27ae60',
};

function LabDerivedRecommendations({ userId }) {
  const backendId = BACKEND_PATIENT_MAP[userId];
  const [labs, setLabs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!backendId) return;
    setLoading(true);
    fetchLabValues(backendId)
      .then(setLabs)
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));
  }, [backendId]);

  // Pro Regel den jüngsten passenden Messwert finden (Backend liefert
  // measurements pro Parameter desc nach Datum sortiert).
  const triggered = useMemo(() => {
    if (!labs) return [];
    const out = [];
    for (const rule of RULES) {
      const lab = labs.find((l) => l.loinc === rule.loinc);
      const latest = lab?.measurements?.[0];
      if (!latest) continue;
      if (rule.matches(latest)) {
        out.push({ rule, measurement: latest, lab });
      }
    }
    return out;
  }, [labs]);

  if (!backendId) return null; // nur für Personas mit Backend-Anbindung

  return (
    <section className="lab-derived">
      <div className="lab-derived-head">
        <div>
          <h2><FaFlask /> Aus deinen Labordaten abgeleitet</h2>
          <p className="lab-derived-sub">
            Konkrete Vorsorge-Hinweise auf Basis deiner aktuellen Werte —
            kuratiert und quellenbasiert.{' '}
            <em>Demo, ersetzt keine ärztliche Beurteilung.</em>
          </p>
        </div>
      </div>

      {loading && (
        <div className="lab-derived-status">Lade Labordaten …</div>
      )}
      {error && (
        <div className="lab-derived-status err">Backend nicht erreichbar: {error}</div>
      )}
      {!loading && !error && labs && labs.length === 0 && (
        <div className="lab-derived-empty">
          <FaInfoCircle />
          <span>
            Noch keine Labordaten vorhanden. Sobald du einen Befund hochlädst, erscheinen
            hier passende Empfehlungen.
          </span>
        </div>
      )}
      {!loading && !error && labs && labs.length > 0 && triggered.length === 0 && (
        <div className="lab-derived-empty success">
          <FaCheckCircle />
          <span>
            Aktuell keine auffälligen Befunde — alle ausgewerteten Parameter im
            empfohlenen Bereich. (Werte gegen {RULES.length} kuratierte Regeln geprüft.)
          </span>
        </div>
      )}

      {triggered.length > 0 && (
        <div className="lab-derived-grid">
          {triggered.map(({ rule, measurement }) => (
            <article key={rule.id} className="lab-derived-card">
              <div
                className="lab-derived-cat"
                style={{ background: `${CATEGORY_COLOR[rule.category]}1a`, color: CATEGORY_COLOR[rule.category] }}
              >
                {rule.category}
              </div>
              <h3>{rule.title}</h3>
              <div className="lab-derived-trigger">
                <strong>{rule.label}:</strong>{' '}
                <span className="lab-derived-val">{measurement.value} {measurement.unit}</span>{' '}
                <span className="lab-derived-date">({measurement.date})</span>
              </div>
              <p className="lab-derived-why">{rule.rationale(measurement)}</p>
              <div className="lab-derived-rec">
                <strong>Empfehlung:</strong> {rule.recommendation}
              </div>
              <div className="lab-derived-foot">
                <span className="lab-derived-interval">Vorgeschlagenes Intervall: <strong>{rule.interval}</strong></span>
                <span className="lab-derived-source" title={rule.source}>
                  <FaInfoCircle /> {rule.source}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default LabDerivedRecommendations;
