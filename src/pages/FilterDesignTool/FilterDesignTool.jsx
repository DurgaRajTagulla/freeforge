import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './FilterDesignTool.css';

const FILTERS = ['RC Low-Pass', 'RC High-Pass', 'RL Low-Pass', 'RL High-Pass', 'RLC Band-Pass', 'RLC Band-Stop'];

function safeMag(v) { return Number.isFinite(v) ? Math.max(-60, v) : -60; }
function safeDeg(v) { return Number.isFinite(v) ? v : 0; }

export default function FilterDesignTool() {
  const navigate = useNavigate();
  const [type, setType] = useState('RC Low-Pass');
  const [mode, setMode] = useState('fc');
  const [r, setR] = useState(1000);
  const [c, setC] = useState(1e-7);
  const [l, setL] = useState(0.01);
  const [targetFc, setTargetFc] = useState(1000);
  const [testFreq, setTestFreq] = useState(500);

  const isRC = type.startsWith('RC');
  const isRL = type.startsWith('RL');
  const isRLC = type.startsWith('RLC');
  const isLP = type.endsWith('Low-Pass');
  const isHP = type.endsWith('High-Pass');
  const isBP = type.endsWith('Band-Pass');
  const isBS = type.endsWith('Band-Stop');

  const result = useMemo(() => {
    try {
      if (mode === 'fc') {
        if (isRC) { if (r <= 0 || c <= 0) return null; const fc = 1 / (2 * Math.PI * r * c); return { fc: Number(fc), r, c }; }
        if (isRL) { if (r <= 0 || l <= 0) return null; const fc = r / (2 * Math.PI * l); return { fc: Number(fc), r, l }; }
        if (isRLC) {
          if (r <= 0 || l <= 0 || c <= 0) return null;
          const fc = 1 / (2 * Math.PI * Math.sqrt(l * c));
          const q = (1 / r) * Math.sqrt(l / c);
          if (!Number.isFinite(fc) || !Number.isFinite(q)) return null;
          return { fc, r, l, c, q, bw: fc / q };
        }
      } else {
        if (targetFc <= 0) return null;
        if (isRC) { const rc = 1 / (2 * Math.PI * targetFc); return { fc: targetFc, r: rc / (c > 0 ? c : 1e-9), c: c > 0 ? c : rc / (r > 0 ? r : 1e3) }; }
        if (isRL) { return { fc: targetFc, r, l: r / (2 * Math.PI * targetFc) }; }
        if (isRLC) {
          const lc = 1 / ((2 * Math.PI * targetFc) ** 2);
          const lGuess = l > 0 ? l : 0.01;
          const cGuess = lc / lGuess;
          const q = (1 / r) * Math.sqrt(lGuess / cGuess);
          if (!Number.isFinite(q)) return null;
          return { fc: targetFc, r, l: lGuess, c: cGuess, q, bw: targetFc / q };
        }
      }
    } catch (e) { /* ignore */ }
    return null;
  }, [type, mode, r, c, l, targetFc]);

  const resultFc = result && Number.isFinite(result.fc) ? result.fc : null;
  const resultQ = result && Number.isFinite(result.q) ? result.q : null;

  const getMag = (ratio) => {
    try {
      const q = resultQ || 1;
      if (isRLC) {
        const det = 1 - ratio * ratio;
        const denom = Math.sqrt(det * det + (ratio / q) ** 2);
        if (!Number.isFinite(denom) || denom === 0) return -60;
        if (isBP) return safeMag(20 * Math.log10(ratio / (q * denom)));
        if (isBS) return safeMag(20 * Math.log10(Math.sqrt(det * det) / denom));
      }
      if (isLP) return safeMag(20 * Math.log10(1 / Math.sqrt(1 + ratio * ratio)));
      if (isHP) return safeMag(20 * Math.log10(ratio / Math.sqrt(1 + ratio * ratio)));
    } catch (e) { /* ignore */ }
    return -60;
  };

  const getPhase = (ratio) => {
    try {
      const q = resultQ || 1;
      if (isRLC) {
        const det = 1 - ratio * ratio;
        if (isBP) return safeDeg(Math.atan2(ratio / q, det) * (180 / Math.PI) - 90);
        if (isBS) return safeDeg(-Math.atan2(ratio / q, det) * (180 / Math.PI));
      }
      if (isLP) return safeDeg(-Math.atan(ratio) * (180 / Math.PI));
      if (isHP) return safeDeg(90 - Math.atan(ratio) * (180 / Math.PI));
    } catch (e) { /* ignore */ }
    return 0;
  };

  const plotData = useMemo(() => {
    if (!resultFc) return null;
    const pts = [];
    for (let i = 0; i < 200; i++) {
      const f = (resultFc / 100) * Math.pow(1000, i / 200);
      const ratio = f / resultFc;
      pts.push({ f, mag: getMag(ratio), phase: getPhase(ratio) });
    }
    return pts;
  }, [resultFc, type]);

  const testResponse = useMemo(() => {
    if (!resultFc || testFreq <= 0) return null;
    const ratio = testFreq / resultFc;
    const mag = getMag(ratio);
    const phase = getPhase(ratio);
    return { mag, phase };
  }, [resultFc, testFreq, type]);

  const fcX = resultFc ? Math.round(60 + (Math.log10(resultFc) - Math.log10(resultFc / 100)) / (Math.log10(resultFc * 10) - Math.log10(resultFc / 100)) * 500) : 0;
  const fcY = Math.round(180 - ((-3 + 40) / 50) * 140);

  const CircuitSVG = () => {
    if (isRC && isLP) return (
      <svg viewBox="0 0 300 120" className="fdt-schematic">
        <line x1="10" y1="60" x2="60" y2="60" stroke="#64748b" strokeWidth="1.5" />
        <rect x="60" y="45" width="40" height="30" rx="3" fill="none" stroke="#f97316" strokeWidth="1.5" />
        <text x="80" y="92" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="600">R</text>
        <line x1="100" y1="60" x2="150" y2="60" stroke="#64748b" strokeWidth="1.5" />
        <line x1="150" y1="30" x2="150" y2="90" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="120" y1="90" x2="180" y2="90" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="150" y="105" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="600">C</text>
        <line x1="180" y1="60" x2="230" y2="60" stroke="#64748b" strokeWidth="1.5" />
        <line x1="230" y1="30" x2="230" y2="90" stroke="#64748b" strokeWidth="1.5" />
        <line x1="200" y1="90" x2="260" y2="90" stroke="#64748b" strokeWidth="1.5" />
        <text x="245" y="105" textAnchor="middle" fill="#64748b" fontSize="10">GND</text>
        <text x="10" y="55" fill="#94a3b8" fontSize="10">Vin</text>
        <text x="230" y="55" fill="#94a3b8" fontSize="10">Vout</text>
      </svg>
    );
    if (isRC && isHP) return (
      <svg viewBox="0 0 300 120" className="fdt-schematic">
        <line x1="10" y1="60" x2="60" y2="60" stroke="#64748b" strokeWidth="1.5" />
        <line x1="60" y1="30" x2="60" y2="90" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="30" y1="90" x2="90" y2="90" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="60" y="105" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="600">C</text>
        <line x1="90" y1="60" x2="140" y2="60" stroke="#64748b" strokeWidth="1.5" />
        <rect x="140" y="45" width="40" height="30" rx="3" fill="none" stroke="#f97316" strokeWidth="1.5" />
        <text x="160" y="92" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="600">R</text>
        <line x1="180" y1="60" x2="230" y2="60" stroke="#64748b" strokeWidth="1.5" />
        <line x1="230" y1="30" x2="230" y2="90" stroke="#64748b" strokeWidth="1.5" />
        <line x1="200" y1="90" x2="260" y2="90" stroke="#64748b" strokeWidth="1.5" />
        <text x="245" y="105" textAnchor="middle" fill="#64748b" fontSize="10">GND</text>
        <text x="10" y="55" fill="#94a3b8" fontSize="10">Vin</text>
        <text x="230" y="55" fill="#94a3b8" fontSize="10">Vout</text>
      </svg>
    );
    if (isRL && isLP) return (
      <svg viewBox="0 0 300 120" className="fdt-schematic">
        <line x1="10" y1="60" x2="60" y2="60" stroke="#64748b" strokeWidth="1.5" />
        <rect x="60" y="45" width="40" height="30" rx="3" fill="none" stroke="#f97316" strokeWidth="1.5" />
        <text x="80" y="92" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="600">R</text>
        <line x1="100" y1="60" x2="150" y2="60" stroke="#64748b" strokeWidth="1.5" />
        <path d="M150,35 Q160,25 165,35 Q170,45 175,35 Q180,25 185,35 Q190,45 195,35 L195,85" fill="none" stroke="#a855f7" strokeWidth="1.5" />
        <text x="173" y="105" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="600">L</text>
        <line x1="195" y1="60" x2="230" y2="60" stroke="#64748b" strokeWidth="1.5" />
        <line x1="230" y1="30" x2="230" y2="90" stroke="#64748b" strokeWidth="1.5" />
        <line x1="200" y1="90" x2="260" y2="90" stroke="#64748b" strokeWidth="1.5" />
        <text x="245" y="105" textAnchor="middle" fill="#64748b" fontSize="10">GND</text>
        <text x="10" y="55" fill="#94a3b8" fontSize="10">Vin</text>
        <text x="230" y="55" fill="#94a3b8" fontSize="10">Vout</text>
      </svg>
    );
    if (isRL && isHP) return (
      <svg viewBox="0 0 300 120" className="fdt-schematic">
        <line x1="10" y1="60" x2="60" y2="60" stroke="#64748b" strokeWidth="1.5" />
        <path d="M60,35 Q70,25 75,35 Q80,45 85,35 Q90,25 95,35 Q100,45 105,35 L105,85" fill="none" stroke="#a855f7" strokeWidth="1.5" />
        <text x="83" y="105" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="600">L</text>
        <line x1="105" y1="60" x2="150" y2="60" stroke="#64748b" strokeWidth="1.5" />
        <rect x="150" y="45" width="40" height="30" rx="3" fill="none" stroke="#f97316" strokeWidth="1.5" />
        <text x="170" y="92" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="600">R</text>
        <line x1="190" y1="60" x2="230" y2="60" stroke="#64748b" strokeWidth="1.5" />
        <line x1="230" y1="30" x2="230" y2="90" stroke="#64748b" strokeWidth="1.5" />
        <line x1="200" y1="90" x2="260" y2="90" stroke="#64748b" strokeWidth="1.5" />
        <text x="245" y="105" textAnchor="middle" fill="#64748b" fontSize="10">GND</text>
        <text x="10" y="55" fill="#94a3b8" fontSize="10">Vin</text>
        <text x="230" y="55" fill="#94a3b8" fontSize="10">Vout</text>
      </svg>
    );
    if (isRLC) return (
      <svg viewBox="0 0 340 140" className="fdt-schematic">
        <line x1="10" y1="70" x2="50" y2="70" stroke="#64748b" strokeWidth="1.5" />
        <rect x="50" y="55" width="35" height="30" rx="3" fill="none" stroke="#f97316" strokeWidth="1.5" />
        <text x="67" y="102" textAnchor="middle" fill="#f97316" fontSize="9" fontWeight="600">R</text>
        <line x1="85" y1="70" x2="120" y2="70" stroke="#64748b" strokeWidth="1.5" />
        <path d="M120,45 Q128,36 133,45 Q138,54 143,45 Q148,36 153,45 Q158,54 163,45 L163,95" fill="none" stroke="#a855f7" strokeWidth="1.5" />
        <text x="142" y="112" textAnchor="middle" fill="#a855f7" fontSize="9" fontWeight="600">L</text>
        <line x1="163" y1="70" x2="200" y2="70" stroke="#64748b" strokeWidth="1.5" />
        <line x1="200" y1="45" x2="200" y2="95" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="175" y1="95" x2="225" y2="95" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="200" y="112" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="600">C</text>
        <line x1="225" y1="70" x2="270" y2="70" stroke="#64748b" strokeWidth="1.5" />
        <text x="270" y="55" fill="#94a3b8" fontSize="10">Vout</text>
        <line x1="270" y1="45" x2="270" y2="95" stroke="#64748b" strokeWidth="1.5" />
        <line x1="240" y1="95" x2="300" y2="95" stroke="#64748b" strokeWidth="1.5" />
        <text x="280" y="112" textAnchor="middle" fill="#64748b" fontSize="9">GND</text>
        <text x="10" y="65" fill="#94a3b8" fontSize="10">Vin</text>
      </svg>
    );
    return null;
  };

  const fmtFc = resultFc !== null ? resultFc.toFixed(2) : '—';

  return (
    <div className="fdt-page">
      <div className="fdt-header">
        <button className="fdt-back" onClick={() => navigate('/ece-hub')}><ArrowLeft size={20} /></button>
        <h1 className="fdt-title">Filter Design Tool</h1>
      </div>
      <div className="fdt-body">
        <div className="fdt-type-tabs">
          {FILTERS.map(t => (
            <button key={t} className={`fdt-type ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>

        <div className="fdt-schematic-wrap">
          <CircuitSVG />
        </div>

        <div className="fdt-mode-tabs">
          <button className={`fdt-mode ${mode === 'fc' ? 'active' : ''}`} onClick={() => setMode('fc')}>Cutoff Calculator</button>
          <button className={`fdt-mode ${mode === 'comp' ? 'active' : ''}`} onClick={() => setMode('comp')}>Find Components</button>
        </div>

        <div className="fdt-fields">
          <div className="fdt-field"><label>R (Ω)</label><input type="number" min={0.1} value={r} onChange={e => setR(parseFloat(e.target.value)||1)} className="fdt-input" /></div>
          {(isRC || isRLC) && <div className="fdt-field"><label>C (F)</label><input type="number" step="any" min={1e-15} value={c} onChange={e => setC(parseFloat(e.target.value)||1e-15)} className="fdt-input" /></div>}
          {(isRL || isRLC) && <div className="fdt-field"><label>L (H)</label><input type="number" step="any" min={1e-9} value={l} onChange={e => setL(parseFloat(e.target.value)||1e-9)} className="fdt-input" /></div>}
          {mode === 'comp' && <div className="fdt-field"><label>Target fc (Hz)</label><input type="number" min={0.1} value={targetFc} onChange={e => setTargetFc(parseFloat(e.target.value)||1)} className="fdt-input" /></div>}
        </div>

        {result && resultFc !== null && (
          <div className="fdt-result">
            <strong>{isRLC ? `Resonant Frequency (f₀): ${fmtFc} Hz` : `Cutoff Frequency (fc): ${fmtFc} Hz`}</strong>
            {isRLC && resultQ !== null && result.bw !== undefined && (
              <span className="fdt-result-hint">Q = {resultQ.toFixed(2)} &nbsp;|&nbsp; BW = {result.bw.toFixed(2)} Hz</span>
            )}
            {mode === 'comp' && (
              <span className="fdt-result-hint">
                {isRC ? `Required C ≈ ${(1 / (2 * Math.PI * result.fc * r)).toExponential(3)} F` : ''}
                {isRL ? `Required L ≈ ${(r / (2 * Math.PI * result.fc)).toExponential(3)} H` : ''}
              </span>
            )}
          </div>
        )}

        {mode === 'fc' && resultFc !== null && (
          <div className="fdt-test-section">
            <div className="fdt-test-row">
              <span className="fdt-test-label">Gain at specific frequency:</span>
              <input type="number" min={0.1} value={testFreq} onChange={e => setTestFreq(parseFloat(e.target.value)||1)} className="fdt-test-input" />
              <span className="fdt-test-unit">Hz</span>
            </div>
            {testResponse && (
              <div className="fdt-test-result">
                <span>Gain: <strong>{testResponse.mag.toFixed(2)} dB</strong></span>
                <span>Phase shift: <strong>{testResponse.phase.toFixed(1)}°</strong></span>
              </div>
            )}
          </div>
        )}

        {plotData && plotData.length > 0 && (
          <div className="fdt-plot-wrap">
            <svg viewBox="0 0 600 360" className="fdt-plot">
              <rect x="0" y="0" width="600" height="360" fill="#0f172a" />
              <line x1="60" y1="30" x2="60" y2="320" stroke="#334155" strokeWidth="1" />
              <line x1="60" y1="330" x2="580" y2="330" stroke="#334155" strokeWidth="1" />
              <line x1="60" y1="180" x2="580" y2="180" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

              {[-40,-30,-20,-10,0].map(db => {
                const y = 180 - ((db + 40) / 50) * 140;
                return <g key={db}><line x1="57" y1={y} x2="63" y2={y} stroke="#475569" /><text x="52" y={y+3} textAnchor="end" fill="#64748b" fontSize="8">{db}</text></g>;
              })}
              <text x="48" y="22" textAnchor="end" fill="#64748b" fontSize="9">Mag (dB)</text>

              <path d={plotData.map((p, i) => {
                const x = 60 + (i / plotData.length) * 500;
                const y = 180 - ((Math.max(-40, p.mag) + 40) / 50) * 140;
                return `${i === 0 ? 'M' : 'L'}${x},${y}`;
              }).join(' ')} fill="none" stroke="#ec4899" strokeWidth="2.5" />

              <circle cx={fcX} cy={fcY} r="4" fill="#22c55e" />
              <text x={fcX - 8} y={fcY - 6} fill="#22c55e" fontSize="8">−3dB</text>

              <path d={plotData.map((p, i) => {
                const x = 60 + (i / plotData.length) * 500;
                const y = 350 - ((p.phase + 90) / 180) * 120;
                return `${i === 0 ? 'M' : 'L'}${x},${y}`;
              }).join(' ')} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" />

              {[-90,-45,0,45,90].map(deg => {
                const y = 350 - ((deg + 90) / 180) * 120;
                if (deg === 0) return <g key={deg}><line x1="57" y1={y} x2="580" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" /></g>;
                return <g key={deg}><line x1="57" y1={y} x2="63" y2={y} stroke="#475569" /><text x="52" y={y+3} textAnchor="end" fill="#475569" fontSize="7">{deg}°</text></g>;
              })}
              <text x="48" y="355" textAnchor="end" fill="#64748b" fontSize="9">Phase</text>
              <text x="580" y="345" textAnchor="end" fill="#64748b" fontSize="9">Frequency →</text>
              {resultFc !== null && <text x={fcX} y="345" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="600">fc</text>}
            </svg>
          </div>
        )}

        <div className="fdt-desc">
          {isLP && <span>Low-pass filter: passes frequencies below fc, attenuates above. Rolloff = −20 dB/decade (1st order).</span>}
          {isHP && <span>High-pass filter: passes frequencies above fc, attenuates below. Rolloff = +20 dB/decade (1st order).</span>}
          {isBP && <span>Band-pass filter: passes frequencies near f₀. Q controls sharpness. Higher Q = narrower bandwidth.</span>}
          {isBS && <span>Band-stop (notch) filter: rejects frequencies near f₀. Q controls notch width. Higher Q = narrower notch.</span>}
        </div>
      </div>
    </div>
  );
}
