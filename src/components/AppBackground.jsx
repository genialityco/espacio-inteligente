import { useEffect } from 'react';

export default function AppBackground() {
  useEffect(() => {
    const layer = document.getElementById('app-bg-particles');
    if (!layer) return;
    const COUNT = 28;
    const nodes = [];
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}vw`;
      p.style.bottom = `${-5 - Math.random() * 10}vh`;
      const size = 1 + Math.random() * 3;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.animationDuration = `${9 + Math.random() * 14}s`;
      p.style.animationDelay = `${-Math.random() * 18}s`;
      p.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
      nodes.push(p);
      layer.appendChild(p);
    }
    return () => nodes.forEach(p => p.remove());
  }, []);

  return (
    <div className="app-bg" aria-hidden="true">
      <div className="stage-rays">
        <div className="ray r1" /><div className="ray r2" />
        <div className="ray r3" /><div className="ray r4" />
      </div>
      <div className="floor-grid" />
      <div className="stage-floor" />
      <div id="app-bg-particles" className="particles" />
    </div>
  );
}
