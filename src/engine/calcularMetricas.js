/**
 * @module calcularMetricas
 * @description Calcula las métricas base del ecosistema sumando los aportes
 * de cada componente seleccionado, usando exclusivamente los valores
 * definidos en el JSON maestro.
 */

/**
 * Calcula las métricas base a partir de los componentes seleccionados.
 *
 * @param {string[]} seleccion - Array de IDs de componentes seleccionados.
 * @param {Object} ecosistema - Objeto del ecosistema cargado desde el JSON.
 * @returns {{ seguridad: number, productividad: number, continuidad: number }}
 */
export function calcularMetricas(seleccion, ecosistema) {
  const { metricas: metricasDefinidas = [], componentes = {} } = ecosistema;

  // Inicializar todas las métricas definidas en el JSON en 0
  const metricas = {};
  for (const metrica of metricasDefinidas) {
    metricas[metrica] = 0;
  }

  // Sumar aportes de cada componente seleccionado
  for (const id of seleccion) {
    const componente = componentes[id];

    // Ignorar componentes que no existen en el JSON
    if (!componente) continue;

    const { aporta = {} } = componente;

    for (const [metrica, valor] of Object.entries(aporta)) {
      // Solo sumar métricas reconocidas por el ecosistema
      if (metricas[metrica] !== undefined) {
        metricas[metrica] += valor;
      }
    }
  }

  return metricas;
}
