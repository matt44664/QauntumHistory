import { useEffect, useRef, useState, useCallback } from 'react';

const SIM_W = 380;
const SIM_H = 260;

function renderFrame(ctx, wavelength, slitSep, showOneSlit, time) {
  const imgData = ctx.createImageData(SIM_W, SIM_H);
  const d = imgData.data;
  const k = (2 * Math.PI) / wavelength;
  const omega = 1.8;

  const barrierX = Math.floor(SIM_W * 0.38);
  const cy = Math.floor(SIM_H / 2);
  const half = slitSep / 2;
  const slit1Y = cy - half;
  const slit2Y = cy + half;

  // Left side: incoming plane waves
  for (let x = 0; x < barrierX - 2; x++) {
    const amp = Math.cos(k * x * 1.5 - omega * time);
    const intensity = (amp + 1) * 0.5;
    for (let y = 0; y < SIM_H; y++) {
      const i = (y * SIM_W + x) * 4;
      d[i] = 0;
      d[i + 1] = Math.floor(intensity * 80);
      d[i + 2] = Math.floor(intensity * 160);
      d[i + 3] = Math.floor(intensity * 120);
    }
  }

  // Right side: interference pattern
  for (let x = barrierX + 2; x < SIM_W; x++) {
    for (let y = 0; y < SIM_H; y++) {
      const dx = x - barrierX;
      const dy1 = y - slit1Y;
      const dy2 = y - slit2Y;
      const r1 = Math.sqrt(dx * dx + dy1 * dy1) + 0.001;
      const r2 = Math.sqrt(dx * dx + dy2 * dy2) + 0.001;
      const decay = Math.min(1, 18 / r1);
      const a1 = (Math.cos(k * r1 - omega * time) * decay) / Math.sqrt(r1 * 0.2 + 1);
      const a2 = showOneSlit ? 0 : (Math.cos(k * r2 - omega * time) * decay) / Math.sqrt(r2 * 0.2 + 1);
      const total = a1 + a2;
      const intensity = Math.min(1, (total * total) * 0.22);
      const i = (y * SIM_W + x) * 4;
      d[i] = Math.floor(intensity * 30);
      d[i + 1] = Math.floor(intensity * 210);
      d[i + 2] = Math.floor(intensity * 255);
      d[i + 3] = Math.floor(intensity * 255);
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Draw barrier
  ctx.fillStyle = '#0d0d2b';
  const slitHalfWidth = 4;
  ctx.fillRect(barrierX - 2, 0, 4, Math.max(0, slit1Y - slitHalfWidth));
  ctx.fillRect(barrierX - 2, slit1Y + slitHalfWidth, 4, slit2Y - slit1Y - slitHalfWidth * 2);
  if (!showOneSlit) {
    ctx.fillRect(barrierX - 2, slit2Y + slitHalfWidth, 4, SIM_H - (slit2Y + slitHalfWidth));
  } else {
    ctx.fillRect(barrierX - 2, slit1Y + slitHalfWidth, 4, SIM_H - (slit1Y + slitHalfWidth));
  }

  // Highlight slits with a glow
  ctx.strokeStyle = 'rgba(126, 249, 255, 0.7)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(barrierX, slit1Y - slitHalfWidth);
  ctx.lineTo(barrierX, slit1Y + slitHalfWidth);
  ctx.stroke();
  if (!showOneSlit) {
    ctx.beginPath();
    ctx.moveTo(barrierX, slit2Y - slitHalfWidth);
    ctx.lineTo(barrierX, slit2Y + slitHalfWidth);
    ctx.stroke();
  }
}

export default function DoubleSlit() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timeRef = useRef(0);
  const paramsRef = useRef({ wavelength: 28, slitSep: 40, showOneSlit: false });
  const [wavelength, setWavelength] = useState(28);
  const [slitSep, setSlitSep] = useState(40);
  const [showOneSlit, setShowOneSlit] = useState(false);
  const [running, setRunning] = useState(true);

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
        <canvas
          ref={canvasRef}
          width={SIM_W}
          height={SIM_H}
          className="sim-canvas"
        />
        <div className="sim-annotations">
          <span className="ann-source">Incoming waves →</span>
          <span className="ann-barrier">Barrier</span>
          <span className="ann-screen">Interference pattern</span>
        </div>
      </div>
      <div className="sim-controls">
        <label className="sim-control">
          <span>Wavelength</span>
          <input
            type="range" min="14" max="50" value={wavelength}
            onChange={e => setWavelength(Number(e.target.value))}
          />
          <span className="val">{wavelength}px</span>
        </label>
        <label className="sim-control">
          <span>Slit Separation</span>
          <input
            type="range" min="20" max="80" value={slitSep}
            onChange={e => setSlitSep(Number(e.target.value))}
          />
          <span className="val">{slitSep}px</span>
        </label>
        <div className="sim-buttons">
          <button
            className={`sim-btn ${showOneSlit ? 'active' : ''}`}
            onClick={() => setShowOneSlit(v => !v)}
          >
            {showOneSlit ? 'Single slit' : 'Double slit'}
          </button>
          <button
            className="sim-btn"
            onClick={() => setRunning(v => !v)}
          >
            {running ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  );
}
