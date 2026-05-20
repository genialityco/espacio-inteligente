import { useState, useEffect, useMemo, useRef } from "react";
import { ref, set, update } from "firebase/database";
import ecosistemaData from "./data/ecosistema_inteligente.json";
import { evaluarEcosistema } from "./engine/index.js";
import { seleccionarPreguntas } from "./engine/cuestionario.js";
import IdleScreen from "./components/IdleScreen";
import RegisterScreen from "./components/RegisterScreen";
import SectorSelectScreen from "./components/SectorSelectScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import PlayingScreen from "./components/PlayingScreen";
import WowScreen from "./components/WowScreen";
import ResultScreen from "./components/ResultScreen";
import AppBackground from "./components/AppBackground";
import { db } from "./firebase.js";


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

// Convierte una pregunta del cuestionario al formato que PlayingScreen espera.
// Las opciones ya tienen tipo/componentes/impacto en el JSON, así que es un mapeo directo.
function preguntaToRonda(pregunta) {
  if (!pregunta) return null;
  return {
    escenario: pregunta.pregunta,
    opciones: pregunta.opciones.map((opt) => ({
      texto: opt.texto,
      tipo: opt.tipo,           // 'correcta' | 'incorrecta'
      componentes: opt.componentes ?? [],
      impacto: opt.impacto,
    })),
  };
}

export default function App() {
  const [view, setView] = useState("idle"); // idle · register · sector-select · onboarding · playing · wow · result
  const [sector, setSector] = useState(null);
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [timeLeft, setTimeLeft] = useState(19.0);
  const [feedback, setFeedback] = useState(null); // { text, type: 'positive'|'negative' }
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedAdvisor, setUsedAdvisor] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [advisorActive, setAdvisorActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [cuestionarioPreguntas, setCuestionarioPreguntas] = useState([]);
  const [scoreModifier, setScoreModifier] = useState(0);
  const sessionIdRef = useRef(generateSessionId());
  const adjustedEngineResultRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current?.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (view !== "idle" && audioRef.current?.paused) {
      audioRef.current.play().catch(() => {});
    }
  }, [view]);

  const currentRound = preguntaToRonda(cuestionarioPreguntas[roundIdx]);

  // Score en vivo: el motor evalúa los componentes seleccionados hasta el momento.
  const engineResult = useMemo(
    () => evaluarEcosistema(selectedComponents, ecosistemaData),
    [selectedComponents],
  );

  // Penalización por respuestas incorrectas en preguntas de conocimiento (unica_correcta).
  const adjustedEngineResult = useMemo(() => {
    if (scoreModifier === 0) return engineResult;
    const adj = Math.max(0, Math.min(100, engineResult.score_global + scoreModifier));
    return { ...engineResult, score_global: adj };
  }, [engineResult, scoreModifier]);

  const finishGame = () => {
    const result = adjustedEngineResultRef.current ?? adjustedEngineResult;
    update(ref(db, `espacio-inteligente/sessions/${sessionIdRef.current}`), {
      sector,
      score: result.score_global,
      estado: result.estado,
      completedAt: Date.now(),
    }).catch(() => {});

    setView("wow");
  };

  const handleOptionSelect = (option) => {
    if (option.tipo === "correcta" && option.componentes?.length > 0) {
      setSelectedComponents((prev) => [
        ...new Set([...prev, ...option.componentes]),
      ]);
    }
    // Penalizar respuestas incorrectas en preguntas de conocimiento.
    if (cuestionarioPreguntas[roundIdx]?.tipo === "unica_correcta" && option.tipo === "incorrecta") {
      setScoreModifier((prev) => prev - 15);
    }
    const fbType = option.tipo === "correcta" ? "positive" : "negative";
    setFeedback({ text: option.impacto, type: fbType });

    setTimeout(() => {
      setFeedback(null);
      setHiddenOptions([]);
      setAdvisorActive(false);
      if (roundIdx < cuestionarioPreguntas.length - 1) {
        setRoundIdx((r) => r + 1);
        setTimeLeft(19.0);
      } else {
        finishGame();
      }
    }, 3000);
  };

  const handleTimeoutRef = useRef(null);

  // Sin deps: mantiene los refs actualizados tras cada render para evitar closures stale.
  useEffect(() => {
    adjustedEngineResultRef.current = adjustedEngineResult;
    handleTimeoutRef.current = () => {
      const bad =
        currentRound?.opciones.find((o) => o.tipo === "incorrecta") ??
        currentRound?.opciones[0];
      if (bad) handleOptionSelect(bad);
    };
  });

  useEffect(() => {
    if (view !== "playing" || feedback !== null || paused) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          handleTimeoutRef.current?.();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [view, feedback, paused]);

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
    setCuestionarioPreguntas([]);
    setRoundIdx(0);
    setTimeLeft(19.0);
    setScoreModifier(0);
    setUsedFiftyFifty(false);
    setUsedAdvisor(false);
    setHiddenOptions([]);
    setAdvisorActive(false);
    setPaused(false);
  };

  const handleFiftyFifty = () => {
    if (usedFiftyFifty || feedback !== null) return;
    // 50/50 solo aplica cuando hay opciones incorrectas (preguntas unica_correcta).
    if (!currentRound?.opciones.some((o) => o.tipo === "incorrecta")) return;
    const correctIdx = currentRound.opciones.findIndex((o) => o.tipo === "correcta");
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
          setCuestionarioPreguntas(seleccionarPreguntas());
          setSelectedComponents([]);
          setRoundIdx(0);
          setView("playing");
          setTimeLeft(19.0);
        }}
      />
    );
  } else if (view === "wow") {
    content = (
      <WowScreen
        engineResult={adjustedEngineResult}
        selectedComponents={selectedComponents}
        sector={sector}
        onContinue={() => setView("result")}
      />
    );
  } else if (view === "result") {
    content = (
      <ResultScreen
        engineResult={adjustedEngineResult}
        selectedComponents={selectedComponents}
        sector={sector}
        onRestart={handleRestart}
      />
    );
  } else {
    content = (
      <PlayingScreen
        feedback={feedback}
        timeLeft={timeLeft}
        currentRound={currentRound}
        roundIdx={roundIdx}
        rondas={cuestionarioPreguntas}
        sector={sector}
        selectedComponents={selectedComponents}
        engineResult={adjustedEngineResult}
        hiddenOptions={hiddenOptions}
        usedFiftyFifty={usedFiftyFifty}
        usedAdvisor={usedAdvisor}
        advisorActive={advisorActive}
        paused={paused}
        onFiftyFifty={handleFiftyFifty}
        onAdvisor={handleAdvisor}
        onOptionSelect={handleOptionSelect}
        onPauseToggle={() => setPaused((p) => !p)}
      />
    );
  }

  return (
    <div className="global-bg">
      <audio ref={audioRef} src="/music-opg.mpeg" loop preload="auto" />
      <AppBackground />
      <div className="global-vignette" aria-hidden="true" />
      {content}
    </div>
  );
}
