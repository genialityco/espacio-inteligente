import { useState, useEffect } from 'react';
import QRScanner from './QRScanner';

const ROLES = ['CEO / Dirección', 'CIO / CTO', 'IT Manager', 'Operaciones', 'Innovación', 'Otro'];
const SIZES = ['1–10', '11–50', '51–200', '201–1000', '1000+'];

function sessionLabel() {
  const d = new Date();
  return `ESP-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function RegisterScreen({ onRegister }) {
  const [nombre,    setNombre]    = useState('');
  const [empresa,   setEmpresa]   = useState('');
  const [rol,       setRol]       = useState('');
  const [tamano,    setTamano]    = useState('');
  const [showQR,    setShowQR]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liveCount, setLiveCount] = useState(142);

  const canSubmit = nombre.trim().length >= 2;

  useEffect(() => {
    const id = setInterval(() => {
      setLiveCount(n => Math.max(120, Math.min(180, n + (Math.random() < 0.5 ? -1 : 1))));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const handleQRResult = ({ nombre: n, raw }) => {
    setNombre(n);
    if (raw.empresa) setEmpresa(raw.empresa);
    if (raw.rol)     setRol(raw.rol);
    setShowQR(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      onRegister({ nombre: nombre.trim(), empresa: empresa.trim(), rol, tamano });
    }, 900);
  };

  return (
    <div className="ac-stage">

      <div className="ac-content">

        {/* ── Top bar ── */}
        <header className="ac-topbar">
          <div className="brand-mark">
            <img src="/CORTES/LOGO-OPEN-FORUM.png" alt="Open Forum" className="brand-logo" />
          </div>
          <div className="ac-step" aria-label="Paso 1 de 3">
            <span>Paso 01 / 03</span>
            <span className="ac-pips" aria-hidden="true">
              <span className="ac-pip on" />
              <span className="ac-pip" />
              <span className="ac-pip" />
            </span>
          </div>
        </header>

        {/* ── Card ── */}
        <section className="ac-card">
          <div className="ac-card-head">
            <span className="ac-eyebrow">Espacio Inteligente · Reto</span>
            <h1 className="ac-title">Activa tu <span className="title-glow">acceso</span></h1>
            <p className="ac-subtitle">Identifícate para entrar al simulador y descubrir el nivel de inteligencia de tu ecosistema tecnológico.</p>
          </div>

          <form className="ac-form" onSubmit={handleSubmit} noValidate>

            {/* Name */}
            <div className="ac-field">
              <label className="ac-field-label" htmlFor="reg-name">Identifícate</label>
              <div className={`ac-input-wrap${canSubmit ? ' has-value' : ''}`}>
                <span className="ac-lead" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  className="ac-input"
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  aria-required="true"
                  autoFocus
                />
                <span className="ac-badge">OK</span>
              </div>
            </div>

            {/* Company */}
            <div className="ac-field">
              <label className="ac-field-label" htmlFor="reg-company">Empresa</label>
              <div className="ac-input-wrap">
                <span className="ac-lead" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/>
                    <path d="M9 9h.01M13 9h.01M9 13h.01M13 13h.01M9 17h.01M13 17h.01"/>
                  </svg>
                </span>
                <input
                  className="ac-input"
                  id="reg-company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Nombre de tu empresa"
                  value={empresa}
                  onChange={e => setEmpresa(e.target.value)}
                />
              </div>
            </div>

            {/* Role + Size */}
            <div className="ac-row-2">
              <div className="ac-field">
                <label className="ac-field-label" htmlFor="reg-role">Rol</label>
                <div className="ac-select-wrap">
                  <span className="ac-lead" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </span>
                  <select className="ac-select" id="reg-role" value={rol} onChange={e => setRol(e.target.value)}>
                    <option value="">Selecciona…</option>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="ac-field">
                <label className="ac-field-label" htmlFor="reg-size">Tamaño</label>
                <div className="ac-select-wrap">
                  <span className="ac-lead" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </span>
                  <select className="ac-select" id="reg-size" value={tamano} onChange={e => setTamano(e.target.value)}>
                    <option value="">Equipo…</option>
                    {SIZES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="ac-divider" aria-hidden="true">o</div>

            <button type="button" className="ac-btn-secondary" onClick={() => setShowQR(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <path d="M14 14h3v3"/><path d="M21 21h-4v-4"/><path d="M14 21v-3"/>
              </svg>
              Escanear código QR de mi invitación
            </button>

            <div className="ac-actions">
              <button type="submit" className="ac-btn-primary" disabled={!canSubmit || submitting}>
                <span>{submitting ? 'Activando…' : 'Iniciar simulación'}</span>
                {!submitting && (
                  <span className="ac-arrow" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><path d="M13 5l7 7-7 7"/>
                    </svg>
                  </span>
                )}
              </button>
              <p className="ac-privacy">Tu información se utiliza únicamente para personalizar el reto.</p>
            </div>

          </form>
        </section>

        {/* ── Footer ── */}
        <footer className="ac-footer">
          <span className="ac-live">
            <span className="ac-live-dot" />
            <span>{liveCount} jugadores activos</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Sesión #{sessionLabel()}</span>
        </footer>

      </div>

      {showQR && <QRScanner onResult={handleQRResult} onClose={() => setShowQR(false)} />}
    </div>
  );
}
