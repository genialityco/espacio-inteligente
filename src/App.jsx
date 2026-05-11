import { useState, useEffect, useMemo, useRef } from "react";
import { ref, set, update } from "firebase/database";
import ecosistemaData from "./data/ecosistema_inteligente.json";
import { SECTORES } from "./data/sectores.js";
import { evaluarEcosistema } from "./engine/index.js";
import Graph from "./components/Graph";
import IdleScreen from "./components/IdleScreen";
import RegisterScreen from "./components/RegisterScreen";
import SectorSelectScreen from "./components/SectorSelectScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import AppBackground from "./components/AppBackground";
import { db } from "./firebase.js";

const OPTION_LABELS = ["A", "B", "C", "D"];

const METRICA_DEFS = [
  { key: "seguridad", label: "Seguridad", max: 3, color: "#10b981" },
  { key: "productividad", label: "Productividad", max: 14, color: "#3b82f6" },
  { key: "continuidad", label: "Continuidad", max: 12, color: "#fbbf24" },
];

function ScoreGauge({ score }) {
  const r = 90;
  const cx = 120;
  const cy = 120;
  const circumference = Math.PI * r;
  const dashOffset = circumference * (1 - score / 100);
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#fbbf24" : "#ef4444";
  return (
    <svg viewBox="0 0 240 140" className="score-gauge">
      <path
        d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
        fill="none"
        stroke="#374151"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{
          transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fill="white"
        fontSize="40"
        fontWeight="800"
        fontFamily="Inter, sans-serif"
      >
        {score}
      </text>
      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="14"
        fontWeight="500"
        fontFamily="Inter, sans-serif"
      >
        / 100
      </text>
    </svg>
  );
}

function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function pickEliminatedIndices(opciones, correctIdx) {
  const bad = opciones.map((_, i) => i).filter((i) => i !== correctIdx);
  for (let i = bad.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bad[i], bad[j]] = [bad[j], bad[i]];
  }
  return bad.slice(0, 2);
}

export default function App() {
  const [view, setView] = useState("idle"); // idle · register · sector-select · onboarding · playing · wow · result
  const [sector, setSector] = useState(null);
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15.0);
  const [feedback, setFeedback] = useState(null); // { text, type: 'positive'|'warning'|'negative' }
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedAdvisor, setUsedAdvisor] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [advisorActive, setAdvisorActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const sessionIdRef = useRef(generateSessionId());

  const rondas = ecosistemaData.simulacion.rondas;

  const currentRound = (() => {
    const base = rondas[roundIdx];
    if (!sector) return base;
    const sr = SECTORES[sector].rondas[roundIdx];
    return {
      ...base,
      escenario: sr.escenario,
      opciones: base.opciones.map((opt, i) => ({
        ...opt,
        texto: sr.opciones[i].texto,
        impacto: sr.opciones[i].impacto,
      })),
    };
  })();

  const engineResult = useMemo(
    () => evaluarEcosistema(selectedComponents, ecosistemaData),
    [selectedComponents],
  );

  useEffect(() => {
    if (view !== "playing" || feedback !== null || paused) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          handleTimeout();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [view, feedback]);

  const handleTimeout = () => {
    const bad =
      currentRound.opciones.find((o) => o.tipo === "incorrecta") ??
      currentRound.opciones[2];
    handleOptionSelect(bad);
  };

  const handleOptionSelect = (option) => {
    if (option.componentes?.length > 0) {
      setSelectedComponents((prev) => [
        ...new Set([...prev, ...option.componentes]),
      ]);
    }
    const fbType =
      option.tipo === "suboptima"
        ? "warning"
        : option.tipo === "incorrecta"
          ? "negative"
          : "positive";
    setFeedback({ text: option.impacto, type: fbType });

    setTimeout(() => {
      setFeedback(null);
      setHiddenOptions([]);
      setAdvisorActive(false);
      if (roundIdx < rondas.length - 1) {
        setRoundIdx((r) => r + 1);
        setTimeLeft(15.0);
      } else {
        finishGame();
      }
    }, 3000);
  };

  const finishGame = () => {
    update(ref(db, `espacio-inteligente/sessions/${sessionIdRef.current}`), {
      sector,
      score: engineResult.score_global,
      estado: engineResult.estado,
      completedAt: Date.now(),
    }).catch(() => {});

    if (engineResult.evento_final.trigger) {
      setView("wow");
      setTimeout(() => setView("result"), 5000);
    } else {
      setView("result");
    }
  };

  const handleRegister = ({ nombre, empresa, rol, tamano }) => {
    sessionIdRef.current = generateSessionId();
    set(ref(db, `espacio-inteligente/sessions/${sessionIdRef.current}`), {
      nombre,
      empresa: empresa || null,
      rol: rol || null,
      tamano: tamano || null,
      startedAt: Date.now(),
    }).catch(() => {});
    setView("sector-select");
  };

  const handleRestart = () => {
    setView("idle");
    setSector(null);
    setSelectedComponents([]);
    setRoundIdx(0);
    setTimeLeft(15.0);
    setUsedFiftyFifty(false);
    setUsedAdvisor(false);
    setHiddenOptions([]);
    setAdvisorActive(false);
    setPaused(false);
  };

  const handleFiftyFifty = () => {
    if (usedFiftyFifty || feedback !== null) return;
    const correctIdx = currentRound.opciones.findIndex(
      (o) => o.tipo === "correcta",
    );
    setHiddenOptions(pickEliminatedIndices(currentRound.opciones, correctIdx));
    setUsedFiftyFifty(true);
  };

  const handleAdvisor = () => {
    if (usedAdvisor || feedback !== null) return;
    setUsedAdvisor(true);
    setAdvisorActive(true);
    setTimeLeft((prev) => prev + 15);
    setTimeout(() => setAdvisorActive(false), 4500);
  };

  // ── Build view content ─────────────────────────────
  let content;

  if (view === "idle") {
    content = <IdleScreen onStart={() => setView("register")} />;
  } else if (view === "register") {
    content = <RegisterScreen onRegister={handleRegister} />;
  } else if (view === "sector-select") {
    content = (
      <SectorSelectScreen
        onSelect={(sectorId) => {
          setSector(sectorId);
          setView("onboarding");
        }}
      />
    );
  } else if (view === "onboarding") {
    content = (
      <OnboardingScreen
        sector={sector}
        onStart={() => {
          setView("playing");
          setTimeLeft(15.0);
        }}
      />
    );
  } else if (view === "wow") {
    content = (
      <div className="app-container fullscreen-view wow-view">
        <h1>
          ROI Tecnológico
          <br />
          Maximizado
        </h1>
        <p
          className="subtitle"
          style={{ color: "rgba(255,255,255,0.85)", marginTop: "1.5rem" }}
        >
          Podrías reducir hasta 30% en costos operativos
          <br />y evitar el 90% de interrupciones.
        </p>
        <Graph selectedComponents={selectedComponents} showSynergies={true} />
      </div>
    );
  } else if (view === "result") {
    const si = SECTORES[sector];
    const accentColor =
      engineResult.color === "rojo"
        ? "var(--accent-red)"
        : "var(--accent-green)";
    content = (
      <div className="app-container fullscreen-view result-view">
        <div className="result-header">
          <div className="sector-badge">
            {si.emoji} {si.nombre}
          </div>
          <p className="result-eyebrow">Diagnóstico Final</p>
        </div>

        <ScoreGauge score={engineResult.score_global} />

        <div className="result-layout">
          <div className="result-left">
            <p className="result-headline" style={{ color: accentColor }}>
              {engineResult.narrativa.headline}
            </p>
            <p className="result-submsg">{engineResult.narrativa.submensaje}</p>

            <div className="metric-bars">
              {METRICA_DEFS.map(({ key, label, max, color }) => {
                const val = engineResult.metricas?.[key] ?? 0;
                const pct = Math.round((val / max) * 100);
                return (
                  <div key={key} className="metric-row">
                    <span className="metric-label">{label}</span>
                    <div className="metric-track">
                      <div
                        className="metric-fill"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                    <span className="metric-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="result-right">
            <div className="result-graph">
              <Graph
                selectedComponents={selectedComponents}
                showSynergies={true}
              />
            </div>
          </div>
        </div>

        <button className="restart-btn" onClick={handleRestart}>
          Reiniciar Demostración
        </button>
      </div>
    );
  } else {
    // ── PLAYING ──────────────────────────────────────
    const visibleTimeLeft = Math.max(0, timeLeft - 3);
    const progressPercent = (visibleTimeLeft / 12) * 100;
    let timerClass = "timer-bar";
    if (visibleTimeLeft < 5) timerClass += " warning";
    if (visibleTimeLeft < 2) timerClass += " danger";

    const activeRoundNodes = currentRound.opciones.flatMap(
      (o) => o.componentes ?? [],
    );

    content = (
      <div className="app-container playing-view">
        {feedback && (
          <div className={`feedback-banner feedback-${feedback.type}`}>
            {feedback.text}
          </div>
        )}

        <div className="right-panel">
          <div className="play-topbar">
            <img
              src="/CORTES/LOGO-OPEN-FORUM.png"
              alt="Open Forum"
              className="play-logo-forum"
            />
            <img
              src="/CORTES/LOGO_QQM.png"
              alt="Quién Quiere Trabajar en Equipo"
              className="play-logo-qqm"
            />
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
              <div className="score-label">
                {engineResult.estado.replace(/_/g, " ")}
              </div>
            </div>
          </div>
        </div>

        <div className="left-panel">
          <div className="panel-top-bar">
            <div className="round-progress">
              {rondas.map((_, i) => (
                <span
                  key={i}
                  className={`round-dot${i < roundIdx ? " done" : i === roundIdx ? " active" : ""}`}
                />
              ))}
            </div>
            <div className="timer-row">
              <div className="timer-container">
                <div
                  className={timerClass}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="timer-secs">{Math.ceil(visibleTimeLeft)}s</span>
            </div>
          </div>

          <div
            className="lifelines"
            role="group"
            aria-label="Ayudas disponibles"
          >
            <span className="lifelines-label">Ayudas</span>
            <button
              className={`lifeline-btn${usedFiftyFifty ? " used" : ""}`}
              disabled={usedFiftyFifty || feedback !== null}
              onClick={handleFiftyFifty}
              aria-label="50/50 — elimina dos opciones incorrectas"
              title="Elimina 2 opciones incorrectas"
            >
              <span className="lifeline-icon-text">50/50</span>
              {usedFiftyFifty && <span className="lifeline-used-mark">✓</span>}
            </button>
            <button
              className={`lifeline-btn${usedAdvisor ? " used" : ""}`}
              disabled={usedAdvisor || feedback !== null}
              onClick={handleAdvisor}
              aria-label="Llamar a un asesor — añade 15 segundos"
              title="Añade 15 segundos con ayuda de un asesor"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.19h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 5.76 5.76l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.19 16z" />
              </svg>
              <span>Asesor</span>
              {usedAdvisor && <span className="lifeline-used-mark">✓</span>}
            </button>
            <button
              className="debug-pause-btn"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Reanudar" : "Pausar"}
            >
              {paused ? "▶" : "⏸"}
            </button>
          </div>

          <div className="scenario-card">
            <h3>
              Escenario {roundIdx + 1} / {rondas.length}
              {sector && (
                <span className="round-sector-badge">
                  {SECTORES[sector].emoji}
                </span>
              )}
            </h3>
            <h2>{currentRound.escenario}</h2>
          </div>

          <div className="options-container">
            {currentRound.opciones.map((opt, i) => {
              const eliminated = hiddenOptions.includes(i);
              return (
                <button
                  key={i}
                  className={`option-btn${eliminated ? " eliminated" : ""}`}
                  disabled={feedback !== null || eliminated}
                  onClick={() => handleOptionSelect(opt)}
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
            <img
              src="/CORTES/LOGO-OPEN-GROUP.png"
              alt="Open Group"
              className="play-logo-group"
            />
            <img
              src="/CORTES/TEXTO_SLOGAN_INTRO.png"
              alt="Digitalización inteligente"
              className="play-slogan"
            />
          </footer>
        </div>

        {advisorActive && (
          <div className="advisor-toast" role="status" aria-live="polite">
            <div className="advisor-toast-icon" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.19h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 5.76 5.76l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.19 16z" />
              </svg>
            </div>
            <div className="advisor-toast-body">
              <p className="advisor-toast-title">Asesor conectado</p>
              <p className="advisor-toast-msg">
                +15 segundos para decidir con calma
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="global-bg">
      <AppBackground />
      <div className="global-vignette" aria-hidden="true" />
      {content}
    </div>
  );
}
