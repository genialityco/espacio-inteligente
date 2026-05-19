import cuestionarioData from './cuestionario.json';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Selecciona 6 preguntas al azar: 4 de todas_correctas + 2 de unica_correcta.
// Q11 (seguridad_endpoint) y Q3 (soporte_servicios) son anclas fijas porque
// equipos_computo — presente en casi toda pregunta — los requiere como dependencia.
// Sin ellas, el motor aplica penalizaciones críticas que llevan el score a 0.
export function seleccionarPreguntas() {
  const preguntas = cuestionarioData.preguntas_todas_correctas.preguntas;
  const ANCHOR_IDS = new Set([3, 11]);
  const anchors = preguntas.filter(p => ANCHOR_IDS.has(p.id));
  const pool = preguntas.filter(p => !ANCHOR_IDS.has(p.id));
  const random2 = shuffle(pool).slice(0, 2);

  const todas = shuffle([...anchors, ...random2])
    .map(p => ({ ...p, tipo: 'todas_correctas' }));

  const unicas = shuffle(cuestionarioData.preguntas_unica_correcta.preguntas)
    .slice(0, 2)
    .map(p => ({ ...p, tipo: 'unica_correcta' }));

  // Intercala: posiciones 1 y 4 (0-indexed) son preguntas de conocimiento
  return [todas[0], unicas[0], todas[1], todas[2], unicas[1], todas[3]];
}
