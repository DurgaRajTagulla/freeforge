import { useState } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import './Games.css';

export default function CoinTossGame() {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ heads: 0, tails: 0, streak: 0, bestStreak: 0, last: null });

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const isHeads = Math.random() < 0.5;
      const result = isHeads ? 'heads' : 'tails';
      setStats(s => {
        const sameStreak = s.last === result ? s.streak + 1 : 1;
        return {
          heads: s.heads + (isHeads ? 1 : 0),
          tails: s.tails + (isHeads ? 0 : 1),
          streak: sameStreak,
          bestStreak: Math.max(s.bestStreak, sameStreak),
          last: result,
        };
      });
      setResult(result);
      setFlipping(false);
    }, 1000);
  };

  const reset = () => { setStats({ heads: 0, tails: 0, streak: 0, bestStreak: 0, last: null }); setResult(null); };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Coin Toss</h2>
        <div className="game-controls">
          <button className="game-icon-btn" onClick={reset}><RotateCcw size={18} /></button>
        </div>
      </div>

      <div className={`coin ${flipping ? 'coin-flipping' : ''} ${result === 'heads' ? 'coin-heads' : result === 'tails' ? 'coin-tails' : ''}`} onClick={flip}>
        <div className="coin-inner">
          <div className="coin-front">H</div>
          <div className="coin-back">T</div>
        </div>
      </div>

      {result && !flipping && (
        <div className={`coin-result coin-result-${result}`}>
          {result === 'heads' ? '👑 Heads!' : '🌙 Tails!'}
        </div>
      )}

      <button className="game-start-btn" onClick={flip} disabled={flipping}>
        {flipping ? 'Flipping...' : '🪙 Flip Coin'}
      </button>

      <div className="coin-stats">
        <div className="coin-stat"><span className="coin-stat-value">{stats.heads}</span><span className="coin-stat-label">Heads</span></div>
        <div className="coin-stat"><span className="coin-stat-value">{stats.tails}</span><span className="coin-stat-label">Tails</span></div>
        <div className="coin-stat"><span className="coin-stat-value">{stats.streak}</span><span className="coin-stat-label">Streak</span></div>
        <div className="coin-stat"><span className="coin-stat-value">{stats.bestStreak}</span><span className="coin-stat-label">Best</span></div>
      </div>
    </div>
  );
}
