import { useState, useMemo } from 'react';
import './KidsActivities.css';

const BASIC_SHAPES = [
  { id: 'circle', name: 'Circle', emoji: '🔴' },
  { id: 'square', name: 'Square', emoji: '🟧' },
  { id: 'triangle', name: 'Triangle', emoji: '🟨' },
  { id: 'star', name: 'Star', emoji: '⭐' },
  { id: 'heart', name: 'Heart', emoji: '❤️' },
  { id: 'diamond', name: 'Diamond', emoji: '💠' },
  { id: 'pentagon', name: 'Pentagon', emoji: '⬠' },
  { id: 'hexagon', name: 'Hexagon', emoji: '⬡' },
  { id: 'octagon', name: 'Octagon', emoji: '🛑' },
  { id: 'oval', name: 'Oval', emoji: '🔵' },
  { id: 'arrow', name: 'Arrow', emoji: '➡️' },
  { id: 'cross', name: 'Cross', emoji: '➕' },
  { id: 'crescent', name: 'Crescent', emoji: '🌙' },
  { id: 'rectangle', name: 'Rectangle', emoji: '▬' },
  { id: 'parallelogram', name: 'Parallelogram', emoji: '▱' },
  { id: 'trapezoid', name: 'Trapezoid', emoji: '⏢' },
  { id: 'rhombus', name: 'Rhombus', emoji: '◆' },
  { id: 'ellipse', name: 'Ellipse', emoji: '🔘' },
  { id: 'ring', name: 'Ring', emoji: '⭕' },
  { id: 'spiral', name: 'Spiral', emoji: '🌀' },
];

const NATURE_SHAPES = [
  { id: 'wave', name: 'Wave', emoji: '🌊' },
  { id: 'lightning', name: 'Lightning', emoji: '⚡' },
  { id: 'sun', name: 'Sun', emoji: '☀️' },
  { id: 'moon', name: 'Moon', emoji: '🌙' },
  { id: 'cloud', name: 'Cloud', emoji: '☁️' },
  { id: 'raindrop', name: 'Raindrop', emoji: '💧' },
  { id: 'flame', name: 'Flame', emoji: '🔥' },
  { id: 'leaf', name: 'Leaf', emoji: '🍃' },
  { id: 'flower', name: 'Flower', emoji: '🌸' },
  { id: 'mountain', name: 'Mountain', emoji: '🏔️' },
  { id: 'tree', name: 'Tree', emoji: '🌳' },
  { id: 'rock', name: 'Rock', emoji: '🪨' },
  { id: 'drop', name: 'Drop', emoji: '🫧' },
  { id: 'wind', name: 'Wind', emoji: '💨' },
  { id: 'snowflake', name: 'Snowflake', emoji: '❄️' },
  { id: 'rainbow', name: 'Rainbow', emoji: '🌈' },
  { id: 'comet', name: 'Comet', emoji: '☄️' },
  { id: 'volcano', name: 'Volcano', emoji: '🌋' },
  { id: 'tornado', name: 'Tornado', emoji: '🌪️' },
  { id: 'cactus', name: 'Cactus', emoji: '🌵' },
];

export default function ShapeMatchingGrid() {
  const [mode, setMode] = useState('basic');
  const [revealed, setRevealed] = useState(new Set());
  const [wrongId, setWrongId] = useState(null);
  const [score, setScore] = useState(0);

  const shapes = useMemo(() => (mode === 'basic' ? BASIC_SHAPES : NATURE_SHAPES), [mode]);

  const nextShape = useMemo(() => {
    const remaining = shapes.filter(s => !revealed.has(s.id));
    if (remaining.length === 0) return null;
    return remaining[Math.floor(Math.random() * remaining.length)];
  }, [revealed, shapes]);

  const isComplete = revealed.size === shapes.length;

  const handleShapeClick = (shape) => {
    if (revealed.has(shape.id)) return;
    if (shape.id === nextShape.id) {
      setRevealed(new Set([...revealed, shape.id]));
      setScore(s => s + 1);
    } else {
      setWrongId(shape.id);
      setTimeout(() => setWrongId(null), 400);
    }
  };

  const toggleMode = (m) => {
    if (m === mode) return;
    setMode(m);
    setRevealed(new Set());
    setScore(0);
    setWrongId(null);
  };

  if (isComplete) {
    return (
      <div className="activity-page">
        <div className="celebration">
          <h2>🎉 Amazing!</h2>
          <p style={{ fontSize: 48, margin: '12px 0' }}>🏆</p>
          <p>You matched all {shapes.length} shapes!</p>
          <p>Score: <strong>{score}</strong>/{shapes.length}</p>
          <button className="back-btn" style={{ marginTop: 20 }} onClick={() => { setRevealed(new Set()); setScore(0); }}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-page">
      <div className="activity-header">
        <h2>🔺 Shape Matching</h2>
        <div className="activity-score">Score: {score}/{shapes.length}  Revealed: {revealed.size}/{shapes.length}</div>
      </div>
      <p className="activity-description">Find and tap the matching shape in the grid</p>

      <div className="toggle-bar">
        <button className={`toggle-btn ${mode === 'basic' ? 'active' : ''}`} onClick={() => toggleMode('basic')}>🔷 Basic Shapes</button>
        <button className={`toggle-btn ${mode === 'nature' ? 'active' : ''}`} onClick={() => toggleMode('nature')}>🌿 Nature Shapes</button>
      </div>

      <div className="shape-grid">
        {shapes.map(shape => {
          const isRevealed = revealed.has(shape.id);
          const isWrong = wrongId === shape.id;
          return (
            <button
              key={shape.id}
              className={`shape-cell ${isRevealed ? 'revealed' : ''} ${isWrong ? 'wrong' : ''}`}
              onClick={() => handleShapeClick(shape)}
            >
              {shape.emoji}
            </button>
          );
        })}
      </div>

      <div className="letter-to-find-box">
        <span className="letter-to-find-label">Find this shape:</span>
        <span className="letter-to-find-emoji">{nextShape?.emoji}</span>
        <span className="letter-to-find-name">{nextShape?.name}</span>
      </div>
    </div>
  );
}
