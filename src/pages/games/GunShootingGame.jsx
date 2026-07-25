import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import './Games.css';

const W = 600, H = 400;
const TARGET_R = 18;
const TIME_LIMIT = 30;

function getHighScore() {
  try { return parseInt(localStorage.getItem('freeforge_gunshoot_high') || '0', 10); } catch { return 0; }
}
function saveHighScore(s) {
  const cur = getHighScore();
  if (s > cur) localStorage.setItem('freeforge_gunshoot_high', String(s));
}

function randomTarget() {
  return {
    x: 40 + Math.random() * (W - 80),
    y: 40 + Math.random() * (H - 120),
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    r: TARGET_R - Math.floor(Math.random() * 6),
    type: Math.floor(Math.random() * 3),
  };
}

export default function GunShootingGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getHighScore);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const stateRef = useRef('menu');
  const scoreVal = useRef(0);
  const timeVal = useRef(TIME_LIMIT);
  const targets = useRef([]);
  const mousePos = useRef({ x: W / 2, y: H / 2 });
  const animRef = useRef(null);
  const spawnTimer = useRef(0);
  const cursorVisible = useRef(true);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    targets.current.forEach(t => {
      const colors = ['#ef4444', '#f97316', '#eab308'];
      ctx.fillStyle = colors[t.type % colors.length];
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = colors[t.type % colors.length];
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r * 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
      ctx.stroke();
    });

    if (stateRef.current !== 'gameover') {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      const mx = mousePos.current.x, my = mousePos.current.y;
      ctx.beginPath();
      ctx.moveTo(mx - 12, my);
      ctx.lineTo(mx + 12, my);
      ctx.moveTo(mx, my - 12);
      ctx.lineTo(mx, my + 12);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(239,68,68,0.3)';
      ctx.beginPath();
      ctx.arc(mx, my, 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Score: ' + scoreVal.current, 10, 24);
    ctx.fillStyle = timeVal.current < 10 ? '#ef4444' : '#facc15';
    ctx.fillText('Time: ' + Math.ceil(timeVal.current) + 's', W - 90, 24);

    if (stateRef.current === 'gameover') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Time Up!', W / 2, H / 2 - 20);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '20px sans-serif';
      ctx.fillText('Score: ' + scoreVal.current, W / 2, H / 2 + 30);
    }
  }, []);

  const tick = useCallback(() => {
    if (stateRef.current !== 'playing') return;

    timeVal.current -= 1 / 60;
    setTimeLeft(Math.ceil(timeVal.current));
    if (timeVal.current <= 0) {
      timeVal.current = 0;
      stateRef.current = 'gameover';
      setGameState('gameover');
      saveHighScore(scoreVal.current);
      setHighScore(getHighScore());
      draw();
      return;
    }

    spawnTimer.current += 1;
    if (spawnTimer.current > 30 && targets.current.length < 8) {
      spawnTimer.current = 0;
      targets.current.push(randomTarget());
    }

    targets.current = targets.current.filter(t => {
      t.x += t.vx;
      t.y += t.vy;
      if (t.x < t.r || t.x > W - t.r) t.vx *= -1;
      if (t.y < t.r || t.y > H - 60 - t.r) t.vy *= -1;
      return true;
    });

    draw();
    animRef.current = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    stateRef.current = 'playing';
    scoreVal.current = 0;
    setScore(0);
    timeVal.current = TIME_LIMIT;
    setTimeLeft(TIME_LIMIT);
    targets.current = [];
    spawnTimer.current = 0;
    for (let i = 0; i < 3; i++) targets.current.push(randomTarget());
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [gameState, tick]);

  useEffect(() => {
    const move = (e) => {
      const r = canvasRef.current?.getBoundingClientRect();
      if (r) {
        mousePos.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }
    };
    const click = (e) => {
      if (stateRef.current !== 'playing') return;
      const r = canvasRef.current?.getBoundingClientRect();
      if (!r) return;
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      let hit = false;
      targets.current = targets.current.filter(t => {
        const dist = Math.sqrt((t.x - mx) ** 2 + (t.y - my) ** 2);
        if (dist < t.r) { hit = true; return false; }
        return true;
      });
      if (hit) {
        scoreVal.current += 1;
        setScore(scoreVal.current);
        if (targets.current.length < 8) targets.current.push(randomTarget());
      }
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('click', click);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('click', click); };
  }, []);

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-title">
          <span style={{ fontSize: 20 }}>🎯</span> Gun Shooting
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
            <span style={{ fontSize: 48 }}>🎯</span>
            <h2>Gun Shooting</h2>
            <p>Click on the targets to shoot them! Be quick — you have 30 seconds.</p>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Aim with your mouse, click to fire</p>
            <button className="game-start-btn" onClick={() => setGameState('playing')}>Start Game</button>
          </div>
        </div>
      )}
      {gameState === 'gameover' && (
        <div className="game-overlay">
          <div className="game-info">
            <h2>Time Up!</h2>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#facc15' }}>{score}</p>
            <p>High Score: {highScore}</p>
            <div className="game-over-btns">
              <button className="game-start-btn" onClick={() => setGameState('playing')}>Retry</button>
              <button className="game-icon-btn" onClick={() => setGameState('menu')} title="Menu"><RotateCcw size={16} /></button>
            </div>
          </div>
        </div>
      )}
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} width={W} height={H} className="game-canvas" style={{ cursor: 'none' }} />
      </div>
      <div className="game-info" style={{ padding: '10px 20px' }}>
        <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>Click to shoot targets</p>
      </div>
    </div>
  );
}
