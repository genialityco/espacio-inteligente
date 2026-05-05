import { useState } from 'react';

export default function IdleScreen({ onStart }) {
  const [flash, setFlash] = useState(false);

  const handleClick = () => {
    setFlash(true);
    setTimeout(onStart, 450);
  };

  return (
    <div className="stage" onClick={handleClick}>
      <div className="stage-content">
        <header className="stage-brand">
          <div className="brand-mark">
            <img src="/CORTES/LOGO-OPEN-FORUM.png" alt="Open Forum" className="brand-logo" />
          </div>
          <div className="business-line">Espacio Inteligente</div>
        </header>

        <div className="qqm-logo-wrap">
          <img src="/CORTES/LOGO_QQM.png" alt="Espacio Inteligente" className="qqm-logo" />
        </div>

        <section className="stage-hero">
          <div className="stage-eyebrow">El reto comienza ahora</div>
          <h1 className="stage-title">
            ¿Qué tan <span className="title-glow">inteligente</span> es<br/>
            tu ecosistema tecnológico?
          </h1>
          <div className="focus-wrap">
            <span className="ripple" aria-hidden="true" />
            <span className="ripple d2" aria-hidden="true" />
            <span className="ripple d3" aria-hidden="true" />
            <button className="focus-btn" aria-label="Toca para descubrir">
              <span className="btn-core">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5L8 5.5z" fill="currentColor"/>
                </svg>
              </span>
            </button>
          </div>
          <p className="cta-label">Toca para descubrir</p>

          <div className="idle-bottom">
            <img src="/CORTES/TEXTO_SLOGAN_INTRO.png" alt="Slogan" className="idle-slogan" />
            <img src="/CORTES/LOGO-OPEN-GROUP.png" alt="Open Group" className="idle-open-group-logo" />
          </div>
        </section>

        <footer className="stage-footer">
          <span className="stage-dot" />
          <span className="stage-footer-label">Listo para jugar</span>
          <span className="stage-dot" />
        </footer>
      </div>

      <div className={`stage-flash${flash ? ' go' : ''}`} aria-hidden="true" />
    </div>
  );
}
