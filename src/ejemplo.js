/**
 * @file ejemplo.js
 * @description Ejemplo de ejecución del motor v2.1 — con tensión narrativa completa.
 *
 * Ejecutar:  npm run evaluar
 *         o: node frontend/src/ejemplo.js
 */

import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluarEcosistema } from "./engine/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(__dirname, "data", "ecosistema_inteligente.json");
const ecosistema = JSON.parse(await readFile(jsonPath, "utf-8"));

const escenarios = [
  {
    nombre: "🔴 Fragmentado",
    seleccion: ["equipos_computo", "backup"],
  },
  {
    nombre: "🟡 Parcial",
    seleccion: ["equipos_computo", "software_colaboracion", "seguridad_endpoint"],
  },
  {
    nombre: "🌟 Ecosistema Inteligente",
    seleccion: [
      "equipos_computo", "perifericos_colaboracion", "software_colaboracion",
      "seguridad_endpoint", "backup", "soporte_servicios",
    ],
  },
];

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║    MOTOR DEL ECOSISTEMA INTELIGENTE v2.1 — OPEN GROUP      ║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

for (const { nombre, seleccion } of escenarios) {
  const r = evaluarEcosistema(seleccion, ecosistema);

  console.log(`─── ${nombre} ───`);
  console.log(`Selección: [${seleccion.join(", ")}]\n`);

  // Narrativa
  console.log(`  📢 ${r.narrativa.headline}`);
  console.log(`     ${r.narrativa.submensaje}\n`);

  // Impacto + Urgencia de acción
  console.log(`  ⚡ Urgencia: ${r.impacto_negocio.urgencia.toUpperCase()} | Impacto: ${r.impacto_negocio.nivel_impacto}`);
  console.log(`     ${r.impacto_negocio.mensaje}`);
  console.log(`     → ${r.impacto_negocio.consecuencia}`);
  console.log(`  ⏰ Actuar: ${r.urgencia_accion.tiempo_estimado.toUpperCase()}`);
  console.log(`     ${r.urgencia_accion.mensaje}\n`);

  // Comparativa antes/después
  console.log(`  🔄 ANTES:   ${r.comparativa.antes}`);
  console.log(`     DESPUÉS: ${r.comparativa.despues}\n`);

  // Progreso emocional
  const p = r.progreso;
  const barLen = 25;
  const filled = Math.round((p.actual / p.objetivo) * barLen);
  const bar = "█".repeat(Math.min(filled, barLen)) + "░".repeat(Math.max(0, barLen - filled));
  console.log(`  📊 [${bar}] ${p.actual}/${p.objetivo}`);
  console.log(`     ${p.mensaje} (${p.tono})`);
  if (p.siguiente_logro) {
    console.log(`     🎯 Siguiente: ${p.siguiente_logro}`);
  }
  console.log();

  // Acciones priorizadas
  if (r.acciones_priorizadas.length > 0) {
    console.log("  🎯 Acciones priorizadas:");
    for (const a of r.acciones_priorizadas) {
      console.log(`     ${a.prioridad}. ${a.accion}`);
      console.log(`        → ${a.impacto}`);
      console.log(`        ✦ ${a.valor}`);
    }
    console.log();
  }

  // Evento wow
  if (r.evento_final.trigger) {
    console.log(`  🎆 ${r.evento_final.mensaje}`);
    console.log(`     💼 ${r.evento_final.impacto_negocio}`);
    console.log(`     ${r.evento_final.submensaje}`);
    console.log();
  }

  console.log("═".repeat(64) + "\n");
}
