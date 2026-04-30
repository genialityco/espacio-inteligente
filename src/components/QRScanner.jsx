import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function parseQR(text) {
  try {
    const data = JSON.parse(text);
    return { nombre: data.nombre ?? data.name ?? text, raw: data };
  } catch {
    return { nombre: text.trim(), raw: {} };
  }
}

export default function QRScanner({ onResult, onClose }) {
  const startedRef = useRef(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const scanner = new Html5Qrcode('qr-video-container');
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 12, qrbox: { width: 220, height: 220 } },
        (text) => {
          scanner.stop().catch(() => {});
          onResult(parseQR(text));
        },
        () => {}
      )
      .catch(() => onClose());

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="qr-overlay" onClick={onClose}>
      <div className="qr-panel" onClick={e => e.stopPropagation()}>
        <div className="qr-panel-head">
          <h3 className="qr-panel-title">Escanea tu invitación</h3>
          <p className="qr-panel-sub">Apunta la cámara al QR para ingresar automáticamente.</p>
        </div>
        <div className="qr-frame">
          <div className="qr-corners" aria-hidden="true">
            <span className="qr-corner tl" /><span className="qr-corner tr" />
            <span className="qr-corner bl" /><span className="qr-corner br" />
          </div>
          <div className="qr-scan-line" aria-hidden="true" />
          <div id="qr-video-container" className="qr-feed" />
        </div>
        <button className="qr-cancel-btn" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
