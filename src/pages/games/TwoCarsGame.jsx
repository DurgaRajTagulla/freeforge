import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import './Games.css';

const W = 300, H = 500;
const CAR_W = 40, CAR_H = 60, CAR_Y = 420;
const OBSTACLE_W = 36, OBSTACLE_H = 36;

function getHighScore() {
  try { return parseInt(localStorage.getItem('freeforge_twocars_high') || '0', 10); } catch { return 0; }
}
function saveHighScore(score) {
  const cur = getHighScore();
  if (score > cur) localStorage.setItem('freeforge_twocars_high', String(score));
}

export default function TwoCarsGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getHighScore);
  const stateRef = useRef('menu');
  const leftLane = useRef(true);
  const rightLane = useRef(true);
  const obstacles = useRef([]);
  const scoreVal = useRef(0);
  const speed = useRef(3);
  const spawnTimer = useRef(0);
  const roadOff = useRef(0);
  const animRef = useRef(null);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    roadOff.current = (roadOff.current + speed.current) % 80;
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 3;
    ctx.setLineDash([30, 30]);
    ctx.lineDashOffset = -roadOff.current;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, W, H);

    obstacles.current = obstacles.current.filter(o => o.y < H + 20);
    const colors = ['#ef4444', '#f97316', '#eab308', '#a855f7', '#ec4899'];
    obstacles.current.forEach(o => {
      ctx.fillStyle = colors[o.ci % colors.length];
      ctx.fillRect(o.x, o.y, OBSTACLE_W, OBSTACLE_H);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(o.x, o.y, OBSTACLE_W, OBSTACLE_H);
    });

    const drawCar = (x, y, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, CAR_W, CAR_H, 8);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 8, y + 8, 8, 14);
      ctx.fillRect(x + CAR_W - 16, y + 8, 8, 14);
      ctx.fillRect(x + 8, y + CAR_H - 22, 8, 14);
      ctx.fillRect(x + CAR_W - 16, y + CAR_H - 22, 8, 14);
    };

    const lx = leftLane.current ? 15 : W / 2 + 15;
    const rx = rightLane.current ? W / 2 - CAR_W - 15 : W - CAR_W - 15;
    drawCar(lx, CAR_Y, '#3b82f6');
    drawCar(rx, CAR_Y, '#22c55e');

    if (stateRef.current === 'gameover') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', W / 2, H / 2 - 20);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '20px sans-serif';
      ctx.fillText('Score: ' + scoreVal.current, W / 2, H / 2 + 30);
    }
  }, []);

  const tick = useCallback(() => {
    if (stateRef.current !== 'playing') return;
    speed.current = 3 + Math.floor(scoreVal.current / 10) * 0.5;
    spawnTimer.current += speed.current;
    if (spawnTimer.current > 60) {
      spawnTimer.current = 0;
      const lane = Math.floor(Math.random() * 2);
      obstacles.current.push({
        x: lane === 0 ? 15 : W / 2 + 15,
        y: -OBSTACLE_H, lane, ci: Math.floor(Math.random() * 5),
      });
    }
    let hit = false;
    obstacles.current.forEach(o => {
      o.y += speed.current;
      const sameLeft = o.lane === 0 && leftLane.current;
      const sameRight = o.lane === 1 && rightLane.current;
      if (o.y + OBSTACLE_H > CAR_Y && o.y < CAR_Y + CAR_H) {
        if (o.lane === 0 && leftLane.current) hit = true;
        if (o.lane === 1 && rightLane.current) hit = true;
      }
    });
    if (hit) {
      stateRef.current = 'gameover';
      setGameState('gameover');
      saveHighScore(scoreVal.current);
      setHighScore(getHighScore());
      draw();
      return;
    }
    scoreVal.current += 1;
    setScore(scoreVal.current);
    draw();
    animRef.current = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    stateRef.current = 'playing';
    scoreVal.current = 0;
    setScore(0);
    obstacles.current = [];
    spawnTimer.current = 0;
    speed.current = 3;
    roadOff.current = 0;
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [gameState, tick]);

  useEffect(() => {
    const h = (e) => {
      if (stateRef.current !== 'playing') return;
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        leftLane.current = !leftLane.current;
        rightLane.current = !rightLane.current;
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const tap = () => {
    if (stateRef.current === 'playing') {
      leftLane.current = !leftLane.current;
      rightLane.current = !rightLane.current;
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-title">
          <span style={{ fontSize: 20 }}>🚗</span> Two Cars
        </div>
        <div className="game-controls">
          <span className="game-score">Score: {score}</span>
          <span className="game-high-score"><Trophy size={14} /> {highScore}</span>
          <button className="game-icon-btn" onClick={() => setGameState('menu')} title="Menu"><RotateCcw size={16} /></button>
        </div>
      </div>
      {gameState === 'menu' && (
        <div className="game-overlay">
          <div className="game-info">
            <span style={{ fontSize: 48 }}>🚗</span>
            <h2>Two Cars</h2>
            <p>Control two cars at once! Tap or press Space/Up to switch lanes.</p>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Dodge obstacles in both lanes simultaneously</p>
            <button className="game-start-btn" onClick={() => setGameState('playing')}>Start Game</button>
          </div>
        </div>
      )}
      {gameState === 'gameover' && (
        <div className="game-overlay">
          <div className="game-info">
            <h2>Game Over!</h2>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#facc15' }}>{score}</p>
            <p>High Score: {highScore}</p>
            <div className="game-over-btns">
              <button className="game-start-btn" onClick={() => setGameState('playing')}>Retry</button>
              <button className="game-icon-btn" onClick={() => setGameState('menu')} title="Menu"><RotateCcw size={16} /></button>
            </div>
          </div>
        </div>
      )}
      <div className="canvas-wrapper" onClick={tap}>
        <canvas ref={canvasRef} width={300} height={500} className="game-canvas" />
      </div>
      <div className="game-info" style={{ padding: '10px 20px' }}>
        <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>
          {gameState === 'playing' ? 'Tap or press Space/Up to switch lanes' : 'Tap/Space to switch both cars at once'}
        </p>
      </div>
    </div>
  );
}
