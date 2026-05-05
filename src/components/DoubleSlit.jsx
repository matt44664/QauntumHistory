import { useEffect, useRef, useState, useCallback } from 'react';

const SIM_W = 380;
const SIM_H = 260;

function renderFrame(ctx, wavelength, slitSep, showOneSlit, time) {
  const k = (2 * Math.PI) / wavelength;
  const omega = 2.0;
  const barrierX = Math.floor(SIM_W * 0.38);
  const cy = SIM_H / 2;
  const slit1Y = cy - slitSep / 2;
  const slit2Y = cy + slitSep / 2;
  const slitHalf = 5;

  // Build entire frame in one ImageData — no offset putImageData call
  const imgData = ctx.createImageData(SIM_W, SIM_H);
  const d = imgData.data;

  for (let y = 0; y < SIM_H; y++) {
    for (let x = 0; x < SIM_W; x++) {
      const idx = (y * SIM_W + x) * 4;
      let r = 8, g = 8, b = 26; // default: background colour

      if (x < barrierX - 2) {
        // Left side — animated plane waves
        const amp = (Math.cos(k * x - omega * time) + 1) * 0.5;
        r = 0;
        g = Math.floor(amp * 90);
        b = Math.floor(amp * 180);

      } else if (x >= barrierX + 3) {
        // Right side — interference pattern
        const dx = x - barrierX;
        const dy1 = y - slit1Y;
        const dy2 = y - slit2Y;
        const r1 = Math.sqrt(dx * dx + dy1 * dy1) || 0.001;
        const r2 = Math.sqrt(dx * dx + dy2 * dy2) || 0.001;

        // Time-averaged intensity — always shows clear fringes
        const pathDiff = r2 - r1;
        const staticI = Math.pow(Math.cos(k * pathDiff / 2), 2);
        const finalI = showOneSlit ? staticI * 0.8 : staticI;

        // Wave-front ripple for animation
        const ripple = (Math.cos(k * r1 - omega * time) + 1) * 0.5;
        const intensity = finalI * (0.6 + 0.4 * ripple);

        r = Math.floor(intensity * 40);
        g = Math.floor(intensity * 210);
        b = Math.floor(intensity * 255);

      } else {
        // Barrier — dark
        r = 10; g = 10; b = 34;
      }

      d[idx]     = r;
      d[idx + 1] = g;
      d[idx + 2] = b;
      d[idx + 3] = 255; // always fully opaque
    }
  }

  // Write entire frame at once — no offset
  ctx.putImageData(imgData, 0, 0);

  // Slit openings: draw on top as cyan glow
  ctx.strokeStyle = 'rgba(126,249,255,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(barrierX, slit1Y - slitHalf);
  ctx.lineTo(barrierX, slit1Y + slitHalf);
  ctx.stroke();
  if (!showOneSlit) {
    ctx.beginPath();
    ctx.moveTo(barrierX, slit2Y - slitHalf);
    ctx.lineTo(barrierX, slit2Y + slitHalf);
    ctx.stroke();
  }
}

export default function DoubleSlit() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const timeRef   = useRef(0);
  const paramsRef = useRef({ wavelength: 28, slitSep: 40, showOneSlit: false });

  const [wavelength,  setWavelength]  = useState(28);
  const [slitSep,     setSlitSep]     = useState(40);
  const [showOneSlit, setShowOneSlit] = useState(false);
  const [running,     setRunning]     = useState(true);

  paramsRef.current = { wavelength, slitSep, showOneSlit };

  const startLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const loop = () => {
      timeRef.current += 0.05;
      const { wavelength: wl, slitSep: ss, showOneSlit: one } = paramsRef.current;
      renderFrame(ctx, wl, ss, one, timeRef.current);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (running) {
      startLoop();
    } else {
      cancelAnimationFrame(animRef.current);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [running, startLoop]);

  return (
    <div className="double-slit-wrapper">
      <p className="sim-label">Interactive Simulation — Young's Double-Slit</p>
      <div className="sim-canvas-container">
        <canvas ref={canvasRef} width={SIM_W} height={SIM_H} className="sim-canvas" />
        <div className="sim-annotations">
          <span className="ann-source">Incoming waves →</span>
          <span className="ann-barrier">Barrier</span>
          <span className="ann-screen">Interference pattern</span>
        </div>
      </div>
      <div className="sim-controls">
        <label className="sim-control">
          <span>Wavelength</span>
          <input type="range" min="14" max="50" value={wavelength}
            onChange={e => setWavelength(Number(e.target.value))} />
          <span className="val">{wavelength}px</span>
        </label>
        <label className="sim-control">
          <span>Slit Separation</span>
          <input type="range" min="20" max="80" value={slitSep}
            onChange={e => setSlitSep(Number(e.target.value))} />
          <span className="val">{slitSep}px</span>
        </label>
        <div className="sim-buttons">
          <button className={`sim-btn ${showOneSlit ? 'active' : ''}`}
            onClick={() => setShowOneSlit(v => !v)}>
            {showOneSlit ? 'Single slit' : 'Double slit'}
          </button>
          <button className="sim-btn" onClick={() => setRunning(v => !v)}>
            {running ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  );
}
