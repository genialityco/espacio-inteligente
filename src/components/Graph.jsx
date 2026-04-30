
// Coordenadas en un ViewBox de 800x800, centro en 400,400
const NODE_LAYOUT = {
  equipos_computo: { x: 200, y: 400, label: "Equipos", color: "#3b82f6" },
  mobiliario: { x: 250, y: 550, label: "Mobiliario", color: "#ec4899" },
  software_colaboracion: { x: 400, y: 200, label: "Colaboración", color: "#8b5cf6" },
  perifericos_colaboracion: { x: 250, y: 250, label: "Periféricos", color: "#f59e0b" },
  seguridad_endpoint: { x: 550, y: 250, label: "Seguridad", color: "#10b981" },
  backup: { x: 600, y: 400, label: "Backup", color: "#06b6d4" },
  soporte_servicios: { x: 550, y: 550, label: "Soporte", color: "#f59e0b" },
  modelo_daas: { x: 400, y: 600, label: "DaaS", color: "#6366f1" },
};

export default function Graph({ selectedComponents = [], activeRoundNodes = [], showFade = false, showSynergies = false }) {
  
  // Extraemos las sinergias de ejemplo (simplificadas visualmente para el SVG)
  // En producción real esto viene de 'sinergias_activadas' del motor.
  const synergies = [
    { source: "equipos_computo", target: "software_colaboracion" },
    { source: "seguridad_endpoint", target: "backup" },
    { source: "software_colaboracion", target: "perifericos_colaboracion" },
    { source: "equipos_computo", target: "modelo_daas" }
  ].filter(s => selectedComponents.includes(s.source) && selectedComponents.includes(s.target));

  return (
    <svg viewBox="0 0 800 800" className="graph-svg" xmlns="http://www.w3.org/2000/svg">
      
      {/* 1. Dibujar conexiones base tenues */}
      {Object.values(NODE_LAYOUT).map((node1, i) => 
        Object.values(NODE_LAYOUT).map((node2, j) => {
          if (i >= j) return null;
          return (
            <line 
              key={`base-${i}-${j}`}
              x1={node1.x} y1={node1.y} 
              x2={node2.x} y2={node2.y} 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="2" 
            />
          );
        })
      )}

      {/* 2. Dibujar Sinergias (líneas animadas) */}
      {showSynergies && synergies.map((s, idx) => {
        const n1 = NODE_LAYOUT[s.source];
        const n2 = NODE_LAYOUT[s.target];
        if (!n1 || !n2) return null;
        return (
          <line
            key={`syn-${idx}`}
            x1={n1.x} y1={n1.y}
            x2={n2.x} y2={n2.y}
            stroke="url(#gold-gradient)"
            strokeWidth="6"
            className="synergy-line"
          />
        );
      })}

      {/* Definición de Gradiente Dorado para sinergias */}
      <defs>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* 3. Dibujar Nodos */}
      {Object.entries(NODE_LAYOUT).map(([id, config]) => {
        const isSelected = selectedComponents.includes(id);
        const isActiveInRound = activeRoundNodes.includes(id);
        const shouldFade = showFade && !isActiveInRound;

        return (
          <g 
            key={id} 
            className={`node-group ${shouldFade ? 'fade-out' : ''} ${isSelected ? 'active' : ''}`}
            style={{ color: config.color }}
          >
            {/* Anillo de pulso (si está activo en esta ronda) */}
            {isActiveInRound && (
              <circle 
                cx={config.x} cy={config.y} 
                r="45" 
                fill="none" 
                stroke={config.color} 
                strokeWidth="2"
                opacity="0.5"
              >
                <animate attributeName="r" values="45;60;45" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
            )}

            <circle 
              cx={config.x} cy={config.y} 
              r="30" 
              fill={isSelected ? config.color : "var(--node-base)"}
              className="node-circle"
            />
            <text x={config.x} y={config.y + 50} className="node-text">
              {config.label}
            </text>
          </g>
        );
      })}
      
      {/* Centro: Hub Core */}
      <g className={`node-group ${showFade && activeRoundNodes.length === 0 ? 'fade-out' : ''}`}>
        <circle cx="400" cy="400" r="50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
        <text x="400" y="405" fill="white" textAnchor="middle" fontSize="18" fontWeight="bold">OG Core</text>
      </g>
    </svg>
  );
}
