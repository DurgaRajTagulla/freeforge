import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Play, Trophy } from 'lucide-react';
import './Games.css';

const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#facc15'];

function getHighScore() {
  try { return parseInt(localStorage.getItem('freeforge_simon_high') || '0', 10); } catch { return 0; }
}
function setHighScore(score) {
  const high = getHighScore();
  if (score > high) localStorage.setItem('freeforge_simon_high', String(score));
}

export default function SimonGame() {
  const [sequence, setSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [activeColor, setActiveColor] = useState(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHigh] = useState(getHighScore);
  const [strict, setStrict] = useState(false);
  const timeoutRef = useRef(null);

  const playSequence = useCallback((seq) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(interval);
        setActiveColor(null);
        return;
      }
      setActiveColor(seq[i]);
      timeoutRef.current = setTimeout(() => setActiveColor(null), 400);
      i++;
    }, 600);
  }, []);

  const addToSequence = useCallback(() => {
    const next = Math.floor(Math.random() * 4);
    const newSeq = [...sequence, next];
    setSequence(newSeq);
    setPlayerInput([]);
    setTimeout(() => playSequence(newSeq), 500);
  }, [sequence, playSequence]);

  const startGame = useCallback(() => {
    setSequence([]);
    setPlayerInput([]);
    setScore(0);
    setGameState('playing');
    const first = Math.floor(Math.random() * 4);
    const newSeq = [first];
    setSequence(newSeq);
    setTimeout(() => playSequence(newSeq), 500);
  }, [playSequence]);

  const handleColorClick = (index) => {
    if (gameState !== 'playing' || activeColor !== null) return;

    setActiveColor(index);
    setTimeout(() => setActiveColor(null), 200);

    const newInput = [...playerInput, index];
    setPlayerInput(newInput);

    // Check input
    const currentStep = newInput.length - 1;
    if (newInput[currentStep] !== sequence[currentStep]) {
      if (strict) {
        setGameState('gameover');
        setHighScore(score);
        setHigh(getHighScore());
      } else {
        // Replay sequence
        setPlayerInput([]);
        setTimeout(() => playSequence(sequence), 800);
      }
      return;
    }

    // Correct - check if complete
    if (newInput.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= 20) {
        setGameState('won');
        setHighScore(newScore);
        setHigh(getHighScore());
      } else {
        addToSequence();
      }
    }
  };

  useEffect(() => {
    return () => { clearTimeout(timeoutRef.current); };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (gameState === 'menu') { if (e.key === 'Enter' || e.key === ' ') startGame(); return; }
      if (e.key === '1') handleColorClick(0);
      if (e.key === '2') handleColorClick(1);
      if (e.key === '3') handleColorClick(2);
      if (e.key === '4') handleColorClick(3);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Simon Says</h2>
        <div className="game-controls">
          <span className="game-score">Score: {score}/20</span>
          <span className="game-high-score"><Trophy size={14} /> Best: {highScore}</span>
          <button className="game-icon-btn" onClick={() => setGameState('menu')}><RotateCcw size={18} /></button>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="game-overlay">
          <h3>Simon Says</h3>
          <p>Repeat the color sequence! Watch carefully.</p>
          <div className="level-select">
            <button className={`level-btn ${!strict ? 'active' : ''}`} onClick={() => setStrict(false)}>Normal</button>
            <button className={`level-btn ${strict ? 'active' : ''}`} onClick={() => setStrict(true)}>Strict</button>
          </div>
          <button className="game-start-btn" onClick={startGame}><Play size={16} /> Start Game</button>
        </div>
      )}

      <div className="simon-board">
        {COLORS.map((color, i) => (
          <button
            key={i}
            className={`simon-btn simon-${i} ${activeColor === i ? 'active' : ''}`}
            style={{ background: color }}
            onClick={() => handleColorClick(i)}
            disabled={gameState !== 'playing' || activeColor !== null}
          />
        ))}
        <div className="simon-center">
          {gameState === 'playing' ? (
            <span className="simon-round">Round {sequence.length}</span>
          ) : gameState === 'won' ? (
            <Trophy size={24} color="#facc15" />
          ) : (
            <Play size={24} color="#94a3b8" />
          )}
        </div>
      </div>

      {(gameState === 'won' || gameState === 'gameover') && (
        <div className="game-overlay">
          <h3>{gameState === 'won' ? 'You Win!' : 'Game Over!'}</h3>
          <p>Score: {score}</p>
          <button className="game-start-btn" onClick={startGame}><RotateCcw size={16} /> Play Again</button>
        </div>
      )}

      <div className="game-info">
        <p>Click colors or press 1-2-3-4 keys</p>
      </div>
    </div>
  );
}
