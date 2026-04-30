/**
 * @module generarInsights
 * @description Genera mensajes de insight contextuales para el usuario.
 *
 * Evalúa reglas definidas en `ecosistema.insights_reglas[]` y activa
 * aquellas cuyas condiciones se cumplen. Los tipos de regla soportados:
 *
 *  - metrica_nivel:      se activa si una métrica está en un nivel dado
 *  - riesgo_activo:      se activa si un riesgo específico está presente
 *  - componente_faltante: se activa si un componente NO está seleccionado
 *  - sinergia_cercana:   se activa si una sinergia está a 1 componente de activarse
 *
 * Los insights se ordenan por prioridad (1 = máxima).
 */

import { clasificarMetrica } from "./determinarEstado.js";

/**
 * Genera los insights aplicables al estado actual.
 *
 * @param {string[]} seleccion - Componentes seleccionados.
 * @param {Object} metricas - Métricas finales.
 * @param {Object[]} riesgos - Riesgos activados.
 * @param {Object[]} sinergiasActivadas - Sinergias activadas (objetos con id).
 * @param {Object} ecosistema - Ecosistema completo.
 * @returns {string[]} Array de mensajes de insight, ordenados por prioridad.
 */
export function generarInsights(
  seleccion,
  metricas,
  riesgos,
  sinergiasActivadas,
  ecosistema
) {
  const {
    insights_reglas: reglas = [],
    sinergias = [],
    configuracion = {},
  } = ecosistema;
  const { umbrales_metricas: umbrales = {} } = configuracion;

  const riesgoIds = new Set(riesgos.map((r) => r.id));
  const sinergiaIds = new Set(sinergiasActivadas.map((s) => s.id));
  const seleccionSet = new Set(seleccion);

  const insightsActivos = [];

  for (const regla of reglas) {
    const { tipo, condicion, mensaje, prioridad = 5 } = regla;
    let aplica = false;

    switch (tipo) {
      case "metrica_nivel": {
        const valor = metricas[condicion.metrica];
        if (valor !== undefined) {
          const nivelActual = clasificarMetrica(valor, umbrales);
          aplica = nivelActual === condicion.nivel;
        }
        break;
      }

      case "riesgo_activo": {
        aplica = riesgoIds.has(condicion.riesgo);
        break;
      }

      case "componente_faltante": {
        aplica = !seleccionSet.has(condicion.componente);
        break;
      }

      case "sinergia_cercana": {
        // Buscar la sinergia en el JSON y verificar si falta exactamente 1 componente
        const sinergiaDef = sinergias.find(
          (s) => s.id === condicion.sinergia
        );
        if (sinergiaDef && !sinergiaIds.has(sinergiaDef.id)) {
          const faltantes = (sinergiaDef.componentes || []).filter(
            (c) => !seleccionSet.has(c)
          );
          aplica = faltantes.length === 1;
        }
        break;
      }
    }

    if (aplica) {
      insightsActivos.push({ mensaje, prioridad });
    }
  }

  // Ordenar por prioridad (1 = máxima) y extraer solo mensajes
  insightsActivos.sort((a, b) => a.prioridad - b.prioridad);
  return insightsActivos.map((i) => i.mensaje);
}
