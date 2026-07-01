import { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Undo2, Trophy } from 'lucide-react';
import './Games.css';

function getHighScore() {
  try { return parseInt(localStorage.getItem('freeforge_2048_high') || '0', 10); } catch { return 0; }
}
function setHighScore(score) {
  const high = getHighScore();
  if (score > high) localStorage.setItem('freeforge_2048_high', String(score));
}

function emptyGrid() { return Array(4).fill(null).map(() => Array(4).fill(0)); }

function addRandom(grid) {
  const empty = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (grid[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const g = grid.map(row => [...row]);
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
  return g;
}

function slide(row) {
  let a = row.filter(v => v !== 0);
  let score = 0;
  for (let i = 0; i < a.length - 1; i++) {
    if (a[i] === a[i + 1]) { a[i] *= 2; score += a[i]; a.splice(i + 1, 1); }
  }
  while (a.length < 4) a.push(0);
  return { row: a, score };
}

function move(grid, dir) {
  let g = grid.map(r => [...r]);
  let totalScore = 0;
  let moved = false;

  const processRow = (row) => {
    const { row: newRow, score } = slide(row);
    totalScore += score;
    return newRow;
  };

  if (dir === 'left') {
    for (let r = 0; r < 4; r++) { const n = processRow(g[r]); if (n.join(',') !== g[r].join(',')) moved = true; g[r] = n; }
  } else if (dir === 'right') {
    for (let r = 0; r < 4; r++) { const n = processRow([...g[r]].reverse()).reverse(); if (n.join(',') !== g[r].join(',')) moved = true; g[r] = n; }
  } else if (dir === 'up') {
    for (let c = 0; c < 4; c++) { const col = [g[0][c], g[1][c], g[2][c], g[3][c]]; const n = processRow(col); if (n.join(',') !== col.join(',')) moved = true; for (let r = 0; r < 4; r++) g[r][c] = n[r]; }
  } else if (dir === 'down') {
    for (let c = 0; c < 4; c++) { const col = [g[3][c], g[2][c], g[1][c], g[0][c]]; const n = processRow(col).reverse(); const orig = [g[0][c], g[1][c], g[2][c], g[3][c]]; if (n.join(',') !== orig.join(',')) moved = true; for (let r = 0; r < 4; r++) g[r][c] = n[r]; }
  }

  return { grid: g, score: totalScore, moved };
}

function canMove(grid) {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (grid[r][c] === 0) return true;
    if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
    if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
  }
  return false;
}

const COLORS = {
  0: 'transparent', 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
  32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
  512: '#edc850', 1024: '#edc53f', 2048: '#edc22e',
};
const TEXT_COLORS = { 0: 'transparent', 2: '#776e65', 4: '#776e65', 128: '#f9f6f2', 256: '#f9f6f2', 512: '#f9f6f2', 1024: '#f9f6f2', 2048: '#f9f6f2' };

export default function Game2048() {
  const [grid, setGrid] = useState(() => addRandom(addRandom(emptyGrid())));
  const [score, setScore] = useState(0);
  const [highScore, setHigh] = useState(getHighScore);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [history, setHistory] = useState([]);
  const touchStart = useRef(null);

  const handleMove = useCallback((dir) => {
    if (gameOver) return;
    const { grid: newGrid, score: s, moved } = move(grid, dir);
    if (!moved) return;
    setHistory(h => [...h, { grid, score }]);
    const withRandom = addRandom(newGrid);
    setGrid(withRandom);
    setScore(prev => {
      const next = prev + s;
      setHighScore(next);
      setHigh(getHighScore());
      return next;
    });
    if (!canMove(withRandom)) setGameOver(true);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      if (withRandom[r][c] === 2048 && !won) setWon(true);
    }
  }, [grid, gameOver, won, score]);

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setGrid(prev.grid);
    setScore(prev.score);
    setHistory(h => h.slice(0, -1));
    setGameOver(false);
  };

  const restart = () => {
    setGrid(addRandom(addRandom(emptyGrid())));
    setScore(0);
    setGameOver(false);
    setWon(false);
    setHistory([]);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowUp' || e.key === 'w') handleMove('up');
      if (e.key === 'ArrowDown' || e.key === 's') handleMove('down');
      if (e.key === 'ArrowLeft' || e.key === 'a') handleMove('left');
      if (e.key === 'ArrowRight' || e.key === 'd') handleMove('right');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleMove]);

  const handleTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
    if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? 'right' : 'left');
    else handleMove(dy > 0 ? 'down' : 'up');
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">2048</h2>
        <div className="game-controls">
          <span className="game-score">Score: {score}</span>
          <span className="game-high-score"><Trophy size={14} /> Best: {highScore}</span>
          <button className="game-icon-btn" onClick={undo} disabled={history.length === 0}><Undo2 size={18} /></button>
          <button className="game-icon-btn" onClick={restart}><RotateCcw size={18} /></button>
        </div>
      </div>

      <div className="grid-2048" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {grid.map((row, r) => row.map((val, c) => (
          <div key={`${r}-${c}`} className={`tile-2048 tile-${val}`} style={{ background: COLORS[val] || '#3c3a32', color: TEXT_COLORS[val] || '#f9f6f2' }}>
            {val !== 0 && val}
          </div>
        )))}
        {(gameOver || won) && (
          <div className="game-overlay-2048">
            <h3>{won ? 'You Win!' : 'Game Over!'}</h3>
            <p>Score: {score}</p>
            <button className="game-start-btn" onClick={restart}><RotateCcw size={16} /> Play Again</button>
          </div>
        )}
      </div>

      <div className="game-info">
        <p>Arrow keys / WASD to move • Swipe on mobile</p>
      </div>
    </div>
  );
}
