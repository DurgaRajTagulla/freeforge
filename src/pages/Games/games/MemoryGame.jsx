import { useState, useRef, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import './Games.css';

const EMOJIS = ['🐶','🐱','🐼','🐸','🦊','🐰','🐯','🦁','🐮','🐷','🐵','🦄'];

function getHighScore() {
  try { return parseInt(localStorage.getItem('freeforge_memory_high') || '99', 10); } catch { return 99; }
}
function setHighScore(score) {
  const high = getHighScore();
  if (score < high) localStorage.setItem('freeforge_memory_high', String(score));
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [highScore, setHigh] = useState(getHighScore);
  const [gameState, setGameState] = useState('menu');
  const [size, setSize] = useState(16);
  const lockRef = useRef(false);

  const initGame = useCallback((s) => {
    const n = s / 2;
    const emojis = shuffle([...EMOJIS]).slice(0, n);
    const cardList = shuffle([...emojis, ...emojis]).map((e, i) => ({ id: i, emoji: e }));
    setCards(cardList);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameState('playing');
    lockRef.current = false;
  }, []);

  const flipCard = (id) => {
    if (lockRef.current || flipped.includes(id) || matched.includes(id) || gameState !== 'playing') return;
    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }
    if (flipped.length === 1) {
      const first = cards.find(c => c.id === flipped[0]);
      const second = cards.find(c => c.id === id);
      setFlipped([flipped[0], id]);
      setMoves(m => m + 1);
      if (first.emoji === second.emoji) {
        setMatched(m => [...m, flipped[0], id]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setHighScore(moves + 1);
          setHigh(getHighScore());
          setGameState('won');
        }
      } else {
        lockRef.current = true;
        setTimeout(() => { setFlipped([]); lockRef.current = false; }, 800);
      }
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Memory Cards</h2>
        <div className="game-controls">
          <span className="game-score">Moves: {moves}</span>
          <span className="game-high-score"><Trophy size={14} /> Best: {highScore}</span>
          <button className="game-icon-btn" onClick={() => setGameState('menu')}><RotateCcw size={18} /></button>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="game-overlay">
          <h3>Memory Cards</h3>
          <p>Flip cards and find matching pairs</p>
          <div className="level-select">
            <button className={`level-btn ${size === 12 ? 'active' : ''}`} onClick={() => setSize(12)}>Easy (12)</button>
            <button className={`level-btn ${size === 16 ? 'active' : ''}`} onClick={() => setSize(16)}>Medium (16)</button>
            <button className={`level-btn ${size === 24 ? 'active' : ''}`} onClick={() => setSize(24)}>Hard (24)</button>
          </div>
          <button className="game-start-btn" onClick={() => initGame(size)}>Start Game</button>
        </div>
      )}

      <div className={`memory-board memory-${size}`}>
        {cards.map(card => (
          <button
            key={card.id}
            className={`memory-card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}
            onClick={() => flipCard(card.id)}
          >
            <div className="memory-front">?</div>
            <div className="memory-back">{card.emoji}</div>
          </button>
        ))}
      </div>

      {gameState === 'won' && (
        <div className="game-overlay">
          <h3>All Matched!</h3>
          <p>Moves: {moves} · Best: {highScore}</p>
          <button className="game-start-btn" onClick={() => initGame(size)}><RotateCcw size={16} /> Play Again</button>
        </div>
      )}

      <div className="game-info">
        <p>Click cards to flip and find matching pairs</p>
      </div>
    </div>
  );
}
