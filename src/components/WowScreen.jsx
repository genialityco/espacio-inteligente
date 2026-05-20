import { useEffect, useState } from 'react';
import Graph from './Graph';
import { SECTORES } from '../data/sectores.js';

const WOW_CONTENT = {
  ecosistema_inteligente: {
    eyebrow: 'ROI Tecnológico Maximizado',
    headline: 'Ecosistema Inteligente\nActivado',
    stat: '90%',
    statLabel: 'de interrupciones evitadas',
    highlight: 'Reducción de hasta 30% en costos operativos',
    color: '#10b981',
  },
  optimizado: {
    eyebrow: 'Buen Nivel de Integración',
    headline: 'Su Ecosistema\nEstá Optimizado',
    stat: '60%',
    statLabel: 'de riesgos bajo control',
    highlight: 'Un paso más para alcanzar máxima eficiencia',
    color: '#3b82f6',
  },
  parcial: {
    eyebrow: 'Ecosistema en Desarrollo',
    headline: 'Vas por\nBuen Camino',
    stat: '40%',
    statLabel: 'del ecosistema activado',
    highlight: 'Brechas identificadas — Open Group puede cerrarlas',
    color: '#fbbf24',
  },
  fragmentado: {
    eyebrow: 'Diagnóstico Detectado',
    headline: 'Su Infraestructura\nNecesita Atención',
    stat: 'Alto',
    statLabel: 'nivel de riesgo operativo',
    highlight: 'Open Group puede protegerte desde hoy',
    color: '#ef4444',
  },
};

export default function WowScreen({ engineResult, selectedComponents, sector, onContinue }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(onContinue, 5000);
    return () => clearTimeout(t);
  }, [onContinue]);

  const estado = engineResult?.estado ?? 'fragmentado';
  const wc = WOW_CONTENT[estado] ?? WOW_CONTENT.fragmentado;
  const si = sector ? SECTORES[sector] : null;
  const lines = wc.headline.split('\n');
  const score = engineResult?.score_global ?? 0;
  const stat = (estado === 'parcial' || estado === 'optimizado') ? `${score}%` : wc.stat;

  return (
    <div className={`wow-screen${visible ? ' wow-visible' : ''}`}>

      {/* ── 1. Header — sector badge + eyebrow ──────── */}
      <div className="wow-header">
        {si && (
          <div className="wow-sector-badge" style={{ '--sector-color': si.color }}>
            {si.emoji} {si.nombre}
          </div>
        )}
        <p className="wow-eyebrow" style={{ color: wc.color }}>{wc.eyebrow}</p>
      </div>

      {/* ── 2. Hero headline ─────────────────────────── */}
      <div className="wow-hero">
        <h1 className="wow-headline">
          {lines.map((l, i) => <span key={i}>{l}</span>)}
        </h1>
      </div>

      {/* ── 3. Stat + highlight — unified card ───────── */}
      <div className="wow-stats-card" style={{ '--wow-color': wc.color }}>
        <div className="wow-stat-main">
          <p className="wow-stat-value" style={{ color: wc.color }}>{stat}</p>
          <p className="wow-stat-label">{wc.statLabel}</p>
        </div>
        <div className="wow-stats-divider" />
        <p className="wow-highlight">{wc.highlight}</p>
      </div>

      {/* ── 4. Graph ─────────────────────────────────── */}
      <div className="wow-graph">
        <Graph selectedComponents={selectedComponents} showSynergies={true} />
      </div>

      {/* ── 5. Bottom — comparativa + score ────────── */}
      <div className="wow-bottom">
        <div className="wow-comparativa">
          <div className="wow-comp-row">
            <span className="wow-comp-tag wow-comp-antes">ANTES</span>
            <span>{engineResult?.comparativa?.antes ?? 'Infraestructura fragmentada'}</span>
          </div>
          <div className="wow-comp-row">
            <span className="wow-comp-tag wow-comp-despues">DESPUÉS</span>
            <span>{engineResult?.comparativa?.despues ?? 'Ecosistema integrado con Open Group'}</span>
          </div>
        </div>
        <p className="wow-score-note">
          Score final: <strong style={{ color: wc.color }}>{engineResult?.score_global ?? 0}</strong> / 100
          &nbsp;·&nbsp; {engineResult?.progreso?.mensaje ?? ''}
        </p>
      </div>

      {/* ── 6. Footer — logo | slogan ─────────── */}
      <div className="wow-footer">
        <img src="/CORTES/LOGO-OPEN-GROUP.png" alt="Open Group" className="wow-footer-logo" />
        <img src="/CORTES/TEXTO_SLOGAN_INTRO.png" alt="Digitalización inteligente" className="wow-footer-slogan" />
      </div>

    </div>
  );
}
