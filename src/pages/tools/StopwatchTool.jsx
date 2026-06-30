import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

export default function StopwatchTool() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return; }
    startTimeRef.current = Date.now() - elapsed;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 10);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const start = () => { setRunning(true); };
  const pause = () => setRunning(false);
  const reset = () => { clearInterval(intervalRef.current); setRunning(false); setElapsed(0); setLaps([]); };
  const lap = () => { if (!running) return; setLaps(l => [elapsed, ...l]); };

  const formatTime = (ms) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  return (
    <div className="utility-tool">
      <div className="tool-options">
        <h3 className="options-title">Stopwatch</h3>
      </div>

      <div className="stopwatch-display">
        <div className="stopwatch-time">{formatTime(elapsed)}</div>
      </div>

      <div className="service-actions">
        {!running ? (
          <button className="process-btn" onClick={start}><Play size={16} /> Start</button>
        ) : (
          <>
            <button className="process-btn" onClick={pause} style={{ background: '#f59e0b' }}><Pause size={16} /> Pause</button>
            <button className="process-btn" onClick={lap} style={{ background: '#8b5cf6' }}><Flag size={16} /> Lap</button>
          </>
        )}
        <button className="process-btn" onClick={reset} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}><RotateCcw size={16} /> Reset</button>
      </div>

      {laps.length > 0 && (
        <div className="stopwatch-laps">
          <h4 style={{ color: '#94a3b8', margin: '0 0 8px', fontSize: '13px' }}>Laps</h4>
          {laps.map((l, i) => (
            <div key={i} className="stopwatch-lap">
              <span className="stopwatch-lap-num">Lap {laps.length - i}</span>
              <span className="stopwatch-lap-time">{formatTime(l)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
