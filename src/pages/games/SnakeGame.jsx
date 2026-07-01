import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import './Games.css';

const GRID = 20;
const CELL = 20;
const W = GRID * CELL;
const H = GRID * CELL;

const LEVELS = [
  { name: 'Easy', speed: 150, obstacles: 0 },
  { name: 'Medium', speed: 110, obstacles: 5 },
  { name: 'Hard', speed: 75, obstacles: 10 },
];

function getHighScore() {
  try { return JSON.parse(localStorage.getItem('freeforge_snake_high') || '{}'); } catch { return {}; }
}
function setHighScore(level, score) {
  const high = getHighScore();
  if (!high[level] || score > high[level]) {
    high[level] = score;
    localStorage.setItem('freeforge_snake_high', JSON.stringify(high));
  }
}

function spawnFood(snake, obstacles) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (
    snake.some(s => s.x === pos.x && s.y === pos.y) ||
    obstacles.some(o => o.x === pos.x && o.y === pos.y)
  );
  return pos;
}

function spawnObstacles(count, snake) {
  const obs = [];
  while (obs.length < count) {
    const pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    if (!snake.some(s => s.x === pos.x && s.y === pos.y) && !obs.some(o => o.x === pos.x && o.y === pos.y)) {
      obs.push(pos);
    }
  }
  return obs;
}

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameover
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState(getHighScore);
  const dirRef = useRef({ x: 1, y: 0 });
  const nextDirRef = useRef({ x: 1, y: 0 });
  const snakeRef = useRef([{ x: 5, y: 10 }]);
  const foodRef = useRef({ x: 15, y: 10 });
  const obstaclesRef = useRef([]);
  const loopRef = useRef(null);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL); ctx.stroke();
    }

    // Obstacles
    ctx.fillStyle = '#64748b';
    obstaclesRef.current.forEach(o => {
      ctx.fillRect(o.x * CELL + 1, o.y * CELL + 1, CELL - 2, CELL - 2);
    });

    // Food with glow
    const fx = foodRef.current.x * CELL + CELL / 2;
    const fy = foodRef.current.y * CELL + CELL / 2;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(fx, fy, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    const snake = snakeRef.current;
    if (snake.length === 0) return;

    const dir = dirRef.current;

    // Draw body segments as connected rounded rects with overlap
    for (let i = snake.length - 1; i >= 0; i--) {
      const s = snake[i];
      const t = i / Math.max(snake.length - 1, 1);
      const green = Math.round(160 + t * 30);
      const red = Math.round(10 + t * 20);
      const blue = Math.round(40 + t * 20);
      const bodyW = i === 0 ? CELL - 2 : CELL - 4 + (1 - t) * 2;
      const bodyH = i === 0 ? CELL - 2 : CELL - 4 + (1 - t) * 2;
      const offset = (CELL - bodyW) / 2;

      ctx.fillStyle = i === 0 ? '#22c55e' : `rgb(${red},${green},${blue})`;
      if (i === 0) {
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
      }
      ctx.beginPath();
      ctx.roundRect(s.x * CELL + offset, s.y * CELL + offset, bodyW, bodyH, 6);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Connect segments with body-colored bridges
    for (let i = 0; i < snake.length - 1; i++) {
      const curr = snake[i];
      const next = snake[i + 1];
      const t = i / Math.max(snake.length - 1, 1);
      const green = Math.round(160 + t * 30);
      const red = Math.round(10 + t * 20);
      const blue = Math.round(40 + t * 20);
      ctx.fillStyle = `rgb(${red},${green},${blue})`;

      const dx = curr.x - next.x;
      const dy = curr.y - next.y;
      const bridgeW = CELL - 4;
      const bridgeH = CELL - 4;

      if (dx !== 0) {
        const bx = Math.min(curr.x, next.x) * CELL + CELL / 2;
        ctx.fillRect(bx, curr.y * CELL + 2, CELL, bridgeH);
      } else if (dy !== 0) {
        const by = Math.min(curr.y, next.y) * CELL + CELL / 2;
        ctx.fillRect(curr.x * CELL + 2, by, bridgeW, CELL);
      }
    }

    // Head details
    const head = snake[0];
    const hx = head.x * CELL + CELL / 2;
    const hy = head.y * CELL + CELL / 2;

    // Eyes
    const eyeOff = 4;
    let eye1, eye2;
    if (dir.x === 1) { eye1 = { x: hx + 3, y: hy - eyeOff }; eye2 = { x: hx + 3, y: hy + eyeOff }; }
    else if (dir.x === -1) { eye1 = { x: hx - 3, y: hy - eyeOff }; eye2 = { x: hx - 3, y: hy + eyeOff }; }
    else if (dir.y === -1) { eye1 = { x: hx - eyeOff, y: hy - 3 }; eye2 = { x: hx + eyeOff, y: hy - 3 }; }
    else { eye1 = { x: hx - eyeOff, y: hy + 3 }; eye2 = { x: hx + eyeOff, y: hy + 3 }; }

    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(eye1.x, eye1.y, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(eye2.x, eye2.y, 3, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(eye1.x + dir.x, eye1.y + dir.y, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(eye2.x + dir.x, eye2.y + dir.y, 1.5, 0, Math.PI * 2); ctx.fill();

    // Tongue
    const tongueLen = 8;
    const tx = hx + dir.x * (CELL / 2 + 1);
    const ty = hy + dir.y * (CELL / 2 + 1);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';

    const tAngle = Math.atan2(dir.y, dir.x);
    const forkLen = 4;
    const forkAngle = 0.4;

    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + Math.cos(tAngle) * tongueLen, ty + Math.sin(tAngle) * tongueLen);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tx + Math.cos(tAngle) * tongueLen, ty + Math.sin(tAngle) * tongueLen);
    ctx.lineTo(
      tx + Math.cos(tAngle) * tongueLen + Math.cos(tAngle + forkAngle) * forkLen,
      ty + Math.sin(tAngle) * tongueLen + Math.sin(tAngle + forkAngle) * forkLen
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tx + Math.cos(tAngle) * tongueLen, ty + Math.sin(tAngle) * tongueLen);
    ctx.lineTo(
      tx + Math.cos(tAngle) * tongueLen + Math.cos(tAngle - forkAngle) * forkLen,
      ty + Math.sin(tAngle) * tongueLen + Math.sin(tAngle - forkAngle) * forkLen
    );
    ctx.stroke();
  }, []);

  const tick = useCallback(() => {
    dirRef.current = nextDirRef.current;
    const snake = [...snakeRef.current];
    const head = { x: snake[0].x + dirRef.current.x, y: snake[0].y + dirRef.current.y };

    // Wall wrap
    if (head.x < 0) head.x = GRID - 1;
    if (head.x >= GRID) head.x = 0;
    if (head.y < 0) head.y = GRID - 1;
    if (head.y >= GRID) head.y = 0;

    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) return 'die';
    // Obstacle collision
    if (obstaclesRef.current.some(o => o.x === head.x && o.y === head.y)) return 'die';

    snake.unshift(head);

    // Eat food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(prev => prev + 10);
      foodRef.current = spawnFood(snake, obstaclesRef.current);
    } else {
      snake.pop();
    }

    snakeRef.current = snake;
    draw();
    return 'ok';
  }, [draw]);

  const startGame = useCallback(() => {
    const lvl = LEVELS[level];
    const initSnake = [{ x: 5, y: 10 }];
    snakeRef.current = initSnake;
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    obstaclesRef.current = spawnObstacles(lvl.obstacles, initSnake);
    foodRef.current = spawnFood(initSnake, obstaclesRef.current);
    setScore(0);
    setGameState('playing');
    draw();
  }, [level, draw]);

  useEffect(() => {
    if (gameState !== 'playing') { clearInterval(loopRef.current); return; }
    loopRef.current = setInterval(() => {
      const result = tick();
      if (result === 'die') {
        setHighScore(level, score);
        setHighScores(getHighScore());
        setGameState('gameover');
      }
    }, LEVELS[level].speed);
    return () => clearInterval(loopRef.current);
  }, [gameState, tick, level, score]);

  useEffect(() => {
    const handleKey = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      if (gameState === 'menu') { if (e.key === 'Enter' || e.key === ' ') startGame(); return; }
      if (gameState === 'gameover') { if (e.key === 'Enter' || e.key === ' ') startGame(); return; }
      if (e.key === 'Escape' || e.key === 'p') { setGameState(g => g === 'paused' ? 'playing' : 'paused'); return; }
      const d = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w') && d.y !== 1) nextDirRef.current = { x: 0, y: -1 };
      if ((e.key === 'ArrowDown' || e.key === 's') && d.y !== -1) nextDirRef.current = { x: 0, y: 1 };
      if ((e.key === 'ArrowLeft' || e.key === 'a') && d.x !== 1) nextDirRef.current = { x: -1, y: 0 };
      if ((e.key === 'ArrowRight' || e.key === 'd') && d.x !== -1) nextDirRef.current = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, startGame]);

  // Touch controls
  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    const d = dirRef.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && d.x !== -1) nextDirRef.current = { x: 1, y: 0 };
      else if (dx < 0 && d.x !== 1) nextDirRef.current = { x: -1, y: 0 };
    } else {
      if (dy > 0 && d.y !== -1) nextDirRef.current = { x: 0, y: 1 };
      else if (dy < 0 && d.y !== 1) nextDirRef.current = { x: 0, y: -1 };
    }
  };

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Snake Game</h2>
        <div className="game-controls">
          <span className="game-score">Score: {score}</span>
          <span className="game-high-score"><Trophy size={14} /> Best: {highScores[level] || 0}</span>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="game-overlay">
          <h3>Snake Game</h3>
          <p>Use arrow keys or swipe to move</p>
          <div className="level-select">
            {LEVELS.map((l, i) => (
              <button key={i} className={`level-btn ${level === i ? 'active' : ''}`} onClick={() => setLevel(i)}>{l.name}</button>
            ))}
          </div>
          <button className="game-start-btn" onClick={startGame}>Start Game</button>
        </div>
      )}

      <div className="canvas-wrapper" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <canvas ref={canvasRef} width={W} height={H} className="game-canvas" />
        {gameState === 'paused' && <div className="game-overlay"><h3>Paused</h3><p>Press ESC or P to resume</p></div>}
        {gameState === 'gameover' && (
          <div className="game-overlay">
            <h3>Game Over</h3>
            <p>Score: {score}</p>
            <div className="game-over-btns">
              <button className="game-start-btn" onClick={startGame}><RotateCcw size={16} /> Play Again</button>
              <button className="game-menu-btn" onClick={() => setGameState('menu')}>Menu</button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      <div className="mobile-dpad">
        <button className="dpad-btn dpad-up" onClick={() => { if (dirRef.current.y !== 1) nextDirRef.current = { x: 0, y: -1 }; }}>▲</button>
        <div className="dpad-row">
          <button className="dpad-btn dpad-left" onClick={() => { if (dirRef.current.x !== 1) nextDirRef.current = { x: -1, y: 0 }; }}>◀</button>
          <button className="dpad-btn dpad-right" onClick={() => { if (dirRef.current.x !== -1) nextDirRef.current = { x: 1, y: 0 }; }}>▶</button>
        </div>
        <button className="dpad-btn dpad-down" onClick={() => { if (dirRef.current.y !== -1) nextDirRef.current = { x: 0, y: 1 }; }}>▼</button>
      </div>

      <div className="game-info">
        <p>Arrow keys / WASD to move • ESC to pause</p>
      </div>
    </div>
  );
}
