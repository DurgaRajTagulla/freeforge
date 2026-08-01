import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import './OpAmpDesigner.css';

export default function OpAmpDesigner() {
  const navigate = useNavigate();
  const [config, setConfig] = useState('inverting');
  const [rin, setRin] = useState(1000);
  const [rf, setRf] = useState(10000);
  const [vin, setVin] = useState(1);
  const [vcc, setVcc] = useState(12);
  const [vee, setVee] = useState(-12);
  const [tol, setTol] = useState(0);
  const [showFreq, setShowFreq] = useState(false);

  const calc = useMemo(() => {
    if (rin <= 0 || rf <= 0) return null;
    const gainIdeal = config === 'inverting' ? -(rf / rin) : (1 + rf / rin);
    const voutIdeal = gainIdeal * vin;

    const tolFactor = 1 + (tol / 100);
    const gainHigh = config === 'inverting' ? -(rf * tolFactor / (rin / tolFactor)) : (1 + rf * tolFactor / (rin / tolFactor));
    const tolRange = tol > 0 ? {
      gainLow: config === 'inverting' ? -(rf / tolFactor / (rin * tolFactor)) : (1 + rf / tolFactor / (rin * tolFactor)),
      gainHigh,
      voutLow: config === 'inverting' ? -(rf / tolFactor / (rin * tolFactor)) * vin : (1 + rf / tolFactor / (rin * tolFactor)) * vin,
      voutHigh: gainHigh * vin,
    } : null;

    const saturated = voutIdeal > vcc || voutIdeal < vee;
    const voutClamped = Math.max(vee, Math.min(vcc, voutIdeal));

    return { gainIdeal, voutIdeal, voutClamped, saturated, vcc, vee, tolRange };
  }, [config, rin, rf, vin, vcc, vee, tol]);

  const iIn = calc && rin > 0 ? vin / rin : 0;
  const iF = calc && rf > 0 ? (calc.voutClamped - (config === 'inverting' ? 0 : vin)) / rf : 0;
  const absGain = calc ? Math.abs(calc.gainIdeal) : 1;
  const fcFreq = absGain > 1e-10 ? 1e6 / absGain : 1e6;

  return (
    <div className="opamp-page">
      <div className="opamp-header">
        <button className="opamp-back" onClick={() => navigate('/ece-hub')}><ArrowLeft size={20} /></button>
        <h1 className="opamp-title">Op-Amp Designer</h1>
      </div>
      <div className="opamp-body">
        <div className="opamp-config-tabs">
          <button className={`opamp-config ${config === 'inverting' ? 'active' : ''}`} onClick={() => setConfig('inverting')}>Inverting</button>
          <button className={`opamp-config ${config === 'non-inverting' ? 'active' : ''}`} onClick={() => setConfig('non-inverting')}>Non-Inverting</button>
        </div>

        <div className="opamp-diagram">
          {config === 'inverting' ? (
            <svg viewBox="0 0 420 240" className="opamp-svg">
              <rect x="140" y="70" width="140" height="100" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <text x="210" y="125" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="700" fontFamily="monospace">Op-Amp</text>
              <text x="210" y="142" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">741</text>
              <text x="210" y="108" textAnchor="middle" fill="#64748b" fontSize="11">−</text>
              <text x="210" y="153" textAnchor="middle" fill="#64748b" fontSize="11">+</text>
              <line x1="30" y1="100" x2="100" y2="100" stroke="#64748b" strokeWidth="1.5" />
              <text x="25" y="94" textAnchor="end" fill="#94a3b8" fontSize="11">R₁</text>
              <text x="55" y="108" textAnchor="middle" fill="#f97316" fontSize="9" fontFamily="monospace" fontWeight="600">{rin >= 1000 ? (rin/1000)+'k' : rin}Ω</text>
              <circle cx="90" cy="100" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              <line x1="90" y1="100" x2="90" y2="35" stroke="#64748b" strokeWidth="1.5" />
              <line x1="90" y1="35" x2="280" y2="35" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="280" cy="35" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              <line x1="280" y1="35" x2="280" y2="100" stroke="#64748b" strokeWidth="1.5" />
              <text x="285" y="85" fill="#94a3b8" fontSize="11">Rƒ</text>
              <text x="285" y="100" fill="#f97316" fontSize="9" fontFamily="monospace" fontWeight="600">{rf >= 1000 ? (rf/1000)+'k' : rf}Ω</text>
              <line x1="280" y1="100" x2="370" y2="100" stroke="#64748b" strokeWidth="1.5" />
              <text x="380" y="104" fill="#94a3b8" fontSize="11">Vout</text>
              <text x="15" y="124" fill="#94a3b8" fontSize="11">Vin</text>
              <text x="130" y="190" fill="#64748b" fontSize="9" fontFamily="monospace">Vcc = +{vcc}V</text>
              <text x="130" y="205" fill="#64748b" fontSize="9" fontFamily="monospace">Vee = {vee}V</text>
            </svg>
          ) : (
            <svg viewBox="0 0 420 240" className="opamp-svg">
              <rect x="140" y="70" width="140" height="100" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <text x="210" y="125" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="700" fontFamily="monospace">Op-Amp</text>
              <text x="210" y="142" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">741</text>
              <text x="210" y="108" textAnchor="middle" fill="#64748b" fontSize="11">−</text>
              <text x="210" y="153" textAnchor="middle" fill="#64748b" fontSize="11">+</text>
              <line x1="280" y1="100" x2="370" y2="100" stroke="#64748b" strokeWidth="1.5" />
              <text x="380" y="104" fill="#94a3b8" fontSize="11">Vout</text>
              <line x1="280" y1="100" x2="280" y2="35" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="280" cy="35" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              <line x1="90" y1="35" x2="280" y2="35" stroke="#64748b" strokeWidth="1.5" />
              <text x="80" y="29" textAnchor="end" fill="#94a3b8" fontSize="11">Rƒ</text>
              <text x="160" y="28" fill="#f97316" fontSize="9" fontFamily="monospace" fontWeight="600">{rf >= 1000 ? (rf/1000)+'k' : rf}Ω</text>
              <line x1="280" y1="100" x2="280" y2="150" stroke="#64748b" strokeWidth="1.5" />
              <line x1="50" y1="150" x2="280" y2="150" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="90" cy="150" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              <line x1="90" y1="150" x2="90" y2="190" stroke="#64748b" strokeWidth="1.5" />
              <text x="95" y="185" fill="#94a3b8" fontSize="11">R₁</text>
              <text x="135" y="185" fill="#f97316" fontSize="9" fontFamily="monospace" fontWeight="600">{rin >= 1000 ? (rin/1000)+'k' : rin}Ω</text>
              <text x="45" y="154" textAnchor="end" fill="#94a3b8" fontSize="11">GND</text>
              <text x="15" y="124" fill="#94a3b8" fontSize="11">Vin</text>
              <line x1="50" y1="150" x2="50" y2="110" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
              <circle cx="50" cy="110" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              <text x="130" y="200" fill="#64748b" fontSize="9" fontFamily="monospace">Vcc = +{vcc}V</text>
              <text x="130" y="215" fill="#64748b" fontSize="9" fontFamily="monospace">Vee = {vee}V</text>
            </svg>
          )}
        </div>

        <div className="opamp-fields">
          <div className="opamp-field"><label>R₁ (Ω)</label><input type="number" min={1} value={rin} onChange={e => setRin(parseFloat(e.target.value)||1)} className="opamp-input" /></div>
          <div className="opamp-field"><label>Rƒ (Ω)</label><input type="number" min={1} value={rf} onChange={e => setRf(parseFloat(e.target.value)||1)} className="opamp-input" /></div>
          <div className="opamp-field"><label>Vin (V)</label><input type="number" step="any" value={vin} onChange={e => setVin(parseFloat(e.target.value)||0)} className="opamp-input" /></div>
        </div>

        <div className="opamp-supply-section">
          <div className="opamp-supply-title">Supply Rails (determines saturation)</div>
          <div className="opamp-supply-fields">
            <div className="opamp-field"><label>+Vcc (V)</label><input type="number" value={vcc} onChange={e => setVcc(parseFloat(e.target.value)||0)} className="opamp-input" /></div>
            <div className="opamp-field"><label>−Vee (V)</label><input type="number" value={vee} onChange={e => setVee(parseFloat(e.target.value)||0)} className="opamp-input" /></div>
          </div>
        </div>

        <div className="opamp-tol-section">
          <div className="opamp-tol-row">
            <span className="opamp-tol-label">Resistor Tolerance:</span>
            <input type="range" min={0} max={20} step={1} value={tol} onChange={e => setTol(parseInt(e.target.value))} className="opamp-tol-slider" />
            <span className="opamp-tol-val">±{tol}%</span>
          </div>
        </div>

        {calc && (
          <>
            <div className="opamp-results">
              <div className="opamp-res-card">
                <span>Gain (A<sub>v</sub>)</span>
                <strong className={calc.saturated ? 'sat-warn' : ''}>{calc.gainIdeal.toFixed(2)}</strong>
                {calc.tolRange && (
                  <span className="opamp-tol-range">±{tol}%: {calc.tolRange.gainLow.toFixed(2)} to {calc.tolRange.gainHigh.toFixed(2)}</span>
                )}
              </div>
              <div className="opamp-res-card">
                <span>Vout</span>
                <strong className={calc.saturated ? 'sat-warn' : ''}>{calc.voutClamped.toFixed(4)} V</strong>
                {calc.saturated && <span className="opamp-sat-badge"><AlertTriangle size={11} /> Clipped at rail</span>}
                {calc.tolRange && (
                  <span className="opamp-tol-range">±{tol}%: {calc.tolRange.voutLow.toFixed(4)} to {calc.tolRange.voutHigh.toFixed(4)} V</span>
                )}
              </div>
            </div>

            <div className="opamp-current-section">
              <div className="opamp-curr-title">Current Flow</div>
              <div className="opamp-curr-grid">
                <div className="opamp-curr-card">
                  <span>I<sub>in</sub> (through R₁)</span>
                  <strong>{iIn.toExponential(4)} A</strong>
                  <span className="opamp-curr-dir">{config === 'inverting' ? '→ into virtual GND' : '→ into op-amp input'}</span>
                </div>
                <div className="opamp-curr-card">
                  <span>I<sub>ƒ</sub> (through Rƒ)</span>
                  <strong>{iF.toExponential(4)} A</strong>
                  <span className="opamp-curr-dir">{config === 'inverting' ? 'from output → virtual GND' : 'from output → inverting input'}</span>
                </div>
              </div>
              <div className="opamp-curr-note">
                {config === 'inverting'
                  ? 'Virtual ground: V− = 0V. I₁ = Vin/R₁ flows into the summing node. Iƒ = −Vout/Rƒ flows out. I₁ + Iƒ = 0 (Kirchhoff).'
                  : 'V− = V+ = Vin. Voltage across R₁ = Vin. I₁ = Vin/R₁. Iƒ = I₁ (no current into op-amp). Output servos to make V− = V+.'}
              </div>
            </div>

            <div className="opamp-freq-section">
              <button className="opamp-freq-toggle" onClick={() => setShowFreq(!showFreq)}>
                {showFreq ? 'Hide' : 'Show'} Frequency Response (GBW)
              </button>
              {showFreq && (
                <div className="opamp-freq-panel">
                  <svg viewBox="0 0 400 180" className="opamp-freq-plot">
                    <rect x="0" y="0" width="400" height="180" fill="#0f172a" />
                    <line x1="50" y1="20" x2="50" y2="160" stroke="#334155" strokeWidth="1" />
                    <line x1="50" y1="160" x2="380" y2="160" stroke="#334155" strokeWidth="1" />
                    <text x="48" y="14" textAnchor="end" fill="#64748b" fontSize="9">Gain dB</text>
                    <text x="380" y="174" textAnchor="end" fill="#64748b" fontSize="9">Freq →</text>
                    {[60, 40, 20, 0, -20].map((db) => {
                      const y = 160 - ((db + 20) / 80) * 140;
                      return <g key={db}><line x1="47" y1={y} x2="53" y2={y} stroke="#475569" /><text x="42" y={y+3} textAnchor="end" fill="#64748b" fontSize="8">{db}</text></g>;
                    })}
                    {(() => {
                      const gainDB = 20 * Math.log10(absGain);
                      const pts = [];
                      for (let i = 0; i < 200; i++) {
                        const f = 1 * Math.pow(1e7, i / 200);
                        const att = 1 / Math.sqrt(1 + (f / fcFreq) ** 2);
                        const db = gainDB + 20 * Math.log10(att || 1e-10);
                        const x = 50 + (i / 200) * 320;
                        const yVal = 160 - ((Math.max(-30, db) + 20) / 80) * 140;
                        pts.push(`${i === 0 ? 'M' : 'L'}${x},${yVal}`);
                      }
                      return <path d={pts.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2" />;
                    })()}
                    {(() => {
                      const gainDB = 20 * Math.log10(absGain);
                      const xFc = 50 + (Math.log10(fcFreq) / 7) * 320;
                      const yFc = 160 - ((Math.max(-30, gainDB - 3) + 20) / 80) * 140;
                      return (
                        <g>
                          <circle cx={xFc} cy={yFc} r="4" fill="#22c55e" />
                          <text x={xFc - 10} y={yFc - 6} fill="#22c55e" fontSize="8">−3dB</text>
                        </g>
                      );
                    })()}
                  </svg>
                  <div className="opamp-freq-info">
                    <span>GBW = 1 MHz (741 typical)</span>
                    <span>−3dB Bandwidth: <strong>{fcFreq.toFixed(1)} Hz</strong></span>
                    <span>Gain at 10 kHz: <strong>{(20 * Math.log10(absGain) - 20 * Math.log10(Math.sqrt(1 + (10000 / fcFreq) ** 2))).toFixed(1)} dB</strong></span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
