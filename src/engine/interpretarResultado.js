/**
 * @module interpretarResultado
 * @description Genera el diagnóstico consultivo del ecosistema.
 *
 * Produce un objeto con:
 *  - mensaje: diagnóstico principal orientado a negocio
 *  - nivel: alto | medio | bajo
 *  - resumen: descripción ejecutiva
 *  - recomendaciones: acciones concretas basadas en errores y riesgos
 *
 * Todo se construye desde el JSON (diagnosticos + componentes).
 */

/**
 * Genera el diagnóstico del ecosistema.
 *
 * @param {string} estado - Estado determinado del ecosistema.
 * @param {Object[]} errores - Errores con componente, faltantes, severidad.
 * @param {Object[]} riesgos - Riesgos activos con id, impacto, descripcion.
 * @param {Object} ecosistema - Ecosistema completo.
 * @returns {{ mensaje: string, nivel: string, resumen: string, recomendaciones: string[] }}
 */
export function interpretarResultado(estado, errores, riesgos, ecosistema) {
  const {
    diagnosticos = {},
    componentes = {},
  } = ecosistema;

  // Obtener plantilla de diagnóstico del JSON
  const plantilla = diagnosticos[estado] || {
    mensaje: "Estado no definido en el ecosistema.",
    nivel: "medio",
    resumen: "No se encontró un diagnóstico para este estado.",
  };

  // Generar recomendaciones basadas en errores (dependencias faltantes)
  const recomendaciones = [];
  const componentesMencionados = new Set();

  for (const error of errores) {
    for (const faltante of error.faltantes) {
      if (componentesMencionados.has(faltante)) continue;
      componentesMencionados.add(faltante);

      const nombre = componentes[faltante]?.nombre || faltante;
      recomendaciones.push(
        `Incorporar ${nombre} para fortalecer la integración del ecosistema.`
      );
    }
  }

  // Agregar recomendaciones basadas en riesgos activos (si no hay ya una del componente)
  for (const riesgo of riesgos) {
    if (riesgo.impacto === "critico") {
      recomendaciones.push(
        `⚠️ Prioridad alta: ${riesgo.descripcion}. Resolver de inmediato.`
      );
    }
  }

  return {
    mensaje: plantilla.mensaje,
    nivel: plantilla.nivel,
    resumen: plantilla.resumen,
    recomendaciones,
  };
}
