import { useState, useMemo } from 'react';
import './KidsActivities.css';

const NUMBERS = Array.from({ length: 20 }, (_, i) => String(i + 1));

export default function AlphabetMatchGrid() {
  const [mode, setMode] = useState('capital');
  const [revealed, setRevealed] = useState(new Set());
  const [wrongLetter, setWrongLetter] = useState(null);
  const [score, setScore] = useState(0);

  const alphabet = useMemo(() => {
    if (mode === 'numbers') return NUMBERS;
    return mode === 'capital' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') : 'abcdefghijklmnopqrstuvwxyz'.split('');
  }, [mode]);

  const total = alphabet.length;

  const nextLetter = useMemo(() => {
    const remaining = alphabet.filter(l => !revealed.has(l));
    if (remaining.length === 0) return null;
    return remaining[Math.floor(Math.random() * remaining.length)];
  }, [revealed, alphabet]);

  const isComplete = revealed.size === total;

  const handleLetterClick = (letter) => {
    if (revealed.has(letter)) return;
    if (letter === nextLetter) {
      setRevealed(new Set([...revealed, letter]));
      setScore(s => s + 1);
    } else {
      setWrongLetter(letter);
      setTimeout(() => setWrongLetter(null), 400);
    }
  };

  const handleReset = () => {
    setRevealed(new Set());
    setScore(0);
    setWrongLetter(null);
  };

  const toggleMode = (m) => {
    if (m === mode) return;
    setMode(m);
    handleReset();
  };

  const modeLabel = mode === 'capital' ? 'capital' : mode === 'small' ? 'small' : 'number';

  if (isComplete) {
    return (
      <div className="activity-page">
        <div className="celebration">
          <h2>🎉 Amazing!</h2>
          <p style={{ fontSize: 48, margin: '12px 0' }}>🏆</p>
          <p>You revealed all {total} {modeLabel}s!</p>
          <p>Score: <strong>{score}</strong>/{total}</p>
          <button className="back-btn" style={{ marginTop: 20 }} onClick={handleReset}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-page">
      <div className="activity-header">
        <h2>🔤 Alphabet & Number Match</h2>
        <div className="activity-score">Score: {score}/{total}  Revealed: {revealed.size}/{total}</div>
      </div>
      <p className="activity-description">Find and tap the matching {modeLabel} in the grid</p>

      <div className="toggle-bar">
        <button className={`toggle-btn ${mode === 'capital' ? 'active' : ''}`} onClick={() => toggleMode('capital')}>🔠 Capital</button>
        <button className={`toggle-btn ${mode === 'small' ? 'active' : ''}`} onClick={() => toggleMode('small')}>🔡 Small</button>
        <button className={`toggle-btn ${mode === 'numbers' ? 'active' : ''}`} onClick={() => toggleMode('numbers')} style={{ flex: '0 0 auto' }}>🔢 1-20</button>
      </div>

      <div className={`alphabet-grid ${mode === 'numbers' ? 'numbers-grid' : ''}`}>
        {alphabet.map(letter => {
          const isRevealed = revealed.has(letter);
          const isWrong = wrongLetter === letter;
          return (
            <button
              key={letter}
              className={`alphabet-cell ${isRevealed ? 'revealed' : ''} ${isWrong ? 'wrong' : ''}`}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <div className="letter-to-find">
        <span className="letter-to-find-label">Find this {modeLabel}:</span>
        <span className="letter-to-find-letter">{nextLetter}</span>
      </div>
    </div>
  );
}
