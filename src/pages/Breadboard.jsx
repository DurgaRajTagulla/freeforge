import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Zap, Wifi, GripVertical, Eye, RotateCcw, Undo2, X } from 'lucide-react';
import { solveCircuit, formatVoltage, formatCurrent } from '../utils/circuitSolver';
import './Breadboard.css';

const COLS = 10, ROWS = 5;
const CS = 62, RS = 42;
const BX = 72, BY = 85;
const HR = 8, CG = 36;
const CW = 830, CH = 600;

const RAIL_TOP_Y = BY - 8;
const LEFT_TOP_Y = BY + 18;
const RIGHT_TOP_Y = BY + (ROWS + 1) * RS + CG + 18;
const BOT_RAIL_Y = BY + (ROWS * 2 + 1) * RS + CG + 30;

function holePos(section, col, row) {
  const x = BX + col * CS;
  switch (section) {
    case 'topRail': return { x, y: RAIL_TOP_Y };
    case 'botRail': return { x, y: BOT_RAIL_Y };
    case 'left': return { x, y: LEFT_TOP_Y + row * RS };
    case 'right': return { x, y: RIGHT_TOP_Y + row * RS };
    default: return { x: 0, y: 0 };
  }
}

function holeNode(section, col) {
  if (section === 'topRail') return 21;
  if (section === 'botRail') return 22;
  if (section === 'left') return col + 1;
  return col + 11;
}

function nodeLabel(n) {
  if (n === 21) return 'VCC';
  if (n === 22) return 'GND';
  if (n >= 1 && n <= 10) return `L${n}`;
  if (n >= 11 && n <= 20) return `R${n - 10}`;
  return `N${n}`;
}

function findNearestHole(cx, cy) {
  let best = null, bestD = Infinity;
  const sections = [
    { s: 'topRail', r: 0 }, { s: 'botRail', r: 0 },
    ...Array.from({ length: 5 }, (_, i) => ({ s: 'left', r: i })),
    ...Array.from({ length: 5 }, (_, i) => ({ s: 'right', r: i })),
  ];
  for (const { s, r } of sections) {
    for (let c = 0; c < 10; c++) {
      const p = holePos(s, c, r);
      const d = Math.sqrt((cx - p.x) ** 2 + (cy - p.y) ** 2);
      if (d < bestD) { bestD = d; best = { section: s, col: c, row: r, node: holeNode(s, c), x: p.x, y: p.y }; }
    }
  }
  return bestD < 35 ? best : null;
}

function findBest2Pin(cx, cy, orient) {
  const h1 = findNearestHole(cx, cy);
  if (!h1) return null;
  const candidates = [];
  if (orient === 'h' || !orient) {
    if (h1.col > 0) { const p = holePos(h1.section, h1.col - 1, h1.row); candidates.push({ h1, h2: { section: h1.section, col: h1.col - 1, row: h1.row, node: holeNode(h1.section, h1.col - 1), x: p.x, y: p.y }, orient: 'h' }); }
    if (h1.col < 9) { const p = holePos(h1.section, h1.col + 1, h1.row); candidates.push({ h1, h2: { section: h1.section, col: h1.col + 1, row: h1.row, node: holeNode(h1.section, h1.col + 1), x: p.x, y: p.y }, orient: 'h' }); }
  }
  if (orient === 'v') {
    const rows = (h1.section === 'left' || h1.section === 'right') ? 5 : 1;
    if (h1.row > 0 && h1.row < rows) { const p = holePos(h1.section, h1.col, h1.row - 1); candidates.push({ h1, h2: { section: h1.section, col: h1.col, row: h1.row - 1, node: holeNode(h1.section, h1.col), x: p.x, y: p.y }, orient: 'v' }); }
    if (h1.row < rows - 1) { const p = holePos(h1.section, h1.col, h1.row + 1); candidates.push({ h1, h2: { section: h1.section, col: h1.col, row: h1.row + 1, node: holeNode(h1.section, h1.col), x: p.x, y: p.y }, orient: 'v' }); }
  }
  if (candidates.length === 0) return null;
  return candidates.reduce((a, b) => {
    const ma = ((a.h1.x + a.h2.x) / 2 - cx) ** 2 + ((a.h1.y + a.h2.y) / 2 - cy) ** 2;
    const mb = ((b.h1.x + b.h2.x) / 2 - cx) ** 2 + ((b.h1.y + b.h2.y) / 2 - cy) ** 2;
    return ma < mb ? a : b;
  });
}

function findBest3Pin(cx, cy) {
  const h1 = findNearestHole(cx, cy);
  if (!h1) return null;
  if ((h1.section !== 'left' && h1.section !== 'right') || h1.row > 2) return null;
  const p2 = holePos(h1.section, h1.col, h1.row + 1);
  const p3 = holePos(h1.section, h1.col, h1.row + 2);
  return {
    pins: [
      h1,
      { section: h1.section, col: h1.col, row: h1.row + 1, node: holeNode(h1.section, h1.col), x: p2.x, y: p2.y },
      { section: h1.section, col: h1.col, row: h1.row + 2, node: holeNode(h1.section, h1.col), x: p3.x, y: p3.y },
    ],
    orient: 'v',
  };
}

function resistorBands(ohms) {
  if (ohms <= 0) return ['#888', '#888', '#888', '#888'];
  const colors = [
    { n: '#000', v: 0 }, { n: '#8B4513', v: 1 }, { n: '#DC2626', v: 2 }, { n: '#EA580C', v: 3 },
    { n: '#EAB308', v: 4 }, { n: '#16A34A', v: 5 }, { n: '#2563EB', v: 6 }, { n: '#7C3AED', v: 7 },
    { n: '#6B7280', v: 8 }, { n: '#D1D5DB', v: 9 },
  ];
  const mulColors = [
    { n: '#000', v: 0, m: 1 }, { n: '#8B4513', v: 1, m: 10 }, { n: '#DC2626', v: 2, m: 100 },
    { n: '#EA580C', v: 3, m: 1e3 }, { n: '#EAB308', v: 4, m: 1e4 },
    { n: '#16A34A', v: 5, m: 1e5 }, { n: '#2563EB', v: 6, m: 1e6 },
    { n: '#7C3AED', v: 7, m: 1e7 }, { n: '#6B7280', v: 8, m: 1e8 },
    { n: '#D1D5DB', v: 9, m: 1e9 }, { n: '#F59E0B', v: -1, m: 0.1 }, { n: '#9CA3AF', v: -2, m: 0.01 },
  ];
  const tolColors = [
    { n: '#8B4513', t: 1 }, { n: '#DC2626', t: 2 }, { n: '#F59E0B', t: 5 }, { n: '#9CA3AF', t: 10 },
    { n: '#16A34A', t: 0.5 }, { n: '#2563EB', t: 0.25 }, { n: '#7C3AED', t: 0.1 },
  ];
  let v = ohms;
  let exp = 0;
  while (v >= 100) { v /= 10; exp++; }
  while (v < 10) { v *= 10; exp--; }
  const d1 = Math.floor(v / 10);
  const d2 = Math.floor(v) % 10;
  const mul = mulColors.find(m => Math.abs(m.m - Math.pow(10, exp)) < 0.01) || mulColors[exp] || mulColors[2];
  const tol = tolColors[2];
  const c1 = colors.find(c => c.v === d1) || colors[0];
  const c2 = colors.find(c => c.v === d2) || colors[0];
  return [c1.n, c2.n, mul.n, tol.n];
}

function drawResistor(ctx, x1, y1, x2, y2, ohms, sel) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const angle = Math.atan2(dy, dx);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;

  ctx.save();
  ctx.translate(mx, my);
  ctx.rotate(angle);

  const bw = 28, bh = 16;
  // leads
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-len / 2, 0); ctx.lineTo(-bw / 2, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bw / 2, 0); ctx.lineTo(len / 2, 0); ctx.stroke();
  // body
  ctx.fillStyle = '#f5e6c8';
  ctx.strokeStyle = '#c4a97a';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 3); ctx.fill(); ctx.stroke();
  // bands
  const bands = resistorBands(ohms);
  const bandW = 3, gap = 1.8;
  const startX = -bw / 2 + 4;
  bands.forEach((b, i) => {
    ctx.fillStyle = b;
    ctx.fillRect(startX + i * (bandW + gap), -bh / 2 + 2, bandW, bh - 4);
  });
  // value label
  ctx.fillStyle = '#333';
  ctx.font = '7px monospace';
  ctx.textAlign = 'center';
  const vStr = ohms >= 1e6 ? (ohms / 1e6).toFixed(1) + 'M' : ohms >= 1e3 ? (ohms / 1e3).toFixed(1) + 'K' : ohms + 'Ω';
  ctx.fillText(vStr, 0, bh / 2 + 10);

  if (sel) {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.roundRect(-bw / 2 - 5, -bh / 2 - 5, bw + 10, bh + 16, 5); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawCapacitor(ctx, x1, y1, x2, y2, val, sel) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const angle = Math.atan2(dy, dx);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;

  ctx.save();
  ctx.translate(mx, my);
  ctx.rotate(angle);

  const r = 11;
  // body - cylinder
  ctx.fillStyle = '#1e40af';
  ctx.strokeStyle = '#1e3a8a';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // top marking
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath(); ctx.arc(0, 0, r - 3, 0, Math.PI * 2); ctx.fill();
  // + marking
  ctx.fillStyle = '#fff';
  ctx.font = '9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('+', 0, 3);
  // leads
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-len / 2, 0); ctx.lineTo(-r - 2, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(r + 2, 0); ctx.lineTo(len / 2, 0); ctx.stroke();

  const vStr = val >= 1e-3 ? (val * 1e3).toFixed(0) + 'mF' : val >= 1e-6 ? (val * 1e6).toFixed(0) + 'µF' : val >= 1e-9 ? (val * 1e9).toFixed(0) + 'nF' : (val * 1e12).toFixed(0) + 'pF';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(vStr, 0, r + 12);

  if (sel) {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.arc(0, 0, r + 6, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawDiode(ctx, x1, y1, x2, y2, val, sel) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const angle = Math.atan2(dy, dx);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;

  ctx.save();
  ctx.translate(mx, my);
  ctx.rotate(angle);

  const bw = 16;
  // glass body
  ctx.fillStyle = 'rgba(200,180,160,0.6)';
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(-bw / 2, -6, bw, 12, 6); ctx.fill(); ctx.stroke();
  // cathode band
  ctx.fillStyle = '#555';
  ctx.fillRect(bw / 2 - 5, -6, 5, 12);
  // diode symbol inside
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1.2;
  const triX = -4;
  ctx.beginPath(); ctx.moveTo(triX, -5); ctx.lineTo(triX + 8, 0); ctx.lineTo(triX, 5); ctx.closePath(); ctx.fillStyle = '#333'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(triX + 8, -6); ctx.lineTo(triX + 8, 6); ctx.stroke();
  // leads
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-len / 2, 0); ctx.lineTo(-bw / 2 - 2, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bw / 2 + 2, 0); ctx.lineTo(len / 2, 0); ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '7px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('D', 0, -12);

  if (sel) {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.roundRect(-bw / 2 - 5, -11, bw + 10, 22, 5); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawLED(ctx, x1, y1, x2, y2, val, color, sel) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const angle = Math.atan2(dy, dx);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;

  ctx.save();
  ctx.translate(mx, my);
  ctx.rotate(angle);

  const ledColor = color || '#ef4444';
  // dome
  ctx.fillStyle = ledColor;
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(0, -3, 8, Math.PI, 0); ctx.fill(); ctx.stroke();
  // flat base
  ctx.fillRect(-8, -3, 16, 4);
  // leads
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-4, 1); ctx.lineTo(-len / 2, 1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(4, 1); ctx.lineTo(len / 2, 1); ctx.stroke();
  // glow
  ctx.fillStyle = ledColor + '30';
  ctx.beginPath(); ctx.arc(0, -3, 14, 0, Math.PI * 2); ctx.fill();
  // light rays
  ctx.strokeStyle = ledColor + '60';
  ctx.lineWidth = 1;
  for (let a = -60; a <= 60; a += 30) {
    const rad = a * Math.PI / 180;
    ctx.beginPath(); ctx.moveTo(Math.cos(rad) * 10, -3 + Math.sin(rad) * 10);
    ctx.lineTo(Math.cos(rad) * 16, -3 + Math.sin(rad) * 16); ctx.stroke();
  }
  // flat side
  ctx.fillStyle = '#333';
  ctx.fillRect(-7, -2, 2, 2);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '7px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LED', 0, 16);

  if (sel) {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.arc(0, -3, 18, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawTransistor(ctx, p1, p2, p3, type, beta, sel) {
  const mx = (p1.x + p2.x + p3.x) / 3, my = (p1.y + p2.y + p3.y) / 3;

  ctx.save();
  ctx.translate(mx, my);

  const bodyR = 16;
  const isNPN = type === 'npn';

  // TO-92 body
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, bodyR, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Flat side of TO-92
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-bodyR, -4, 7, 8);

  // inner symbol
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-8, -4);
  ctx.lineTo(4, 0);
  ctx.lineTo(-8, 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(4, -5);
  ctx.lineTo(4, 5);
  ctx.stroke();
  if (!isNPN) {
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(-2, 0, 3, 0, Math.PI * 2);
    ctx.stroke();
  }
  // arrow for NPN
  if (isNPN) {
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(-2, -2);
    ctx.lineTo(-2, 2);
    ctx.closePath();
    ctx.fill();
  }

  // label
  ctx.fillStyle = '#94a3b8';
  ctx.font = '7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(type.toUpperCase(), 0, -bodyR - 4);
  ctx.fillStyle = '#64748b';
  ctx.font = '6px monospace';
  ctx.fillText('β=' + beta, 0, -bodyR + 10);

  // lead lines
  const pPos = [p1, p2, p3];
  const labels = ['B', 'E', 'C'];
  pPos.forEach((p, i) => {
    if (!p) return;
    const a = Math.atan2(p.y - my, p.x - mx);
    const ex = Math.cos(a) * bodyR, ey = Math.sin(a) * bodyR;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(p.x - mx, p.y - my);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], p.x - mx, p.y - my + (p.y > my ? 12 : -6));
  });

  if (sel) {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.arc(0, 0, bodyR + 8, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawBattery(ctx, x1, y1, x2, y2, volts, sel) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const angle = Math.atan2(dy, dx);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;

  ctx.save();
  ctx.translate(mx, my);
  ctx.rotate(angle);

  const bw = 24, bh = 16;
  // battery body
  ctx.fillStyle = '#22c55e';
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 3); ctx.fill(); ctx.stroke();
  // + terminal
  ctx.fillStyle = '#15803d';
  ctx.fillRect(bw / 2, -6, 4, 12);
  // - terminal
  ctx.fillStyle = '#15803d';
  ctx.fillRect(-bw / 2 - 4, -6, 4, 12);
  // markings
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('+', bw / 2 + 2, 3);
  ctx.fillText('−', -bw / 2 - 2, 3);
  // leads
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-len / 2, 0); ctx.lineTo(-bw / 2 - 4, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bw / 2 + 4, 0); ctx.lineTo(len / 2, 0); ctx.stroke();
  // voltage label
  ctx.fillStyle = '#22c55e';
  ctx.font = '7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(volts + 'V', 0, bh / 2 + 10);

  if (sel) {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.roundRect(-bw / 2 - 6, -bh / 2 - 6, bw + 12, bh + 20, 5); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawWire(ctx, x1, y1, x2, y2) {
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7;
  // 90° routed path
  const midX = (x1 + x2) / 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(midX, y1);
  ctx.lineTo(midX, y2);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  // dot at joints
  ctx.fillStyle = '#22c55e';
  ctx.beginPath(); ctx.arc(x1, y1, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x2, y2, 2, 0, Math.PI * 2); ctx.fill();
}

// ---- Component Definitions ----
const COMP_DEFS = [
  { type: 'resistor', icon: 'R', label: 'Resistor', pins: 2, dVal: 1000, valLabel: 'Ohms (Ω)', step: 100, color: '#f5e6c8' },
  { type: 'capacitor', icon: 'C', label: 'Capacitor', pins: 2, dVal: 1e-6, valLabel: 'Capacitance (F)', step: 1e-9, color: '#1e40af' },
  { type: 'diode', icon: 'D', label: 'Diode', pins: 2, dVal: 0.7, valLabel: 'Vf (V)', step: 0.05, color: '#555' },
  { type: 'led', icon: 'LED', label: 'LED', pins: 2, dVal: 2, valLabel: 'Vf (V)', step: 0.1, color: '#ef4444' },
  { type: 'battery', icon: 'V', label: 'Battery', pins: 2, dVal: 5, valLabel: 'Voltage (V)', step: 0.5, color: '#22c55e' },
  { type: 'npn', icon: 'QN', label: 'NPN Transistor', pins: 3, dVal: 100, valLabel: 'HFE (β)', step: 10, color: '#a855f7' },
  { type: 'pnp', icon: 'QP', label: 'PNP Transistor', pins: 3, dVal: 100, valLabel: 'HFE (β)', step: 10, color: '#a855f7' },
];

export default function Breadboard() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [comps, setComps] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [mode, setMode] = useState('select');
  const [placeType, setPlaceType] = useState(null);
  const [selId, setSelId] = useState(null);
  const [wireStart, setWireStart] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [preview, setPreview] = useState(null);
  const [showV, setShowV] = useState(false);
  const [simRes, setSimRes] = useState(null);
  const [dragComp, setDragComp] = useState(null);
  const [dragOrig, setDragOrig] = useState(null);
  const [orient, setOrient] = useState('h');
  const dragRef = useRef(null);
  const animRef = useRef(null);

  const runSim = useCallback((c) => {
    if (!c || c.length === 0) { setSimRes(null); return; }
    setSimRes(solveCircuit(c));
  }, []);

  useEffect(() => { runSim(comps); }, [comps, runSim]);

  // Mouse tracking for preview
  useEffect(() => {
    const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  function getPinPos(comp, idx) {
    const sections = ['topRail', 'left', 'right', 'botRail'];
    for (const s of sections) {
      const maxR = (s === 'left' || s === 'right') ? 5 : 1;
      for (let r = 0; r < maxR; r++) {
        for (let c = 0; c < 10; c++) {
          if (holeNode(s, c) === comp.pins[idx]) return holePos(s, c, r);
        }
      }
    }
    return null;
  }

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Breadboard body
    const bbW = 9 * CS + CS * 1.4;
    const bbH = (ROWS * 2 + 1.5) * RS + CG + 32;
    ctx.fillStyle = '#e8d5b7';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 25;
    ctx.beginPath(); ctx.roundRect(BX - 16, BY - 24, bbW + 32, bbH + 18, 12); ctx.fill();
    ctx.shadowBlur = 0;

    // Board surface
    ctx.fillStyle = '#f0e2ca';
    ctx.beginPath(); ctx.roundRect(BX - 12, BY - 20, bbW + 24, bbH + 10, 8); ctx.fill();

    // Grid lines
    ctx.strokeStyle = 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 1;
    for (let c = 0; c < 10; c++) {
      const x = BX + c * CS + CS / 2;
      ctx.beginPath(); ctx.moveTo(x, BY); ctx.lineTo(x, BY + bbH); ctx.stroke();
    }
    for (let r = 0; r < 12; r++) {
      const y = BY + r * RS + RS / 2;
      ctx.beginPath(); ctx.moveTo(BX, y); ctx.lineTo(BX + bbW, y); ctx.stroke();
    }

    // Center channel
    const chY = BY + (ROWS + 0.5) * RS + 6;
    ctx.fillStyle = '#d4c0a0';
    ctx.fillRect(BX - 8, chY, bbW + 16, CG - 12);

    // Center channel label
    ctx.fillStyle = '#b8a080';
    ctx.font = '7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('— CENTER CHANNEL —', BX + bbW / 2, chY + CG / 2 + 2);

    // Top power rail
    const rH = 26, rY = BY - 20;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.roundRect(BX + 6, rY, bbW - 12, rH, 4); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('+ VCC', BX + 14, rY + 17);

    // Bottom power rail
    const rY2 = BY + (ROWS * 2 + 1) * RS + CG + 10;
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath(); ctx.roundRect(BX + 6, rY2, bbW - 12, rH, 4); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('− GND', BX + 14, rY2 + 17);

    // Column labels
    ctx.textAlign = 'center';
    for (let c = 0; c < 10; c++) {
      const x = BX + c * CS;
      ctx.fillStyle = '#444';
      ctx.font = '9px sans-serif';
      ctx.fillText(`${c + 1}`, x, BY - 26);
      ctx.fillText(`${c + 1}`, x, BY + (ROWS * 2 + 1) * RS + CG + 34);
    }

    // Row labels A-E (left side)
    ctx.textAlign = 'right';
    for (let r = 0; r < 5; r++) {
      ctx.fillStyle = '#444';
      ctx.font = '9px sans-serif';
      ctx.fillText(String.fromCharCode(65 + r), BX - 14, LEFT_TOP_Y + r * RS + 4);
    }
    // Row labels F-J (right side)
    for (let r = 0; r < 5; r++) {
      ctx.fillStyle = '#444';
      ctx.font = '9px sans-serif';
      ctx.fillText(String.fromCharCode(70 + r), BX - 14, RIGHT_TOP_Y + r * RS + 4);
    }
    ctx.textAlign = 'center';

    // Vertical connection strips (faint)
    ctx.strokeStyle = 'rgba(100,80,50,0.12)';
    ctx.lineWidth = 4;
    for (let c = 0; c < 10; c++) {
      const p0 = holePos('left', c, 0), p4 = holePos('left', c, 4);
      ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p4.x, p4.y); ctx.stroke();
      const p0r = holePos('right', c, 0), p4r = holePos('right', c, 4);
      ctx.beginPath(); ctx.moveTo(p0r.x, p0r.y); ctx.lineTo(p4r.x, p4r.y); ctx.stroke();
    }
    // Power rail strips
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    const pt0 = holePos('topRail', 0, 0), pt9 = holePos('topRail', 9, 0);
    ctx.beginPath(); ctx.moveTo(pt0.x, pt0.y); ctx.lineTo(pt9.x, pt9.y); ctx.stroke();
    const pb0 = holePos('botRail', 0, 0), pb9 = holePos('botRail', 9, 0);
    ctx.beginPath(); ctx.moveTo(pb0.x, pb0.y); ctx.lineTo(pb9.x, pb9.y); ctx.stroke();

    // Draw holes
    function drawHoles(section, cols, rows) {
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const p = holePos(section, c, r);
          ctx.beginPath(); ctx.arc(p.x + 1, p.y + 1, HR, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fill();
          ctx.beginPath(); ctx.arc(p.x, p.y, HR, 0, Math.PI * 2);
          ctx.fillStyle = '#b8a888'; ctx.fill();
          ctx.strokeStyle = '#9a8a6a'; ctx.lineWidth = 1; ctx.stroke();
          ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#8a7a5a'; ctx.fill();
        }
      }
    }
    drawHoles('left', 10, 5);
    drawHoles('right', 10, 5);

    // Power rail holes
    for (let c = 0; c < 10; c++) {
      [holePos('topRail', c, 0), holePos('botRail', c, 0)].forEach((p, i) => {
        ctx.beginPath(); ctx.arc(p.x + 1, p.y + 1, HR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, HR, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? '#b91c1c' : '#1e3a8a'; ctx.fill();
        ctx.strokeStyle = i === 0 ? '#7f1d1d' : '#1e3a8a'; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? '#7f1d1d' : '#0f172a'; ctx.fill();
      });
    }

    // Wires
    comps.filter(c => c.type === 'wire').forEach(c => {
      if (c._visS && c._visE) drawWire(ctx, c._visS.x, c._visS.y, c._visE.x, c._visE.y);
    });

    // Non-wire components
    comps.filter(c => c.type !== 'wire').forEach(c => {
      const isSel = c.id === selId;
      if (c.pins.length === 2) {
        const p1 = getPinPos(c, 0), p2 = getPinPos(c, 1);
        if (!p1 || !p2) return;
        switch (c.type) {
          case 'resistor': drawResistor(ctx, p1.x, p1.y, p2.x, p2.y, c.value, isSel); break;
          case 'capacitor': drawCapacitor(ctx, p1.x, p1.y, p2.x, p2.y, c.value, isSel); break;
          case 'diode': drawDiode(ctx, p1.x, p1.y, p2.x, p2.y, c.value, isSel); break;
          case 'led': drawLED(ctx, p1.x, p1.y, p2.x, p2.y, c.value, c.color, isSel); break;
          case 'battery': drawBattery(ctx, p1.x, p1.y, p2.x, p2.y, c.value, isSel); break;
        }
      } else if (c.pins.length === 3) {
        const pp = c.pins.map((_, i) => getPinPos(c, i));
        if (pp.some(p => !p)) return;
        drawTransistor(ctx, pp[0], pp[1], pp[2], c.type, c.value, isSel);
      }
    });

    // Wire start indicator
    if (mode === 'wire' && wireStart) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(wireStart.x, wireStart.y, HR + 8, 0, Math.PI * 2); ctx.stroke();
      // rubber band
      const canvasRect = canvas.getBoundingClientRect();
      const mx = (mousePos.x - canvasRect.left) * (W / canvasRect.width);
      const my2 = (mousePos.y - canvasRect.top) * (H / canvasRect.height);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(wireStart.x, wireStart.y); ctx.lineTo(mx, my2); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Placement preview
    if (mode === 'place' && placeType && preview) {
      const p = preview;
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      if (p.pins && p.pins.length === 2) {
        const mx2 = (p.pins[0].x + p.pins[1].x) / 2, my2 = (p.pins[0].y + p.pins[1].y) / 2;
        ctx.beginPath(); ctx.arc(mx2, my2, 22, 0, Math.PI * 2); ctx.stroke();
        // Draw ghost
        const def = COMP_DEFS.find(d => d.type === placeType);
        if (def) {
          ctx.globalAlpha = 0.5;
          switch (placeType) {
            case 'resistor': drawResistor(ctx, p.pins[0].x, p.pins[0].y, p.pins[1].x, p.pins[1].y, def.dVal, false); break;
            case 'capacitor': drawCapacitor(ctx, p.pins[0].x, p.pins[0].y, p.pins[1].x, p.pins[1].y, def.dVal, false); break;
            case 'diode': drawDiode(ctx, p.pins[0].x, p.pins[0].y, p.pins[1].x, p.pins[1].y, def.dVal, false); break;
            case 'led': drawLED(ctx, p.pins[0].x, p.pins[0].y, p.pins[1].x, p.pins[1].y, def.dVal, def.color, false); break;
            case 'battery': drawBattery(ctx, p.pins[0].x, p.pins[0].y, p.pins[1].x, p.pins[1].y, def.dVal, false); break;
          }
          ctx.globalAlpha = 1;
        }
      } else if (p.pins && p.pins.length === 3) {
        const mx2 = (p.pins[0].x + p.pins[1].x + p.pins[2].x) / 3;
        const my2 = (p.pins[0].y + p.pins[1].y + p.pins[2].y) / 3;
        ctx.beginPath(); ctx.arc(mx2, my2, 26, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.5;
        drawTransistor(ctx, p.pins[0], p.pins[1], p.pins[2], placeType, 100, false);
        ctx.globalAlpha = 1;
      }
      ctx.setLineDash([]);

      // snap dots
      p.pins.forEach(pin => {
        ctx.fillStyle = '#a855f7';
        ctx.beginPath(); ctx.arc(pin.x, pin.y, 5, 0, Math.PI * 2); ctx.fill();
      });
    }

    // Selected component highlight
    if (selId && mode === 'select') {
      const c = comps.find(x => x.id === selId);
      if (c && c.type !== 'wire') {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(59,130,246,0.08)';
        if (c.pins.length === 2) {
          const p1 = getPinPos(c, 0), p2 = getPinPos(c, 1);
          if (p1 && p2) {
            const mx2 = (p1.x + p2.x) / 2, my2 = (p1.y + p2.y) / 2;
            ctx.beginPath(); ctx.arc(mx2, my2, 30, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(mx2, my2, 30, 0, Math.PI * 2); ctx.stroke();
          }
        }
      }
    }

    // Voltage overlay
    if (showV && simRes) {
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      const seen = new Set();
      for (const comp of comps) {
        for (const pin of comp.pins) {
          if (seen.has(pin) || comp.type === 'wire') continue;
          seen.add(pin);
          const v = simRes.voltages[pin] || 0;
          const pos = getPinPos(comp, comp.pins.indexOf(pin));
          if (!pos) continue;
          ctx.fillStyle = Math.abs(v) > 0.1 ? '#22c55e' : '#64748b';
          const label = formatVoltage(v);
          ctx.fillText(label, pos.x, pos.y - 18);
          // small dot
          ctx.fillStyle = Math.abs(v) > 0.1 ? '#22c55e' : '#64748b';
          ctx.beginPath(); ctx.arc(pos.x, pos.y + 2, 2, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    // Status text
    ctx.fillStyle = '#64748b';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    const st = comps.length + ' component' + (comps.length !== 1 ? 's' : '');
    ctx.fillText(st, 10, 16);
    if (simRes) {
      ctx.textAlign = 'right';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Sim OK • ' + Object.keys(simRes.voltages).length + ' nodes', W - 10, 16);
    }
  }, [comps, selId, mode, wireStart, placeType, preview, showV, simRes, mousePos, orient]);

  // Animation loop
  useEffect(() => {
    let running = true;
    function loop() { if (running) { drawScene(); animRef.current = requestAnimationFrame(loop); } }
    animRef.current = requestAnimationFrame(loop);
    return () => { running = false; if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [drawScene]);

  // Update preview on mouse move
  useEffect(() => {
    if (mode !== 'place' || !placeType) { setPreview(null); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = (mousePos.x - rect.left) * (canvas.width / rect.width);
    const cy = (mousePos.y - rect.top) * (canvas.height / rect.height);
    if (cx < 0 || cx > canvas.width || cy < 0 || cy > canvas.height) { setPreview(null); return; }

    const def = COMP_DEFS.find(d => d.type === placeType);
    if (!def) return;
    if (def.pins === 2) {
      const best = findBest2Pin(cx, cy, orient);
      setPreview(best);
    } else if (def.pins === 3) {
      const best = findBest3Pin(cx, cy);
      setPreview(best);
    }
  }, [mousePos, mode, placeType, orient]);

  function handleCanvasClick(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const cy = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (mode === 'select') {
      // Try to find component at click position
      let found = null;
      for (const c of comps) {
        if (c.type === 'wire') continue;
        if (c.pins.length === 2) {
          const p1 = getPinPos(c, 0), p2 = getPinPos(c, 1);
          if (p1 && p2) {
            const mx2 = (p1.x + p2.x) / 2, my2 = (p1.y + p2.y) / 2;
            if (Math.sqrt((cx - mx2) ** 2 + (cy - my2) ** 2) < 28) found = c;
          }
        } else {
          const pp = c.pins.map((_, i) => getPinPos(c, i));
          if (pp.some(p => !p)) continue;
          const mx2 = pp.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), { x: 0, y: 0 });
          mx2.x /= 3; mx2.y /= 3;
          if (Math.sqrt((cx - mx2.x) ** 2 + (cy - mx2.y) ** 2) < 28) found = c;
        }
      }
      setSelId(found ? found.id : null);
      return;
    }

    if (mode === 'place' && placeType && preview) {
      const def = COMP_DEFS.find(d => d.type === placeType);
      if (!def) return;
      const comp = {
        id: `c${nextId}`,
        type: placeType,
        pins: preview.pins.map(p => p.node || p.pin?.node),
        value: def.dVal,
        nonlinear: def.type === 'diode' || def.type === 'led' || def.type === 'npn' || def.type === 'pnp',
        color: def.color,
        label: def.label,
      };
      setComps(prev => [...prev, comp]);
      setNextId(prev => prev + 1);
      return;
    }

    if (mode === 'wire') {
      const h = findNearestHole(cx, cy);
      if (!h) return;
      if (!wireStart) {
        setWireStart(h);
      } else {
        if (wireStart.node !== h.node) {
          const comp = {
            id: `c${nextId}`,
            type: 'wire',
            pins: [wireStart.node, h.node],
            value: 0,
            nonlinear: false,
            color: '#22c55e',
            label: 'Wire',
            _visS: { x: wireStart.x, y: wireStart.y },
            _visE: { x: h.x, y: h.y },
          };
          setComps(prev => [...prev, comp]);
          setNextId(prev => prev + 1);
        }
        setWireStart(null);
      }
      return;
    }
  }

  function handleContextMenu(e) {
    e.preventDefault();
    if (mode === 'wire' && wireStart) { setWireStart(null); return; }
    if (mode === 'place') { setPlaceType(null); setMode('select'); setPreview(null); return; }
  }

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selId) { setComps(prev => prev.filter(c => c.id !== selId)); setSelId(null); }
      }
      if (e.key === 'Escape') {
        if (wireStart) { setWireStart(null); }
        else if (mode === 'place') { setPlaceType(null); setMode('select'); setPreview(null); }
        else { setSelId(null); }
      }
      if (e.key === 'r' || e.key === 'R') {
        setOrient(prev => prev === 'h' ? 'v' : 'h');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selId, wireStart, mode]);

  function selectPlaceType(type) {
    setPlaceType(type);
    setMode('place');
    setSelId(null);
    setWireStart(null);
  }

  function clearAll() {
    setComps([]);
    setNextId(1);
    setSelId(null);
    setWireStart(null);
    setPlaceType(null);
    setMode('select');
    setPreview(null);
    setSimRes(null);
  }

  const selComp = selId ? comps.find(c => c.id === selId) : null;
  const selDef = selComp ? COMP_DEFS.find(d => d.type === selComp.type) : null;

  return (
    <div className="bb-page">
      <div className="bb-header">
        <button className="bb-back" onClick={() => navigate('/ece-hub')}><ArrowLeft size={20} /></button>
        <h1 className="bb-title">Breadboard Simulator</h1>
        <span className="bb-badge">v2 — Drag & Place</span>
        <span className="bb-hint">R to rotate · Esc to cancel · Del to delete</span>
      </div>

      <div className="bb-layout">
        <div className="bb-sidebar">
          <div className="bb-sect">
            <h3 className="bb-sect-title">Components</h3>
            {COMP_DEFS.map(def => (
              <button
                key={def.type}
                className={`bb-p-btn ${placeType === def.type && mode === 'place' ? 'on' : ''}`}
                onClick={() => selectPlaceType(def.type)}
                title={`${def.label} — ${def.pins} pins. Click board to place.`}
              >
                <span className="bb-p-icon" style={{ color: def.color }}>{def.icon}</span>
                <span className="bb-p-label">{def.label}</span>
                <span className="bb-p-pins">{def.pins}p</span>
              </button>
            ))}
          </div>

          <div className="bb-sect">
            <h3 className="bb-sect-title">Tools</h3>
            <button className={`bb-t-btn ${mode === 'select' ? 'on' : ''}`} onClick={() => { setMode('select'); setPlaceType(null); setWireStart(null); }}>
              <GripVertical size={14} /> Select
            </button>
            <button className={`bb-t-btn ${mode === 'wire' ? 'on' : ''}`} onClick={() => { setMode('wire'); setPlaceType(null); }}>
              <Wifi size={14} /> Wire
            </button>
            <button className={`bb-t-btn ${showV ? 'on' : ''}`} onClick={() => setShowV(!showV)}>
              <Eye size={14} /> {showV ? 'Hide V' : 'Show V'}
            </button>
          </div>

          <div className="bb-sect">
            <h3 className="bb-sect-title">Actions</h3>
            <button className="bb-t-btn d" onClick={() => { if (selId) { setComps(prev => prev.filter(c => c.id !== selId)); setSelId(null); } }} disabled={!selId}>
              <Trash2 size={14} /> Delete
            </button>
            <button className="bb-t-btn d" onClick={clearAll}>
              <X size={14} /> Clear All
            </button>
          </div>

          {selComp && selDef && (
            <div className="bb-config">
              <h3 className="bb-sect-title" style={{ color: '#a855f7' }}>{selComp.label}</h3>
              <label className="bb-cl">{selDef.valLabel}</label>
              <input
                type="number" className="bb-ci"
                value={selComp.value}
                onChange={e => setComps(prev => prev.map(c => c.id === selComp.id ? { ...c, value: parseFloat(e.target.value) || 0 } : c))}
                step={selDef.step} min={0}
              />
            </div>
          )}

          {simRes && (
            <div className="bb-sim">
              <h3 className="bb-sect-title"><Zap size={12} /> Voltages</h3>
              {Object.entries(simRes.voltages)
                .filter(([k]) => parseInt(k) > 0 && parseInt(k) < 23)
                .slice(0, 8)
                .map(([node, v]) => (
                  <div key={node} className="bb-sr">
                    <span className="bb-sl">{nodeLabel(parseInt(node))}</span>
                    <span className="bb-sv" style={{ color: Math.abs(v) > 0.1 ? '#22c55e' : '#64748b' }}>{formatVoltage(v)}</span>
                  </div>
                ))}
              {Object.keys(simRes.currents).filter(k => Math.abs(simRes.currents[k]) > 1e-9).length > 0 && (
                <>
                  <h3 className="bb-sect-title" style={{ marginTop: 6 }}><Zap size={12} /> Currents</h3>
                  {Object.entries(simRes.currents).filter(([, v]) => Math.abs(v) > 1e-9).slice(0, 4).map(([id, i]) => (
                    <div key={id} className="bb-sr">
                      <span className="bb-sl">{id}</span>
                      <span className="bb-sv">{formatCurrent(i)}</span>
                    </div>
                  ))}
                </>
              )}
              {simRes.error && <p className="bb-err">Circuit error</p>}
            </div>
          )}

          {comps.length === 0 && (
            <div className="bb-tip">
              <p>Click a component above, then click the breadboard to place it.</p>
              <p>Use <strong>Wire</strong> to connect holes. Press <strong>R</strong> to rotate.</p>
            </div>
          )}
        </div>

        <div className="bb-carea">
          <div className="bb-cbar">
            {mode === 'place' && placeType && (
              <span className="bb-st"><span className="bb-st-dot" /> Placing {COMP_DEFS.find(d => d.type === placeType)?.label} — click board to place · R to rotate</span>
            )}
            {mode === 'wire' && (
              <span className="bb-st"><span className="bb-st-dot g" /> {wireStart ? 'Click second hole to complete wire' : 'Click a hole to start wiring'}</span>
            )}
            {mode === 'select' && (
              <span className="bb-st"><span className="bb-st-dot b" /> Click component to select · Del to delete</span>
            )}
          </div>
          <canvas ref={canvasRef} width={CW} height={CH} className="bb-cvs" onClick={handleCanvasClick} onContextMenu={handleContextMenu} />
        </div>
      </div>
    </div>
  );
}
