
// Coordenadas en un ViewBox de 800x800, centro en 400,400
const NODE_LAYOUT = {
  equipos_computo:          { x: 200, y: 400, label: "Equipos",      color: "#3b82f6" },
  mobiliario:               { x: 250, y: 550, label: "Mobiliario",   color: "#ec4899" },
  software_colaboracion:    { x: 400, y: 200, label: "Colaboración", color: "#8b5cf6" },
  perifericos_colaboracion: { x: 250, y: 250, label: "Periféricos",  color: "#f59e0b" },
  seguridad_endpoint:       { x: 550, y: 250, label: "Seguridad",    color: "#10b981" },
  backup:                   { x: 600, y: 400, label: "Backup",       color: "#06b6d4" },
  soporte_servicios:        { x: 550, y: 550, label: "Soporte",      color: "#f59e0b" },
  modelo_daas:              { x: 400, y: 600, label: "DaaS",         color: "#6366f1" },
};

const CX = 400, CY = 400;

export default function Graph({ selectedComponents = [], activeRoundNodes = [], showFade = false, showSynergies = false }) {

  const synergies = [
    { source: "equipos_computo",       target: "software_colaboracion" },
    { source: "seguridad_endpoint",    target: "backup" },
    { source: "software_colaboracion", target: "perifericos_colaboracion" },
    { source: "equipos_computo",       target: "modelo_daas" },
  ].filter(s => selectedComponents.includes(s.source) && selectedComponents.includes(s.target));

  const nodes = Object.entries(NODE_LAYOUT);

  return (
    <svg viewBox="0 0 800 800" className="graph-svg" xmlns="http://www.w3.org/2000/svg">

      <defs>
        {/* Soft node glow */}
        <filter id="glow-node" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="9" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Strong hub glow */}
        <filter id="glow-hub" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Synergy line glow */}
        <filter id="glow-synergy" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Hub ambient radial */}
        <radialGradient id="hub-ambient" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#06b6d4" stopOpacity="0.35" />
          <stop offset="55%"  stopColor="#06b6d4" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"    />
        </radialGradient>

        {/* Synergy gold gradient */}
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#fde68a" />
          <stop offset="50%"  stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Per-node inner gradient (selected state) */}
        {nodes.map(([id, cfg]) => (
          <radialGradient key={`grad-${id}`} id={`ng-${id}`} cx="38%" cy="32%" r="68%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" />
            <stop offset="45%"  stopColor={cfg.color} stopOpacity="0.92" />
            <stop offset="100%" stopColor={cfg.color} stopOpacity="0.45" />
          </radialGradient>
        ))}

        {/* Grid dot pattern */}
        <pattern id="grid-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="rgba(6,182,212,0.18)" />
        </pattern>
      </defs>

      {/* ── Panel background (circular) — semi-transparent ── */}
      <circle cx={CX} cy={CY} r="390"
        fill="rgba(2, 8, 18, 0.28)"
        stroke="rgba(6,182,212,0.28)"
        strokeWidth="1.5"
      />
      {/* Dot grid overlay */}
      <circle cx={CX} cy={CY} r="390" fill="url(#grid-dots)" />

      {/* ── Background ──────────────────────────────── */}
      <circle cx={CX} cy={CY} r="280" fill="url(#hub-ambient)" />

      {/* Orbit rings */}
      <circle cx={CX} cy={CY} r="238" fill="none" stroke="rgba(6,182,212,0.07)" strokeWidth="1" strokeDasharray="3 10" />
      <circle cx={CX} cy={CY} r="158" fill="none" stroke="rgba(6,182,212,0.10)" strokeWidth="0.75" />

      {/* ── Spokes: hub → nodes ─────────────────────── */}
      {nodes.map(([id, cfg]) => {
        const isSel = selectedComponents.includes(id);
        return (
          <line
            key={`spoke-${id}`}
            x1={CX} y1={CY} x2={cfg.x} y2={cfg.y}
            stroke={cfg.color}
            strokeWidth={isSel ? "2.5" : "1.2"}
            opacity={isSel ? 0.75 : 0.25}
          />
        );
      })}

      {/* ── Synergy lines ───────────────────────────── */}
      {showSynergies && synergies.map((s, i) => {
        const n1 = NODE_LAYOUT[s.source];
        const n2 = NODE_LAYOUT[s.target];
        if (!n1 || !n2) return null;
        return (
          <line
            key={`syn-${i}`}
            x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
            stroke="url(#gold-gradient)"
            strokeWidth="5"
            className="synergy-line"
            filter="url(#glow-synergy)"
          />
        );
      })}

      {/* ── Nodes ───────────────────────────────────── */}
      {nodes.map(([id, cfg]) => {
        const isSel   = selectedComponents.includes(id);
        const isActive = activeRoundNodes.includes(id);
        const fade    = showFade && !isActive && !isSel;
        const r = isSel ? 42 : 32;

        return (
          <g
            key={id}
            className={`node-group${fade ? ' fade-out' : ''}${isSel ? ' active' : ''}`}
            style={{ color: cfg.color }}
          >
            {/* Active-round pulse ring */}
            {isActive && (
              <circle cx={cfg.x} cy={cfg.y} r={r + 20} fill="none" stroke={cfg.color} strokeWidth="2" opacity="0.5">
                <animate attributeName="r"       values={`${r+14};${r+40};${r+14}`} dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5"                 dur="2.2s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Glow halo (selected) */}
            {isSel && (
              <circle
                cx={cfg.x} cy={cfg.y} r={r + 16}
                fill={cfg.color} opacity="0.28"
                filter="url(#glow-node)"
              />
            )}

            {/* Node body */}
            <circle
              cx={cfg.x} cy={cfg.y} r={r}
              fill={isSel ? `url(#ng-${id})` : "rgba(6,14,24,0.72)"}
              stroke={cfg.color}
              strokeWidth={isSel ? "2.5" : "1.75"}
              strokeOpacity={isSel ? "1" : "0.55"}
              className="node-circle"
            />

            {/* Inner core dot (selected) */}
            {isSel && (
              <circle cx={cfg.x} cy={cfg.y} r="6" fill="rgba(255,255,255,0.9)" />
            )}

            {/* Label */}
            <text
              x={cfg.x} y={cfg.y + r + 18}
              className="node-text"
              opacity={fade ? 0.18 : isSel ? 1 : 0.65}
              style={{ fontSize: isSel ? '19px' : '17px' }}
            >
              {cfg.label}
            </text>
          </g>
        );
      })}

      {/* ── Central hub ─────────────────────────────── */}
      <g className={`node-group${showFade && activeRoundNodes.length === 0 ? ' fade-out' : ''}`}>
        {/* Slow-rotating dashed ring */}
        <circle cx={CX} cy={CY} r="77" fill="none" stroke="rgba(6,182,212,0.38)" strokeWidth="1.5" strokeDasharray="6 6">
          <animateTransform attributeName="transform" type="rotate" from="0 400 400" to="360 400 400" dur="22s" repeatCount="indefinite" />
        </circle>
        {/* Counter-rotating fine ring */}
        <circle cx={CX} cy={CY} r="65" fill="none" stroke="rgba(6,182,212,0.18)" strokeWidth="1" strokeDasharray="2 9">
          <animateTransform attributeName="transform" type="rotate" from="360 400 400" to="0 400 400" dur="34s" repeatCount="indefinite" />
        </circle>
        {/* Ambient glow disc */}
        <circle cx={CX} cy={CY} r="53" fill="rgba(6,182,212,0.18)" filter="url(#glow-hub)" />
        {/* Core body */}
        <circle cx={CX} cy={CY} r="43" fill="rgba(2,10,18,0.88)" stroke="rgba(6,182,212,0.8)" strokeWidth="2" />
        {/* Center pulsing dot */}
        <circle cx={CX} cy={CY} r="11" fill="#06b6d4" opacity="0.9">
          <animate attributeName="r"       values="11;14;11"    dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.8s" repeatCount="indefinite" />
        </circle>
        {/* Label */}
        <text
          x={CX} y={CY + 84}
          textAnchor="middle"
          fill="rgba(6,182,212,0.65)"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', letterSpacing: '3px' }}
        >
          OG CORE
        </text>
      </g>

    </svg>
  );
}
