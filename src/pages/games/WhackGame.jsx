import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import './Games.css';

function getHighScore() {
  try { return parseInt(localStorage.getItem('freeforge_whack_high') || '0', 10); } catch { return 0; }
}
function setHighScore(score) {
  const high = getHighScore();
  if (score > high) localStorage.setItem('freeforge_whack_high', String(score));
}

export default function WhackGame() {
  const [holes] = useState(9);
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [highScore, setHigh] = useState(getHighScore);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState('menu');
  const [hitEffect, setHitEffect] = useState(null);
  const timerRef = useRef(null);
  const moleRef = useRef(null);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setMoles(Array(9).fill(false));
    setGameState('playing');
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearInterval(moleRef.current);
          setGameState('gameover');
          setHighScore(score);
          setHigh(getHighScore());
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState, score]);

  // Spawn moles
  useEffect(() => {
    if (gameState !== 'playing') return;
    moleRef.current = setInterval(() => {
      setMoles(prev => {
        const newMoles = [...prev];
        // Remove a random mole
        const activeIndices = newMoles.map((m, i) => m ? i : -1).filter(i => i >= 0);
        if (activeIndices.length > 0) {
          newMoles[activeIndices[Math.floor(Math.random() * activeIndices.length)]] = false;
        }
        // Add a new mole
        const emptyIndices = newMoles.map((m, i) => !m ? i : -1).filter(i => i >= 0);
        if (emptyIndices.length > 0) {
          newMoles[emptyIndices[Math.floor(Math.random() * emptyIndices.length)]] = true;
        }
        return newMoles;
      });
    }, 800);
    return () => clearInterval(moleRef.current);
  }, [gameState]);

  const whack = (index) => {
    if (gameState !== 'playing' || !moles[index]) return;
    setMoles(prev => { const n = [...prev]; n[index] = false; return n; });
    setScore(s => s + 1);
    setHitEffect(index);
    setTimeout(() => setHitEffect(null), 150);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Whack-a-Mole</h2>
        <div className="game-controls">
          <span className="game-score">Score: {score}</span>
          <span className="game-score">⏱ {timeLeft}s</span>
          <span className="game-high-score"><Trophy size={14} /> Best: {highScore}</span>
          <button className="game-icon-btn" onClick={() => { clearInterval(timerRef.current); clearInterval(moleRef.current); setGameState('menu'); }}><RotateCcw size={18} /></button>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="game-overlay">
          <h3>Whack-a-Mole</h3>
          <p>Tap the moles as they pop up! You have 30 seconds.</p>
          <button className="game-start-btn" onClick={startGame}>Start Game</button>
        </div>
      )}

      <div className="whack-board">
        {Array(holes).fill(null).map((_, i) => (
          <button
            key={i}
            className={`whack-hole ${moles[i] ? 'has-mole' : ''} ${hitEffect === i ? 'hit' : ''}`}
            onClick={() => whack(i)}
          >
            <div className="whack-mole">🐹</div>
            <div className="whack-grass">🌿</div>
          </button>
        ))}
      </div>

      {(gameState === 'gameover') && (
        <div className="game-overlay">
          <h3>Time's Up!</h3>
          <p>Score: {score} moles whacked</p>
          <button className="game-start-btn" onClick={startGame}><RotateCcw size={16} /> Play Again</button>
        </div>
      )}

      <div className="game-info">
        <p>Tap or click moles to whack them</p>
      </div>
    </div>
  );
}
