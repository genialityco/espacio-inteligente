import { SECTORES } from '../data/sectores.js';

export default function SectorSelectScreen({ onSelect }) {
  const handleSectorClick = (sectorId) => {
    onSelect(sectorId);
  };

  return (
    <div className="ac-stage">

      <div className="ac-content">

        {/* ── Top bar ── */}
        <header className="ac-topbar">
          <div className="brand-mark">
            <span className="wordmark">OPEN <span className="accent">GROUP</span></span>
          </div>
          <div className="ac-step" aria-label="Paso 2 de 3">
            <span>Paso 02 / 03</span>
            <span className="ac-pips" aria-hidden="true">
              <span className="ac-pip on" />
              <span className="ac-pip on" />
              <span className="ac-pip" />
            </span>
          </div>
        </header>

        {/* ── Card ── */}
        <section className="ac-card">
          <div className="ac-card-head">
            <span className="ac-eyebrow">Espacio Inteligente · Reto</span>
            <h1 className="ac-title">¿A qué <span className="title-glow">sector</span> perteneces?</h1>
            <p className="ac-subtitle">Personalizamos tu reto según tu industria y contexto operativo.</p>
          </div>

          <div className="sector-select-grid">
            {Object.values(SECTORES).map(sector => (
              <button
                key={sector.id}
                className="sector-select-card"
                style={{ '--sector-color': sector.color }}
                onClick={() => handleSectorClick(sector.id)}
                aria-label={`Seleccionar sector: ${sector.nombre}`}
              >
                <span className="sector-select-emoji">{sector.emoji}</span>
                <span className="sector-select-nombre">{sector.nombre}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="ac-footer">
          <span aria-hidden="true">Elige tu contexto para personalizar los escenarios</span>
        </footer>

      </div>
    </div>
  );
}
