/**
 * @module validarDependencias
 * @description Valida las dependencias de los componentes seleccionados
 * contra las reglas definidas en el ecosistema JSON.
 *
 * Cada error se enriquece con severidad basada en el impacto del riesgo
 * asociado (critico | alto | medio).
 */

const SEVERIDAD_ORDEN = { critico: 3, alto: 2, medio: 1 };

/**
 * Valida las dependencias de los componentes seleccionados.
 *
 * @param {string[]} seleccion - Array de IDs de componentes seleccionados.
 * @param {Object} ecosistema - Objeto del ecosistema cargado desde el JSON.
 * @returns {{ errores: Object[], riesgos: Object[] }}
 */
export function validarDependencias(seleccion, ecosistema) {
  const errores = [];
  const riesgosMap = new Map();

  const {
    dependencias = [],
    componentes = {},
    riesgos: riesgosDefinidos = {},
  } = ecosistema;

  for (const dep of dependencias) {
    const { componente, requiere = [], riesgos: riesgosAsociados = [] } = dep;

    // Solo evaluar dependencias de componentes que el usuario seleccionó
    if (!seleccion.includes(componente)) continue;

    // Solo considerar dependencias hacia componentes que existen en el JSON
    const faltantes = requiere.filter(
      (req) => !seleccion.includes(req) && componentes[req] !== undefined
    );

    if (faltantes.length === 0) continue;

    // Determinar severidad del error basada en el riesgo de mayor impacto
    const severidades = riesgosAsociados.map((rId) => {
      const def = riesgosDefinidos[rId];
      return def?.impacto || "medio";
    });

    const severidad = severidades.reduce((max, sev) => {
      return (SEVERIDAD_ORDEN[sev] || 0) > (SEVERIDAD_ORDEN[max] || 0)
        ? sev
        : max;
    }, "medio");

    errores.push({ componente, faltantes, severidad });

    // Registrar riesgos enriquecidos (sin duplicados)
    for (const riesgoId of riesgosAsociados) {
      if (riesgosMap.has(riesgoId)) continue;
      const def = riesgosDefinidos[riesgoId];
      if (def) {
        riesgosMap.set(riesgoId, {
          id: riesgoId,
          impacto: def.impacto,
          descripcion: def.descripcion,
        });
      }
    }
  }

  return {
    errores,
    riesgos: [...riesgosMap.values()],
  };
}
