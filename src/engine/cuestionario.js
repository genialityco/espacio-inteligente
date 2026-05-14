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
// Las intercala para que las de conocimiento no aparezcan juntas.
export function seleccionarPreguntas() {
  const todas = shuffle(cuestionarioData.preguntas_todas_correctas.preguntas)
    .slice(0, 4)
    .map(p => ({ ...p, tipo: 'todas_correctas' }));

  const unicas = shuffle(cuestionarioData.preguntas_unica_correcta.preguntas)
    .slice(0, 2)
    .map(p => ({ ...p, tipo: 'unica_correcta' }));

  // Intercala: posiciones 1 y 4 (0-indexed) son preguntas de conocimiento
  return [todas[0], unicas[0], todas[1], todas[2], unicas[1], todas[3]];
}
