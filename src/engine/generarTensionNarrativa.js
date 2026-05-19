/**
 * @module generarTensionNarrativa
 * @description Capa de tensión narrativa para el motor del Ecosistema Inteligente.
 *
 * Transforma resultados técnicos en una experiencia consultiva que genera:
 *   - Urgencia (impacto_negocio + urgencia_accion)
 *   - Dirección (acciones_priorizadas con branding Open Group + valor)
 *   - Contraste (comparativa antes/después)
 *   - Motivación (progreso emocional + siguiente_logro)
 *   - Impacto (evento_final conectado a negocio)
 *   - Claridad (narrativa)
 *
 * FUNCIÓN PURA — no modifica el resultado existente, retorna nuevas estructuras.
 * Todo el contenido narrativo proviene del JSON (tension_narrativa).
 */

const PRIORIDAD_IMPACTO = { critico: 1, alto: 2, medio: 3, bajo: 4 };

/**
 * Genera las acciones priorizadas (máximo 3) con branding Open Group.
 */
function construirAcciones(riesgos, errores, config) {
  const {
    acciones_por_riesgo: accionesRiesgo = {},
    acciones_por_componente: accionesComponente = {},
  } = config;

  const acciones = [];
  const accionesUsadas = new Set();

  // 1. Acciones derivadas de riesgos (mayor prioridad)
  const riesgosOrdenados = [...riesgos].sort(
    (a, b) =>
      (PRIORIDAD_IMPACTO[a.impacto] || 99) -
      (PRIORIDAD_IMPACTO[b.impacto] || 99)
  );

  for (const riesgo of riesgosOrdenados) {
    const plantilla = accionesRiesgo[riesgo.id];
    if (!plantilla || accionesUsadas.has(riesgo.id)) continue;
    accionesUsadas.add(riesgo.id);

    acciones.push({
      accion: plantilla.accion,
      impacto: plantilla.impacto,
      valor: plantilla.valor || "",
      prioridad: PRIORIDAD_IMPACTO[riesgo.impacto] || 3,
    });
  }

  // 2. Acciones derivadas de componentes faltantes
  const faltantesUnicos = new Set();
  const erroresOrdenados = [...errores].sort(
    (a, b) =>
      (PRIORIDAD_IMPACTO[a.severidad] || 99) -
      (PRIORIDAD_IMPACTO[b.severidad] || 99)
  );

  for (const error of erroresOrdenados) {
    for (const faltante of error.faltantes) {
      if (faltantesUnicos.has(faltante)) continue;
      faltantesUnicos.add(faltante);

      const plantilla = accionesComponente[faltante];
      if (!plantilla) continue;

      const yaExiste = acciones.some((a) => a.accion === plantilla.accion);
      if (yaExiste) continue;

      acciones.push({
        accion: plantilla.accion,
        impacto: plantilla.impacto,
        valor: plantilla.valor || "",
        prioridad: PRIORIDAD_IMPACTO[error.severidad] || 3,
      });
    }
  }

  acciones.sort((a, b) => a.prioridad - b.prioridad);
  return acciones.slice(0, 3);
}

/**
 * Determina el mensaje emocional del progreso basado en el score.
 */
function obtenerProgresoEmocional(score, rangos) {
  for (const rango of rangos) {
    if (score <= rango.max) {
      return { mensaje: rango.mensaje, tono: rango.tono };
    }
  }
  // Fallback al último rango
  const ultimo = rangos[rangos.length - 1];
  return { mensaje: ultimo?.mensaje || "", tono: ultimo?.tono || "" };
}

/**
 * Determina el siguiente logro basado en la primera acción priorizada.
 */
function obtenerSiguienteLogro(errores, config) {
  const { siguiente_logro_por_componente: logros = {} } = config;

  // Buscar el primer componente faltante con logro definido
  for (const error of errores) {
    for (const faltante of error.faltantes) {
      if (logros[faltante]) {
        return logros[faltante];
      }
    }
  }

  return null;
}

/**
 * Genera la capa de tensión narrativa completa.
 *
 * @param {Object} resultado - Output del motor (evaluarEcosistema).
 * @param {Object} ecosistema - Ecosistema completo cargado del JSON.
 * @returns {Object} Las 7 estructuras narrativas.
 */
export function generarTensionNarrativa(resultado, ecosistema) {
  const config = ecosistema.tension_narrativa || {};
  const {
    narrativas = {},
    impactos = {},
    evento_wow: eventoWow = {},
    umbral_ecosistema: umbral = 85,
    urgencia_accion: urgencias = {},
    comparativas = {},
    progreso_emocional: rangosEmocionales = [],
  } = config;

  const { estado, score_global, riesgos, errores } = resultado;

  // ── 1. Impacto en el negocio ─────────────────────────────────────────
  const impactoPlantilla = impactos[estado] || {
    urgencia: "media",
    nivel_impacto: "medio",
    mensaje: "Evaluación en curso.",
    consecuencia: "Consulta con un especialista para más detalles.",
  };

  const impacto_negocio = {
    urgencia: impactoPlantilla.urgencia,
    nivel_impacto: impactoPlantilla.nivel_impacto,
    mensaje: impactoPlantilla.mensaje,
    consecuencia: impactoPlantilla.consecuencia,
  };

  // ── 2. Urgencia de acción (presión de decisión) ──────────────────────
  const urgenciaPlantilla = urgencias[estado] || {
    tiempo_estimado: "pendiente",
    mensaje: "Consulta con un especialista para definir próximos pasos.",
  };

  const urgencia_accion = {
    tiempo_estimado: urgenciaPlantilla.tiempo_estimado,
    mensaje: urgenciaPlantilla.mensaje,
  };

  // ── 3. Acciones priorizadas (branded Open Group + valor) ─────────────
  const acciones_priorizadas = construirAcciones(riesgos, errores, config);

  // ── 4. Comparativa antes/después ─────────────────────────────────────
  const comparativaPlantilla = comparativas[estado] || {
    antes: "Situación actual con oportunidades de mejora",
    despues: "Ecosistema optimizado con Open Group",
  };

  const comparativa = {
    antes: comparativaPlantilla.antes,
    despues: comparativaPlantilla.despues,
  };

  // ── 5. Progreso emocional ────────────────────────────────────────────
  const emocional = obtenerProgresoEmocional(score_global, rangosEmocionales);
  const siguienteLogro = obtenerSiguienteLogro(errores, config);

  const progreso = {
    actual: score_global,
    objetivo: umbral,
    faltante: Math.max(0, umbral - score_global),
    mensaje: emocional.mensaje,
    tono: emocional.tono,
  };

  if (siguienteLogro) {
    progreso.siguiente_logro = siguienteLogro;
  }

  // ── 6. Evento final (wow conectado a negocio) ────────────────────────
  const esEcosistemaInteligente = estado === "ecosistema_inteligente";
  const evento_final = {
    tipo: eventoWow.tipo || "ecosistema_completo",
    mensaje: eventoWow.mensaje || "",
    impacto_negocio: eventoWow.impacto_negocio || "",
    submensaje: eventoWow.submensaje || "",
    trigger: esEcosistemaInteligente,
  };

  // ── 7. Narrativa (microcopy dinámico) ────────────────────────────────
  const narrativaPlantilla = narrativas[estado] || {
    headline: "Ecosistema en evaluación",
    submensaje: "Seleccione componentes para ver su diagnóstico.",
  };

  const narrativa = {
    headline: narrativaPlantilla.headline,
    submensaje: narrativaPlantilla.submensaje,
  };

  return {
    impacto_negocio,
    urgencia_accion,
    acciones_priorizadas,
    comparativa,
    progreso,
    evento_final,
    narrativa,
  };
}
