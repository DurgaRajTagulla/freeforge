import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import './ResistorColorCode.css';

const COLORS = [
  { name: 'Black',  band: '#000',   sig: 0, mul: 1, tol: null,  tcr: null },
  { name: 'Brown',  band: '#8B4513',sig: 1, mul: 10, tol: 1,    tcr: 100 },
  { name: 'Red',    band: '#DC2626',sig: 2, mul: 100, tol: 2,   tcr: 50 },
  { name: 'Orange', band: '#EA580C',sig: 3, mul: 1e3, tol: null, tcr: 15 },
  { name: 'Yellow', band: '#EAB308',sig: 4, mul: 1e4, tol: null, tcr: 25 },
  { name: 'Green',  band: '#16A34A',sig: 5, mul: 1e5, tol: 0.5, tcr: 20 },
  { name: 'Blue',   band: '#2563EB',sig: 6, mul: 1e6, tol: 0.25,tcr: 10 },
  { name: 'Violet', band: '#7C3AED',sig: 7, mul: 1e7, tol: 0.1, tcr: 5 },
  { name: 'Grey',   band: '#6B7280',sig: 8, mul: 1e8, tol: 0.05,tcr: 1 },
  { name: 'White',  band: '#D1D5DB',sig: 9, mul: 1e9, tol: null, tcr: null },
  { name: 'Gold',   band: '#F59E0B',sig: null, mul: 0.1, tol: 5,   tcr: null },
  { name: 'Silver', band: '#9CA3AF',sig: null, mul: 0.01,tol: 10,  tcr: null },
];

const SIGS = COLORS.filter(c => c.sig !== null);
const MULS = COLORS.filter(c => c.mul !== null);
const TOLS = COLORS.filter(c => c.tol !== null);
const TCRS = COLORS.filter(c => c.tcr !== null);

const ESERIES = {
  'E6':  [10,15,22,33,47,68],
  'E12': [10,12,15,18,22,27,33,39,47,56,68,82],
  'E24': [10,11,12,13,15,16,18,20,22,24,27,30,33,36,39,43,47,51,56,62,68,75,82,91],
};

const BAND_LABELS = { 4: ['1st', '2nd', 'Mult', 'Tol'], 5: ['1st', '2nd', '3rd', 'Mult', 'Tol'], 6: ['1st', '2nd', '3rd', 'Mult', 'Tol', 'TCR'] };

function fmt(v) {
  if (v >= 1e6) return (v / 1e6).toFixed(2) + ' MΩ';
  if (v >= 1e3) return (v / 1e3).toFixed(2) + ' kΩ';
  return v.toFixed(2) + ' Ω';
}

function detectSeries(val) {
  const norm = (v) => { let n = v; while (n >= 100) n /= 10; while (n < 10) n *= 10; return Math.round(n); };
  const n = norm(val);
  for (const [name, values] of Object.entries(ESERIES)) {
    if (values.some(v => Math.abs(v - n) / v < 0.05)) return name;
  }
  return null;
}

function cycleColor(colors, current, dir = 1) {
  const idx = colors.indexOf(current);
  return colors[(idx + dir + colors.length) % colors.length];
}

export default function ResistorColorCode() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('decode');
  const [bands, setBands] = useState(4);
  const [b1, setB1] = useState(COLORS[1]);
  const [b2, setB2] = useState(COLORS[0]);
  const [b3, setB3] = useState(COLORS[2]);
  const [b4, setB4] = useState(COLORS[10]);
  const [b5, setB5] = useState(COLORS[5]);
  const [b6, setB6] = useState(COLORS[1]);
  const [targetVal, setTargetVal] = useState(4700);
  const [targetTol, setTargetTol] = useState(5);
  const [appliedV, setAppliedV] = useState(5);

  const bandColors = [b1, b2, b3, b4, b5, b6];
  const setBand = [setB1, setB2, setB3, setB4, setB5, setB6];
  const bandPositions = bands === 4 ? [0, 1, 2, 3] : bands === 5 ? [0, 1, 2, 3, 4] : [0, 1, 2, 3, 4, 5];

  const handleClickBand = (pos) => {
    if (mode !== 'decode') return;
    setBand[pos](prev => {
      if (pos <= 2) return cycleColor(SIGS, prev);
      if (pos === (bands === 4 ? 3 : 4) && bands === 4) return cycleColor(TOLS, prev);
      if (pos === (bands === 4 ? 3 : 4)) return cycleColor(TOLS, prev);
      if (pos === 5) return cycleColor(TCRS, prev);
      return cycleColor(MULS, prev);
    });
  };

  const decoded = useMemo(() => {
    if (mode !== 'decode') return null;
    let sig, mul, tol = null, tcr = null;
    if (bands === 4) { sig = b1.sig * 10 + b2.sig; mul = b3.mul; tol = b4.tol; }
    else if (bands === 5) { sig = b1.sig * 100 + b2.sig * 10 + b3.sig; mul = b4.mul; tol = b5.tol; }
    else { sig = b1.sig * 100 + b2.sig * 10 + b3.sig; mul = b4.mul; tol = b5.tol; tcr = b6.tcr; }
    const val = sig * mul;
    const series = detectSeries(val);
    const rangeLow = val * (1 - (tol || 5) / 100);
    const rangeHigh = val * (1 + (tol || 5) / 100);
    return { val, display: fmt(val), tol, tcr, series, rangeLow, rangeHigh };
  }, [mode, bands, b1, b2, b3, b4, b5, b6]);

  const encoded = useMemo(() => {
    if (mode !== 'encode') return null;
    let v = targetVal, m = 1, sigV = v;
    while (sigV >= (bands === 4 ? 100 : 1000)) { sigV /= 10; m *= 10; }
    const s1 = SIGS.find(c => c.sig === Math.floor(sigV / (bands === 4 ? 10 : 100)));
    const s2 = SIGS.find(c => c.sig === Math.floor((sigV % (bands === 4 ? 10 : 100)) / (bands === 4 ? 1 : 10)));
    const s3 = bands > 4 ? SIGS.find(c => c.sig === Math.floor(sigV % 10)) : null;
    const mc = MULS.find(c => Math.abs(c.mul - m) < 0.01);
    const tc = TOLS.find(c => c.tol === targetTol) || COLORS[10];
    return { s1, s2, s3, mul: mc, tol: tc };
  }, [mode, bands, targetVal, targetTol]);

  const renderStripe = (color, idx, pos) => {
    const label = BAND_LABELS[bands][pos] || '';
    const isClickable = mode === 'decode';
    return (
      <div key={pos} className="rcc-band-col" onClick={() => handleClickBand(pos)} style={{ cursor: isClickable ? 'pointer' : 'default' }}>
        <div className="rcc-stripe" style={{ background: color.band, opacity: color.band === '#D1D5DB' ? 0.9 : 1 }} />
        <span className="rcc-band-label">{label}</span>
        {isClickable && <span className="rcc-band-color-name">{color.name}</span>}
      </div>
    );
  };

  const maxRange = decoded ? Math.max(decoded.rangeHigh, decoded.val * 2) : 1;
  const rangePct = decoded ? ((decoded.val - decoded.rangeLow) / (decoded.rangeHigh - decoded.rangeLow) * 100) : 0;

  return (
    <div className="rcc-page">
      <div className="rcc-header">
        <button className="rcc-back" onClick={() => navigate('/ece-hub')}><ArrowLeft size={20} /></button>
        <h1 className="rcc-title">Resistor Color Code</h1>
      </div>
      <div className="rcc-body">
        <div className="rcc-mode-tabs">
          <button className={`rcc-mode-tab ${mode === 'decode' ? 'active' : ''}`} onClick={() => setMode('decode')}>Decode Bands</button>
          <button className={`rcc-mode-tab ${mode === 'encode' ? 'active' : ''}`} onClick={() => setMode('encode')}>Find Bands</button>
        </div>

        <div className="rcc-bands-select">
          <span>Bands:</span>
          {[4,5,6].map(b => <button key={b} className={`rcc-band-btn ${bands === b ? 'active' : ''}`} onClick={() => setBands(b)}>{b}-Band</button>)}
        </div>

        <div className="rcc-resistor-vis">
          <div className="rcc-resistor" style={{ justifyContent: 'center' }}>
            <div className="rcc-lead" />
            <div className="rcc-body">
              {bandPositions.map((pos, idx) => renderStripe(bandColors[pos], idx, pos))}
            </div>
            <div className="rcc-lead" />
          </div>
        </div>

        {mode === 'decode' ? (
          <>
            {decoded && (
              <div className="rcc-result">
                <div className="rcc-result-main">
                  <span className="rcc-result-val">{decoded.display}</span>
                  <span className="rcc-result-tol">±{decoded.tol}%</span>
                  {decoded.tcr && <span className="rcc-result-tcr">{decoded.tcr} ppm/K</span>}
                  {decoded.series && <span className="rcc-series">{decoded.series}</span>}
                </div>

                <div className="rcc-range-bar-wrap">
                  <div className="rcc-range-labels">
                    <span>{fmt(decoded.rangeLow)}</span>
                    <span className="rcc-range-nom">{decoded.display}</span>
                    <span>{fmt(decoded.rangeHigh)}</span>
                  </div>
                  <div className="rcc-range-bar">
                    <div className="rcc-range-fill" style={{ left: 0, right: `${100 - (decoded.rangeHigh - decoded.rangeLow) / (maxRange * 2) * 100}%` }} />
                    <div className="rcc-range-marker" style={{ left: `${(decoded.val - decoded.rangeLow) / (decoded.rangeHigh - decoded.rangeLow) * 100}%` }} />
                  </div>
                  <div className="rcc-range-sub">Actual resistance lies within this range</div>
                </div>

                <div className="rcc-power-section">
                  <div className="rcc-power-header"><Zap size={14} /> Ohm's Law at applied voltage</div>
                  <div className="rcc-power-row">
                    <span>Applied Voltage (V):</span>
                    <input type="number" min={0.1} step={0.5} value={appliedV} onChange={e => setAppliedV(parseFloat(e.target.value)||1)} className="rcc-pow-input" />
                  </div>
                  <div className="rcc-power-results">
                    <div className="rcc-pow-card"><span>Current</span><strong>{(appliedV / decoded.val).toExponential(4)} A</strong></div>
                    <div className="rcc-pow-card"><span>Power</span><strong>{(appliedV * appliedV / decoded.val).toExponential(4)} W</strong></div>
                  </div>
                </div>
              </div>
            )}

            <div className="rcc-pickers">
              <div className="rcc-picker-row"><span className="rcc-pl">Band 1</span><div className="rcc-swatches">{SIGS.map(c => <div key={c.name} className={`rcc-swatch ${b1.name === c.name ? 'on' : ''}`} style={{ background: c.band }} onClick={() => setB1(c)} title={c.name} />)}</div></div>
              <div className="rcc-picker-row"><span className="rcc-pl">Band 2</span><div className="rcc-swatches">{SIGS.map(c => <div key={c.name} className={`rcc-swatch ${b2.name === c.name ? 'on' : ''}`} style={{ background: c.band }} onClick={() => setB2(c)} title={c.name} />)}</div></div>
              {bands >= 4 && (
                <div className="rcc-picker-row"><span className="rcc-pl">Band 3</span><div className="rcc-swatches">
                  {(bands === 4 ? MULS : SIGS).map(c => <div key={c.name} className={`rcc-swatch ${b3.name === c.name ? 'on' : ''}`} style={{ background: c.band }} onClick={() => setB3(c)} title={c.name} />)}
                </div></div>
              )}
              {bands === 4 && (
                <div className="rcc-picker-row"><span className="rcc-pl">Tol</span><div className="rcc-swatches rcc-swatches-sm">{TOLS.map(c => <div key={c.name} className={`rcc-swatch ${b4.name === c.name ? 'on' : ''}`} style={{ background: c.band }} onClick={() => setB4(c)} title={`${c.name} ±${c.tol}%`} />)}</div></div>
              )}
              {bands >= 5 && (
                <>
                  <div className="rcc-picker-row"><span className="rcc-pl">Mult</span><div className="rcc-swatches rcc-swatches-sm">{MULS.map(c => <div key={c.name} className={`rcc-swatch ${b4.name === c.name ? 'on' : ''}`} style={{ background: c.band }} onClick={() => setB4(c)} title={c.name} />)}</div></div>
                  <div className="rcc-picker-row"><span className="rcc-pl">Tol</span><div className="rcc-swatches rcc-swatches-sm">{TOLS.map(c => <div key={c.name} className={`rcc-swatch ${b5.name === c.name ? 'on' : ''}`} style={{ background: c.band }} onClick={() => setB5(c)} title={`${c.name} ±${c.tol}%`} />)}</div></div>
                </>
              )}
              {bands === 6 && (
                <div className="rcc-picker-row"><span className="rcc-pl">TCR</span><div className="rcc-swatches rcc-swatches-sm">{TCRS.map(c => <div key={c.name} className={`rcc-swatch ${b6.name === c.name ? 'on' : ''}`} style={{ background: c.band }} onClick={() => setB6(c)} title={`${c.name} ${c.tcr} ppm/K`} />)}</div></div>
              )}
            </div>
          </>
        ) : (
          <div className="rcc-encode-mode">
            <div className="rcc-encode-fields">
              <div className="rcc-picker"><label>Resistance (Ω)</label><input type="number" min={0.1} value={targetVal} onChange={e => setTargetVal(parseFloat(e.target.value)||1)} className="rcc-input" /></div>
              <div className="rcc-picker"><label>Tolerance (%)</label><select value={targetTol} onChange={e => setTargetTol(parseFloat(e.target.value))}>{[0.05,0.1,0.25,0.5,1,2,5,10].map(t => <option key={t} value={t}>{t}%</option>)}</select></div>
            </div>
            {encoded && (
              <div className="rcc-result">
                {[encoded.s1, encoded.s2, encoded.s3, encoded.mul, encoded.tol].filter(Boolean).map((c, i) => (
                  <span key={i} className="rcc-chip" style={{ background: c.band, color: ['#000','#8B4513','#DC2626','#EA580C','#EAB308','#16A34A','#2563EB','#7C3AED','#6B7280','#F59E0B','#9CA3AF'].includes(c.band) && c.band !== '#000' ? '#fff' : c.band === '#000' ? '#fff' : '#000' }}>{c.name}</span>
                ))}
              </div>
            )}
            <div className="rcc-encode-hint">Tip: Resistor values follow E-series standards. Try 470, 1000, 4700, 10000 for common values.</div>
          </div>
        )}
      </div>
    </div>
  );
}
