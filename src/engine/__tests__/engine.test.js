/**
 * @file engine.test.js — v2.1
 * @description Tests unitarios + integración para el motor del Ecosistema Inteligente.
 *
 * Ejecutar:  npm test
 *         o: node --test frontend/src/engine/__tests__/engine.test.js
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { evaluarEcosistema } from "../index.js";
import { validarDependencias } from "../validarDependencias.js";
import { calcularMetricas } from "../calcularMetricas.js";
import { evaluarSinergias } from "../evaluarSinergias.js";
import { determinarEstado, clasificarMetrica } from "../determinarEstado.js";
import { calcularScoreGlobal } from "../calcularScoreGlobal.js";
import { interpretarResultado } from "../interpretarResultado.js";
import { generarInsights } from "../generarInsights.js";
import { generarTensionNarrativa } from "../generarTensionNarrativa.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(__dirname, "..", "..", "data", "ecosistema_inteligente.json");
const ecosistema = JSON.parse(await readFile(jsonPath, "utf-8"));

// ═══════════════════════════════════════════════════════════════════════
// validarDependencias
// ═══════════════════════════════════════════════════════════════════════
describe("validarDependencias", () => {
  it("detecta faltantes y clasifica severidad", () => {
    const { errores, riesgos } = validarDependencias(
      ["equipos_computo"],
      ecosistema
    );

    assert.ok(errores.length > 0);
    const errorEquipos = errores.find((e) => e.componente === "equipos_computo");
    assert.ok(errorEquipos);
    assert.ok(errorEquipos.faltantes.includes("seguridad_endpoint"));
    assert.ok(errorEquipos.faltantes.includes("soporte_servicios"));
    assert.ok(errorEquipos.severidad, "Debe tener severidad");
    assert.equal(errorEquipos.severidad, "alto");
  });

  it("retorna riesgos como objetos enriquecidos sin duplicados", () => {
    const { riesgos } = validarDependencias(
      ["equipos_computo", "backup"],
      ecosistema
    );

    assert.ok(riesgos.every((r) => r.id && r.impacto && r.descripcion));
    const ids = riesgos.map((r) => r.id);
    assert.equal(ids.length, new Set(ids).size, "Sin duplicados");
  });

  it("no reporta errores si dependencias cubiertas", () => {
    const { errores } = validarDependencias(
      ["equipos_computo", "seguridad_endpoint", "soporte_servicios"],
      ecosistema
    );
    const errorEquipos = errores.find((e) => e.componente === "equipos_computo");
    assert.equal(errorEquipos, undefined);
  });

  it("retorna vacío sin selección", () => {
    const { errores, riesgos } = validarDependencias([], ecosistema);
    assert.equal(errores.length, 0);
    assert.equal(riesgos.length, 0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// calcularMetricas
// ═══════════════════════════════════════════════════════════════════════
describe("calcularMetricas", () => {
  it("suma correctamente los aportes", () => {
    const metricas = calcularMetricas(
      ["equipos_computo", "seguridad_endpoint"],
      ecosistema
    );
    assert.equal(metricas.productividad, 2);
    assert.equal(metricas.seguridad, 3);
    assert.equal(metricas.continuidad, 0);
  });

  it("ignora componentes inexistentes", () => {
    const metricas = calcularMetricas(["componente_falso"], ecosistema);
    assert.equal(metricas.seguridad, 0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// evaluarSinergias (función pura)
// ═══════════════════════════════════════════════════════════════════════
describe("evaluarSinergias", () => {
  it("retorna sinergias como objetos enriquecidos", () => {
    const { sinergias_activadas } = evaluarSinergias(
      ["equipos_computo", "software_colaboracion"],
      ecosistema
    );

    assert.ok(sinergias_activadas.length > 0);
    const sinergia = sinergias_activadas[0];
    assert.ok(sinergia.id, "Debe tener id");
    assert.ok(sinergia.nombre, "Debe tener nombre");
    assert.ok(Array.isArray(sinergia.componentes), "Debe tener componentes");
    assert.ok(sinergia.beneficio, "Debe tener beneficio");
    assert.equal(sinergia.id, "productividad_digital");
  });

  it("retorna bonificaciones sin mutar objetos externos", () => {
    const metricasOriginal = { seguridad: 0, productividad: 0, continuidad: 0 };
    const copia = { ...metricasOriginal };

    const { bonificaciones } = evaluarSinergias(
      ["equipos_computo", "software_colaboracion"],
      ecosistema
    );

    // Métricas originales no deben cambiar
    assert.deepStrictEqual(metricasOriginal, copia);
    // Bonificaciones deben tener valores
    assert.equal(bonificaciones.productividad, 2);
  });

  it("detecta sinergias especiales", () => {
    const { sinergias_especiales } = evaluarSinergias(
      ["equipos_computo", "software_colaboracion", "seguridad_endpoint", "backup", "soporte_servicios"],
      ecosistema
    );
    assert.ok(sinergias_especiales.includes("ecosistema_inteligente"));
  });
});

// ═══════════════════════════════════════════════════════════════════════
// clasificarMetrica
// ═══════════════════════════════════════════════════════════════════════
describe("clasificarMetrica", () => {
  const umbrales = ecosistema.configuracion.umbrales_metricas;

  it("clasifica correctamente bajo", () => {
    assert.equal(clasificarMetrica(3, umbrales), "bajo");
  });

  it("clasifica correctamente medio", () => {
    assert.equal(clasificarMetrica(7, umbrales), "medio");
  });

  it("clasifica correctamente alto", () => {
    assert.equal(clasificarMetrica(15, umbrales), "alto");
  });
});

// ═══════════════════════════════════════════════════════════════════════
// determinarEstado
// ═══════════════════════════════════════════════════════════════════════
describe("determinarEstado", () => {
  it("devuelve fragmentado con riesgos críticos", () => {
    const { estado, nivel, color } = determinarEstado(
      [{ id: "perdida_informacion", impacto: "critico" }],
      { seguridad: 0, productividad: 0, continuidad: 0 },
      [],
      ecosistema
    );
    assert.equal(estado, "fragmentado");
    assert.equal(nivel, 1);
    assert.equal(color, "rojo");
  });

  it("devuelve parcial con riesgos no críticos", () => {
    const { estado, nivel } = determinarEstado(
      [{ id: "baja_productividad", impacto: "medio" }],
      { seguridad: 10, productividad: 10, continuidad: 10 },
      [],
      ecosistema
    );
    assert.equal(estado, "parcial");
    assert.equal(nivel, 2);
  });

  it("devuelve parcial si no hay riesgos pero métricas son bajas", () => {
    const { estado } = determinarEstado(
      [],
      { seguridad: 2, productividad: 3, continuidad: 1 },
      [],
      ecosistema
    );
    assert.equal(estado, "parcial");
  });

  it("devuelve optimizado sin riesgos y métricas >= medio", () => {
    const { estado, nivel } = determinarEstado(
      [],
      { seguridad: 8, productividad: 10, continuidad: 7 },
      [],
      ecosistema
    );
    assert.equal(estado, "optimizado");
    assert.equal(nivel, 3);
  });

  it("devuelve ecosistema_inteligente con sinergia especial y sin riesgos", () => {
    const { estado, nivel, color } = determinarEstado(
      [],
      { seguridad: 5, productividad: 10, continuidad: 8 },
      ["ecosistema_inteligente"],
      ecosistema
    );
    assert.equal(estado, "ecosistema_inteligente");
    assert.equal(nivel, 4);
    assert.equal(color, "verde");
  });
});

// ═══════════════════════════════════════════════════════════════════════
// calcularScoreGlobal
// ═══════════════════════════════════════════════════════════════════════
describe("calcularScoreGlobal", () => {
  it("retorna score 0–100 con detalle de ponderación", () => {
    const { score_global, score_base, penalizacion_total, detalle_ponderacion } =
      calcularScoreGlobal(
        { seguridad: 3, productividad: 5, continuidad: 3 },
        [],
        ecosistema
      );

    assert.ok(score_global >= 0 && score_global <= 100);
    assert.ok(score_base >= 0);
    assert.equal(penalizacion_total, 0);
    assert.ok(detalle_ponderacion.seguridad);
    assert.equal(detalle_ponderacion.seguridad.peso, 1.5);
  });

  it("aplica penalización por riesgos", () => {
    const sinPenalizacion = calcularScoreGlobal(
      { seguridad: 3, productividad: 5, continuidad: 3 },
      [],
      ecosistema
    );

    const conPenalizacion = calcularScoreGlobal(
      { seguridad: 3, productividad: 5, continuidad: 3 },
      [{ id: "test", impacto: "critico" }],
      ecosistema
    );

    assert.ok(conPenalizacion.score_global < sinPenalizacion.score_global);
    assert.equal(conPenalizacion.penalizacion_total, 30);
  });

  it("score no baja de 0", () => {
    const { score_global } = calcularScoreGlobal(
      { seguridad: 0, productividad: 1, continuidad: 0 },
      [
        { id: "r1", impacto: "critico" },
        { id: "r2", impacto: "critico" },
      ],
      ecosistema
    );
    assert.equal(score_global, 0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// interpretarResultado
// ═══════════════════════════════════════════════════════════════════════
describe("interpretarResultado", () => {
  it("genera diagnóstico con mensaje, nivel, resumen y recomendaciones", () => {
    const errores = [
      { componente: "equipos_computo", faltantes: ["seguridad_endpoint"], severidad: "alto" },
    ];
    const riesgos = [
      { id: "perdida_informacion", impacto: "critico", descripcion: "No hay recuperación" },
    ];

    const diag = interpretarResultado("fragmentado", errores, riesgos, ecosistema);

    assert.ok(diag.mensaje);
    assert.ok(diag.nivel);
    assert.ok(diag.resumen);
    assert.ok(Array.isArray(diag.recomendaciones));
    assert.ok(diag.recomendaciones.length > 0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// generarInsights
// ═══════════════════════════════════════════════════════════════════════
describe("generarInsights", () => {
  it("genera insights basados en reglas del JSON", () => {
    const insights = generarInsights(
      ["equipos_computo"],
      { seguridad: 0, productividad: 2, continuidad: 0 },
      [{ id: "vulnerabilidad_ciberseguridad", impacto: "alto" }],
      [],
      ecosistema
    );

    assert.ok(insights.length > 0);
    assert.ok(insights.every((i) => typeof i === "string"));
  });

  it("detecta sinergias cercanas (falta 1 componente)", () => {
    const insights = generarInsights(
      ["seguridad_endpoint"],
      { seguridad: 3, productividad: 0, continuidad: 0 },
      [],
      [],
      ecosistema
    );

    const cercana = insights.find((i) => i.includes("Protección Integral"));
    assert.ok(cercana, "Debe detectar sinergia proteccion_integral cercana");
  });
});

// ═══════════════════════════════════════════════════════════════════════
// generarTensionNarrativa
// ═══════════════════════════════════════════════════════════════════════
describe("generarTensionNarrativa", () => {
  it("retorna las 7 estructuras narrativas", () => {
    const resultado = evaluarEcosistema(["equipos_computo"], ecosistema);
    const tension = generarTensionNarrativa(resultado, ecosistema);

    assert.ok("impacto_negocio" in tension);
    assert.ok("urgencia_accion" in tension);
    assert.ok("acciones_priorizadas" in tension);
    assert.ok("comparativa" in tension);
    assert.ok("progreso" in tension);
    assert.ok("evento_final" in tension);
    assert.ok("narrativa" in tension);
  });

  it("urgencia_accion tiene tiempo y presión para fragmentado", () => {
    const resultado = evaluarEcosistema(["equipos_computo", "backup"], ecosistema);
    const { urgencia_accion } = generarTensionNarrativa(resultado, ecosistema);

    assert.equal(urgencia_accion.tiempo_estimado, "inmediato");
    assert.ok(urgencia_accion.mensaje.length > 0);
    assert.ok(urgencia_accion.mensaje.includes("protección"));
  });

  it("acciones tienen branding Open Group y campo valor", () => {
    const resultado = evaluarEcosistema(["equipos_computo", "backup"], ecosistema);
    const { acciones_priorizadas } = generarTensionNarrativa(resultado, ecosistema);

    assert.ok(acciones_priorizadas.length > 0);
    assert.ok(acciones_priorizadas.length <= 3);

    for (const a of acciones_priorizadas) {
      assert.ok(a.accion.includes("Open Group"), `Acción debe mencionar Open Group: ${a.accion}`);
      assert.ok(a.valor, "Cada acción debe tener campo valor");
      assert.ok(a.valor.length > 0);
      assert.ok(typeof a.prioridad === "number");
    }
  });

  it("comparativa tiene antes y después con Open Group", () => {
    const resultado = evaluarEcosistema(["equipos_computo", "backup"], ecosistema);
    const { comparativa } = generarTensionNarrativa(resultado, ecosistema);

    assert.ok(comparativa.antes);
    assert.ok(comparativa.despues);
    assert.ok(comparativa.despues.includes("Open Group"));
  });

  it("progreso tiene mensaje emocional, tono y siguiente_logro", () => {
    const resultado = evaluarEcosistema(
      ["equipos_computo", "software_colaboracion", "seguridad_endpoint"],
      ecosistema
    );
    const { progreso } = generarTensionNarrativa(resultado, ecosistema);

    assert.equal(progreso.actual, resultado.score_global);
    assert.equal(progreso.objetivo, 85);
    assert.ok(progreso.mensaje, "Debe tener mensaje emocional");
    assert.ok(progreso.tono, "Debe tener tono");
    assert.ok(progreso.siguiente_logro, "Debe tener siguiente logro");
  });

  it("evento_final conecta con negocio e impacto", () => {
    const completo = evaluarEcosistema(
      ["equipos_computo", "perifericos_colaboracion", "software_colaboracion",
       "seguridad_endpoint", "backup", "soporte_servicios"],
      ecosistema
    );
    const { evento_final } = generarTensionNarrativa(completo, ecosistema);

    assert.equal(evento_final.trigger, true);
    assert.ok(evento_final.mensaje.length > 0);
    assert.ok(evento_final.impacto_negocio.length > 0);
    assert.ok(evento_final.impacto_negocio.includes("Open Group"));
    assert.ok(evento_final.submensaje.length > 0);
  });

  it("evento_final.trigger es false para estados no-inteligentes", () => {
    const parcial = evaluarEcosistema(["equipos_computo"], ecosistema);
    const { evento_final } = generarTensionNarrativa(parcial, ecosistema);
    assert.equal(evento_final.trigger, false);
  });

  it("narrativa adapta headline al estado", () => {
    const frag = evaluarEcosistema(["equipos_computo", "backup"], ecosistema);
    const { narrativa: nFrag } = generarTensionNarrativa(frag, ecosistema);
    assert.ok(nFrag.headline.includes("riesgo"));

    const completo = evaluarEcosistema(
      ["equipos_computo", "perifericos_colaboracion", "software_colaboracion",
       "seguridad_endpoint", "backup", "soporte_servicios"],
      ecosistema
    );
    const { narrativa: nComp } = generarTensionNarrativa(completo, ecosistema);
    assert.ok(nComp.headline.includes("integrado"));
  });

  it("acciones vacías cuando no hay riesgos ni errores", () => {
    const completo = evaluarEcosistema(
      ["equipos_computo", "perifericos_colaboracion", "software_colaboracion",
       "seguridad_endpoint", "backup", "soporte_servicios"],
      ecosistema
    );
    const { acciones_priorizadas } = generarTensionNarrativa(completo, ecosistema);
    assert.equal(acciones_priorizadas.length, 0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// evaluarEcosistema — integración completa
// ═══════════════════════════════════════════════════════════════════════
describe("evaluarEcosistema — integración", () => {
  it("output tiene forma completa para frontend (incluyendo narrativa)", () => {
    const resultado = evaluarEcosistema(
      ["equipos_computo", "software_colaboracion"],
      ecosistema
    );

    // Campos v2.0
    assert.ok("estado" in resultado);
    assert.ok("nivel" in resultado);
    assert.ok("score_global" in resultado);
    assert.ok("color" in resultado);
    assert.ok("metricas" in resultado);
    assert.ok("riesgos" in resultado);
    assert.ok("sinergias_activadas" in resultado);
    assert.ok("errores" in resultado);
    assert.ok("diagnostico" in resultado);
    assert.ok("insights" in resultado);
    assert.ok("_meta" in resultado);

    // Campos v2.1 — tensión narrativa
    assert.ok("impacto_negocio" in resultado);
    assert.ok("urgencia_accion" in resultado);
    assert.ok("acciones_priorizadas" in resultado);
    assert.ok("comparativa" in resultado);
    assert.ok("progreso" in resultado);
    assert.ok("evento_final" in resultado);
    assert.ok("narrativa" in resultado);
  });

  it("escenario fragmentado con narrativa completa", () => {
    const r = evaluarEcosistema(["equipos_computo", "backup"], ecosistema);
    assert.equal(r.estado, "fragmentado");
    assert.equal(r.nivel, 1);
    assert.equal(r.color, "rojo");
    assert.ok(r.riesgos.length > 0);
    assert.ok(r.diagnostico.recomendaciones.length > 0);
    assert.equal(r.impacto_negocio.urgencia, "alta");
    assert.equal(r.urgencia_accion.tiempo_estimado, "inmediato");
    assert.ok(r.acciones_priorizadas.length > 0);
    assert.ok(r.acciones_priorizadas[0].valor);
    assert.ok(r.comparativa.antes);
    assert.ok(r.comparativa.despues);
    assert.ok(r.progreso.mensaje);
    assert.equal(r.evento_final.trigger, false);
  });

  it("escenario ecosistema inteligente con wow event", () => {
    const r = evaluarEcosistema(
      ["equipos_computo", "perifericos_colaboracion", "software_colaboracion",
       "seguridad_endpoint", "backup", "soporte_servicios"],
      ecosistema
    );
    assert.equal(r.estado, "ecosistema_inteligente");
    assert.equal(r.nivel, 4);
    assert.equal(r.color, "verde");
    assert.equal(r.riesgos.length, 0);
    assert.equal(r.errores.length, 0);
    assert.ok(r.score_global > 70);
    assert.equal(r.evento_final.trigger, true);
    assert.ok(r.evento_final.impacto_negocio.includes("Open Group"));
    assert.equal(r.impacto_negocio.urgencia, "baja");
    assert.equal(r.urgencia_accion.tiempo_estimado, "mantenimiento");
    assert.equal(r.acciones_priorizadas.length, 0);
  });

  it("score 100 con ecosistema completo", () => {
    const r = evaluarEcosistema(
      ["equipos_computo", "perifericos_colaboracion", "software_colaboracion",
       "seguridad_endpoint", "backup", "soporte_servicios", "mobiliario", "modelo_daas"],
      ecosistema
    );
    assert.equal(r.score_global, 100);
    assert.equal(r.progreso.faltante, 0);
  });

  it("sinergias_activadas son objetos, no strings", () => {
    const r = evaluarEcosistema(
      ["equipos_computo", "software_colaboracion"],
      ecosistema
    );

    for (const s of r.sinergias_activadas) {
      assert.ok(typeof s === "object");
      assert.ok(s.id);
      assert.ok(s.nombre);
      assert.ok(Array.isArray(s.componentes));
    }
  });

  it("componentes inexistentes van a _meta.advertencias", () => {
    const r = evaluarEcosistema(
      ["equipos_computo", "componente_falso"],
      ecosistema
    );
    assert.ok(r._meta.advertencias);
    assert.ok(r._meta.advertencias.length > 0);
  });
});
