import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import './Games.css';

const W = 600, H = 400;
const GROUND_Y = 320;
const CAR_W = 50, CAR_H = 20;

function getHighScore() {
  try { return parseInt(localStorage.getItem('freeforge_hillclimb_high') || '0', 10); } catch { return 0; }
}
function saveHighScore(s) {
  const cur = getHighScore();
  if (s > cur) localStorage.setItem('freeforge_hillclimb_high', String(s));
}

function generateTerrain(len) {
  const t = [];
  for (let i = 0; i < len; i++) {
    t.push(Math.sin(i * 0.05) * 40 + Math.sin(i * 0.12) * 20 + Math.sin(i * 0.03) * 30);
  }
  return t;
}

export default function HillClimbGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getHighScore);
  const stateRef = useRef('menu');
  const scoreVal = useRef(0);
  const carX = useRef(80);
  const carY = useRef(0);
  const carVx = useRef(0);
  const carVy = useRef(0);
  const terrain = useRef(generateTerrain(600));
  const terrainOff = useRef(0);
  const fuel = useRef(100);
  const animRef = useRef(null);
  const keys = useRef({ left: false, right: false });

  const getGroundY = useCallback((x) => {
    const idx = Math.floor(x) % terrain.current.length;
    return GROUND_Y - terrain.current[idx >= 0 ? idx : idx + terrain.current.length];
  }, []);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, '#0f172a');
    skyGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    const stars = 50;
    for (let i = 0; i < stars; i++) {
      const sx = (i * 137.5 + 50) % W, sy = (i * 97.3 + 20) % (GROUND_Y - 40);
      ctx.fillStyle = `rgba(255,255,255,${0.3 + (i % 7) * 0.1})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let minY = H;
    for (let x = 0; x < W; x++) {
      const gx = x + terrainOff.current;
      const gy = getGroundY(gx);
      if (gy < minY) minY = gy;
      x === 0 ? ctx.moveTo(x, gy) : ctx.lineTo(x, gy);
    }
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, minY, W, H - minY);

    ctx.fillStyle = '#22c55e';
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x++) {
      const gx = x + terrainOff.current;
      const gy = getGroundY(gx);
      ctx.lineTo(x, gy);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    const cx = carX.current;
    const cy = carY.current;
    const angle = Math.atan2(
      getGroundY(cx + 1 + terrainOff.current) - getGroundY(cx - 1 + terrainOff.current),
      2
    );

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(-CAR_W / 2, -CAR_H / 2, CAR_W, CAR_H, 4);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-CAR_W / 2 + 4, -CAR_H / 2 + 3, 10, 7);
    ctx.fillRect(CAR_W / 2 - 14, -CAR_H / 2 + 3, 10, 7);
    ctx.fillRect(-CAR_W / 2 + 4, CAR_H / 2 - 10, 10, 7);
    ctx.fillRect(CAR_W / 2 - 14, CAR_H / 2 - 10, 10, 7);

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(-CAR_W / 2 + 10, CAR_H / 2 + 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(CAR_W / 2 - 10, CAR_H / 2 + 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#facc15';
    ctx.font = '12px sans-serif';
    ctx.fillText('Fuel: ' + Math.round(fuel.current) + '%', 10, 20);

    if (stateRef.current === 'gameover') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CRASHED', W / 2, H / 2 - 20);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '20px sans-serif';
      ctx.fillText('Distance: ' + Math.round(scoreVal.current) + 'm', W / 2, H / 2 + 30);
    }
  }, [getGroundY]);

  const tick = useCallback(() => {
    if (stateRef.current !== 'playing') return;
    const accel = keys.current.right ? 0.3 : 0;
    const brake = keys.current.left ? 0.2 : 0;
    carVx.current = Math.max(0, Math.min(12, carVx.current + accel - brake * carVx.current * 0.1));
    if (carVx.current < 0.05 && !keys.current.right) carVx.current *= 0.95;
    carX.current += carVx.current;
    terrainOff.current += carVx.current;

    const gy = getGroundY(carX.current + terrainOff.current);
    const targetY = gy - CAR_H / 2;
    carY.current += (targetY - carY.current) * 0.3;

    fuel.current -= carVx.current * 0.05;
    if (fuel.current <= 0) {
      fuel.current = 0;
      stateRef.current = 'gameover';
      setGameState('gameover');
      saveHighScore(Math.round(scoreVal.current));
      setHighScore(getHighScore());
      draw();
      return;
    }

    if (Math.abs(gy - carY.current - CAR_H / 2) > 50) {
      stateRef.current = 'gameover';
      setGameState('gameover');
      saveHighScore(Math.round(scoreVal.current));
      setHighScore(getHighScore());
      draw();
      return;
    }

    scoreVal.current += carVx.current * 0.1;
    setScore(Math.round(scoreVal.current));
    draw();
    animRef.current = requestAnimationFrame(tick);
  }, [draw, getGroundY]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    stateRef.current = 'playing';
    carX.current = 80;
    carY.current = getGroundY(80) - CAR_H / 2;
    carVx.current = 0;
    carVy.current = 0;
    terrainOff.current = 0;
    fuel.current = 100;
    scoreVal.current = 0;
    setScore(0);
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [gameState, tick, getGroundY]);

  useEffect(() => {
    const down = (e) => {
      if (stateRef.current !== 'playing') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); keys.current.right = true; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); keys.current.left = true; }
    };
    const up = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); keys.current.right = false; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); keys.current.left = false; }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-title">
          <span style={{ fontSize: 20 }}>🏎️</span> Hill Climb
        </div>
        <div className="game-controls">
          <span className="game-score">Distance: {score}m</span>
          <span className="game-high-score"><Trophy size={14} /> {highScore}m</span>
          <button className="game-icon-btn" onClick={() => setGameState('menu')} title="Menu"><RotateCcw size={16} /></button>
        </div>
      </div>
      {gameState === 'menu' && (
        <div className="game-overlay">
          <div className="game-info">
            <span style={{ fontSize: 48 }}>🏎️</span>
            <h2>Hill Climb</h2>
            <p>Drive over hills and valleys. Press Right Arrow to accelerate, Left Arrow to brake.</p>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Don't flip over or run out of fuel!</p>
            <button className="game-start-btn" onClick={() => setGameState('playing')}>Start Game</button>
          </div>
        </div>
      )}
      {gameState === 'gameover' && (
        <div className="game-overlay">
          <div className="game-info">
            <h2>Crashed!</h2>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#facc15' }}>{score}m</p>
            <p>Best: {highScore}m</p>
            <div className="game-over-btns">
              <button className="game-start-btn" onClick={() => setGameState('playing')}>Retry</button>
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
          ← Brake &nbsp; → Accelerate
        </p>
      </div>
    </div>
  );
}
