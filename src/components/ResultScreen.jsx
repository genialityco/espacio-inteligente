import Graph from './Graph';
import { SECTORES } from '../data/sectores.js';
import ecosistemaData from '../data/ecosistema_inteligente.json';

const METRICA_DEFS = [
  { key: 'seguridad',     label: 'Seguridad',     max: 3,  color: '#10b981' },
  { key: 'productividad', label: 'Productividad', max: 14, color: '#3b82f6' },
  { key: 'continuidad',   label: 'Continuidad',   max: 12, color: '#fbbf24' },
];

const RISK_LABELS = {
  critico: { label: 'Crítico', color: '#ef4444' },
  alto:    { label: 'Alto',    color: '#f59e0b' },
  medio:   { label: 'Medio',   color: '#fbbf24' },
};

function ScoreGauge({ score, color }) {
  const r = 80, cx = 100, cy = 100;
  const circ   = Math.PI * r;
  const offset = circ * (1 - score / 100);
  const stroke = color ?? (score >= 70 ? '#10b981' : score >= 40 ? '#fbbf24' : '#ef4444');
  return (
    <svg viewBox="0 0 200 118" className="rs-gauge-svg">
      <path d={`M ${cx-r},${cy} A ${r},${r} 0 0 1 ${cx+r},${cy}`}
        fill="none" stroke="#1e2d3d" strokeWidth="14" strokeLinecap="round" />
      <path d={`M ${cx-r},${cy} A ${r},${r} 0 0 1 ${cx+r},${cy}`}
        fill="none" stroke={stroke} strokeWidth="14" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="white"
        fontSize="38" fontWeight="800" fontFamily="Inter, sans-serif">{score}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="#94a3b8"
        fontSize="13" fontFamily="Inter, sans-serif">/ 100</text>
    </svg>
  );
}

export default function ResultScreen({ engineResult, selectedComponents, sector, onRestart }) {
  const si     = sector ? SECTORES[sector] : null;
  const estado = engineResult?.estado ?? 'fragmentado';
  const score  = engineResult?.score_global ?? 0;
  const accent = engineResult?.color === 'rojo'     ? '#ef4444'
               : engineResult?.color === 'amarillo' ? '#fbbf24' : '#10b981';

  const componentNames = (engineResult?._meta?.componentes_seleccionados ?? [])
    .map(id => ecosistemaData.componentes[id]?.nombre ?? id);
  const sinergias = engineResult?.sinergias_activadas ?? [];
  const riesgos   = engineResult?.riesgos ?? [];
  const acciones  = engineResult?.acciones_priorizadas ?? [];

  const hasPros = componentNames.length > 0 || sinergias.length > 0;
  const hasCons = riesgos.length > 0 || acciones.length > 0;

  const totalItems = componentNames.length + sinergias.length + riesgos.length + acciones.length;
  const density = totalItems <= 6 ? 'low' : totalItems >= 12 ? 'high' : 'medium';

  return (
    <div className="result-screen" data-density={density}>

      <button className="rs-restart-fixed" onClick={onRestart} title="Reiniciar demostración">↺</button>

      {/* ── 1. Header ── */}
      <div className="rs-header">
        {si && (
          <div className="rs-sector-badge" style={{ '--sector-color': si.color }}>
            {si.emoji}&nbsp;{si.nombre}
          </div>
        )}
        <p className="rs-eyebrow">Diagnóstico · Final</p>
      </div>

      {/* ── 2. Headline ── */}
      <div className="rs-headline-zone">
        <h1 className="rs-headline" style={{ color: accent }}>
          {engineResult?.narrativa?.headline ?? 'Diagnóstico completado'}
        </h1>
      </div>

      {/* ── 3. Score + Metrics ── */}
      <div className="rs-score-metrics">
        <div className="rs-gauge-col">
          <ScoreGauge score={score} color={accent} />
          <p className="rs-gauge-estado" style={{ color: accent }}>
            {estado.replace(/_/g, ' ')}
          </p>
        </div>
        <div className="rs-metrics-col">
          {METRICA_DEFS.map(({ key, label, max, color }) => {
            const val = engineResult?.metricas?.[key] ?? 0;
            const pct = Math.min(100, Math.round((val / max) * 100));
            return (
              <div key={key} className="rs-metric-row">
                <span className="rs-metric-label">{label}</span>
                <div className="rs-metric-track">
                  <div className="rs-metric-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="rs-metric-pct" style={{ color }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Graph ── */}
      <div className="rs-graph-zone">
        <Graph selectedComponents={selectedComponents} showSynergies={true} />
      </div>

      {/* ── 5. Verdict ── */}
      {(hasPros || hasCons) && (
        <div className={`rs-verdict${(!hasPros || !hasCons) ? ' rs-verdict--solo' : ''}`}>

          {hasPros && (
            <div className="rs-col rs-col-pros">
              <h3 className="rs-col-title rs-pros-title">Lo que logró</h3>
              {componentNames.length > 0 && (
                <ul className="rs-list">
                  {componentNames.map((n, i) => (
                    <li key={i} className="rs-item">
                      <span className="rs-item-dot" />{n}
                    </li>
                  ))}
                </ul>
              )}
              {sinergias.length > 0 && (
                <>
                  <p className="rs-subsection">Sinergias activas</p>
                  <ul className="rs-list">
                    {sinergias.map((s, i) => (
                      <li key={i} className="rs-item">
                        <span className="rs-item-dot rs-sinergia-dot" />{s.nombre}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {hasCons && (
            <div className="rs-col rs-col-cons">
              <h3 className="rs-col-title rs-cons-title">Oportunidades de mejora</h3>
              {riesgos.length > 0 && (
                <ul className="rs-list">
                  {riesgos.map((r, i) => {
                    const ri = RISK_LABELS[r.impacto] ?? RISK_LABELS.medio;
                    return (
                      <li key={i} className="rs-item">
                        <span className="rs-risk-badge" style={{ background: ri.color }}>{ri.label}</span>
                        {r.descripcion}
                      </li>
                    );
                  })}
                </ul>
              )}
              {acciones.length > 0 && (
                <>
                  <p className="rs-subsection">Próximos pasos con Open Group</p>
                  <ul className="rs-list">
                    {acciones.map((a, i) => (
                      <li key={i} className="rs-item">
                        <span className="rs-item-arrow">›</span>
                        <span>{a.accion}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

        </div>
      )}

      {/* ── 6. Footer ── */}
      <footer className="rs-footer">
        <img src="/CORTES/sponsors-sin-linea.png" alt="Sponsors" className="rs-sponsors" />
      </footer>

    </div>
  );
}
