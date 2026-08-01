import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

export default function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running || remaining <= 0) {
      clearInterval(intervalRef.current);
      if (remaining <= 0 && running) {
        setRunning(false);
        setFinished(true);
        try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==').play(); } catch {}
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining(r => r - 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, remaining]);

  const start = () => {
    if (remaining <= 0) {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total <= 0) return;
      setRemaining(total);
    }
    setFinished(false);
    setRunning(true);
  };

  const pause = () => setRunning(false);
  const reset = () => { clearInterval(intervalRef.current); setRunning(false); setRemaining(0); setFinished(false); };

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  const progress = remaining > 0 && (hours * 3600 + minutes * 60 + seconds) > 0
    ? remaining / (hours * 3600 + minutes * 60 + seconds) : 0;

  return (
    <div className="utility-tool">
      <div className="tool-options">
        <h3 className="options-title">Countdown Timer</h3>
        <div className="options-grid">
          <div className="option-item">
            <label>Hours</label>
            <input type="number" className="option-input" value={hours} onChange={e => setHours(Math.max(0, Math.min(23, Number(e.target.value))))} min={0} max={23} disabled={running} />
          </div>
          <div className="option-item">
            <label>Minutes</label>
            <input type="number" className="option-input" value={minutes} onChange={e => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))} min={0} max={59} disabled={running} />
          </div>
          <div className="option-item">
            <label>Seconds</label>
            <input type="number" className="option-input" value={seconds} onChange={e => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))} min={0} max={59} disabled={running} />
          </div>
        </div>
      </div>

      <div className="countdown-display">
        <div className="countdown-time">
          {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </div>
        <div className="countdown-bar">
          <div className="countdown-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {finished && (
        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', textAlign: 'center', color: '#f87171', fontWeight: 600, marginBottom: '12px' }}>
          <Bell size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Time's up!
        </div>
      )}

      <div className="service-actions">
        {!running ? (
          <button className="process-btn" onClick={start}><Play size={16} /> {remaining > 0 ? 'Resume' : 'Start'}</button>
        ) : (
          <button className="process-btn" onClick={pause} style={{ background: '#f59e0b' }}><Pause size={16} /> Pause</button>
        )}
        <button className="process-btn" onClick={reset} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}><RotateCcw size={16} /> Reset</button>
      </div>
    </div>
  );
}
