/**
 * exportar.js — Genera un HTML con todas las preguntas y respuestas por sector.
 * Ejecutar: node frontend/src/exportar.js   (desde la raíz del proyecto)
 *       o:  npm run exportar                (desde frontend/)
 *
 * Output: preguntas-export.html  (abrir en navegador → Ctrl+P → Guardar como PDF)
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTORES } from './data/sectores.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath  = resolve(__dirname, 'data', 'ecosistema_inteligente.json');
const ecosistema = JSON.parse(await readFile(jsonPath, 'utf-8'));

const LETRAS = ['A', 'B', 'C', 'D'];

const TIPO = {
  correcta:   { label: 'Óptima',     color: '#16a34a', bg: '#f0fdf4', border: '#86efac', icon: '✅' },
  suboptima:  { label: 'Subóptima',  color: '#b45309', bg: '#fffbeb', border: '#fcd34d', icon: '⚠️' },
  incorrecta: { label: 'Incorrecta', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', icon: '❌' },
};

const RIESGO_COLOR = { critico: '#dc2626', alto: '#ea580c', medio: '#d97706' };

function buildOpcion(baseOpt, sectorOpt, idx) {
  const t      = TIPO[baseOpt.tipo];
  const letra  = LETRAS[idx];
  const comps  = (baseOpt.componentes || []).map(id => ecosistema.componentes[id]);
  const riesgoId = baseOpt.riesgo_forzado || baseOpt.riesgo_oculto || null;
  const riesgo   = riesgoId ? ecosistema.riesgos[riesgoId] : null;
  const riesgoVis = baseOpt.riesgo_forzado ? 'inmediato' : 'oculto';

  // Métricas totales ganadas
  const metricas = {};
  for (const c of comps) {
    for (const [k, v] of Object.entries(c?.aporta ?? {})) {
      metricas[k] = (metricas[k] || 0) + v;
    }
  }

  const metricasHtml = Object.keys(metricas).length
    ? Object.entries(metricas).map(([k, v]) =>
        `<span class="badge badge-metric">+${v} ${k}</span>`).join(' ')
    : '<span class="none">sin ganancia de métricas</span>';

  const compsHtml = comps.length
    ? comps.map(c => `<li><strong>${c.nombre}</strong> <em>(${c.tipo})</em> — ${
        Object.entries(c.aporta).map(([k,v]) => `+${v} ${k}`).join(', ')
      }</li>`).join('')
    : '<li class="none">Ninguno</li>';

  const riesgoHtml = riesgo
    ? `<div class="riesgo" style="border-left-color:${RIESGO_COLOR[riesgo.impacto]}">
        <span class="riesgo-label" style="color:${RIESGO_COLOR[riesgo.impacto]}">
          ⚠ Riesgo ${riesgo.impacto.toUpperCase()} (${riesgoVis})
        </span>
        <span class="riesgo-id">${riesgoId}</span>
        <p>${riesgo.descripcion}</p>
       </div>`
    : '';

  return `
    <div class="opcion" style="border-color:${t.border};background:${t.bg}">
      <div class="opcion-header" style="color:${t.color}">
        <span class="opcion-letra">${letra}</span>
        <span class="opcion-badge" style="background:${t.color}">${t.icon} ${t.label}</span>
        <span class="opcion-texto">${sectorOpt.texto}</span>
      </div>
      <div class="opcion-body">
        <div class="campo">
          <span class="campo-label">Impacto percibido</span>
          <p>${sectorOpt.impacto}</p>
        </div>
        <div class="campo">
          <span class="campo-label">Métricas ganadas</span>
          <p>${metricasHtml}</p>
        </div>
        <div class="campo">
          <span class="campo-label">Componentes activados</span>
          <ul>${compsHtml}</ul>
        </div>
        ${riesgoHtml}
      </div>
    </div>`;
}

function buildSector(sectorId) {
  const sector  = SECTORES[sectorId];
  const rondas  = ecosistema.simulacion.rondas;

  const rondasHtml = rondas.map((base, i) => {
    const sr = sector.rondas[i];
    const opcionesHtml = base.opciones.map((opt, j) =>
      buildOpcion(opt, sr.opciones[j], j)).join('');
    return `
      <div class="ronda">
        <h3>Ronda ${i + 1} <span class="ronda-id">${base.id}</span></h3>
        <div class="escenario">📍 ${sr.escenario}</div>
        <div class="opciones">${opcionesHtml}</div>
      </div>`;
  }).join('');

  return `
    <section class="sector" id="${sectorId}">
      <div class="sector-header">
        <span class="sector-emoji">${sector.emoji}</span>
        <div>
          <h2>${sector.nombre}</h2>
          <p class="reto">${sector.reto_central}</p>
        </div>
      </div>
      ${rondasHtml}
    </section>`;
}

// Índice de sectores para navegación
const sectoresIds = Object.keys(SECTORES);
const indiceHtml  = sectoresIds.map(id =>
  `<a href="#${id}">${SECTORES[id].emoji} ${SECTORES[id].nombre}</a>`
).join('  ·  ');

const contenidoHtml = sectoresIds.map(buildSector).join('\n<div class="page-break"></div>\n');

const fecha = new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' });

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Espacio Inteligente — Preguntas y Respuestas por Sector</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 13px;
      color: #1e293b;
      background: #fff;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 32px;
      line-height: 1.55;
    }

    /* ── Portada ── */
    .portada { text-align: center; padding: 60px 0 40px; border-bottom: 2px solid #e2e8f0; margin-bottom: 40px; }
    .portada h1 { font-size: 26px; color: #0f172a; margin-bottom: 8px; }
    .portada .sub { color: #64748b; font-size: 14px; margin-bottom: 20px; }
    .portada .fecha { font-size: 12px; color: #94a3b8; }
    .indice { margin-top: 20px; font-size: 13px; }
    .indice a { color: #0ea5e9; text-decoration: none; }
    .indice a:hover { text-decoration: underline; }

    /* ── Sector ── */
    .sector { margin-bottom: 48px; }
    .sector-header {
      display: flex; align-items: flex-start; gap: 16px;
      background: #0f172a; color: #fff;
      padding: 20px 24px; border-radius: 10px;
      margin-bottom: 24px;
    }
    .sector-emoji { font-size: 36px; line-height: 1; }
    .sector-header h2 { font-size: 20px; margin-bottom: 4px; }
    .reto { color: #94a3b8; font-size: 13px; font-style: italic; }

    /* ── Ronda ── */
    .ronda { margin-bottom: 28px; }
    .ronda h3 {
      font-size: 15px; color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px; margin-bottom: 10px;
      display: flex; align-items: center; gap: 10px;
    }
    .ronda-id { font-size: 11px; color: #94a3b8; font-weight: 400; font-family: monospace; }
    .escenario {
      background: #f1f5f9; border-left: 3px solid #0ea5e9;
      padding: 10px 14px; border-radius: 4px;
      font-size: 13px; color: #334155; margin-bottom: 12px;
    }

    /* ── Opción ── */
    .opciones { display: flex; flex-direction: column; gap: 10px; }
    .opcion {
      border: 1.5px solid; border-radius: 8px;
      overflow: hidden;
    }
    .opcion-header {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; font-weight: 600; font-size: 13px;
    }
    .opcion-letra {
      font-size: 16px; font-weight: 800; min-width: 20px;
    }
    .opcion-badge {
      color: #fff; font-size: 11px; padding: 2px 8px;
      border-radius: 999px; white-space: nowrap; flex-shrink: 0;
    }
    .opcion-texto { font-size: 13px; }
    .opcion-body { padding: 10px 14px 12px; display: flex; flex-direction: column; gap: 8px; }

    /* ── Campo ── */
    .campo { font-size: 12.5px; }
    .campo-label {
      display: block; font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: #64748b; margin-bottom: 3px;
    }
    .campo p, .campo ul { color: #334155; }
    .campo ul { padding-left: 16px; }
    .campo ul li { margin-bottom: 2px; }
    .none { color: #94a3b8; font-style: italic; }

    /* ── Badges ── */
    .badge-metric {
      display: inline-block;
      background: #dbeafe; color: #1d4ed8;
      font-size: 11px; font-weight: 600;
      padding: 2px 8px; border-radius: 999px;
      margin-right: 4px;
    }

    /* ── Riesgo ── */
    .riesgo {
      border-left: 3px solid; padding: 8px 12px;
      background: #fff7ed; border-radius: 4px;
      font-size: 12px;
    }
    .riesgo-label { display: block; font-weight: 700; font-size: 11px; margin-bottom: 2px; }
    .riesgo-id { font-family: monospace; font-size: 11px; color: #64748b; }
    .riesgo p { color: #78350f; margin-top: 3px; }

    /* ── Print ── */
    .page-break { page-break-after: always; }
    @media print {
      body { padding: 20px 24px; font-size: 11.5px; }
      .portada { padding: 30px 0 20px; }
      .sector-header { padding: 14px 18px; }
      .opcion-body { padding: 8px 12px; }
      a { color: inherit; text-decoration: none; }
    }
  </style>
</head>
<body>

  <div class="portada">
    <h1>Espacio Inteligente — Open Forum 2025</h1>
    <p class="sub">Preguntas, respuestas y análisis por sector</p>
    <p class="fecha">Generado el ${fecha}</p>
    <div class="indice">${indiceHtml}</div>
  </div>

  ${contenidoHtml}

</body>
</html>`;

const outPath = resolve(__dirname, '../../preguntas-export.html');
await writeFile(outPath, html, 'utf-8');

console.log('\n✅  Archivo generado: preguntas-export.html');
console.log('👉  Ábrelo en Chrome/Edge → Ctrl+P → "Guardar como PDF"\n');
console.log(`    Sectores: ${sectoresIds.length}  ·  Rondas por sector: ${ecosistema.simulacion.rondas.length}`);
console.log(`    Total escenarios: ${sectoresIds.length * ecosistema.simulacion.rondas.length}\n`);
