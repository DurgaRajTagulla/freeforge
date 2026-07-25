import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import './Games.css';

const W = 600, H = 400;
const GRAVITY = 0.15;
const TARGET_R = 25;

function getHighScore() {
  try { return parseInt(localStorage.getItem('freeforge_arrow_high') || '0', 10); } catch { return 0; }
}
function saveHighScore(s) {
  const cur = getHighScore();
  if (s > cur) localStorage.setItem('freeforge_arrow_high', String(s));
}

function randomTarget() {
  return {
    x: 400 + Math.random() * 150,
    y: 80 + Math.random() * 150,
    r: TARGET_R,
  };
}

export default function ArrowGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getHighScore);
  const [round, setRound] = useState(1);
  const stateRef = useRef('menu');
  const scoreVal = useRef(0);
  const roundVal = useRef(1);
  const target = useRef(randomTarget());
  const arrow = useRef(null);
  const angle = useRef(45);
  const power = useRef(40);
  const charging = useRef(false);
  const mouseDown = useRef(false);
  const animRef = useRef(null);
  const wind = useRef(0);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, H - 40, W, 40);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H - 40);
    ctx.lineTo(W, H - 40);
    ctx.stroke();

    const t = target.current;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.arc(t.x, t.y, t.r - i * 6, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Target', t.x, t.y - t.r - 8);

    const bowX = 60, bowY = H - 40;
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bowX, bowY - 5, 40, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();

    const rad = ((angle.current - 90) * Math.PI) / 180;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(bowX, bowY);
    ctx.lineTo(bowX + Math.cos(rad) * 100, bowY + Math.sin(rad) * 100);
    ctx.stroke();
    ctx.setLineDash([]);

    if (!arrow.current) {
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bowX, bowY);
      ctx.lineTo(bowX + Math.cos(rad) * 50, bowY + Math.sin(rad) * 50);
      ctx.stroke();
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.arc(bowX + Math.cos(rad) * 50, bowY + Math.sin(rad) * 50, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (arrow.current) {
      const a = arrow.current;
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x + Math.cos(a.angle) * 25, a.y + Math.sin(a.angle) * 25);
      ctx.stroke();
    }

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + scoreVal.current, 10, 24);
    ctx.fillText('Round: ' + roundVal.current, 10, 44);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('Angle: ' + angle.current + '°', W - 120, 20);
    const pw = charging.current ? mouseDown.current ? power.current : 0 : 0;
    ctx.fillText('Power: ' + Math.round(pw), W - 120, 38);

    ctx.fillStyle = '#60a5fa';
    ctx.fillText('Wind: ' + (wind.current > 0 ? '→ ' : '← ') + Math.abs(wind.current).toFixed(1), W / 2 - 40, 20);

    if (stateRef.current === 'roundEnd') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Hit! +' + (arrow.current ? arrow.current.points : 0), W / 2, H / 2 - 20);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '16px sans-serif';
      ctx.fillText('Click to continue', W / 2, H / 2 + 30);
    }

    if (stateRef.current === 'gameover') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', W / 2, H / 2 - 20);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '20px sans-serif';
      ctx.fillText('Final Score: ' + scoreVal.current, W / 2, H / 2 + 30);
    }
  }, []);

  const tick = useCallback(() => {
    if (stateRef.current !== 'playing') return;
    if (arrow.current) {
      const a = arrow.current;
      a.vx += wind.current * 0.01;
      a.vy += GRAVITY;
      a.x += a.vx;
      a.y += a.vy;
      a.angle = Math.atan2(a.vy, a.vx);

      if (a.y > H - 40 || a.x > W || a.x < 0 || a.y < 0) {
        arrow.current = null;
        endRound(false);
        draw();
        return;
      }

      const t = target.current;
      const dist = Math.sqrt((a.x - t.x) ** 2 + (a.y - t.y) ** 2);
      if (dist < t.r) {
        const ringScore = Math.max(1, Math.floor((t.r - dist) / (t.r / 10)));
        a.points = ringScore + 1;
        arrow.current = null;
        endRound(true, a.points);
        draw();
        return;
      }

      draw();
      animRef.current = requestAnimationFrame(tick);
    }
  }, [draw]);

  function endRound(hit, pts) {
    if (hit) {
      scoreVal.current += pts;
      setScore(scoreVal.current);
    }
    if (roundVal.current >= 10) {
      stateRef.current = 'gameover';
      setGameState('gameover');
      saveHighScore(scoreVal.current);
      setHighScore(getHighScore());
    } else {
      stateRef.current = 'roundEnd';
    }
  }

  function nextRound() {
    if (stateRef.current === 'roundEnd') {
      roundVal.current += 1;
      setRound(roundVal.current);
      target.current = randomTarget();
      wind.current = (Math.random() - 0.5) * 6;
      angle.current = 45;
      power.current = 40;
      arrow.current = null;
      stateRef.current = 'playing';
      draw();
    }
  }

  useEffect(() => {
    if (gameState !== 'playing') return;
    stateRef.current = 'playing';
    scoreVal.current = 0;
    setScore(0);
    roundVal.current = 1;
    setRound(1);
    target.current = randomTarget();
    wind.current = (Math.random() - 0.5) * 6;
    angle.current = 45;
    power.current = 40;
    arrow.current = null;
    draw();
  }, [gameState, draw]);

  useEffect(() => {
    const move = (e) => {
      if (stateRef.current !== 'playing' || arrow.current) return;
      const r = canvasRef.current?.getBoundingClientRect();
      if (!r) return;
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      const bowX = 60, bowY = H - 40;
      const dx = mx - bowX, dy = my - bowY;
      let a = Math.atan2(dy, dx) * (180 / Math.PI);
      a = Math.max(5, Math.min(85, a));
      angle.current = Math.round(a);
    };
    const down = (e) => {
      if (stateRef.current !== 'playing' || arrow.current) return;
      mouseDown.current = true;
      charging.current = true;
      power.current = 10;
      const interval = setInterval(() => {
        if (!mouseDown.current) { clearInterval(interval); return; }
        power.current = Math.min(100, power.current + 2);
      }, 30);
      (window._powInt = interval);
    };
    const up = (e) => {
      if (stateRef.current !== 'playing') return;
      if (mouseDown.current) {
        mouseDown.current = false;
        charging.current = false;
        if (window._powInt) clearInterval(window._powInt);
        if (!arrow.current) {
          const bowX = 60, bowY = H - 40;
          const rad = ((angle.current - 90) * Math.PI) / 180;
          const pwr = power.current * 0.15;
          arrow.current = {
            x: bowX + Math.cos(rad) * 40,
            y: bowY + Math.sin(rad) * 40,
            vx: Math.cos(rad) * pwr,
            vy: Math.sin(rad) * pwr,
            angle: rad,
            points: 0,
          };
          animRef.current = requestAnimationFrame(tick);
        }
      }
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [tick]);

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-title">
          <span style={{ fontSize: 20 }}>🏹</span> Arrow Game
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
            <span style={{ fontSize: 48 }}>🏹</span>
            <h2>Arrow Game</h2>
            <p>Aim with your mouse, hold click to charge power, release to shoot. Hit the target!</p>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>10 rounds. Wind affects your arrow trajectory.</p>
            <button className="game-start-btn" onClick={() => setGameState('playing')}>Start Game</button>
          </div>
        </div>
      )}
      {(gameState === 'roundEnd') && (
        <div className="game-overlay" onClick={nextRound}>
          <div className="game-info">
            <h2 style={{ color: '#22c55e' }}>Hit!</h2>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#facc15' }}>+{arrow.current?.points || 0}</p>
            <p>Score: {score} / Round {round} of 10</p>
            <p style={{ fontSize: 12, color: '#64748b' }}>Click to continue</p>
          </div>
        </div>
      )}
      {gameState === 'gameover' && (
        <div className="game-overlay">
          <div className="game-info">
            <h2>Game Over</h2>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#facc15' }}>{score}</p>
            <p>High Score: {highScore}</p>
            <div className="game-over-btns">
              <button className="game-start-btn" onClick={() => setGameState('playing')}>Play Again</button>
              <button className="game-icon-btn" onClick={() => setGameState('menu')} title="Menu"><RotateCcw size={16} /></button>
            </div>
          </div>
        </div>
      )}
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} width={W} height={H} className="game-canvas" />
      </div>
      <div className="game-info" style={{ padding: '10px 20px' }}>
        <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>
          Move mouse to aim &bull; Hold click to charge power &bull; Release to shoot
        </p>
      </div>
    </div>
  );
}
