import { useEffect, useRef } from 'react';

function WaveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const W = 700;
    const H = 120;
    canvas.width = W;
    canvas.height = H;

    const drawWaves = () => {
      ctx.clearRect(0, 0, W, H);
      const sources = [W * 0.35, W * 0.65];
      const imgData = ctx.createImageData(W, H);
      const d = imgData.data;
      const k = 0.18;
      const omega = 1.4;
      const sourceY = H * 0.5;

      for (let x = 0; x < W; x++) {
        for (let y = 0; y < H; y++) {
          let amp = 0;
          sources.forEach(sx => {
            const r = Math.sqrt((x - sx) ** 2 + (y - sourceY) ** 2) + 0.001;
            amp += Math.cos(k * r - omega * time) / Math.sqrt(r * 0.1 + 1);
          });
          const intensity = Math.min(1, ((amp + 2) / 4) ** 2.5);
          const i = (y * W + x) * 4;
          d[i] = Math.floor(intensity * 10);
          d[i + 1] = Math.floor(intensity * 180);
          d[i + 2] = Math.floor(intensity * 220);
          d[i + 3] = Math.floor(intensity * 200);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      time += 0.04;
      animId = requestAnimationFrame(drawWaves);
    };
    drawWaves();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="hero-wave-canvas" aria-hidden="true" />;
}

export default function Hero() {
  const scrollToTimeline = () => {
    const el = document.getElementById('timeline');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">1801 — Present Day</p>
        <h1 className="hero-title">
          <span className="hero-title-line">The Quantum</span>
          <span className="hero-title-line accent">Story</span>
        </h1>
        <p className="hero-subtitle">
          How humanity peered into the invisible and rewrote the laws of reality
        </p>
        <WaveCanvas />
        <p className="hero-wave-caption">
          Wave interference pattern from two coherent sources — as observed by Thomas Young in 1801
        </p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">33</span>
            <span className="stat-label">Milestones</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">5</span>
            <span className="stat-label">Eras</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">221</span>
            <span className="stat-label">Years</span>
          </div>
        </div>
        <button className="hero-cta" onClick={scrollToTimeline}>
          Begin the Journey ↓
        </button>
      </div>
    </header>
  );
}
