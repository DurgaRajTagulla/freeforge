import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, Wand2 } from 'lucide-react';
import './Timer555.css';

const PRESETS = [
  { label: '1 kHz, 50%', r1: 1000, r2: 1000, c: 6.8e-7 },
  { label: '1 kHz, 60%', r1: 2200, r2: 1000, c: 4.7e-7 },
  { label: '100 Hz, 50%', r1: 10000, r2: 10000, c: 6.8e-7 },
  { label: 'Audio tone', r1: 1000, r2: 1000, c: 1e-7 },
  { label: 'LED blinker', r1: 10000, r2: 10000, c: 1e-5 },
  { label: 'Slow blink', r1: 47000, r2: 47000, c: 1e-5 },
];

const PINOUT = [
  { pin: 1, label: 'GND', desc: 'Ground (0V)', color: '#64748b' },
  { pin: 2, label: 'TRIG', desc: 'Trigger — starts timing when < Vcc/3', color: '#22c55e' },
  { pin: 3, label: 'OUT', desc: 'Output — HIGH during timing, LOW otherwise', color: '#f97316' },
  { pin: 4, label: 'RESET', desc: 'Reset — connect to Vcc to enable', color: '#ef4444' },
  { pin: 5, label: 'CTRL', desc: 'Control Voltage — filter with 10nF to GND', color: '#a855f7' },
  { pin: 6, label: 'THRES', desc: 'Threshold — ends timing when > 2Vcc/3', color: '#3b82f6' },
  { pin: 7, label: 'DISCH', desc: 'Discharge — open collector discharge path', color: '#eab308' },
  { pin: 8, label: 'VCC', desc: 'Supply (5–15V)', color: '#ef4444' },
];

function fmt(v) {
  if (v >= 1) return v.toFixed(3) + ' s';
  if (v >= 1e-3) return (v * 1e3).toFixed(2) + ' ms';
  if (v >= 1e-6) return (v * 1e6).toFixed(0) + ' µs';
  return (v * 1e9).toFixed(0) + ' ns';
}

export default function Timer555() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [mode, setMode] = useState('astable');
  const [r1, setR1] = useState(1000);
  const [r2, setR2] = useState(1000);
  const [c, setC] = useState(1e-6);
  const [r, setR] = useState(1000);
  const [cm, setCm] = useState(1e-6);
  const [showPinout, setShowPinout] = useState(false);
  const [designFreq, setDesignFreq] = useState(1000);
  const [designDuty, setDesignDuty] = useState(60);
  const [designMode, setDesignMode] = useState(false);
  const [vcc, setVcc] = useState(9);

  const astable = useMemo(() => {
    if (r1 <= 0 || r2 <= 0 || c <= 0) return null;
    const tH = 0.693 * (r1 + r2) * c;
    const tL = 0.693 * r2 * c;
    const period = tH + tL;
    const freq = 1 / period;
    const duty = (tH / period) * 100;
    return { tH, tL, period, freq, duty };
  }, [r1, r2, c]);

  const mono = useMemo(() => {
    if (r <= 0 || cm <= 0) return null;
    return { pw: 1.1 * r * cm };
  }, [r, cm]);

  const designResult = useMemo(() => {
    if (!designMode || designFreq <= 0 || designDuty <= 0 || designDuty >= 100) return null;
    const period = 1 / designFreq;
    const tH = period * designDuty / 100;
    const tL = period - tH;
    const cGuess = 1e-7;
    const totalR = tH / (0.693 * cGuess);
    const r2Guess = tL / (0.693 * cGuess);
    const r1Guess = totalR - r2Guess;
    if (r1Guess < 0 || r2Guess < 0) return null;
    return { r1: r1Guess, r2: r2Guess, c: cGuess, tH, tL, period, freq: designFreq, duty: designDuty };
  }, [designMode, designFreq, designDuty]);

  const loadDesign = () => {
    if (!designResult) return;
    setR1(Math.round(designResult.r1));
    setR2(Math.round(designResult.r2));
    setC(designResult.c);
    setDesignMode(false);
  };

  const W = 560, H = 80;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode !== 'astable' || !astable) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const period = astable.period;
      const vHigh = 20;
      const vLow = H - 20;
      const cycles = 3;
      const totalT = cycles * period;
      const pxPerSec = W / totalT;

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let first = true;
      for (let px = 0; px <= W; px++) {
        const time = (px / W) * totalT + t;
        const modTime = time % period;
        const isHigh = modTime < astable.tH;
        const yVal = isHigh ? vHigh : vLow;
        if (first) { ctx.moveTo(px, yVal); first = false; }
        else ctx.lineTo(px, yVal);
      }
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      ctx.fillText('1 cycle', W / 3 - 10, H - 4);
      ctx.fillText('2 cycles', 2 * W / 3 - 10, H - 4);

      ctx.fillStyle = '#475569';
      ctx.font = '8px monospace';
      ctx.fillText('VOH', 4, 22);
      ctx.fillText('VOL', 4, H - 6);

      t += 0.008;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [astable, mode, W, H]);

  return (
    <div className="t555-page">
      <div className="t555-header">
        <button className="t555-back" onClick={() => navigate('/ece-hub')}><ArrowLeft size={20} /></button>
        <h1 className="t555-title">555 Timer Calculator</h1>
        <button className="t555-pinout-btn" onClick={() => setShowPinout(!showPinout)}>Pinout</button>
      </div>
      <div className="t555-body">
        {showPinout && (
          <div className="t555-pinout-panel">
            <div className="t555-pinout-dip">
              <svg viewBox="0 0 200 240" className="t555-pinout-svg">
                <rect x="40" y="40" width="120" height="160" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <text x="100" y="125" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="700" fontFamily="monospace">555</text>
                <line x1="40" y1="55" x2="10" y2="55" stroke="#475569" strokeWidth="2" />
                <text x="6" y="59" textAnchor="end" fill="#64748b" fontSize="9">1</text>
                <line x1="40" y1="85" x2="10" y2="85" stroke="#475569" strokeWidth="2" />
                <text x="6" y="89" textAnchor="end" fill="#64748b" fontSize="9">2</text>
                <line x1="40" y1="115" x2="10" y2="115" stroke="#475569" strokeWidth="2" />
                <text x="6" y="119" textAnchor="end" fill="#64748b" fontSize="9">3</text>
                <line x1="40" y1="145" x2="10" y2="145" stroke="#475569" strokeWidth="2" />
                <text x="6" y="149" textAnchor="end" fill="#64748b" fontSize="9">4</text>
                <line x1="160" y1="55" x2="190" y2="55" stroke="#475569" strokeWidth="2" />
                <text x="194" y="59" fill="#64748b" fontSize="9">8</text>
                <line x1="160" y1="85" x2="190" y2="85" stroke="#475569" strokeWidth="2" />
                <text x="194" y="89" fill="#64748b" fontSize="9">7</text>
                <line x1="160" y1="115" x2="190" y2="115" stroke="#475569" strokeWidth="2" />
                <text x="194" y="119" fill="#64748b" fontSize="9">6</text>
                <line x1="160" y1="145" x2="190" y2="145" stroke="#475569" strokeWidth="2" />
                <text x="194" y="149" fill="#64748b" fontSize="9">5</text>
              </svg>
            </div>
            <div className="t555-pinout-list">
              {PINOUT.map(p => (
                <div key={p.pin} className="t555-pin-row">
                  <span className="t555-pin-num" style={{ color: p.color }}>{p.pin}</span>
                  <span className="t555-pin-label" style={{ color: p.color }}>{p.label}</span>
                  <span className="t555-pin-desc">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="t555-mode-tabs">
          <button className={`t555-mode ${mode === 'astable' ? 'active' : ''}`} onClick={() => setMode('astable')}><Timer size={16} /> Astable</button>
          <button className={`t555-mode ${mode === 'monostable' ? 'active' : ''}`} onClick={() => setMode('monostable')}><Timer size={16} /> Monostable</button>
        </div>

        {mode === 'astable' ? (
          <>
            <div className="t555-diagram">
              <svg viewBox="0 0 300 180" className="t555-svg">
                <rect x="100" y="30" width="100" height="120" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <text x="150" y="95" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="700" fontFamily="monospace">555</text>
                <line x1="50" y1="55" x2="100" y2="55" stroke="#64748b" strokeWidth="1.5" />
                <text x="35" y="59" textAnchor="end" fill="#94a3b8" fontSize="10">R1</text>
                <text x="35" y="72" textAnchor="end" fill="#64748b" fontSize="8" fontFamily="monospace">{r1 >= 1000 ? (r1/1000)+'k' : r1}Ω</text>
                <line x1="100" y1="85" x2="150" y2="85" stroke="#64748b" strokeWidth="1.5" />
                <line x1="150" y1="85" x2="150" y2="120" stroke="#64748b" strokeWidth="1.5" />
                <line x1="150" y1="120" x2="200" y2="120" stroke="#64748b" strokeWidth="1.5" />
                <text x="205" y="124" fill="#94a3b8" fontSize="10">R2</text>
                <text x="205" y="137" textAnchor="start" fill="#64748b" fontSize="8" fontFamily="monospace">{r2 >= 1000 ? (r2/1000)+'k' : r2}Ω</text>
                <line x1="200" y1="90" x2="250" y2="90" stroke="#64748b" strokeWidth="1.5" />
                <text x="255" y="94" fill="#94a3b8" fontSize="10">C</text>
                <text x="255" y="107" fill="#64748b" fontSize="8" fontFamily="monospace">{c >= 1e-3 ? (c*1e3)+'m' : c >= 1e-6 ? (c*1e6)+'µ' : (c*1e9)+'n'}F</text>
                <line x1="250" y1="90" x2="250" y2="150" stroke="#64748b" strokeWidth="1.5" />
                <line x1="180" y1="150" x2="250" y2="150" stroke="#64748b" strokeWidth="1.5" />
                <text x="150" y="170" textAnchor="middle" fill="#64748b" fontSize="9">GND</text>
                <line x1="150" y1="150" x2="150" y2="174" stroke="#64748b" strokeWidth="1.5" />
                <text x="150" y="22" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="600">Vcc = {vcc}V</text>
              </svg>
            </div>

            <div className="t555-presets">
              <span className="t555-pre-label">Presets:</span>
              {PRESETS.map((p, i) => (
                <button key={i} className="t555-pre-btn" onClick={() => { setR1(p.r1); setR2(p.r2); setC(p.c); }}>{p.label}</button>
              ))}
            </div>

            <div className="t555-fields">
              <div className="t555-field"><label>R<sub>1</sub> (Ω)</label><input type="number" min={1} value={r1} onChange={e => setR1(parseFloat(e.target.value)||1)} className="t555-input" /></div>
              <div className="t555-field"><label>R<sub>2</sub> (Ω)</label><input type="number" min={1} value={r2} onChange={e => setR2(parseFloat(e.target.value)||1)} className="t555-input" /></div>
              <div className="t555-field"><label>C (F)</label><input type="number" step="any" min={1e-12} value={c} onChange={e => setC(parseFloat(e.target.value)||1e-12)} className="t555-input" /></div>
              <div className="t555-field"><label>Vcc (V)</label><input type="number" min={3} max={18} value={vcc} onChange={e => setVcc(parseFloat(e.target.value)||9)} className="t555-input" /></div>
            </div>

            {astable && (
              <div className="t555-astable-results">
                <div className="t555-results-grid">
                  <div className="t555-result-card"><span>Frequency</span><strong>{astable.freq.toFixed(2)} Hz</strong></div>
                  <div className="t555-result-card"><span>Period</span><strong>{fmt(astable.period)}</strong></div>
                  <div className="t555-result-card"><span>High Time</span><strong>{fmt(astable.tH)}</strong></div>
                  <div className="t555-result-card"><span>Low Time</span><strong>{fmt(astable.tL)}</strong></div>
                  <div className="t555-result-card"><span>Duty Cycle</span><strong>{astable.duty.toFixed(1)}%</strong></div>
                </div>
                <div className="t555-duty-bar-wrap">
                  <div className="t555-duty-bar">
                    <div className="t555-duty-high" style={{ flex: astable.tH }} title={`High: ${fmt(astable.tH)}`} />
                    <div className="t555-duty-low" style={{ flex: astable.tL }} title={`Low: ${fmt(astable.tL)}`} />
                  </div>
                  <div className="t555-duty-labels">
                    <span style={{ color: '#22c55e' }}>HIGH {astable.duty.toFixed(0)}%</span>
                    <span style={{ color: '#ef4444' }}>LOW {(100 - astable.duty).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="t555-warn">
                  {astable.duty < 50 ? (<span>⚠ Duty cycle is below 50%. Standard 555 astable always has duty &gt; 50% (t<sub>H</sub> &gt; t<sub>L</sub>). Use a diode for &lt; 50%.</span>) : astable.duty > 95 ? (<span>⚠ Duty cycle is very high. t<sub>L</sub> is very short — verify circuit can discharge fast enough.</span>) : null}
                </div>
              </div>
            )}

            {astable && (
              <div className="t555-timing-diagram">
                <div className="t555-timing-label">Output Timing Diagram</div>
                <canvas ref={canvasRef} width={W} height={H} className="t555-timing-canvas" />
              </div>
            )}

            <div className="t555-design-section">
              <button className="t555-design-toggle" onClick={() => setDesignMode(!designMode)}><Wand2 size={14} /> {designMode ? 'Cancel Design' : 'Design Wizard'}</button>
              {designMode && (
                <div className="t555-design-panel">
                  <p className="t555-design-intro">Find R₁, R₂, C for a target frequency and duty cycle</p>
                  <div className="t555-fields">
                    <div className="t555-field"><label>Target Frequency (Hz)</label><input type="number" min={0.1} value={designFreq} onChange={e => setDesignFreq(parseFloat(e.target.value)||1)} className="t555-input" /></div>
                    <div className="t555-field"><label>Target Duty (%)</label><input type="number" min={51} max={99} value={designDuty} onChange={e => setDesignDuty(parseFloat(e.target.value)||50)} className="t555-input" /></div>
                  </div>
                  {designResult && (
                    <div className="t555-design-result">
                      <div className="t555-design-values">
                        <span>R₁ ≈ <strong>{Math.round(designResult.r1)} Ω</strong></span>
                        <span>R₂ ≈ <strong>{Math.round(designResult.r2)} Ω</strong></span>
                        <span>C ≈ <strong>{(designResult.c * 1e9).toFixed(0)} nF</strong></span>
                      </div>
                      <button className="t555-apply-btn" onClick={loadDesign}>Apply Values</button>
                    </div>
                  )}
                  {!designResult && <div className="t555-design-hint">Duty must be &gt; 50% and &lt; 100% for standard astable 555</div>}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="t555-diagram">
              <svg viewBox="0 0 280 160" className="t555-svg">
                <rect x="90" y="20" width="100" height="110" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <text x="140" y="80" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="700" fontFamily="monospace">555</text>
                <line x1="40" y1="50" x2="90" y2="50" stroke="#64748b" strokeWidth="1.5" />
                <text x="25" y="54" textAnchor="end" fill="#94a3b8" fontSize="10">Trigger</text>
                <line x1="190" y1="75" x2="240" y2="75" stroke="#64748b" strokeWidth="1.5" />
                <text x="250" y="79" fill="#94a3b8" fontSize="10">Output</text>
                <line x1="90" y1="105" x2="140" y2="105" stroke="#64748b" strokeWidth="1.5" />
                <text x="75" y="109" textAnchor="end" fill="#94a3b8" fontSize="10">R</text>
                <line x1="140" y1="105" x2="140" y2="130" stroke="#64748b" strokeWidth="1.5" />
                <line x1="140" y1="130" x2="190" y2="130" stroke="#64748b" strokeWidth="1.5" />
                <text x="200" y="134" fill="#94a3b8" fontSize="10">C</text>
                <line x1="190" y1="130" x2="240" y2="130" stroke="#64748b" strokeWidth="1.5" />
                <text x="250" y="134" fill="#94a3b8" fontSize="10">GND</text>
              </svg>
            </div>
            <div className="t555-fields">
              <div className="t555-field"><label>R (Ω)</label><input type="number" min={1} value={r} onChange={e => setR(parseFloat(e.target.value)||1)} className="t555-input" /></div>
              <div className="t555-field"><label>C (F)</label><input type="number" step="any" min={1e-12} value={cm} onChange={e => setCm(parseFloat(e.target.value)||1e-12)} className="t555-input" /></div>
            </div>
            {mono && (
              <div className="t555-results-grid">
                <div className="t555-result-card"><span>Pulse Width</span><strong>{fmt(mono.pw)}</strong></div>
              </div>
            )}
            <div className="t555-mono-note">
              <strong>How it works:</strong> Trigger (pin 2) goes LOW → output (pin 3) goes HIGH for 1.1·R·C seconds, then returns LOW. While timing, a second trigger is ignored.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
