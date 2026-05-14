import { SECTORES } from '../data/sectores.js';

const SECTOR_ICONS = {
  salud:       '/CORTES/ICONOS/ICONOS-01-SALUD.png',
  educacion:   '/CORTES/ICONOS/ICONOS-02-EDUCACION.png',
  corporativo: '/CORTES/ICONOS/ICONOS-03-CORPORATIVO.png',
  industria:   '/CORTES/ICONOS/ICONOS-04-INDUSTRIA.png',
  financiero:  '/CORTES/ICONOS/ICONOS-05-FINANCIERO.png',
};

export default function SectorSelectScreen({ onSelect }) {
  return (
    <div className="ac-stage">
      <div className="sss-content">

        {/* Top bar */}
        <header className="sss-topbar">
          <img src="/CORTES/LOGO-OPEN-FORUM.png" alt="Open Forum" className="sss-logo-forum" />
          <div className="ac-step" aria-label="Paso 2 de 3">
            <span>PASO 02 / 03</span>
            <span className="ac-pips" aria-hidden="true">
              <span className="ac-pip on" />
              <span className="ac-pip on" />
              <span className="ac-pip" />
            </span>
          </div>
        </header>

        {/* QQM hero logo */}
        <div className="sss-hero">
          <img src="/CORTES/LOGO_QQM.png" alt="Quién Quiere Trabajar en Equipo" className="sss-logo-qqm" />
          <span className="ac-eyebrow sss-eyebrow-2l">
            <span>Espacio Inteligente</span>
            <span>Reto</span>
          </span>
        </div>

        {/* Heading */}
        <div className="sss-heading">
          <h1 className="ac-title">¿A qué <span className="title-glow">sector</span><br />perteneces?</h1>
          <p className="ac-subtitle">Personalizamos tu reto según tu industria<br />y contexto operativo.</p>
        </div>

        {/* Sector grid */}
        <div className="sss-grid">
          {Object.values(SECTORES).map(sector => (
            <button
              key={sector.id}
              className="sss-card"
              style={{ '--sector-color': sector.color }}
              onClick={() => onSelect(sector.id)}
              aria-label={`Seleccionar sector: ${sector.nombre}`}
            >
              <img src={SECTOR_ICONS[sector.id]} alt="" aria-hidden="true" className="sss-card-icon" />
              <span className="sss-card-nombre">{sector.nombre}</span>
            </button>
          ))}
        </div>

        {/* Hint */}
        <p className="sss-hint">Elige tu contexto para personalizar los escenarios</p>

        {/* Footer logos */}
        <footer className="sss-footer">
          <img src="/CORTES/LOGO-OPEN-GROUP.png" alt="Open Group" className="sss-logo-group" />
          <img src="/CORTES/TEXTO_SLOGAN_INTRO.png" alt="Digitalización inteligente, cómo la IA redefine las organizaciones." className="sss-slogan" />
        </footer>

      </div>
    </div>
  );
}
