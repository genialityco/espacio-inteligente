/**
 * @module evaluarSinergias
 * @description Evalúa las sinergias del ecosistema — FUNCIÓN PURA.
 *
 * No muta ningún objeto externo. Retorna:
 *  - sinergias_activadas: objetos enriquecidos con id, nombre, componentes, beneficio, peso
 *  - bonificaciones: métricas adicionales que deben sumarse al cálculo base
 *  - sinergias_especiales: IDs de sinergias que no son métricas estándar
 */

/**
 * Evalúa las sinergias activas.
 *
 * @param {string[]} seleccion - Array de IDs de componentes seleccionados.
 * @param {Object} ecosistema - Objeto del ecosistema cargado desde el JSON.
 * @returns {{ sinergias_activadas: Object[], bonificaciones: Object, sinergias_especiales: string[] }}
 */
export function evaluarSinergias(seleccion, ecosistema) {
  const { sinergias = [], metricas: metricasDefinidas = [] } = ecosistema;

  const sinergias_activadas = [];
  const sinergias_especiales = [];
  const bonificaciones = {};

  // Inicializar bonificaciones en 0 para todas las métricas
  for (const m of metricasDefinidas) {
    bonificaciones[m] = 0;
  }

  for (const sinergia of sinergias) {
    const {
      id,
      nombre,
      componentes: requeridos = [],
      beneficio,
      peso = 0,
    } = sinergia;

    // Verificar si TODOS los componentes de la sinergia están seleccionados
    const activa = requeridos.every((comp) => seleccion.includes(comp));
    if (!activa) continue;

    // Registrar sinergia activada como objeto enriquecido
    sinergias_activadas.push({
      id: id || beneficio,
      nombre: nombre || id || beneficio,
      componentes: [...requeridos],
      beneficio,
      peso,
    });

    // Separar entre bonificación de métrica estándar y sinergia especial
    if (metricasDefinidas.includes(beneficio)) {
      bonificaciones[beneficio] += peso;
    } else {
      sinergias_especiales.push(id || beneficio);
    }
  }

  return {
    sinergias_activadas,
    bonificaciones,
    sinergias_especiales,
  };
}
