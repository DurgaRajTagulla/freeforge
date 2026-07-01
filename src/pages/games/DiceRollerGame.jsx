import { useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import './Games.css';

const DICE_FACES = [
  null,
  [[2,2]],
  [[0,4],[4,0]],
  [[0,4],[2,2],[4,0]],
  [[0,0],[0,4],[4,0],[4,4]],
  [[0,0],[0,4],[2,2],[4,0],[4,4]],
  [[0,0],[0,2],[0,4],[4,0],[4,2],[4,4]],
];

function DiceFace({ value }) {
  const dots = DICE_FACES[value] || [];
  return (
    <div className="dice-face">
      {dots.map(([r, c], i) => (
        <span key={i} className="dice-dot" style={{ top: `${r * 20 + 8}%`, left: `${c * 20 + 8}%` }} />
      ))}
    </div>
  );
}

export default function DiceRollerGame() {
  const [count, setCount] = useState(1);
  const [dice, setDice] = useState([1]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [rollPhase, setRollPhase] = useState(null);
  const [dieStyles, setDieStyles] = useState([]);

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    setRollPhase('launch');

    const results = Array(count).fill(0).map(() => Math.floor(Math.random() * 6) + 1);

    const styles = Array(count).fill(0).map((_, i) => ({
      '--tx': `${(Math.random() - 0.5) * 60}px`,
      '--ty': `${-40 - Math.random() * 50}px`,
      '--r1': `${(Math.random() - 0.5) * 720}deg`,
      '--r2': `${(Math.random() - 0.5) * 360}deg`,
      '--bounce-h': `${(Math.random() - 0.5) * 30}px`,
      '--bounce-r': `${(Math.random() - 0.5) * 20}deg`,
      animationDelay: `${i * 40}ms`,
    }));
    setDieStyles(styles);

    let frames = 0;
    const interval = setInterval(() => {
      setDice(Array(count).fill(0).map(() => Math.floor(Math.random() * 6) + 1));
      frames++;
      if (frames === 8) {
        setRollPhase('tumble');
      }
      if (frames >= 14) {
        clearInterval(interval);
        setDice(results);
        setRollPhase('settle');
        const sum = results.reduce((a, b) => a + b, 0);
        setTotal(t => t + sum);
        setHistory(h => [{ dice: results, sum }, ...h].slice(0, 20));
        setTimeout(() => {
          setRolling(false);
          setRollPhase(null);
          setDieStyles([]);
        }, 500);
      }
    }, 55);
  }, [rolling, count]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Dice Roller</h2>
        <div className="game-controls">
          <span className="game-score">Total: {total}</span>
          <button className="game-icon-btn" onClick={() => { setDice([1]); setHistory([]); setTotal(0); }}><RotateCcw size={18} /></button>
        </div>
      </div>

      <div className="dice-count-select">
        {[1,2,3,4,5,6].map(n => (
          <button key={n} className={`level-btn ${count === n ? 'active' : ''}`} onClick={() => { setCount(n); setDice(Array(n).fill(1)); }}>{n} dice</button>
        ))}
      </div>

      <div className="dice-results">
        {dice.map((val, i) => (
          <div
            key={i}
            className={`dice-container ${rollPhase ? `phase-${rollPhase}` : ''}`}
            style={dieStyles[i] || {}}
          >
            <DiceFace value={val} />
          </div>
        ))}
      </div>

      <div className="dice-sum">{dice.reduce((a,b) => a+b, 0)}</div>

      <button className="game-start-btn" onClick={roll} disabled={rolling}>
        {rolling ? 'Rolling...' : '🎲 Roll'}
      </button>

      {history.length > 0 && (
        <div className="dice-history">
          {history.map((h, i) => (
            <div key={i} className="dice-history-item">
              <span className="dice-history-rolls">{h.dice.join(' + ')}</span>
              <span className="dice-history-sum">= {h.sum}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
