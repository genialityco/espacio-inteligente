/**
 * @module determinarEstado
 * @description Determina el estado global y nivel del ecosistema.
 *
 * Usa umbrales configurables desde el JSON para evaluar si las métricas
 * califican como "optimizado" (todas al menos nivel "medio").
 *
 * Estados (evaluados en orden de prioridad):
 *   1. "ecosistema_inteligente" — Sinergia especial cumplida, sin riesgos.
 *   2. "fragmentado"           — Existen riesgos con impacto "critico".
 *   3. "parcial"               — Existen riesgos, o métricas demasiado bajas.
 *   4. "optimizado"            — Sin riesgos y todas las métricas ≥ nivel "medio".
 */

/**
 * Clasifica el valor de una métrica según los umbrales definidos.
 *
 * @param {number} valor
 * @param {Object} umbrales - { bajo: [min, max], medio: [min, max], alto: [min, max|null] }
 * @returns {string} "bajo" | "medio" | "alto"
 */
export function clasificarMetrica(valor, umbrales) {
  for (const [nivel, [min, max]] of Object.entries(umbrales)) {
    const upperBound = max === null ? Infinity : max;
    if (valor >= min && valor <= upperBound) {
      return nivel;
    }
  }
  return "bajo";
}

/**
 * Determina el estado y nivel del ecosistema.
 *
 * @param {Object[]} riesgos - Array de riesgos activados (objetos con id, impacto).
 * @param {Object} metricas - Objeto con las métricas finales.
 * @param {string[]} sinergiasEspeciales - IDs de sinergias no-métricas activadas.
 * @param {Object} ecosistema - Objeto del ecosistema cargado desde el JSON.
 * @returns {{ estado: string, nivel: number, color: string }}
 */
export function determinarEstado(
  riesgos,
  metricas,
  sinergiasEspeciales,
  ecosistema
) {
  const { configuracion = {} } = ecosistema;
  const {
    niveles = {},
    colores_estado: colores = {},
    umbrales_metricas: umbrales = {},
  } = configuracion;

  let estado;

  // 1. Sinergia especial "ecosistema_inteligente" + sin riesgos
  if (
    sinergiasEspeciales.includes("ecosistema_inteligente") &&
    riesgos.length === 0
  ) {
    estado = "ecosistema_inteligente";
  }

  // 2. Riesgos críticos → fragmentado
  if (!estado) {
    const hayCriticos = riesgos.some((r) => r.impacto === "critico");
    if (hayCriticos) {
      estado = "fragmentado";
    }
  }

  // 3. Cualquier riesgo no crítico → parcial
  if (!estado && riesgos.length > 0) {
    estado = "parcial";
  }

  // 4. Sin riesgos → evaluar umbrales para optimizado vs parcial
  if (!estado) {
    const nivelesMetricas = Object.values(metricas).map((val) =>
      clasificarMetrica(val, umbrales)
    );
    const todasAlMenosMedio = nivelesMetricas.every(
      (n) => n === "medio" || n === "alto"
    );
    estado = todasAlMenosMedio ? "optimizado" : "parcial";
  }

  return {
    estado,
    nivel: niveles[estado] ?? 0,
    color: colores[estado] ?? "amarillo",
  };
}
