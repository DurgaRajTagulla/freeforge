import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Plus, Minus, X } from 'lucide-react';
import './SignalPlotter.css';

const TYPES = ['Sine', 'Square', 'Triangle', 'Sawtooth', 'AM', 'FM'];

const FORMULAS = {
  Sine: 'y(t) = A · sin(2πft + φ) + DC',
  Square: 'y(t) = A · sgn(sin(2πft + φ)) + DC',
  Triangle: 'y(t) = A · tri(2πft + φ) + DC',
  Sawtooth: 'y(t) = A · saw(2πft + φ) + DC',
  AM: 'y(t) = A · sin(2πf_ct) · sin(2πf_mt)',
  FM: 'y(t) = A · sin(2πf_ct + β·sin(2πf_mt))',
};

function computeSignal(type, t, freq, amp, phase, dc, duty) {
  const omega = 2 * Math.PI * freq;
  const ph = phase * (Math.PI / 180);
  let val = 0;
  switch (type) {
    case 'Sine':
      val = Math.sin(omega * t + ph);
      break;
    case 'Square': {
      const s = Math.sin(omega * t + ph);
      val = s >= Math.cos(Math.PI * (1 - duty / 100)) ? 1 : -1;
      break;
    }
    case 'Triangle': {
      const p = ((omega * t + ph) / (2 * Math.PI)) % 1;
      const pPos = p < 0 ? p + 1 : p;
      val = pPos < duty / 100 ? 4 * (pPos / (duty / 100)) - 1 : 3 - 4 * ((pPos - duty / 100) / (1 - duty / 100));
      break;
    }
    case 'Sawtooth': {
      const p = ((omega * t + ph) / (2 * Math.PI)) % 1;
      val = 2 * (p < 0 ? p + 1 : p) - 1;
      break;
    }
    case 'AM':
      val = Math.sin(2 * Math.PI * 1 * t + ph) * Math.sin(omega * t);
      break;
    case 'FM':
      val = Math.sin(omega * t + ph + 3 * Math.sin(2 * Math.PI * 0.5 * t));
      break;
  }
  return val * amp + dc;
}

function computeMeasurements(type, freq, amp, dc, duty) {
  const period = freq > 0 ? 1 / freq : 0;
  const vpp = 2 * amp;
  let vrms = 0;
  switch (type) {
    case 'Sine': vrms = amp / Math.SQRT2; break;
    case 'Square': vrms = amp; break;
    case 'Triangle': vrms = amp / Math.sqrt(3); break;
    case 'Sawtooth': vrms = amp / Math.sqrt(3); break;
    default: vrms = amp / Math.SQRT2; break;
  }
  return { freq, period: period.toFixed(4), vpp: vpp.toFixed(2), vrms: vrms.toFixed(2), duty: type === 'Square' ? duty : 50 };
}

export default function SignalPlotter() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timeRef = useRef(0);
  const [running, setRunning] = useState(true);

  const [chA, setChA] = useState({ type: 'Sine', freq: 2, amp: 2, phase: 0, dc: 0, duty: 50, visible: true });
  const [chB, setChB] = useState({ type: 'Square', freq: 4, amp: 1.5, phase: 45, dc: 0, duty: 50, visible: true });
  const [mathMode, setMathMode] = useState('off');
  const [crosshair, setCrosshair] = useState(null);

  const W = 760, H = 320;
  const midY = H / 2;
  const timeWindow = 2;

  const channelConfigs = [
    { label: 'A', color: '#f97316', state: chA, setState: setChA },
    { label: 'B', color: '#06b6d4', state: chB, setState: setChB },
  ];

  const updateCh = useCallback((ch, field, value) => {
    const setter = ch === 'A' ? setChA : setChB;
    setter(prev => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      for (let x = 0; x < W; x += 76) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();
      ctx.setLineDash([]);

      const sampleSignal = (ch, tOffset) => {
        const pts = [];
        for (let px = 0; px < W; px++) {
          const tVal = (px / W) * timeWindow + tOffset;
          pts.push(computeSignal(ch.type, tVal, ch.freq, ch.amp, ch.phase, ch.dc, ch.duty));
        }
        return pts;
      };

      const scale = (H / 2 - 10) / 5;

      const drawTrace = (pts, color, label) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let px = 0; px < pts.length; px++) {
          const y = midY - pts[px] * scale;
          if (px === 0) ctx.moveTo(px, y);
          else ctx.lineTo(px, y);
        }
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = 'bold 11px monospace';
        ctx.fillText(label, 8, 16);
      };

      const ptsA = chA.visible ? sampleSignal(chA, t) : null;
      const ptsB = chB.visible ? sampleSignal(chB, t) : null;

      if (ptsA) drawTrace(ptsA, chA.visible ? '#f97316' : 'transparent', 'CH A');
      if (ptsB) drawTrace(ptsB, chB.visible ? '#06b6d4' : 'transparent', 'CH B');

      if (mathMode !== 'off' && ptsA && ptsB) {
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        for (let px = 0; px < W; px++) {
          let val = 0;
          if (mathMode === 'A+B') val = ptsA[px] + ptsB[px];
          else if (mathMode === 'A-B') val = ptsA[px] - ptsB[px];
          else if (mathMode === 'A×B') val = ptsA[px] * ptsB[px];
          const y = midY - val * scale;
          if (px === 0) ctx.moveTo(px, y);
          else ctx.lineTo(px, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`CH A ${mathMode === 'A+B' ? '+' : mathMode === 'A-B' ? '−' : '×'} CH B`, 8, 32);
      }

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText('1 div = 1 V', 10, H - 8);
      ctx.fillText('1 div = ' + (timeWindow / 10).toFixed(2) + ' s', W - 120, H - 8);

      ctx.fillStyle = '#475569';
      ctx.font = '9px monospace';
      for (let i = -5; i <= 5; i++) {
        const y = midY - i * scale;
        ctx.fillText(i, 2, y + 3);
      }

      if (crosshair) {
        const cx = crosshair.x;
        const cy = crosshair.y;
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
        ctx.setLineDash([]);

        const tVal = (cx / W) * timeWindow;
        const vVal = ((midY - cy) / scale);
        ctx.fillStyle = 'rgba(15,23,42,0.85)';
        ctx.fillRect(cx + 8, cy - 28, 160, 22);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx + 8, cy - 28, 160, 22);
        ctx.fillStyle = '#f1f5f9';
        ctx.font = '10px monospace';
        ctx.fillText(`t = ${tVal.toFixed(3)} s  v = ${vVal.toFixed(3)} V`, cx + 14, cy - 12);
      }

      if (running) {
        timeRef.current += 0.016;
        animRef.current = requestAnimationFrame(() => draw(timeRef.current));
      }
    };

    draw(timeRef.current);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [chA, chB, mathMode, running, W, H, midY, timeWindow, crosshair]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = W / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleX;
    if (x >= 0 && x < W && y >= 0 && y < H) setCrosshair({ x, y });
  };

  const handleMouseLeave = () => setCrosshair(null);

  return (
    <div className="sp-page">
      <div className="sp-header">
        <button className="sp-back" onClick={() => navigate('/ece-hub')}><ArrowLeft size={20} /></button>
        <h1 className="sp-title">Signal Plotter</h1>
      </div>
      <div className="sp-body">
        <div className="sp-types">
          {TYPES.map(t => (
            <button key={t} className={`sp-type-btn ${chA.type === t ? 'active' : ''}`} onClick={() => { updateCh('A', 'type', t); updateCh('B', 'type', t); }}>{t}</button>
          ))}
        </div>

        <div className="sp-canvas-wrap">
          <canvas ref={canvasRef} width={W} height={H} className="sp-canvas" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
        </div>

        <div className="sp-formula">
          {FORMULAS[chA.type]}
        </div>

        <div className="sp-channels">
          {channelConfigs.map(ch => (
            <div key={ch.label} className="sp-channel" style={{ borderColor: ch.color + '44' }}>
              <div className="sp-ch-hdr">
                <span className="sp-ch-label" style={{ color: ch.color }}>CH {ch.label}</span>
                <button className="sp-vis-btn" onClick={() => ch.setState(p => ({ ...p, visible: !p.visible }))} style={{ color: ch.state.visible ? ch.color : '#475569' }}>
                  {ch.state.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
              <div className="sp-ch-controls">
                <div className="sp-ch-row">
                  <span className="sp-ch-param">Freq</span>
                  <input type="range" min={0.5} max={20} step={0.5} value={ch.state.freq} onChange={e => ch.setState(p => ({ ...p, freq: parseFloat(e.target.value) }))} className="sp-slider" style={{ accentColor: ch.color }} />
                  <span className="sp-ch-val">{ch.state.freq} Hz</span>
                </div>
                <div className="sp-ch-row">
                  <span className="sp-ch-param">Amp</span>
                  <input type="range" min={0.5} max={5} step={0.5} value={ch.state.amp} onChange={e => ch.setState(p => ({ ...p, amp: parseFloat(e.target.value) }))} className="sp-slider" style={{ accentColor: ch.color }} />
                  <span className="sp-ch-val">{ch.state.amp} V</span>
                </div>
                <div className="sp-ch-row">
                  <span className="sp-ch-param">Phase</span>
                  <input type="range" min={0} max={360} step={15} value={ch.state.phase} onChange={e => ch.setState(p => ({ ...p, phase: parseInt(e.target.value) }))} className="sp-slider" style={{ accentColor: ch.color }} />
                  <span className="sp-ch-val">{ch.state.phase}°</span>
                </div>
                <div className="sp-ch-row">
                  <span className="sp-ch-param">DC</span>
                  <input type="range" min={-3} max={3} step={0.5} value={ch.state.dc} onChange={e => ch.setState(p => ({ ...p, dc: parseFloat(e.target.value) }))} className="sp-slider" style={{ accentColor: ch.color }} />
                  <span className="sp-ch-val">{ch.state.dc > 0 ? '+' : ''}{ch.state.dc} V</span>
                </div>
                <div className="sp-ch-row">
                  <span className="sp-ch-param">Duty</span>
                  <input type="range" min={10} max={90} step={5} value={ch.state.duty} onChange={e => ch.setState(p => ({ ...p, duty: parseInt(e.target.value) }))} className="sp-slider" style={{ accentColor: ch.color }} />
                  <span className="sp-ch-val">{ch.state.duty}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sp-math">
          <span className="sp-math-label">Math:</span>
          {['off', 'A+B', 'A-B', 'A×B'].map(m => (
            <button key={m} className={`sp-math-btn ${mathMode === m ? 'active' : ''}`} onClick={() => setMathMode(m)}>{m}</button>
          ))}
        </div>

        <div className="sp-measurements">
          {channelConfigs.filter(ch => ch.state.visible).map(ch => {
            const m = computeMeasurements(ch.state.type, ch.state.freq, ch.state.amp, ch.state.dc, ch.state.duty);
            return (
              <div key={ch.label} className="sp-meas" style={{ borderColor: ch.color + '44' }}>
                <div className="sp-meas-title" style={{ color: ch.color }}>CH {ch.label}</div>
                <div className="sp-meas-grid">
                  <span>Freq</span><span className="sp-mv">{m.freq} Hz</span>
                  <span>Period</span><span className="sp-mv">{m.period} s</span>
                  <span>Vpp</span><span className="sp-mv">{m.vpp} V</span>
                  <span>Vrms</span><span className="sp-mv">{m.vrms} V</span>
                  <span>Duty</span><span className="sp-mv">{m.duty}%</span>
                </div>
              </div>
            );
          })}
          {channelConfigs.filter(ch => ch.state.visible).length === 0 && (
            <div className="sp-meas-empty">Enable a channel to see measurements</div>
          )}
        </div>

        <div className="sp-actions">
          <button className="sp-toggle" onClick={() => setRunning(!running)} style={{ background: running ? '#ef4444' : '#22c55e' }}>
            {running ? '⏹ Stop' : '▶ Run'}
          </button>
        </div>
      </div>
    </div>
  );
}
