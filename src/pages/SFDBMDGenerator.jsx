import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Weight, Waves } from 'lucide-react';
import './SFDBMDGenerator.css';

const N = 300;

function solveBeam(type, len, loads) {
  let R1 = 0, R2 = 0;
  if (type === 'simply-supported') {
    loads.forEach(ld => {
      if (ld.type === 'point') { const a = ld.pos; R1 += ld.val * (len - a) / len; R2 += ld.val * a / len; }
      else if (ld.type === 'udl') { const a = ld.start, b = ld.end; const eq = ld.val * (b - a); const c = (a + b) / 2; R1 += eq * (len - c) / len; R2 += eq * c / len; }
    });
  } else {
    loads.forEach(ld => {
      if (ld.type === 'point') { R1 += ld.val; R2 += ld.val * ld.pos; }
      else if (ld.type === 'udl') { const eq = ld.val * (ld.end - ld.start); const c = (ld.start + ld.end) / 2; R1 += eq; R2 += eq * c; }
    });
  }
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * len;
    let V = R1, M = type === 'simply-supported' ? R1 * x : 0;
    loads.forEach(ld => {
      if (ld.type === 'point') { if (x >= ld.pos) { V -= ld.val; M -= ld.val * (x - ld.pos); } }
      else if (ld.type === 'udl') {
        if (x > ld.start) { const end = Math.min(x, ld.end); const dist = end - ld.start; V -= ld.val * dist; M -= ld.val * dist * (x - ld.start - dist / 2); }
      }
    });
    if (type === 'cantilever') M = -R2 + R1 * x;
    pts.push({ x, V, M });
  }
  return { R1, R2, points: pts };
}

function formatNum(v) { return Math.abs(v) < 0.001 ? '0' : v.toFixed(2); }

function drawOnCanvas(canvas, data, yLabel, color, len) {
  if (!canvas || !data || data.length < 2) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const pad = { t: 24, b: 28, l: 52, r: 20 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  if (cw <= 0 || ch <= 0) return;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);

  const values = data.map(p => p.V);
  const maxAbs = Math.max(...values.map(Math.abs), 1);
  const scale = (ch * 0.45) / maxAbs;
  const toX = (x) => pad.l + (x / len) * cw;
  const toY = (v) => pad.t + ch / 2 - v * scale;

  ctx.strokeStyle = '#334155'; ctx.lineWidth = 0.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(pad.l, pad.t + ch / 2); ctx.lineTo(pad.l + cw, pad.t + ch / 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + ch); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pad.l + cw, pad.t); ctx.lineTo(pad.l + cw, pad.t + ch); ctx.stroke();

  for (let i = 0; i <= 4; i++) {
    const x = (i / 4) * len;
    const sx = toX(x);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(sx, pad.t); ctx.lineTo(sx, pad.t + ch); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(x + 'm', sx, pad.t + ch + 6);
  }

  const absMax = Math.max(...values.map(Math.abs), 1);
  const tickStep = 10 ** Math.floor(Math.log10(absMax / 3));
  if (tickStep > 0) {
    const startT = Math.ceil(-absMax / tickStep) * tickStep;
    const endT = Math.floor(absMax / tickStep) * tickStep;
    for (let v = startT; v <= endT + tickStep * 0.5; v += tickStep) {
      if (Math.abs(v) < tickStep * 0.01) continue;
      const sy = toY(v);
      ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(formatNum(v), pad.l - 6, sy);
    }
  }

  ctx.beginPath();
  data.forEach((p, i) => {
    const sx = toX(p.x), sy = toY(p.V);
    i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
  });
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.shadowColor = color + '60'; ctx.shadowBlur = 8;
  ctx.stroke(); ctx.shadowBlur = 0;

  ctx.fillStyle = color; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(yLabel, pad.l + cw / 2, 14);

  const maxP = data.reduce((a, b) => Math.abs(a.V) > Math.abs(b.V) ? a : b);
  ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(`Max: ${formatNum(maxP.V)} at ${formatNum(maxP.x)}m`, pad.l + cw / 2, pad.t + ch + 14);
}

export default function SFDBMDGenerator() {
  const navigate = useNavigate();
  const sfdRef = useRef(null);
  const bmdRef = useRef(null);
  const sfdWrapRef = useRef(null);
  const bmdWrapRef = useRef(null);

  const [beamType, setBeamType] = useState('simply-supported');
  const [len, setLen] = useState(6);
  const [loads, setLoads] = useState([
    { id: 1, type: 'point', val: 10, pos: 2 },
    { id: 2, type: 'point', val: 8, pos: 4 },
  ]);
  const [nextId, setNextId] = useState(3);

  const result = useMemo(() => solveBeam(beamType, len, loads.filter(l => l.val > 0)), [beamType, len, loads]);
  const sfdData = result.points;
  const maxShear = sfdData.reduce((a, p) => Math.max(a, Math.abs(p.V)), 0);
  const maxMoment = sfdData.reduce((a, p) => Math.max(a, Math.abs(p.M)), 0);

  const drawAll = useCallback(() => {
    const dpr = window.devicePixelRatio || 1;
    [sfdRef, bmdRef].forEach((ref, idx) => {
      const c = ref.current;
      const wrap = idx === 0 ? sfdWrapRef.current : bmdWrapRef.current;
      if (!c || !wrap) return;
      const rect = wrap.getBoundingClientRect();
      c.width = rect.width * dpr; c.height = 240 * dpr;
      c.style.width = rect.width + 'px'; c.style.height = '240px';
      const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
      const vals = sfdData.map(p => ({ x: p.x, V: idx === 0 ? p.V : p.M }));
      const label = idx === 0 ? 'SFD (kN)' : 'BMD (kN·m)';
      const color = idx === 0 ? '#22c55e' : '#60a5fa';
      drawOnCanvas(c, vals, label, color, len);
    });
  }, [sfdData, len]);

  useEffect(() => { drawAll(); }, [drawAll]);

  useEffect(() => {
    window.addEventListener('resize', drawAll);
    return () => window.removeEventListener('resize', drawAll);
  }, [drawAll]);

  return (
    <div className="sfd-page">
      <div className="sfd-header">
        <button className="sfd-back" onClick={() => navigate('/students-hub')}><ArrowLeft size={20} /></button>
        <div><h1 className="sfd-title">SFD &amp; BMD Generator</h1><p className="sfd-subtitle">Shear Force &amp; Bending Moment Diagram</p></div>
      </div>

      <div className="sfd-body">
        <div className="sfd-panel">
          <div className="sfd-row">
            <label>Beam Type</label>
            <select value={beamType} onChange={e => setBeamType(e.target.value)} className="sfd-select">
              <option value="simply-supported">Simply Supported</option>
              <option value="cantilever">Cantilever</option>
            </select>
          </div>
          <div className="sfd-row">
            <label>Length (m)</label>
            <input type="number" min={0.1} step={0.5} value={len} onChange={e => setLen(parseFloat(e.target.value) || 1)} className="sfd-input" />
          </div>

          <div className="sfd-loads-head">
            <span>Loads</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="sfd-add-btn" onClick={() => { setLoads(p => [...p, { id: nextId, type: 'point', val: 10, pos: len * 0.5 }]); setNextId(n => n + 1); }}><Weight size={13} /> Point</button>
              <button className="sfd-add-btn" onClick={() => { setLoads(p => [...p, { id: nextId, type: 'udl', val: 5, start: 0, end: len * 0.5 }]); setNextId(n => n + 1); }}><Waves size={13} /> UDL</button>
            </div>
          </div>

          <div className="sfd-loads">
            {loads.map(ld => (
              <div key={ld.id} className="sfd-load">
                <span className={`sfd-load-badge ${ld.type}`}>{ld.type === 'point' ? 'P' : 'w'}</span>
                <div className="sfd-load-fields">
                  {ld.type === 'point' ? (
                    <>
                      <div><label>Value</label><input type="number" step={0.5} min={0} value={ld.val} onChange={e => setLoads(p => p.map(l => l.id === ld.id ? { ...l, val: parseFloat(e.target.value) || 0 } : l))} className="sfd-input sm" /></div>
                      <div><label>@ (m)</label><input type="number" step={0.1} min={0} max={len} value={ld.pos} onChange={e => setLoads(p => p.map(l => l.id === ld.id ? { ...l, pos: parseFloat(e.target.value) || 0 } : l))} className="sfd-input sm" /></div>
                    </>
                  ) : (
                    <>
                      <div><label>Value</label><input type="number" step={0.5} min={0} value={ld.val} onChange={e => setLoads(p => p.map(l => l.id === ld.id ? { ...l, val: parseFloat(e.target.value) || 0 } : l))} className="sfd-input sm" /></div>
                      <div><label>From</label><input type="number" step={0.1} min={0} max={len} value={ld.start} onChange={e => setLoads(p => p.map(l => l.id === ld.id ? { ...l, start: parseFloat(e.target.value) || 0 } : l))} className="sfd-input sm" /></div>
                      <div><label>To</label><input type="number" step={0.1} min={0} max={len} value={ld.end} onChange={e => setLoads(p => p.map(l => l.id === ld.id ? { ...l, end: parseFloat(e.target.value) || 0 } : l))} className="sfd-input sm" /></div>
                    </>
                  )}
                </div>
                <button className="sfd-remove-btn" onClick={() => setLoads(p => p.filter(l => l.id !== ld.id))}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          <div className="sfd-results">
            <div className="sfd-result-row"><span>Reaction R₁</span><span className="sfd-result-val">{formatNum(result.R1)} kN</span></div>
            {beamType === 'simply-supported' && <div className="sfd-result-row"><span>Reaction R₂</span><span className="sfd-result-val">{formatNum(result.R2)} kN</span></div>}
            {beamType === 'cantilever' && <div className="sfd-result-row"><span>Fixed Moment</span><span className="sfd-result-val">{formatNum(result.R2)} kN·m</span></div>}
            <div className="sfd-result-row"><span>Max Shear</span><span className="sfd-result-val warn">{formatNum(maxShear)} kN</span></div>
            <div className="sfd-result-row"><span>Max Moment</span><span className="sfd-result-val warn">{formatNum(maxMoment)} kN·m</span></div>
          </div>
        </div>

        <div className="sfd-diagrams">
          <div className="sfd-diagram-box">
            <div className="sfd-diagram-label" style={{ color: '#22c55e' }}>Shear Force Diagram (SFD)</div>
            <div className="sfd-canvas-wrap" ref={sfdWrapRef}><canvas ref={sfdRef} /></div>
          </div>
          <div className="sfd-diagram-box">
            <div className="sfd-diagram-label" style={{ color: '#60a5fa' }}>Bending Moment Diagram (BMD)</div>
            <div className="sfd-canvas-wrap" ref={bmdWrapRef}><canvas ref={bmdRef} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
