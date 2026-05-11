import { SECTORES } from '../data/sectores.js';

export default function OnboardingScreen({ sector, onStart }) {
  const si = SECTORES[sector];

  return (
    <div className="ac-stage">
      <div className="ob-content">

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

        {/* QQM hero */}
        <div className="ob-hero">
          <img src="/CORTES/LOGO_QQM.png" alt="Quién Quiere Trabajar en Equipo" className="sss-logo-qqm" />
        </div>

        {/* Misión */}
        <div className="ob-mission">
          <h1 className="ob-title">Tu Misión</h1>

          <div className="ob-badge" style={{ '--sector-color': si.color }}>
            <span>{si.emoji}</span>
            <span>{si.nombre}</span>
          </div>

          <div className="ob-reto" style={{ '--sector-color': si.color }}>
            <p className="ob-reto-text">{si.reto_central}</p>
          </div>

          <p className="ob-desc">
            Toma 6 decisiones clave en escenarios reales.<br />
            Construiremos tu ecosistema en tiempo real.<br />
            Tus decisiones cuestan. El tiempo corre.
          </p>
        </div>

        {/* CTA */}
        <button
          className="ob-cta"
          style={{ '--sector-color': si.color }}
          onClick={onStart}
        >
          COMENZAR SIMULACIÓN
        </button>

        {/* Footer */}
        <footer className="sss-footer">
          <img src="/CORTES/LOGO-OPEN-GROUP.png" alt="Open Group" className="sss-logo-group" />
          <img src="/CORTES/TEXTO_SLOGAN_INTRO.png" alt="Digitalización inteligente, cómo la IA redefine las organizaciones." className="sss-slogan" />
        </footer>

      </div>
    </div>
  );
}
