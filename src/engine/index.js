/**
 * @module EcosistemaEngine v2.1
 * @description Motor principal del Ecosistema Inteligente — Nivel Producto.
 *
 * Pipeline de evaluación (9 fases):
 *   1. Filtro de componentes válidos
 *   2. Validación de dependencias + riesgos enriquecidos
 *   3. Cálculo de métricas base
 *   4. Evaluación de sinergias (pura, sin mutación)
 *   5. Merge de métricas finales (base + bonificaciones)
 *   6. Score global ponderado con penalización
 *   7. Estado + nivel + diagnóstico + insights
 *   8. Insights contextuales
 *   9. Tensión narrativa (impacto, acciones, progreso, wow, narrativa)
 *
 * Todas las funciones son puras. El output es frontend-ready.
 */

import { validarDependencias } from "./validarDependencias.js";
import { calcularMetricas } from "./calcularMetricas.js";
import { evaluarSinergias } from "./evaluarSinergias.js";
import { determinarEstado } from "./determinarEstado.js";
import { calcularScoreGlobal } from "./calcularScoreGlobal.js";
import { interpretarResultado } from "./interpretarResultado.js";
import { generarInsights } from "./generarInsights.js";
import { generarTensionNarrativa } from "./generarTensionNarrativa.js";

/**
 * Evalúa una selección de componentes contra el ecosistema definido.
 * Retorna un objeto completo listo para consumo en frontend.
 *
 * @param {string[]} seleccion - IDs de componentes seleccionados por el usuario.
 * @param {Object} ecosistema - Objeto del ecosistema cargado desde el JSON.
 * @returns {Object} Resultado completo de la evaluación.
 */
export function evaluarEcosistema(seleccion, ecosistema) {
  // ── 0. Filtrar componentes inexistentes ──────────────────────────────
  const componentesValidos = seleccion.filter(
    (id) => ecosistema.componentes?.[id] !== undefined
  );

  const componentesIgnorados = seleccion.filter(
    (id) => !componentesValidos.includes(id)
  );

  // ── 1. Validar dependencias ──────────────────────────────────────────
  const { errores, riesgos } = validarDependencias(
    componentesValidos,
    ecosistema
  );

  // ── 2. Calcular métricas base ────────────────────────────────────────
  const metricasBase = calcularMetricas(componentesValidos, ecosistema);

  // ── 3. Evaluar sinergias (función pura) ──────────────────────────────
  const { sinergias_activadas, bonificaciones, sinergias_especiales } =
    evaluarSinergias(componentesValidos, ecosistema);

  // ── 4. Merge métricas finales (base + bonificaciones) ────────────────
  const metricas = {};
  for (const key of Object.keys(metricasBase)) {
    metricas[key] = metricasBase[key] + (bonificaciones[key] || 0);
  }

  // ── 5. Score global ponderado ────────────────────────────────────────
  const {
    score_global,
    score_base,
    penalizacion_total,
    detalle_ponderacion,
  } = calcularScoreGlobal(metricas, riesgos, ecosistema);

  // ── 6. Estado + nivel + color ────────────────────────────────────────
  const { estado, nivel, color } = determinarEstado(
    riesgos,
    metricas,
    sinergias_especiales,
    ecosistema
  );

  // ── 7. Diagnóstico consultivo ────────────────────────────────────────
  const diagnostico = interpretarResultado(
    estado,
    errores,
    riesgos,
    ecosistema
  );

  // ── 8. Insights contextuales ─────────────────────────────────────────
  const insights = generarInsights(
    componentesValidos,
    metricas,
    riesgos,
    sinergias_activadas,
    ecosistema
  );

  // ── Resultado parcial (para alimentar tensión narrativa) ─────────────
  const resultadoParcial = {
    estado,
    nivel,
    score_global,
    color,
    metricas,
    riesgos,
    sinergias_activadas,
    errores,
    diagnostico,
    insights,
  };

  // ── 9. Tensión narrativa ─────────────────────────────────────────────
  const {
    impacto_negocio,
    urgencia_accion,
    acciones_priorizadas,
    comparativa,
    progreso,
    evento_final,
    narrativa,
  } = generarTensionNarrativa(resultadoParcial, ecosistema);

  // ── Resultado final (frontend-ready) ─────────────────────────────────
  const resultado = {
    ...resultadoParcial,
    impacto_negocio,
    urgencia_accion,
    acciones_priorizadas,
    comparativa,
    progreso,
    evento_final,
    narrativa,
  };

  // Metadata adicional (útil para debug / UI avanzada)
  resultado._meta = {
    score_base,
    penalizacion_total,
    detalle_ponderacion,
    metricas_base: metricasBase,
    bonificaciones,
    sinergias_especiales,
    componentes_seleccionados: componentesValidos,
  };

  if (componentesIgnorados.length > 0) {
    resultado._meta.advertencias = componentesIgnorados.map(
      (id) => `Componente "${id}" no existe en el ecosistema y fue ignorado.`
    );
  }

  return resultado;
}

// Re-exportar funciones individuales para uso granular
export { validarDependencias } from "./validarDependencias.js";
export { calcularMetricas } from "./calcularMetricas.js";
export { evaluarSinergias } from "./evaluarSinergias.js";
export { determinarEstado, clasificarMetrica } from "./determinarEstado.js";
export { calcularScoreGlobal } from "./calcularScoreGlobal.js";
export { interpretarResultado } from "./interpretarResultado.js";
export { generarInsights } from "./generarInsights.js";
export { generarTensionNarrativa } from "./generarTensionNarrativa.js";
