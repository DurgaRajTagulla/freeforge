import { useState, useRef, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import './Games.css';

const DEFAULT_SEGMENTS = ['Prize 1','Prize 2','Prize 3','Prize 4','Prize 5','Prize 6','Prize 7','Prize 8'];
const COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899'];

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
          {segments.map((seg, i) => {
            const angle = segAngle * i;
            return (
              <div key={i} className="spin-segment" style={{ transform: `rotate(${angle}deg)`, background: COLORS[i % COLORS.length] }}>
                <span className="spin-seg-text" style={{ transform: `rotate(${segAngle / 2}deg)` }}>{seg}</span>
              </div>
            );
          })}
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
