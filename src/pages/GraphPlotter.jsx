import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Move, RotateCcw, Play } from 'lucide-react';
import './GraphPlotter.css';

const PRESETS = [
  { label: 'x²', fn: 'x^2' },
  { label: 'sin(x)', fn: 'sin(x)' },
  { label: 'cos(x)', fn: 'cos(x)' },
  { label: 'x³−x', fn: 'x^3 - x' },
  { label: '|x|', fn: 'abs(x)' },
  { label: '1/x', fn: '1/x' },
  { label: '√x', fn: 'sqrt(x)' },
  { label: 'eˣ', fn: 'exp(x)' },
  { label: 'ln(x)', fn: 'log(x)' },
  { label: 'x²+2x−3', fn: 'x^2 + 2*x - 3' },
  { label: 'sin(x²)', fn: 'sin(x^2)' },
  { label: 'x·sin(x)', fn: 'x*sin(x)' },
];

function parseFn(src) {
  let s = src
    .replace(/\^/g, '**')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/log\(/g, 'Math.log(')
    .replace(/exp\(/g, 'Math.exp(')
    .replace(/pi/gi, 'Math.PI')
    .replace(/π/g, 'Math.PI');
  try { return new Function('x', `return ${s}`); }
  catch { return null; }
}

export default function GraphPlotter() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [expr, setExpr] = useState('x^2');
  const [fn, setFn] = useState(() => parseFn('x^2'));
  const [error, setError] = useState('');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const dragStart = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const xScale = W / (xMax - xMin);
    const yScale = H / (yMax - yMin);

    const toScreenX = (x) => (x - xMin) * xScale;
    const toScreenY = (y) => H - (y - yMin) * yScale;

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;

    const xStep = 10 ** Math.floor(Math.log10((xMax - xMin) / 5));
    const yStep = 10 ** Math.floor(Math.log10((yMax - yMin) / 5));

    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      const sx = toScreenX(x);
      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();
    }
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      const sy = toScreenY(y);
      ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
    }

    const ox = toScreenX(0);
    const oy = toScreenY(0);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      if (Math.abs(x) < 1e-10) continue;
      const sx = toScreenX(x);
      ctx.fillText(Number.isInteger(x) ? x.toString() : x.toFixed(1), sx, oy + 4);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      if (Math.abs(y) < 1e-10) continue;
      const sy = toScreenY(y);
      ctx.fillText(Number.isInteger(y) ? y.toString() : y.toFixed(1), ox - 6, sy);
    }

    if (!fn) return;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#fbbf2440';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= W; px++) {
      const x = xMin + (px / W) * (xMax - xMin);
      let y;
      try { y = fn(x); }
      catch { continue; }
      if (y === undefined || y === null || !isFinite(y)) { started = false; continue; }
      const sy = toScreenY(y);
      if (sy < -500 || sy > H + 500) { started = false; continue; }
      if (!started) { ctx.moveTo(px, sy); started = true; }
      else ctx.lineTo(px, sy);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [fn, xMin, xMax, yMin, yMax]);

  useEffect(() => { draw(); }, [draw]);

  useEffect(() => {
    const handleResize = () => {
      const c = containerRef.current;
      const canvas = canvasRef.current;
      if (!c || !canvas) return;
      const rect = c.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      const ctx = canvas.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      draw();
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  const handleExprChange = (val) => {
    setExpr(val);
    const parsed = parseFn(val);
    if (parsed) { setFn(() => parsed); setError(''); }
    else setError('Invalid expression');
  };

  const handlePreset = (p) => {
    setExpr(p.fn);
    const parsed = parseFn(p.fn);
    if (parsed) setFn(() => parsed);
  };

  const handleMouseDown = (e) => {
    dragStart.current = { x: e.clientX, y: e.clientY, xMin, xMax, yMin, yMax };
  };

  const handleMouseMove = (e) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const W = canvasRef.current?.getBoundingClientRect().width || 600;
    const H = canvasRef.current?.getBoundingClientRect().height || 400;
    const xRange = dragStart.current.xMax - dragStart.current.xMin;
    const yRange = dragStart.current.yMax - dragStart.current.yMin;
    setXMin(dragStart.current.xMin - (dx / W) * xRange);
    setXMax(dragStart.current.xMax - (dx / W) * xRange);
    setYMin(dragStart.current.yMin + (dy / H) * yRange);
    setYMax(dragStart.current.yMax + (dy / H) * yRange);
  };

  const handleMouseUp = () => { dragStart.current = null; };

  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.85;
    const cx = (xMin + xMax) / 2;
    const cy = (yMin + yMax) / 2;
    const nxr = (xMax - xMin) * factor;
    const nyr = (yMax - yMin) * factor;
    setXMin(cx - nxr / 2); setXMax(cx + nxr / 2);
    setYMin(cy - nyr / 2); setYMax(cy + nyr / 2);
  };

  const resetView = () => {
    setXMin(-10); setXMax(10); setYMin(-10); setYMax(10);
  };

  const zoomIn = () => {
    const cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2;
    const nxr = (xMax - xMin) * 0.85, nyr = (yMax - yMin) * 0.85;
    setXMin(cx - nxr / 2); setXMax(cx + nxr / 2);
    setYMin(cy - nyr / 2); setYMax(cy + nyr / 2);
  };

  const zoomOut = () => {
    const cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2;
    const nxr = (xMax - xMin) * 1.15, nyr = (yMax - yMin) * 1.15;
    setXMin(cx - nxr / 2); setXMax(cx + nxr / 2);
    setYMin(cy - nyr / 2); setYMax(cy + nyr / 2);
  };

  return (
    <div className="gp-page">
      <div className="gp-header">
        <div className="gp-header-inner">
          <button className="gp-back" onClick={() => navigate('/students-hub')}><ArrowLeft size={20} /></button>
          <div>
            <h1 className="gp-title">Graph Plotter</h1>
            <p className="gp-subtitle">Plot y = f(x) — pan by dragging, zoom with scroll or buttons</p>
          </div>
        </div>
      </div>

      <div className="gp-body">
        <div className="gp-sidebar">
          <div className="gp-input-group">
            <label className="gp-label">y = f(x)</label>
            <div className="gp-input-wrap">
              <input className={`gp-input ${error ? 'gp-error' : ''}`} value={expr} onChange={e => handleExprChange(e.target.value)} placeholder="x^2 + 2*x - 3" spellCheck={false} />
              <button className="gp-plot-btn" onClick={() => handleExprChange(expr)}><Play size={16} /></button>
            </div>
            {error && <span className="gp-error-text">{error}</span>}
          </div>

          <div className="gp-zoom-row">
            <button className="gp-zoom-btn" onClick={zoomOut}><Minus size={16} /></button>
            <button className="gp-zoom-btn" onClick={resetView}><RotateCcw size={16} /></button>
            <button className="gp-zoom-btn" onClick={zoomIn}><Plus size={16} /></button>
          </div>

          <div className="gp-presets">
            <span className="gp-presets-label"><Move size={14} /> Presets</span>
            <div className="gp-preset-grid">
              {PRESETS.map(p => (
                <button key={p.fn} className={`gp-preset-btn ${p.fn === expr ? 'active' : ''}`} onClick={() => handlePreset(p)}>{p.label}</button>
              ))}
            </div>
          </div>

          <div className="gp-tips">
            <strong>Tips:</strong>
            <ul>
              <li><code>^</code> for power: <code>x^3</code></li>
              <li><code>abs(x)</code>, <code>sqrt(x)</code></li>
              <li><code>sin(x)</code>, <code>cos(x)</code>, <code>tan(x)</code></li>
              <li><code>log(x)</code> (ln), <code>exp(x)</code></li>
              <li>Constants: <code>pi</code></li>
            </ul>
          </div>
        </div>

        <div className="gp-canvas-wrap" ref={containerRef}
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
          onWheel={handleWheel}>
          <canvas ref={canvasRef} className="gp-canvas" />
          <div className="gp-canvas-hint"><Move size={14} /> Drag to pan · Scroll to zoom</div>
        </div>
      </div>
    </div>
  );
}
