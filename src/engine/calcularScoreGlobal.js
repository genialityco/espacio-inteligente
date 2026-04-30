/**
 * @module calcularScoreGlobal
 * @description Calcula el score global del ecosistema (0–100).
 *
 * Fórmula:
 *   1. Calcular métricas ponderadas = Σ(métrica × peso_estratégico)
 *   2. Calcular máximo teórico ponderado (todos los componentes + todas las sinergias métricas)
 *   3. score_base = (ponderado_actual / max_ponderado) × 100
 *   4. penalización = Σ penalizaciones por cada riesgo activo
 *   5. score_global = max(0, score_base − penalización)
 *
 * Todos los pesos y penalizaciones vienen del JSON.
 */

/**
 * Calcula el máximo teórico ponderado del ecosistema.
 * Suma todos los aportes de todos los componentes + bonificaciones de sinergias métricas.
 *
 * @param {Object} ecosistema
 * @param {Object} pesos - Pesos estratégicos por métrica.
 * @returns {number}
 */
function calcularMaxPonderado(ecosistema, pesos) {
  const { componentes = {}, sinergias = [], metricas: metricasIds = [] } =
    ecosistema;

  // Acumular aportes máximos por métrica
  const maxMetricas = {};
  for (const m of metricasIds) {
    maxMetricas[m] = 0;
  }

  // Sumar todos los componentes
  for (const comp of Object.values(componentes)) {
    for (const [metrica, valor] of Object.entries(comp.aporta || {})) {
      if (maxMetricas[metrica] !== undefined) {
        maxMetricas[metrica] += valor;
      }
    }
  }

  // Sumar todas las sinergias que aportan a métricas estándar
  for (const sinergia of sinergias) {
    if (metricasIds.includes(sinergia.beneficio)) {
      maxMetricas[sinergia.beneficio] += sinergia.peso || 0;
    }
  }

  // Ponderar
  let total = 0;
  for (const [metrica, valor] of Object.entries(maxMetricas)) {
    total += valor * (pesos[metrica] || 1);
  }

  return total;
}

/**
 * Calcula el score global del ecosistema.
 *
 * @param {Object} metricas - Métricas finales (base + bonificaciones).
 * @param {Object[]} riesgos - Riesgos activados (objetos con id, impacto).
 * @param {Object} ecosistema - Ecosistema completo.
 * @returns {{ score_global: number, score_base: number, penalizacion_total: number, detalle_ponderacion: Object }}
 */
export function calcularScoreGlobal(metricas, riesgos, ecosistema) {
  const { configuracion = {} } = ecosistema;
  const {
    pesos_estrategicos: pesos = {},
    penalizaciones_riesgo: penalizaciones = {},
  } = configuracion;

  // 1. Métricas ponderadas actuales
  const detalle_ponderacion = {};
  let ponderadoActual = 0;
  for (const [metrica, valor] of Object.entries(metricas)) {
    const peso = pesos[metrica] || 1;
    const ponderado = valor * peso;
    detalle_ponderacion[metrica] = { valor, peso, ponderado };
    ponderadoActual += ponderado;
  }

  // 2. Máximo teórico
  const maxPonderado = calcularMaxPonderado(ecosistema, pesos);

  // 3. Score base (0–100)
  const score_base =
    maxPonderado > 0
      ? Math.round((ponderadoActual / maxPonderado) * 100)
      : 0;

  // 4. Penalización por riesgos
  let penalizacion_total = 0;
  for (const riesgo of riesgos) {
    penalizacion_total += penalizaciones[riesgo.impacto] || 0;
  }

  // 5. Score final
  const score_global = Math.max(0, score_base - penalizacion_total);

  return {
    score_global,
    score_base,
    penalizacion_total,
    detalle_ponderacion,
  };
}
