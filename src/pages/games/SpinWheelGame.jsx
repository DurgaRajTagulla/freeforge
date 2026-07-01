import { useState, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import './Games.css';

const DEFAULT_SEGMENTS = ['Prize 1','Prize 2','Prize 3','Prize 4','Prize 5','Prize 6','Prize 7','Prize 8'];
const COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899'];
const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = SIZE / 2 - 2;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export default function SpinWheelGame() {
  const [segments, setSegments] = useState(DEFAULT_SEGMENTS);
  const [newEntry, setNewEntry] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const wheelRef = useRef(null);

  const spin = useCallback(() => {
    if (spinning || segments.length < 2) return;
    setSpinning(true);
    setResult(null);
    const extra = 1440 + Math.random() * 360;
    const newRot = rotation + extra;
    setRotation(newRot);
    setTimeout(() => {
      const segAngle = 360 / segments.length;
      const idx = Math.floor(((360 - (newRot % 360)) % 360) / segAngle);
      const winner = segments[idx % segments.length];
      setResult(winner);
      setHistory(h => [winner, ...h].slice(0, 10));
      setSpinning(false);
    }, 4200);
  }, [spinning, segments, rotation]);

  const addEntry = () => {
    if (newEntry.trim() && segments.length < 16) {
      setSegments(s => [...s, newEntry.trim()]);
      setNewEntry('');
    }
  };

  const removeEntry = (i) => { setSegments(s => s.filter((_, idx) => idx !== i)); };
  const resetEntries = () => { setSegments(DEFAULT_SEGMENTS); setHistory([]); setResult(null); };

  const segAngle = 360 / segments.length;

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Spin Wheel</h2>
        <div className="game-controls">
          <button className="game-icon-btn" onClick={resetEntries}><RotateCcw size={18} /></button>
        </div>
      </div>

      <div className="spin-wheel-wrapper">
        <div className="spin-pointer">▼</div>
        <div ref={wheelRef} className="spin-wheel" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 4s cubic-bezier(0.17,0.67,0.12,0.99)' : 'none' }}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: '100%', height: '100%' }}>
            {segments.map((seg, i) => {
              const startAngle = segAngle * i;
              const endAngle = segAngle * (i + 1);
              const midAngle = (startAngle + endAngle) / 2;
              const path = describeArc(CX, CY, RADIUS, startAngle, endAngle);
              const textPos = polarToCartesian(CX, CY, RADIUS * 0.6, midAngle);
              const textRotation = midAngle <= 180 ? midAngle - 90 : midAngle + 90;
              return (
                <g key={i}>
                  <path d={path} fill={COLORS[i % COLORS.length]} stroke="#1e293b" strokeWidth="2" />
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    fill="#fff"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textRotation}, ${textPos.x}, ${textPos.y})`}
                    style={{ pointerEvents: 'none' }}
                  >
                    {seg}
                  </text>
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r="6" fill="#1e293b" />
          </svg>
        </div>
      </div>

      {result && <div className="spin-result">🎉 {result}</div>}

      <button className="game-start-btn" onClick={spin} disabled={spinning || segments.length < 2}>
        {spinning ? 'Spinning...' : 'Spin!'}
      </button>

      <div className="spin-editor">
        <h4 style={{ color: '#f1f5f9', margin: '0 0 8px', fontSize: '14px' }}>Customize Segments</h4>
        <div className="spin-add-row">
          <input className="option-input" value={newEntry} onChange={e => setNewEntry(e.target.value)} placeholder="Add item..." onKeyDown={e => e.key === 'Enter' && addEntry()} />
          <button className="process-btn" onClick={addEntry} style={{ padding: '8px 14px', fontSize: '13px' }}>Add</button>
        </div>
        <div className="spin-tags">
          {segments.map((seg, i) => (
            <span key={i} className="spin-tag" style={{ background: COLORS[i % COLORS.length] }}>
              {seg}
              <button onClick={() => removeEntry(i)}>×</button>
            </span>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="spin-history">
          <h4 style={{ color: '#94a3b8', margin: '0 0 6px', fontSize: '12px' }}>History</h4>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{history.join(' → ')}</p>
        </div>
      )}
    </div>
  );
}
