import { useState, useEffect, useMemo, useRef } from "react";
import { ref, set, update } from "firebase/database";
import ecosistemaData from "./data/ecosistema_inteligente.json";
import { SECTORES } from "./data/sectores.js";
import { evaluarEcosistema } from "./engine/index.js";
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
    if (option.tipo === "correcta" && option.componentes?.length > 0) {
      setSelectedComponents((prev) => [
        ...new Set([...prev, ...option.componentes]),
      ]);
    }
    const fbType = option.tipo === "correcta" ? "positive" : "negative";
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

    setView("wow");
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
      <WowScreen
        engineResult={engineResult}
        selectedComponents={selectedComponents}
        sector={sector}
        onContinue={() => setView("result")}
      />
    );
  } else if (view === "result") {
    content = (
      <ResultScreen
        engineResult={engineResult}
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
        rondas={rondas}
        sector={sector}
        selectedComponents={selectedComponents}
        engineResult={engineResult}
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
      <AppBackground />
      <div className="global-vignette" aria-hidden="true" />
      {content}
    </div>
  );
}
