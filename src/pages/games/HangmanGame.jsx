import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Lightbulb, Trophy } from 'lucide-react';
import './Games.css';

const WORDS = {
  Animals: ['elephant', 'giraffe', 'penguin', 'dolphin', 'cheetah', 'kangaroo', 'octopus', 'butterfly', 'crocodile', 'flamingo'],
  Countries: ['australia', 'brazil', 'canada', 'germany', 'japan', 'mexico', 'norway', 'sweden', 'thailand', 'argentina'],
  Fruits: ['avocado', 'blueberry', 'dragonfruit', 'grapefruit', 'kiwi', 'mango', 'pineapple', 'strawberry', 'watermelon', 'raspberry'],
  Sports: ['basketball', 'cricket', 'football', 'golf', 'hockey', 'swimming', 'tennis', 'volleyball', 'baseball', 'soccer'],
};

const MAX_WRONG = 6;

function getHighScore() {
  try { return parseInt(localStorage.getItem('freeforge_hangman_high') || '0', 10); } catch { return 0; }
}
function setHighScore(score) {
  const high = getHighScore();
  if (score > high) localStorage.setItem('freeforge_hangman_high', String(score));
}

function drawHangman(wrong) {
  const parts = [
    '  O',      // head
    '  |',      // body
    ' /|',     // left arm
    ' \\|',    // right arm
    ' /',      // left leg
    ' \\',    // right leg
  ];
  return parts.slice(0, wrong).join('\n');
}

export default function HangmanGame() {
  const [category, setCategory] = useState('Animals');
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHigh] = useState(getHighScore);
  const [gameState, setGameState] = useState('menu');
  const [hintUsed, setHintUsed] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);

  const startGame = useCallback(() => {
    const words = WORDS[category];
    const w = words[Math.floor(Math.random() * words.length)];
    setWord(w);
    setGuessed([]);
    setWrong(0);
    setHintUsed(false);
    setGameState('playing');
  }, [category]);

  const guessLetter = (letter) => {
    if (gameState !== 'playing' || guessed.includes(letter)) return;
    const newGuessed = [...guessed, letter];
    setGuessed(newGuessed);
    if (!word.includes(letter)) {
      const newWrong = wrong + 1;
      setWrong(newWrong);
      if (newWrong >= MAX_WRONG) {
        setGameState('lost');
        setHighScore(score);
        setHigh(getHighScore());
      }
    } else {
      // Check win
      const won = word.split('').every(l => newGuessed.includes(l));
      if (won) {
        const points = MAX_WRONG - wrong + (hintUsed ? 0 : 5);
        setScore(s => s + points);
        setGameState('won');
        setHighScore(score + points);
        setHigh(getHighScore());
      }
    }
  };

  const useHint = () => {
    if (hintsLeft <= 0 || gameState !== 'playing') return;
    const unguessed = word.split('').filter(l => !guessed.includes(l));
    if (unguessed.length === 0) return;
    const hint = unguessed[Math.floor(Math.random() * unguessed.length)];
    setGuessed(prev => [...prev, hint]);
    setHintsLeft(h => h - 1);
    setHintUsed(true);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (gameState !== 'playing') return;
      const letter = e.key.toLowerCase();
      if (/^[a-z]$/.test(letter)) guessLetter(letter);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const displayWord = word.split('').map(l => guessed.includes(l) ? l : '_').join(' ');

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Hangman</h2>
        <div className="game-controls">
          <span className="game-score">Score: {score}</span>
          <span className="game-high-score"><Trophy size={14} /> Best: {highScore}</span>
          <button className="game-icon-btn" onClick={() => setGameState('menu')}><RotateCcw size={18} /></button>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="game-overlay">
          <h3>Hangman</h3>
          <p>Guess the word before the man is hanged!</p>
          <div className="level-select">
            {Object.keys(WORDS).map(c => (
              <button key={c} className={`level-btn ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <button className="game-start-btn" onClick={startGame}>Start Game</button>
        </div>
      )}

      {gameState !== 'menu' && (
        <>
          <div className="hangman-display">
            <pre className="hangman-drawing">{drawHangman(wrong)}</pre>
            <div className="hangman-status">
              <span className="hangman-wrong">Wrong: {wrong}/{MAX_WRONG}</span>
              <span className="hangman-hints"><Lightbulb size={14} /> Hints: {hintsLeft}</span>
            </div>
          </div>

          <div className="hangman-word">{displayWord}</div>

          <div className="hangman-keyboard">
            {"abcdefghijklmnopqrstuvwxyz".split('').map(letter => (
              <button
                key={letter}
                className={`kbd-btn ${guessed.includes(letter) ? (word.includes(letter) ? 'correct' : 'wrong') : ''}`}
                onClick={() => guessLetter(letter)}
                disabled={guessed.includes(letter)}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="hangman-actions">
            <button className="hint-btn" onClick={useHint} disabled={hintsLeft <= 0 || gameState !== 'playing'}>
              <Lightbulb size={16} /> Use Hint
            </button>
          </div>
        </>
      )}

      {(gameState === 'won' || gameState === 'lost') && (
        <div className="game-overlay">
          <h3>{gameState === 'won' ? 'You Won!' : 'Game Over!'}</h3>
          <p>Word: <strong>{word}</strong></p>
          <button className="game-start-btn" onClick={startGame}><RotateCcw size={16} /> Play Again</button>
        </div>
      )}

      <div className="game-info">
        <p>Type or click letters to guess</p>
      </div>
    </div>
  );
}
