import Graph from './Graph';
import { SECTORES } from '../data/sectores.js';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function PlayingScreen({
  feedback,
  timeLeft,
  currentRound,
  roundIdx,
  rondas,
  sector,
  selectedComponents,
  engineResult,
  hiddenOptions,
  usedFiftyFifty,
  usedAdvisor,
  advisorActive,
  paused,
  onFiftyFifty,
  onAdvisor,
  onOptionSelect,
  onPauseToggle,
}) {
  const visibleTimeLeft = Math.max(0, timeLeft - 3);
  const progressPercent = (visibleTimeLeft / 12) * 100;
  let timerClass = 'timer-bar';
  if (visibleTimeLeft < 5) timerClass += ' warning';
  if (visibleTimeLeft < 2) timerClass += ' danger';

  const activeRoundNodes = currentRound.opciones.flatMap(o => o.componentes ?? []);

  return (
    <div className="app-container playing-view">
      {feedback && (
        <div className={`feedback-banner feedback-${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      {/* ── Grafo ── */}
      <div className="right-panel">
        <div className="play-topbar">
          <img src="/CORTES/LOGO-OPEN-FORUM.png" alt="Open Forum" className="play-logo-forum" />
          <img src="/CORTES/LOGO_QQM.png" alt="Quién Quiere Trabajar en Equipo" className="play-logo-qqm" />
        </div>
        <div className="right-panel-graph">
          <Graph
            selectedComponents={selectedComponents}
            activeRoundNodes={activeRoundNodes}
            showFade={true}
            showSynergies={true}
          />
          <div className="score-overlay">
            <div className="score-number">{engineResult.score_global}</div>
            <div className="score-label">{engineResult.estado.replace(/_/g, ' ')}</div>
          </div>
        </div>
      </div>

      {/* ── Preguntas y respuestas ── */}
      <div className="left-panel">
        <div className="panel-top-bar">
          <div className="panel-top-row">
            <div className="round-progress">
              {rondas.map((_, i) => (
                <span
                  key={i}
                  className={`round-dot${i < roundIdx ? ' done' : i === roundIdx ? ' active' : ''}`}
                />
              ))}
            </div>
            <span className="scenario-label">
              Escenario {roundIdx + 1} / {rondas.length}
              {sector && <span className="round-sector-badge">{SECTORES[sector].emoji}</span>}
            </span>
          </div>
          <div className="timer-row">
            <div className="timer-container">
              <div className={timerClass} style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="timer-secs">{Math.ceil(visibleTimeLeft)}s</span>
          </div>
        </div>

        <div className="lifelines" role="group" aria-label="Ayudas disponibles">
          <span className="lifelines-label">Ayudas</span>
          <button
            className={`lifeline-btn${usedFiftyFifty ? ' used' : ''}`}
            disabled={usedFiftyFifty || feedback !== null}
            onClick={onFiftyFifty}
            aria-label="50/50 — elimina dos opciones incorrectas"
            title="Elimina 2 opciones incorrectas"
          >
            <span className="lifeline-icon-text">50/50</span>
            {usedFiftyFifty && <span className="lifeline-used-mark">✓</span>}
          </button>
          <button
            className={`lifeline-btn${usedAdvisor ? ' used' : ''}`}
            disabled={usedAdvisor || feedback !== null}
            onClick={onAdvisor}
            aria-label="Llamar a un asesor — añade 15 segundos"
            title="Añade 15 segundos con ayuda de un asesor"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.19h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 5.76 5.76l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.19 16z" />
            </svg>
            <span>Asesor</span>
            {usedAdvisor && <span className="lifeline-used-mark">✓</span>}
          </button>
          <button
            className="debug-pause-btn"
            onClick={onPauseToggle}
            aria-label={paused ? 'Reanudar' : 'Pausar'}
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>

        <div className="scenario-card">
          <h2>{currentRound.escenario}</h2>
        </div>

        <div className="options-container">
          {currentRound.opciones.map((opt, i) => {
            const eliminated = hiddenOptions.includes(i);
            return (
              <button
                key={i}
                className={`option-btn${eliminated ? ' eliminated' : ''}`}
                disabled={feedback !== null || eliminated}
                onClick={() => onOptionSelect(opt)}
                aria-hidden={eliminated}
              >
                <span className="option-label">{OPTION_LABELS[i]}</span>
                <span className="option-text">{opt.texto}</span>
                {!eliminated && <span className="option-arrow">›</span>}
              </button>
            );
          })}
        </div>

        <footer className="play-footer">
          <img src="/CORTES/LOGO-OPEN-GROUP.png" alt="Open Group" className="play-logo-group" />
          <img src="/CORTES/TEXTO_SLOGAN_INTRO.png" alt="Digitalización inteligente" className="play-slogan" />
        </footer>
      </div>

      {advisorActive && (
        <div className="advisor-toast" role="status" aria-live="polite">
          <div className="advisor-toast-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.19h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 5.76 5.76l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.19 16z" />
            </svg>
          </div>
          <div className="advisor-toast-body">
            <p className="advisor-toast-title">Asesor conectado</p>
            <p className="advisor-toast-msg">+15 segundos para decidir con calma</p>
          </div>
        </div>
      )}
    </div>
  );
}
