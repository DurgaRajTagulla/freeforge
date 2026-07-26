import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, RotateCcw, GripVertical, Cable } from 'lucide-react';
import './LogicGateSimulator.css';

const GATE_DEFS = {
  input:  { label: 'INPUT', inputs: 0, outputs: 1, w: 60, h: 42, color: '#64748b' },
  output: { label: 'OUT',   inputs: 1, outputs: 0, w: 60, h: 42, color: '#64748b' },
  and:    { label: 'AND',   inputs: 2, outputs: 1, w: 72, h: 50, color: '#3b82f6' },
  or:     { label: 'OR',    inputs: 2, outputs: 1, w: 72, h: 50, color: '#22c55e' },
  not:    { label: 'NOT',   inputs: 1, outputs: 1, w: 72, h: 50, color: '#ef4444' },
  nand:   { label: 'NAND',  inputs: 2, outputs: 1, w: 72, h: 50, color: '#a855f7' },
  nor:    { label: 'NOR',   inputs: 2, outputs: 1, w: 72, h: 50, color: '#f97316' },
  xor:    { label: 'XOR',   inputs: 2, outputs: 1, w: 72, h: 50, color: '#06b6d4' },
  xnor:   { label: 'XNOR',  inputs: 2, outputs: 1, w: 72, h: 50, color: '#ec4899' },
};

const PALETTE_TYPES = ['input','output','and','or','not','nand','nor','xor','xnor'];

function portPos(gate) {
  const d = GATE_DEFS[gate.type];
  const pts = [];
  if (d.inputs >= 1) pts.push({ port: 'in1', x: 0, y: d.h / (d.inputs + 1) * 1 });
  if (d.inputs >= 2) pts.push({ port: 'in2', x: 0, y: d.h / (d.inputs + 1) * 2 });
  if (d.outputs >= 1) pts.push({ port: 'out', x: d.w, y: d.h / 2 });
  return pts;
}

function evalGate(gate, vals, wires) {
  if (gate.type === 'input') return gate.value;
  const ins = {};
  wires.filter(w => w.toId === gate.id).forEach(w => { ins[w.toPort] = vals[w.fromId] || 0; });
  const a = ins.in1 !== undefined ? ins.in1 : 0;
  const b = ins.in2 !== undefined ? ins.in2 : 0;
  switch (gate.type) {
    case 'and':  return (a && b) ? 1 : 0;
    case 'or':   return (a || b) ? 1 : 0;
    case 'not':  return a ? 0 : 1;
    case 'nand': return (a && b) ? 0 : 1;
    case 'nor':  return (a || b) ? 0 : 1;
    case 'xor':  return (a !== b) ? 1 : 0;
    case 'xnor': return (a === b) ? 1 : 0;
    case 'output': return a;
    default: return 0;
  }
}

function computeAll(gates, wires) {
  const vals = {};
  Object.keys(gates).forEach(id => { vals[id] = 0; });
  const indeg = {}; const adj = {};
  Object.keys(gates).forEach(id => { indeg[id] = 0; adj[id] = []; });
  wires.forEach(w => { adj[w.fromId].push(w); indeg[w.toId] = (indeg[w.toId]||0)+1; });
  const q = Object.keys(gates).filter(id => indeg[id] === 0);
  while (q.length) {
    const id = q.shift();
    vals[id] = evalGate(gates[id], vals, wires);
    adj[id].forEach(w => { indeg[w.toId]--; if (indeg[w.toId] === 0) q.push(w.toId); });
  }
  return vals;
}

function genTruthTable(gates, wires) {
  const ins = Object.values(gates).filter(g => g.type === 'input').sort((a,b) => a.label.localeCompare(b.label));
  const outs = Object.values(gates).filter(g => g.type === 'output');
  if (!ins.length || !outs.length) return null;
  const rows = [];
  for (let mask = 0; mask < (1 << ins.length); mask++) {
    const testGates = {};
    Object.entries(gates).forEach(([id,g]) => { testGates[id] = { ...g }; });
    ins.forEach((g, i) => { testGates[g.id].value = (mask >> (ins.length-1-i)) & 1; });
    const vals = computeAll(testGates, wires);
    const outVals = outs.map(o => vals[o.id]);
    rows.push({ in: ins.map((_,i) => (mask >> (ins.length-1-i)) & 1), out: outVals });
  }
  return { inputs: ins.map(g => g.label), outputs: outs.map(g => g.label), rows };
}

let _id = 1;
function uid() { return `g${_id++}`; }
function wid() { return `w${_id++}`; }

export default function LogicGateSimulator() {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const [gates, setGates] = useState(() => {
    const init = {};
    const a = { id: uid(), type: 'input',  x: 60,  y: 100, label: 'A', value: 0 };
    const b = { id: uid(), type: 'input',  x: 60,  y: 200, label: 'B', value: 0 };
    const g1 = { id: uid(), type: 'and',   x: 200, y: 125 };
    const o1 = { id: uid(), type: 'output', x: 340, y: 150, label: 'Y' };
    init[a.id]=a; init[b.id]=b; init[g1.id]=g1; init[o1.id]=o1;
    return init;
  });
  const [wires, setWires] = useState(() => {
    const gs = Object.values(gates);
    const a=gs.find(g=>g.label==='A'), b=gs.find(g=>g.label==='B'), g1=gs.find(g=>g.type==='and'), o1=gs.find(g=>g.type==='output');
    return [
      { id: wid(), fromId: a.id, fromPort: 'out', toId: g1.id, toPort: 'in1' },
      { id: wid(), fromId: b.id, fromPort: 'out', toId: g1.id, toPort: 'in2' },
      { id: wid(), fromId: g1.id, fromPort: 'out', toId: o1.id, toPort: 'in1' },
    ];
  });
  const [selectedId, setSelectedId] = useState(null);
  const [placing, setPlacing] = useState(null);
  const [drawing, setDrawing] = useState(null);
  const [drag, setDrag] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const vals = useMemo(() => computeAll(gates, wires), [gates, wires]);
  const truth = useMemo(() => genTruthTable(gates, wires), [gates, wires]);

  const svgPt = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const svgW = 800, svgH = 500;
    return { x: (e.clientX - rect.left) * (svgW / rect.width), y: (e.clientY - rect.top) * (svgH / rect.height) };
  }, []);

  const placeGate = useCallback((e) => {
    if (!placing) return;
    const p = svgPt(e);
    const id = uid();
    const label = placing === 'input'
      ? String.fromCharCode(65 + Object.values(gates).filter(g => g.type === 'input').length)
      : (placing === 'output' ? 'Y' : undefined);
    setGates(prev => ({ ...prev, [id]: { id, type: placing, x: p.x - GATE_DEFS[placing].w / 2, y: p.y - 20, label, value: 0 } }));
    setSelectedId(id);
  }, [placing, svgPt, gates]);

  const startWire = useCallback((gateId) => {
    setDrawing({ fromId: gateId, fromPort: 'out' });
  }, []);

  const endWire = useCallback((gateId, port) => {
    if (!drawing || drawing.fromId === gateId) return;
    const exists = wires.some(w => w.fromId === drawing.fromId && w.toId === gateId && w.toPort === port);
    if (!exists) {
      setWires(prev => [...prev, { id: wid(), fromId: drawing.fromId, fromPort: 'out', toId: gateId, toPort: port }]);
    }
    setDrawing(null);
  }, [drawing, wires]);

  const toggleInput = useCallback((id) => {
    setGates(prev => {
      const g = prev[id];
      if (g.type !== 'input') return prev;
      return { ...prev, [id]: { ...g, value: g.value ? 0 : 1 } };
    });
  }, []);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setGates(prev => { const n = { ...prev }; delete n[selectedId]; return n; });
    setWires(prev => prev.filter(w => w.fromId !== selectedId && w.toId !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  const resetCircuit = useCallback(() => {
    setGates(prev => {
      const n = {};
      Object.entries(prev).forEach(([id, g]) => {
        if (g.type === 'input') n[id] = { ...g, value: 0 };
        else n[id] = { ...g };
      });
      return n;
    });
  }, []);

  const clearAll = useCallback(() => {
    setGates({}); setWires([]); setSelectedId(null); setDrawing(null); setPlacing(null);
  }, []);

  const handleSvgMouseDown = useCallback((e) => {
    if (e.target === svgRef.current || e.target.classList.contains('gp-svg-bg')) {
      setSelectedId(null);
      if (placing) { placeGate(e); }
    }
  }, [placing, placeGate]);

  const handleSvgMouseMove = useCallback((e) => {
    const p = svgPt(e);
    setCursor(p);
    if (drag) {
      const dx = p.x - drag.mx, dy = p.y - drag.my;
      setGates(prev => {
        const g = prev[drag.id]; if (!g) return prev;
        return { ...prev, [drag.id]: { ...g, x: Math.max(0, g.x + dx), y: Math.max(0, g.y + dy) } };
      });
      setDrag({ ...drag, mx: p.x, my: p.y });
    }
  }, [svgPt, drag]);

  const handleSvgMouseUp = useCallback(() => {
    setDrag(null);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setDrawing(null); setPlacing(null); }
      if (e.key === 'Delete' || e.key === 'Backspace') { if (selectedId) deleteSelected(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, deleteSelected]);

  const renderGate = (g) => {
    const d = GATE_DEFS[g.type];
    const out = vals[g.id];
    const ports = portPos(g);
    const isSel = selectedId === g.id;

    return (
      <g key={g.id} className={`lgs-gate ${isSel ? 'selected' : ''}`}
        onMouseDown={(e) => { e.stopPropagation(); setSelectedId(g.id); setDrag({ id: g.id, mx: cursor.x, my: cursor.y }); }}>
        <rect x={g.x} y={g.y} width={d.w} height={d.h} rx={7} ry={7}
          fill={`${d.color}18`} stroke={isSel ? '#fbbf24' : d.color} strokeWidth={isSel ? 2 : 1.5} />
        <text x={g.x + d.w / 2} y={g.y + d.h / 2} textAnchor="middle" dominantBaseline="central"
          fill={d.color} fontSize={12} fontWeight={700} fontFamily="system-ui,sans-serif">
          {g.type === 'input' || g.type === 'output' ? g.label : d.label}
        </text>
        {g.type === 'input' && (
          <text x={g.x + d.w / 2} y={g.y + d.h - 8} textAnchor="middle" fontSize={13} fontWeight={800}
            fill={g.value ? '#22c55e' : '#ef4444'} fontFamily="monospace">
            {g.value}
          </text>
        )}
        {g.type === 'output' && (
          <text x={g.x + d.w / 2} y={g.y + d.h - 8} textAnchor="middle" fontSize={14} fontWeight={800}
            fill={out ? '#22c55e' : '#ef4444'} fontFamily="monospace">
            {out}
          </text>
        )}
        {ports.map(p => {
          const cx = g.x + p.x, cy = g.y + p.y;
          const isOut = p.port === 'out';
          const isDrawing = drawing && drawing.fromId === g.id;
          return (
            <circle key={p.port} cx={cx} cy={cy} r={6}
              fill={isOut ? '#1e293b' : '#1e293b'}
              stroke={isOut ? (isDrawing ? '#fbbf24' : '#22c55e') : '#60a5fa'}
              strokeWidth={2}
              className="lgs-port"
              onMouseDown={(e) => {
                e.stopPropagation();
                if (isOut) startWire(g.id);
                else if (drawing) endWire(g.id, p.port);
              }}
              style={{ cursor: isOut ? 'crosshair' : (drawing ? 'pointer' : 'default') }} />
          );
        })}
      </g>
    );
  };

  const renderWire = (w) => {
    const src = gates[w.fromId]; const dst = gates[w.toId];
    if (!src || !dst) return null;
    const dSrc = GATE_DEFS[src.type]; const dDst = GATE_DEFS[dst.type];
    const srcPort = portPos(src).find(p => p.port === 'out');
    const dstPort = portPos(dst).find(p => p.port === w.toPort);
    if (!srcPort || !dstPort) return null;
    const x1 = src.x + srcPort.x, y1 = src.y + srcPort.y;
    const x2 = dst.x + dstPort.x, y2 = dst.y + dstPort.y;
    const cpx = (x1 + x2) / 2;
    return (
      <path key={w.id} d={`M ${x1} ${y1} Q ${cpx} ${y1} ${cpx} ${(y1+y2)/2} Q ${cpx} ${y2} ${x2} ${y2}`}
        fill="none" stroke="#64748b" strokeWidth={2.5} strokeLinecap="round"
        className="lgs-wire" />
    );
  };

  const getInputGates = () => Object.values(gates).filter(g => g.type === 'input').sort((a,b) => a.label.localeCompare(b.label));
  const getOutputGates = () => Object.values(gates).filter(g => g.type === 'output');

  return (
    <div className="lgs-page">
      <div className="lgs-header">
        <button className="lgs-back" onClick={() => navigate('/students-hub')}><ArrowLeft size={20} /></button>
        <h1 className="lgs-title">Logic Gate Simulator</h1>
      </div>

      <div className="lgs-body">
        <div className="lgs-palette">
          <h3 className="lgs-palette-title">Gates</h3>
          {PALETTE_TYPES.map(t => {
            const d = GATE_DEFS[t];
            return (
              <button key={t} className={`lgs-palette-btn ${placing === t ? 'active' : ''}`}
                onClick={() => setPlacing(placing === t ? null : t)}>
                <span className="lgs-palette-dot" style={{ background: d.color }} />
                {d.label}
              </button>
            );
          })}
          <div className="lgs-palette-divider" />
          <button className="lgs-palette-btn danger" onClick={clearAll}><Trash2 size={14} /> Clear All</button>
          <button className="lgs-palette-btn" onClick={resetCircuit}><RotateCcw size={14} /> Reset Inputs</button>
          {selectedId && (
            <button className="lgs-palette-btn danger" onClick={deleteSelected}><Trash2 size={14} /> Delete Selected</button>
          )}

          <div className="lgs-palette-hint">
            <p><Cable size={12} /> Click output ● to wire, then click input ●</p>
            <p><GripVertical size={12} /> Drag gates to move</p>
            <p>⌫ Delete/Backspace to remove</p>
          </div>
        </div>

        <div className="lgs-canvas-wrap">
          <svg ref={svgRef} viewBox="0 0 800 500" className="lgs-svg"
            onMouseDown={handleSvgMouseDown} onMouseMove={handleSvgMouseMove} onMouseUp={handleSvgMouseUp} onMouseLeave={handleSvgMouseUp}>
            <rect className="gp-svg-bg" width={800} height={500} fill="transparent" />
            {Object.values(gates).map(g => (
              <g key={g.id}>
                {wires.filter(w => w.fromId === g.id).map(renderWire)}
              </g>
            ))}
            {Object.values(gates).map(renderGate)}
            {drawing && (() => {
              const src = gates[drawing.fromId];
              if (!src) return null;
              const dSrc = GATE_DEFS[src.type];
              const srcPort = portPos(src).find(p => p.port === 'out');
              if (!srcPort) return null;
              const x1 = src.x + srcPort.x, y1 = src.y + srcPort.y;
              const cpx = (x1 + cursor.x) / 2;
              return (
                <path d={`M ${x1} ${y1} Q ${cpx} ${y1} ${cpx} ${(y1+cursor.y)/2} Q ${cpx} ${cursor.y} ${cursor.x} ${cursor.y}`}
                  fill="none" stroke="#fbbf24" strokeWidth={2} strokeDasharray="5,4" strokeLinecap="round" />
              );
            })()}
          </svg>
        </div>

        <div className="lgs-sidebar">
          <h3 className="lgs-sidebar-title">Truth Table</h3>
          {truth ? (
            <div className="lgs-ttable-wrap">
              <table className="lgs-ttable">
                <thead>
                  <tr>
                    {truth.inputs.map((l, i) => <th key={i}>{l}</th>)}
                    <th className="lgs-ttable-sep">|</th>
                    {truth.outputs.map((l, i) => <th key={i}>{l}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {truth.rows.map((row, i) => (
                    <tr key={i}>
                      {row.in.map((v, j) => <td key={j} className={v ? 'high' : 'low'}>{v}</td>)}
                      <td className="lgs-ttable-sep">|</td>
                      {row.out.map((v, j) => <td key={j} className={v ? 'high' : 'low'}>{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="lgs-sidebar-hint">Add at least one INPUT and one OUTPUT gate to see the truth table.</p>
          )}

          <h3 className="lgs-sidebar-title" style={{ marginTop: 16 }}>Circuit State</h3>
          <div className="lgs-state">
            {getInputGates().map(g => (
              <div key={g.id} className="lgs-state-row">
                <span className="lgs-state-label">{g.label}</span>
                <button className={`lgs-toggle ${g.value ? 'on' : ''}`} onClick={() => toggleInput(g.id)}>
                  {g.value ? '1' : '0'}
                </button>
              </div>
            ))}
            {getOutputGates().map(g => (
              <div key={g.id} className="lgs-state-row">
                <span className="lgs-state-label">{g.label}</span>
                <span className={`lgs-state-val ${vals[g.id] ? 'on' : ''}`}>{vals[g.id]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
