import { useState, useRef, useEffect, useCallback } from 'react';
import './KidsActivities.css';

const COLORS = ['#f1f5f9', '#ef4444', '#3b82f6', '#22c55e', '#facc15', '#a855f7'];
const SIZES = { small: 2, medium: 5, large: 10 };

export default function DrawingCanvas({ title, guideText, showGuide }) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState(COLORS[0]);
  const [lineWidth, setLineWidth] = useState('medium');
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [ctx, setCtx] = useState(null);

  const drawGuides = useCallback((ctx, w, h) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (guideText.includes('A to Z') || guideText.includes('letters')) {
      const letters = ['A', 'B', 'C'];
      const startX = w / 2;
      const startY = h / 3;
      letters.forEach((letter, i) => {
        ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
        ctx.font = '60px Arial';
        ctx.fillText(letter, startX + (i - 1) * 80, startY + i * 80);
        if (i < letters.length - 1) {
          ctx.beginPath();
          ctx.moveTo(startX + (i - 1) * 80 + 30, startY + i * 80 + 30);
          ctx.lineTo(startX + i * 80 + 30, startY + (i + 1) * 80 + 30);
          ctx.stroke();
        }
      });
    } else if (guideText.includes('numbers')) {
      for (let i = 1; i <= 3; i++) {
        ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
        ctx.font = '60px Arial';
        ctx.fillText(String(i), w / 2 + (i - 2) * 80, h / 2);
      }
    } else if (guideText.includes('dots') || guideText.includes('Dot')) {
      const dotCount = 8;
      for (let i = 0; i < dotCount; i++) {
        const x = (w / (dotCount + 1)) * (i + 1);
        const y = h / 2 + Math.sin(i * 1.2) * 80;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
        ctx.fill();
        ctx.fillStyle = 'rgba(96, 165, 250, 0.5)';
        ctx.font = '14px Arial';
        ctx.fillText(String(i + 1), x, y - 20);
        if (i > 0) {
          const prevX = (w / (dotCount + 1)) * i;
          const prevY = h / 2 + Math.sin((i - 1) * 1.2) * 80;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
    } else {
      ctx.fillStyle = 'rgba(96, 165, 250, 0.15)';
      ctx.font = '24px Arial';
      ctx.fillText(guideText, w / 2, h / 2);
    }
    ctx.restore();
  }, [guideText]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (showGuide && guideText) {
      drawGuides(ctx, rect.width, rect.height);
    }

    paths.forEach(path => {
      if (path.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });

    if (currentPath && currentPath.points.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = currentPath.color;
      ctx.lineWidth = currentPath.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(currentPath.points[0].x, currentPath.points[0].y);
      for (let i = 1; i < currentPath.points.length; i++) {
        ctx.lineTo(currentPath.points[i].x, currentPath.points[i].y);
      }
      ctx.stroke();
    }
  }, [paths, currentPath, showGuide, guideText, ctx, drawGuides]);

  const resizeCanvas = useCallback((canvas, context) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    context.scale(dpr, dpr);
    redraw();
  }, [redraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    setCtx(context);
    resizeCanvas(canvas, context);
    const handleResize = () => resizeCanvas(canvas, context);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas]);

  useEffect(() => {
    if (!ctx || !canvasRef.current) return;
    redraw();
  }, [paths, color, lineWidth, ctx, showGuide, guideText, redraw]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const pos = getPos(e);
    setIsDrawing(true);
    const newPath = { color, size: SIZES[lineWidth], points: [pos] };
    setCurrentPath(newPath);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing || !currentPath) return;
    const pos = getPos(e);
    setCurrentPath(prev => ({
      ...prev,
      points: [...prev.points, pos]
    }));
  };

  const stopDrawing = (e) => {
    e.preventDefault();
    if (!isDrawing || !currentPath) return;
    setIsDrawing(false);
    setPaths(prev => [...prev, currentPath]);
    setCurrentPath(null);
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath(null);
  };

  const undo = () => {
    setPaths(prev => prev.slice(0, -1));
  };

  return (
    <div className="activity-page">
      <div className="activity-header">
        <h2>{title}</h2>
      </div>
      {guideText && (
        <p className="activity-description">{guideText}</p>
      )}
      <div className="drawing-canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="drawing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="drawing-tools">
        <div className="color-picker">
          {COLORS.map(c => (
            <button
              key={c}
              className={`color-btn ${color === c ? 'active' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        <div className="size-selector">
          {Object.keys(SIZES).map(s => (
            <button
              key={s}
              className={`size-btn ${lineWidth === s ? 'active' : ''}`}
              onClick={() => setLineWidth(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <button className="tool-action-btn" onClick={undo} disabled={paths.length === 0}>
          Undo
        </button>
        <button className="tool-action-btn clear" onClick={clearCanvas} disabled={paths.length === 0}>
          Clear
        </button>
      </div>
    </div>
  );
}
