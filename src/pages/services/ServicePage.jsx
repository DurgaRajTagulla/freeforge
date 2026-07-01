import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Download, ArrowLeft, Loader2, FileText } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { jsPDF } from 'jspdf';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist';
import Cropper from 'react-easy-crop';
import SnakeGame from '../games/SnakeGame';
import Game2048 from '../games/Game2048';
import SudokuGame from '../games/SudokuGame';
import MinesweeperGame from '../games/MinesweeperGame';
import HangmanGame from '../games/HangmanGame';
import WordSearchGame from '../games/WordSearchGame';
import SimonGame from '../games/SimonGame';
import WhackGame from '../games/WhackGame';
import TicTacToeGame from '../games/TicTacToeGame';
import MemoryGame from '../games/MemoryGame';
import SpinWheelGame from '../games/SpinWheelGame';
import DiceRollerGame from '../games/DiceRollerGame';
import CoinTossGame from '../games/CoinTossGame';
import TruthDareGame from '../games/TruthDareGame';
import RPSGame from '../games/RPSGame';
import CountdownTimer from '../tools/CountdownTimer';
import StopwatchTool from '../tools/StopwatchTool';
import CompassTool from '../tools/CompassTool';
import './Services.css';

const tools = {
  'image-compress': { title: 'Compress Image', desc: 'Reduce image file size while maintaining quality', category: 'image', accepts: 'image/*', multiple: false },
  'image-crop': { title: 'Crop Image', desc: 'Crop unwanted areas from your images', category: 'image', accepts: 'image/*', multiple: false },
  'image-rotate': { title: 'Rotate Image', desc: 'Rotate images clockwise or counter-clockwise', category: 'image', accepts: 'image/*', multiple: false },
  'image-convert': { title: 'JPG ↔ PNG ↔ WebP', desc: 'Convert between image formats', category: 'image', accepts: 'image/*', multiple: false },
  'add-watermark': { title: 'Add Watermark', desc: 'Add text watermark to your photos', category: 'image', accepts: 'image/*', multiple: false },
  'image-to-pdf': { title: 'Image to PDF', desc: 'Convert images to a PDF document', category: 'pdf', accepts: 'image/*', multiple: true },
  'pdf-to-image': { title: 'PDF to Image', desc: 'Extract images from PDF pages', category: 'pdf', accepts: '.pdf', multiple: false },
  'merge-pdf': { title: 'Merge PDF', desc: 'Combine multiple PDFs into one', category: 'pdf', accepts: '.pdf', multiple: true },
  'split-pdf': { title: 'Split PDF', desc: 'Split a PDF into separate pages', category: 'pdf', accepts: '.pdf', multiple: false },
  'compress-pdf': { title: 'Compress PDF', desc: 'Reduce PDF file size', category: 'pdf', accepts: '.pdf', multiple: false },
  'rotate-pdf': { title: 'Rotate PDF', desc: 'Rotate PDF pages', category: 'pdf', accepts: '.pdf', multiple: false },
  'unlock-pdf': { title: 'Unlock PDF', desc: 'Remove PDF password protection', category: 'pdf', accepts: '.pdf', multiple: false },
  'add-page-numbers': { title: 'Add Page Numbers', desc: 'Add page numbers to your PDF', category: 'pdf', accepts: '.pdf', multiple: false },
  'age-calculator': { title: 'Age Calculator', desc: 'Calculate exact age in years, months and days', category: 'utility', accepts: null, multiple: false },
  'emi-calculator': { title: 'EMI Calculator', desc: 'Calculate monthly EMI, total interest and payment', category: 'utility', accepts: null, multiple: false },
  'income-tax-calculator': { title: 'Income Tax Calculator (India)', desc: 'Calculate tax as per Indian income tax slabs', category: 'utility', accepts: null, multiple: false },
  'currency-converter': { title: 'Currency Converter', desc: 'Convert between world currencies with live rates', category: 'utility', accepts: null, multiple: false },
  'timezone-converter': { title: 'Time Zone Converter', desc: 'Convert time between different time zones', category: 'utility', accepts: null, multiple: false },
  'unit-converter': { title: 'Unit Converter', desc: 'Convert between units of length, weight, temperature and more', category: 'utility', accepts: null, multiple: false },
  'bmi-calculator': { title: 'BMI Calculator', desc: 'Calculate Body Mass Index from weight and height', category: 'utility', accepts: null, multiple: false },
  'interest-calculator': { title: 'Interest Calculator', desc: 'Simple & compound interest on borrowed money', category: 'utility', accepts: null, multiple: false },
  'browser-notepad': { title: 'Browser Notepad', desc: 'Take notes that auto-save in your browser', category: 'utility', accepts: null, multiple: false },
  'json-compare': { title: 'JSON Compare', desc: 'Compare two JSON objects side by side', category: 'utility', accepts: null, multiple: false },
  'json-parser': { title: 'JSON Parser', desc: 'Format, validate and beautify JSON', category: 'utility', accepts: null, multiple: false },
  'curl-parser': { title: 'cURL Parser', desc: 'Parse cURL commands into readable request data', category: 'utility', accepts: null, multiple: false },
  'snake-game': { title: 'Snake Game', desc: 'Classic snake game with obstacles and levels', category: 'game', accepts: null, multiple: false, howToPlay: ['Use Arrow Keys or WASD to move the snake', 'Eat food to grow longer and score points', 'Avoid hitting walls, obstacles, or yourself', '3 difficulty levels: Easy, Medium, Hard'] },
  'game-2048': { title: '2048', desc: 'Slide tiles and merge numbers to reach 2048', category: 'game', accepts: null, multiple: false, howToPlay: ['Swipe or use Arrow Keys to slide tiles', 'When two tiles with the same number touch, they merge into one', 'Create a tile with the number 2048 to win', 'Use Undo to reverse your last move'] },
  'sudoku': { title: 'Sudoku', desc: 'Logic puzzle with hints and difficulty levels', category: 'game', accepts: null, multiple: false, howToPlay: ['Fill each row, column, and 3x3 box with numbers 1-9', 'No number can repeat in any row, column, or box', 'Click a cell and type a number to fill it', 'Use Hint to reveal a correct cell when stuck'] },
  'minesweeper': { title: 'Minesweeper', desc: 'Flag all mines without detonating them', category: 'game', accepts: null, multiple: false, howToPlay: ['Left-click to reveal a cell', 'Numbers show how many mines are adjacent', 'Right-click or long-press to flag a suspected mine', 'Flag all mines to win without clicking one'] },
  'hangman': { title: 'Hangman', desc: 'Guess the word before the man is hanged', category: 'game', accepts: null, multiple: false, howToPlay: ['Click letters to guess them', 'Correct letters appear in the word, wrong ones add to the hangman', 'You have 6 wrong guesses before game over', 'Choose from 4 word categories with hints'] },
  'word-search': { title: 'Word Search', desc: 'Find hidden words in the grid', category: 'game', accepts: null, multiple: false, howToPlay: ['Click and drag across letters to select a word', 'Words can be horizontal, vertical, or diagonal', 'Found words are highlighted in the grid', 'Find all words to complete the puzzle'] },
  'simon-says': { title: 'Simon Says', desc: 'Remember and repeat color sequences', category: 'game', accepts: null, multiple: false, howToPlay: ['Watch the sequence of colors that light up', 'Repeat the sequence by clicking the buttons in order', 'Each round adds one more step to the sequence', 'Make a mistake and the game is over'] },
  'whack-a-mole': { title: 'Whack-a-Mole', desc: 'Tap moles as they pop up', category: 'game', accepts: null, multiple: false, howToPlay: ['Click or tap moles as they appear', 'Each whacked mole scores a point', 'Moles disappear quickly — be fast!', 'You have 30 seconds to get the highest score'] },
  'tic-tac-toe': { title: 'Tic-Tac-Toe', desc: 'Classic X vs O game', category: 'game', accepts: null, multiple: false, howToPlay: ['Click an empty cell to place your mark (X or O)', 'Get three in a row to win', 'Horizontal, vertical, or diagonal counts', 'Take turns with a friend or play against AI'] },
  'memory-cards': { title: 'Memory Cards', desc: 'Flip cards and find matching pairs', category: 'game', accepts: null, multiple: false, howToPlay: ['Click a card to flip it and reveal the symbol', 'Click a second card to find a match', 'If they match, both stay face-up', 'Match all pairs in the fewest moves possible'] },
  'spin-wheel': { title: 'Spin Wheel', desc: 'Custom spin wheel with any items', category: 'game', accepts: null, multiple: false, howToPlay: ['Add your own items using the input box below the wheel', 'Click Spin to randomly select an item', 'Remove items by clicking the × on their tag', 'Up to 16 segments supported'] },
  'dice-roller': { title: 'Dice Roller', desc: 'Roll 1-6 dice with history', category: 'game', accepts: null, multiple: false, howToPlay: ['Select how many dice to roll (1-6)', 'Click Roll to roll all dice', 'View the total and roll history below', 'Track your cumulative score across rolls'] },
  'coin-toss': { title: 'Coin Toss', desc: 'Heads or tails with streak stats', category: 'game', accepts: null, multiple: false, howToPlay: ['Click the coin or press Space to flip', 'Choose Heads or Tails before flipping', 'Track your streak of consecutive correct guesses', 'View flip history and streak stats'] },
  'truth-or-dare': { title: 'Truth or Dare', desc: 'Truth or Dare challenges for groups', category: 'game', accepts: null, multiple: false, howToPlay: ['Choose Truth for a question or Dare for a challenge', 'Click the button to get a random prompt', 'Add custom truths and dares of your own', 'Great for parties and group gatherings'] },
  'rock-paper-scissors': { title: 'Rock Paper Scissors', desc: 'Beat the computer', category: 'game', accepts: null, multiple: false, howToPlay: ['Click Rock, Paper, or Scissors to make your choice', 'Computer makes a random choice', 'Rock beats Scissors, Scissors beats Paper, Paper beats Rock', 'Track wins, losses, and ties'] },
  'countdown-timer': { title: 'Countdown Timer', desc: 'Set a countdown alarm', category: 'utility', accepts: null, multiple: false },
  'stopwatch': { title: 'Stopwatch', desc: 'Precision stopwatch with laps', category: 'utility', accepts: null, multiple: false },
  'compass': { title: 'Compass', desc: 'Digital compass using device orientation', category: 'utility', accepts: null, multiple: false },
};

function ServicePage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const tool = tools[toolId];
  const inputRef = useRef(null);
  const canvasRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputName, setOutputName] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  // Compress options
  const [targetSizeKB, setTargetSizeKB] = useState(100);
  const [compressMaxWidth, setCompressMaxWidth] = useState(1920);
  const [quality, setQuality] = useState(80);

  // Crop options
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [cropZoom, setCropZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropAspect, setCropAspect] = useState('free');
  const aspectMap = { free: undefined, '1/1': 1, '4/3': 4/3, '16/9': 16/9, '3/2': 3/2 };
  const onCropComplete = useCallback((_, pixels) => setCroppedAreaPixels(pixels), []);

  // Rotate options
  const [rotateAngle, setRotateAngle] = useState(90);

  // Convert options
  const [outputFormat, setOutputFormat] = useState('image/jpeg');

  // Watermark options

  const [watermarkText, setWatermarkText] = useState('Watermark');
  const [watermarkSize, setWatermarkSize] = useState(48);
  const [watermarkPos, setWatermarkPos] = useState('bottom-right');
  const [watermarkColor, setWatermarkColor] = useState('#ffffff');
  const watermarkPreviewRef = useRef(null);

  // Utility tool state
  const [birthDate, setBirthDate] = useState('');
  const [ageResult, setAgeResult] = useState(null);
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(12);
  const [emiResult, setEmiResult] = useState(null);
  const [taxIncome, setTaxIncome] = useState(500000);
  const [taxRegime, setTaxRegime] = useState('old');
  const [taxAgeGroup, setTaxAgeGroup] = useState('below60');
  const [taxResult, setTaxResult] = useState(null);
  const [currencyAmount, setCurrencyAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [convLoading, setConvLoading] = useState(false);
  const [tzDateTime, setTzDateTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [fromTz, setFromTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [toTz, setToTz] = useState('Asia/Kolkata');
  const [convertedTime, setConvertedTime] = useState(null);
  const [unitCategory, setUnitCategory] = useState('length');
  const [unitValue, setUnitValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [unitResult, setUnitResult] = useState(null);

  // BMI Calculator
  const [bmiWeight, setBmiWeight] = useState(70);
  const [bmiHeight, setBmiHeight] = useState(170);
  const [bmiResult, setBmiResult] = useState(null);

  // Interest Calculator
  const [intTakenDate, setIntTakenDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [intAmount, setIntAmount] = useState('');
  const [intRate, setIntRate] = useState('');
  const [intResult, setIntResult] = useState(null);

  // Notepad
  const [notepadText, setNotepadText] = useState(() => localStorage.getItem('freeforge_notepad') || '');
  const [notepadStatus, setNotepadStatus] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('freeforge_notepad', notepadText);
      setNotepadStatus('Saved');
      setTimeout(() => setNotepadStatus(''), 2000);
    }, 500);
    return () => clearTimeout(timer);
  }, [notepadText]);

  // JSON Compare
  const [jsonA, setJsonA] = useState('');
  const [jsonB, setJsonB] = useState('');
  const [jsonDiff, setJsonDiff] = useState(null);

  // JSON Parser
  const [jsonParserInput, setJsonParserInput] = useState('');
  const [jsonParserOutput, setJsonParserOutput] = useState('');
  const [jsonParserError, setJsonParserError] = useState('');

  // cURL Parser
  const [curlInput, setCurlInput] = useState('');
  const [curlParsed, setCurlParsed] = useState(null);

  function formatIndianNumber(num) {
    const n = parseFloat(num);
    if (isNaN(n)) return num;
    const isDecimal = num.toString().includes('.');
    const parts = num.toString().split('.');
    let intPart = parts[0];
    const decPart = parts[1];
    const isNeg = intPart.startsWith('-');
    if (isNeg) intPart = intPart.slice(1);
    let result = '';
    const len = intPart.length;
    if (len <= 3) {
      result = intPart;
    } else {
      result = intPart.slice(-3);
      let remaining = intPart.slice(0, -3);
      while (remaining.length > 2) {
        result = remaining.slice(-2) + ',' + result;
        remaining = remaining.slice(0, -2);
      }
      if (remaining.length > 0) result = remaining + ',' + result;
    }
    if (isNeg) result = '-' + result;
    if (isDecimal) result += '.' + decPart;
    return result;
  }

  function deepDiff(a, b, path = '') {
    if (a === b) return [];
    if (typeof a !== typeof b || (typeof a !== 'object') || a === null || b === null) {
      return [{ type: 'changed', path: path || '(root)', from: a, to: b }];
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      const diffs = [];
      const len = Math.max(a.length, b.length);
      for (let i = 0; i < len; i++) {
        const p = `${path}[${i}]`;
        if (i >= a.length) diffs.push({ type: 'added', path: p, value: b[i] });
        else if (i >= b.length) diffs.push({ type: 'removed', path: p, value: a[i] });
        else diffs.push(...deepDiff(a[i], b[i], p));
      }
      return diffs;
    }
    const diffs = [];
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of allKeys) {
      const p = path ? `${path}.${k}` : k;
      if (!(k in a)) diffs.push({ type: 'added', path: p, value: b[k] });
      else if (!(k in b)) diffs.push({ type: 'removed', path: p, value: a[k] });
      else diffs.push(...deepDiff(a[k], b[k], p));
    }
    return diffs;
  }

  function parseCurl(cmd) {
    const result = { method: 'GET', url: '', headers: {}, body: '', cookies: '', user: '', compressed: false, insecure: false, followRedirects: false };
    let rest = cmd.trim();
    rest = rest.replace(/^curl\s+/i, '');
    const parts = [];
    const re = /(?:'[^']*'|"[^"]*"|\[[^\]]*\]|\S+)/g;
    let m;
    while ((m = re.exec(rest)) !== null) parts.push(m[0]);
    let i = 0;
    const shift = () => parts[i++];
    while (i < parts.length) {
      const token = shift();
      if (token === '-X' || token === '--request') { result.method = (shift() || '').toUpperCase(); }
      else if (token === '-H' || token === '--header') {
        const h = (shift() || '').replace(/^['"]|['"]$/g, '');
        const colon = h.indexOf(':');
        if (colon > 0) result.headers[h.slice(0, colon).trim()] = h.slice(colon + 1).trim();
      }
      else if (token === '-d' || token === '--data' || token === '--data-raw' || token === '--data-binary' || token === '--data-urlencode') {
        result.body = (shift() || '').replace(/^['"]|['"]$/g, '');
        if (!result.method || result.method === 'GET') result.method = 'POST';
      }
      else if (token === '-b' || token === '--cookie') { result.cookies = (shift() || '').replace(/^['"]|['"]$/g, ''); }
      else if (token === '-u' || token === '--user') { result.user = (shift() || '').replace(/^['"]|['"]$/g, ''); }
      else if (token === '-A' || token === '--user-agent') { result.headers['User-Agent'] = (shift() || '').replace(/^['"]|['"]$/g, ''); }
      else if (token === '--compressed') { result.compressed = true; }
      else if (token === '-k' || token === '--insecure') { result.insecure = true; }
      else if (token === '-L' || token === '--follow') { result.followRedirects = true; }
      else if (token === '--connect-timeout' || token === '-m' || token === '--max-time') { shift(); }
      else if (token.startsWith('-')) { shift(); }
      else { result.url = token.replace(/^['"]|['"]$/g, ''); }
    }
    return result;
  }

  function curlToFetch(parsed) {
    let code = `fetch("${parsed.url}"`;
    const opts = [];
    if (parsed.method !== 'GET') opts.push(`method: "${parsed.method}"`);
    if (Object.keys(parsed.headers).length > 0) {
      const h = Object.entries(parsed.headers).map(([k, v]) => `    "${k}": "${v}"`).join(',\n');
      opts.push(`headers: {\n${h}\n  }`);
    }
    if (parsed.body) opts.push(`body: JSON.stringify(${parsed.body})`);
    if (parsed.followRedirects) opts.push(`redirect: "follow"`);
    if (opts.length > 0) code += `, {\n  ${opts.join(',\n  ')}\n}`;
    code += `);`;
    return code;
  }

  function getTzOffsetMinutes(tz, date = new Date()) {
    try {
      const parts = new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'longOffset' }).formatToParts(date);
      const off = parts.find(p => p.type === 'timeZoneName')?.value || '';
      const m = off.match(/GMT([+-])(\d{2}):(\d{2})/);
      if (!m) return 0;
      return (m[1] === '+' ? 1 : -1) * (parseInt(m[2]) * 60 + parseInt(m[3]));
    } catch { return 0; }
  }

  function hexToRgba(hex, alpha) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // PDF password
  const [pdfPassword, setPdfPassword] = useState('');

  // Page numbers options
  const [pageNumStart, setPageNumStart] = useState(1);

  // Auto-rotate: live preview on angle change
  const rotatePreviewRef = useRef(null);
  const firstPreview = previewUrls[0];
  useEffect(() => {
    if (toolId !== 'image-rotate' || !firstPreview || !rotatePreviewRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        const img = await loadImg(firstPreview);
        if (cancelled) return;
        const canvas = rotatePreviewRef.current;
        const angle = rotateAngle * Math.PI / 180;
        const sin = Math.abs(Math.sin(angle)), cos = Math.abs(Math.cos(angle));
        canvas.width = img.width * cos + img.height * sin;
        canvas.height = img.width * sin + img.height * cos;
        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, files[0]?.type || 'image/jpeg'));
        if (cancelled || !blob) return;
        if (outputUrl) URL.revokeObjectURL(outputUrl);
        setOutputUrl(URL.createObjectURL(blob));
        setOutputName('rotated_' + files[0].name);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [toolId, rotateAngle, firstPreview, files, outputUrl, previewUrls]);

  // Auto-watermark: live preview on text/size/position change
  const firstWatermarkPreview = previewUrls[0];
  useEffect(() => {
    if (toolId !== 'add-watermark' || !firstWatermarkPreview || !watermarkPreviewRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        const img = await loadImg(firstWatermarkPreview);
        if (cancelled) return;
        const canvas = watermarkPreviewRef.current;
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        ctx.font = watermarkSize + 'px Arial';
        ctx.fillStyle = hexToRgba(watermarkColor, 0.6);
        ctx.textAlign = 'center';
        const positions = { 'center': [canvas.width / 2, canvas.height / 2], 'top-left': [40, watermarkSize + 20], 'top-right': [canvas.width - 40, watermarkSize + 20], 'bottom-left': [40, canvas.height - 30], 'bottom-right': [canvas.width - 40, canvas.height - 30] };
        const [px, py] = positions[watermarkPos] || positions['bottom-right'];
        ctx.fillText(watermarkText || 'Watermark', px, py);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, files[0]?.type || 'image/jpeg'));
        if (cancelled || !blob) return;
        if (outputUrl) URL.revokeObjectURL(outputUrl);
        setOutputUrl(URL.createObjectURL(blob));
        setOutputName('wm_' + files[0].name);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [toolId, watermarkText, watermarkSize, watermarkPos, watermarkColor, firstWatermarkPreview, files, outputUrl, previewUrls]);

  if (!tool) {
    return (
      <div className="service-page">
        <div className="service-error">
          <h1>Tool not found</h1>
          <button className="back-btn" onClick={() => navigate('/')}><ArrowLeft size={20} /></button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(prev => tool.multiple ? [...prev, ...selected] : selected);
    setOutputUrl(null);
    const urls = selected.map(f => URL.createObjectURL(f));
    setPreviewUrls(prev => tool.multiple ? [...prev, ...urls] : urls);
    if (e.target) e.target.value = '';
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => { URL.revokeObjectURL(prev[index]); return prev.filter((_, i) => i !== index); });
    setOutputUrl(null);
  };

  const handleClearAll = () => {
    previewUrls.forEach(u => URL.revokeObjectURL(u));
    setFiles([]); setPreviewUrls([]); setOutputUrl(null);
  };

  const loadImg = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

  const canvasToBlob = (canvas, mimeType) => new Promise(resolve => canvas.toBlob(resolve, mimeType));

  const handleProcess = async () => {
    if (!files.length) return;
    setLoading(true);
    try {
      switch (toolId) {
        case 'image-compress': {
          const compressed = await imageCompression(files[0], {
            maxSizeMB: targetSizeKB / 1024, maxWidthOrHeight: compressMaxWidth,
            quality: quality / 100, useWebWorker: true,
          });
          setOutputUrl(URL.createObjectURL(compressed));
          setOutputName('compressed_' + files[0].name);
          break;
        }
        case 'image-crop': {
          const img = await loadImg(previewUrls[0]);
          const canvas = canvasRef.current;
          const { x, y, width, height } = croppedAreaPixels;
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(img, x, y, width, height, 0, 0, width, height);
          const blob = await canvasToBlob(canvas, files[0].type || 'image/jpeg');
          if (blob) { setOutputUrl(URL.createObjectURL(blob)); setOutputName('cropped_' + files[0].name); }
          break;
        }
        case 'image-rotate': {
          const img = await loadImg(previewUrls[0]);
          const canvas = canvasRef.current;
          const angle = rotateAngle * Math.PI / 180;
          const sin = Math.abs(Math.sin(angle)), cos = Math.abs(Math.cos(angle));
          canvas.width = img.width * cos + img.height * sin;
          canvas.height = img.width * sin + img.height * cos;
          const ctx = canvas.getContext('2d');
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(angle);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          const blob = await canvasToBlob(canvas, files[0].type || 'image/jpeg');
          if (blob) { setOutputUrl(URL.createObjectURL(blob)); setOutputName('rotated_' + files[0].name); }
          break;
        }
        case 'image-convert': {
          const img = await loadImg(previewUrls[0]);
          const canvas = canvasRef.current;
          canvas.width = img.width; canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
          const mimeType = outputFormat;
          const ext = mimeType.split('/')[1];
          const blob = await canvasToBlob(canvas, mimeType);
          if (blob) { setOutputUrl(URL.createObjectURL(blob)); setOutputName(files[0].name.replace(/\.[^.]+$/, '') + '.' + ext); }
          break;
        }
        case 'add-watermark': {
          const img = await loadImg(previewUrls[0]);
          const canvas = canvasRef.current;
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          ctx.font = watermarkSize + 'px Arial';
          ctx.fillStyle = hexToRgba(watermarkColor, 0.6);
          ctx.textAlign = 'center';
          const positions = { 'center': [canvas.width / 2, canvas.height / 2], 'top-left': [40, watermarkSize + 20], 'top-right': [canvas.width - 40, watermarkSize + 20], 'bottom-left': [40, canvas.height - 30], 'bottom-right': [canvas.width - 40, canvas.height - 30] };
          const [px, py] = positions[watermarkPos] || positions['bottom-right'];
          ctx.fillText(watermarkText || 'Watermark', px, py);
          const blob = await canvasToBlob(canvas, files[0].type || 'image/jpeg');
          if (blob) { setOutputUrl(URL.createObjectURL(blob)); setOutputName('wm_' + files[0].name); }
          break;
        }
        case 'image-to-pdf': {
          const pdf = new jsPDF('portrait', 'mm', 'a4');
          for (let i = 0; i < files.length; i++) {
            const imgUrl = await fileToDataUrl(files[i]);
            if (i > 0) pdf.addPage();
            pdf.addImage(imgUrl, 'JPEG', 10, 10, 190, 0);
          }
          setOutputUrl(URL.createObjectURL(pdf.output('blob')));
          setOutputName('images.pdf');
          break;
        }
        case 'pdf-to-image': {
          const bytes = await files[0].arrayBuffer();
          const pdf = await getDocument({ data: bytes }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = canvasRef.current;
          canvas.width = viewport.width; canvas.height = viewport.height;
          await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
          const blob = await canvasToBlob(canvas, 'image/png');
          if (blob) { setOutputUrl(URL.createObjectURL(blob)); setOutputName(files[0].name.replace(/\.[^.]+$/, '') + '.png'); }
          break;
        }
        case 'merge-pdf': {
          const merged = await PDFDocument.create();
          for (const file of files) {
            const bytes = await file.arrayBuffer();
            const srcPdf = await PDFDocument.load(bytes);
            const pages = await merged.copyPages(srcPdf, srcPdf.getPageIndices());
            pages.forEach(p => merged.addPage(p));
          }
          const saved = await merged.save();
          setOutputUrl(URL.createObjectURL(new Blob([saved], { type: 'application/pdf' })));
          setOutputName('merged.pdf');
          break;
        }
        case 'split-pdf': {
          const bytes = await files[0].arrayBuffer();
          const pdf = await PDFDocument.load(bytes);
          if (pdf.getPageCount() > 1) {
            const firstPdf = await PDFDocument.create();
            const [firstPage] = await firstPdf.copyPages(pdf, [0]);
            firstPdf.addPage(firstPage);
            setOutputUrl(URL.createObjectURL(new Blob([await firstPdf.save()], { type: 'application/pdf' })));
            setOutputName('page_1_' + files[0].name);
          } else {
            setOutputUrl(URL.createObjectURL(files[0]));
            setOutputName(files[0].name);
          }
          break;
        }
        case 'compress-pdf': {
          const bytes = await files[0].arrayBuffer();
          const pdf = await PDFDocument.load(bytes);
          const saved = await pdf.save({ useObjectStreams: true });
          setOutputUrl(URL.createObjectURL(new Blob([saved], { type: 'application/pdf' })));
          setOutputName('compressed_' + files[0].name);
          break;
        }
        case 'rotate-pdf': {
          const bytes = await files[0].arrayBuffer();
          const pdf = await PDFDocument.load(bytes);
          pdf.getPages().forEach(p => p.setRotation({ angle: 90 }));
          const saved = await pdf.save();
          setOutputUrl(URL.createObjectURL(new Blob([saved], { type: 'application/pdf' })));
          setOutputName('rotated_' + files[0].name);
          break;
        }
        case 'unlock-pdf': {
          const bytes = await files[0].arrayBuffer();
          const pdf = await PDFDocument.load(bytes, { password: pdfPassword });
          const saved = await pdf.save();
          setOutputUrl(URL.createObjectURL(new Blob([saved], { type: 'application/pdf' })));
          setOutputName('unlocked_' + files[0].name);
          break;
        }
        case 'add-page-numbers': {
          const bytes = await files[0].arrayBuffer();
          const pdf = await PDFDocument.load(bytes);
          const font = await pdf.embedFont(StandardFonts.Helvetica);
          pdf.getPages().forEach((page, i) => {
            const { width } = page.getSize();
            page.drawText(String(pageNumStart + i), { x: width / 2 - 5, y: 20, size: 10, font, color: rgb(0, 0, 0) });
          });
          const saved = await pdf.save();
          setOutputUrl(URL.createObjectURL(new Blob([saved], { type: 'application/pdf' })));
          setOutputName('numbered_' + files[0].name);
          break;
        }
      }
    } catch (err) {
      console.error('Process error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (outputUrl) {
      const a = document.createElement('a');
      a.href = outputUrl;
      a.download = outputName;
      a.click();
    }
  };

  return (
    <div className="service-page">
      <div className="service-page-header">
        <button className="back-btn" onClick={() => navigate(tool.category === 'game' ? '/games' : '/services')}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>{tool.title}</h1>
          <p>{tool.desc}</p>
          {tool.howToPlay && (
            <button className="guide-toggle" onClick={() => setShowGuide(true)}>
              How to Play
            </button>
          )}
        </div>
      </div>
      {tool.howToPlay && showGuide && (
        <div className="guide-overlay" onClick={() => setShowGuide(false)}>
          <div className="guide-panel" onClick={e => e.stopPropagation()}>
            <div className="guide-panel-header">
              <h3>How to Play</h3>
              <button className="guide-close" onClick={() => setShowGuide(false)}>×</button>
            </div>
            <ul>
              {tool.howToPlay.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="service-body">
        {tool.category !== 'utility' && tool.category !== 'game' && (
          <div className="service-upload">
            <div className="upload-area" onClick={() => inputRef.current?.click()}>
              <Upload size={40} />
              <p>Click to upload{tool.multiple ? ' (multiple files)' : ''}</p>
              <span className="upload-hint">{tool.category === 'pdf' ? 'PDF files' : 'Images'} accepted</span>
              <input ref={inputRef} type="file" accept={tool.accepts} multiple={tool.multiple} onChange={handleFileChange} hidden />
            </div>
            {previewUrls.length > 0 && (
              <div className="file-list">
                {previewUrls.map((url, i) => (
                  <div key={i} className="file-item">
                    {tool.category === 'image' ? <img src={url} alt="" className="file-preview" /> : <FileText size={32} />}
                    <span className="file-name">{files[i]?.name}</span>
                    <button className="file-remove" onClick={() => handleRemoveFile(i)} title="Remove file">&times;</button>
                  </div>
                ))}
                {previewUrls.length > 1 && <button className="clear-all-btn" onClick={handleClearAll}>Clear All</button>}
              </div>
            )}
          </div>
        )}

        {toolId === 'image-compress' && (
          <div className="tool-options">
            <h3 className="options-title">Compression Options</h3>
            <div className="options-grid">
              <div className="option-item">
                <label>Target Size (KB)</label>
                <input type="number" className="option-input" value={targetSizeKB} onChange={e => setTargetSizeKB(Math.max(1, Number(e.target.value)))} min={1} max={10000} />
                <span className="option-hint">Approximate target file size</span>
              </div>
              <div className="option-item">
                <label>Max Width (px)</label>
                <input type="number" className="option-input" value={compressMaxWidth} onChange={e => setCompressMaxWidth(Math.max(100, Number(e.target.value)))} min={100} max={10000} />
                <span className="option-hint">Resize to fit within this width</span>
              </div>
              <div className="option-item">
                <label>Quality: {quality}%</label>
                <input type="range" className="option-slider" value={quality} onChange={e => setQuality(Number(e.target.value))} min={1} max={100} />
                <span className="option-hint">Lower = smaller file, higher = better quality</span>
              </div>
            </div>
          </div>
        )}

        {toolId === 'image-crop' && previewUrls[0] && (
          <>
            <div className="crop-container">
              <Cropper
                image={previewUrls[0]}
                crop={crop}
                zoom={cropZoom}
                aspect={aspectMap[cropAspect]}
                onCropChange={setCrop}
                onZoomChange={setCropZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="tool-options">
              <h3 className="options-title">Crop Options</h3>
              <div className="options-grid">
                <div className="option-item">
                  <label>Aspect Ratio</label>
                  <select className="option-input" value={cropAspect} onChange={e => setCropAspect(e.target.value)}>
                    <option value="free">Free</option>
                    <option value="1/1">1:1</option>
                    <option value="4/3">4:3</option>
                    <option value="16/9">16:9</option>
                    <option value="3/2">3:2</option>
                  </select>
                </div>
                <div className="option-item">
                  <label>Zoom: {cropZoom.toFixed(1)}x</label>
                  <input type="range" className="option-slider" min={1} max={3} step={0.1} value={cropZoom} onChange={e => setCropZoom(Number(e.target.value))} />
                </div>
              </div>
            </div>
          </>
        )}

        {toolId === 'image-rotate' && previewUrls[0] && (
          <>
            <div className="rotate-preview-area">
              <canvas ref={rotatePreviewRef} className="rotate-canvas" />
            </div>
            <div className="tool-options">
              <h3 className="options-title">Rotate Options</h3>
              <div className="options-grid">
                <div className="option-item">
                  <label>Angle</label>
                  <select className="option-input" value={rotateAngle} onChange={e => setRotateAngle(Number(e.target.value))}>
                    <option value={90}>90° Clockwise</option>
                    <option value={180}>180°</option>
                    <option value={270}>90° Counter-clockwise</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {toolId === 'image-convert' && (
          <div className="tool-options">
            <h3 className="options-title">Convert Options</h3>
            <div className="options-grid">
              <div className="option-item">
                <label>Output Format</label>
                <select className="option-input" value={outputFormat} onChange={e => setOutputFormat(e.target.value)}>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {toolId === 'add-watermark' && previewUrls[0] && (
          <>
            <div className="watermark-preview-area">
              <canvas ref={watermarkPreviewRef} className="watermark-canvas" />
            </div>
            <div className="tool-options">
              <h3 className="options-title">Watermark Options</h3>
              <div className="options-grid">
                <div className="option-item">
                  <label>Text</label>
                  <input type="text" className="option-input" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} placeholder="Enter watermark text" />
                </div>
                <div className="option-item">
                  <label>Font Size</label>
                  <input type="number" className="option-input" value={watermarkSize} onChange={e => setWatermarkSize(Math.max(8, Number(e.target.value)))} min={8} max={200} />
                </div>
                <div className="option-item">
                  <label>Position</label>
                  <select className="option-input" value={watermarkPos} onChange={e => setWatermarkPos(e.target.value)}>
                    <option value="center">Center</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>
                <div className="option-item">
                  <label>Color</label>
                  <div className="color-picker-row">
                    <input type="color" className="color-picker" value={watermarkColor} onChange={e => setWatermarkColor(e.target.value)} />
                    <div className="color-presets">
                      {['#ffffff','#000000','#ff0000','#00cc00','#0066ff','#ffff00','#ff00ff','#00cccc'].map(c => (
                        <button key={c} className="color-swatch" style={{ background: c }} onClick={() => setWatermarkColor(c)} title={c} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {toolId === 'unlock-pdf' && (
          <div className="tool-options">
            <h3 className="options-title">Unlock Options</h3>
            <div className="options-grid">
              <div className="option-item">
                <label>Password</label>
                <input type="password" className="option-input" value={pdfPassword} onChange={e => setPdfPassword(e.target.value)} placeholder="Enter PDF password" />
              </div>
            </div>
          </div>
        )}

        {toolId === 'add-page-numbers' && (
          <div className="tool-options">
            <h3 className="options-title">Page Number Options</h3>
            <div className="options-grid">
              <div className="option-item">
                <label>Starting Number</label>
                <input type="number" className="option-input" value={pageNumStart} onChange={e => setPageNumStart(Math.max(1, Number(e.target.value)))} min={1} />
              </div>
            </div>
          </div>
        )}

        {/* --- Age Calculator --- */}
        {toolId === 'age-calculator' && (
          <div className="utility-tool">
            <div className="tool-options">
              <h3 className="options-title">Enter Date of Birth</h3>
              <div className="options-grid">
                <div className="option-item">
                  <label>Date of Birth</label>
                  <input type="date" className="option-input" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="service-actions">
              <button className="process-btn" onClick={() => {
                if (!birthDate) return;
                const b = new Date(birthDate), t = new Date();
                let y = t.getFullYear() - b.getFullYear();
                let m = t.getMonth() - b.getMonth();
                let d = t.getDate() - b.getDate();
                if (d < 0) { m--; d += new Date(t.getFullYear(), t.getMonth(), 0).getDate(); }
                if (m < 0) { y--; m += 12; }
                setAgeResult({ y, m, d });
              }}>Calculate Age</button>
            </div>
            {ageResult && (
              <div className="utility-result">
                <div className="result-grid">
                  <div className="result-card"><span className="result-value">{ageResult.y}</span><span className="result-label">Years</span></div>
                  <div className="result-card"><span className="result-value">{ageResult.m}</span><span className="result-label">Months</span></div>
                  <div className="result-card"><span className="result-value">{ageResult.d}</span><span className="result-label">Days</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- EMI Calculator --- */}
        {toolId === 'emi-calculator' && (
          <div className="utility-tool">
            <div className="tool-options">
              <h3 className="options-title">Loan Details</h3>
              <div className="options-grid">
                <div className="option-item"><label>Loan Amount (₹)</label><input type="number" className="option-input" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} min={0} /></div>
                <div className="option-item"><label>Annual Interest Rate (%)</label><input type="number" className="option-input" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} min={0} step={0.1} /></div>
                <div className="option-item"><label>Tenure (months)</label><input type="number" className="option-input" value={loanTenure} onChange={e => setLoanTenure(Math.max(1, Number(e.target.value)))} min={1} /></div>
              </div>
            </div>
            <div className="service-actions">
              <button className="process-btn" onClick={() => {
                const P = loanAmount, r = interestRate / 12 / 100, n = loanTenure;
                if (!P || !r || !n) return;
                const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
                const tp = emi * n, ti = tp - P;
                setEmiResult({ emi: Math.round(emi), tp: Math.round(tp), ti: Math.round(ti) });
              }}>Calculate EMI</button>
            </div>
            {emiResult && (
              <div className="utility-result">
                <div className="result-grid">
                  <div className="result-card highlight"><span className="result-value">₹{emiResult.emi.toLocaleString()}</span><span className="result-label">Monthly EMI</span></div>
                  <div className="result-card"><span className="result-value">₹{emiResult.ti.toLocaleString()}</span><span className="result-label">Total Interest</span></div>
                  <div className="result-card"><span className="result-value">₹{emiResult.tp.toLocaleString()}</span><span className="result-label">Total Payment</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Income Tax Calculator (India) --- */}
        {toolId === 'income-tax-calculator' && (
          <div className="utility-tool">
            <div className="tool-options">
              <h3 className="options-title">Income Details</h3>
              <div className="options-grid">
                <div className="option-item"><label>Annual Income (₹)</label><input type="number" className="option-input" value={taxIncome} onChange={e => setTaxIncome(Math.max(0, Number(e.target.value)))} min={0} /></div>
                <div className="option-item full-width">
                  <label>Tax Regime</label>
                  <div className="toggle-group">
                    <button className={`toggle-btn ${taxRegime === 'old' ? 'active' : ''}`} onClick={() => setTaxRegime('old')}>Old Regime</button>
                    <button className={`toggle-btn ${taxRegime === 'new' ? 'active' : ''}`} onClick={() => setTaxRegime('new')}>New Regime</button>
                  </div>
                </div>
                {taxRegime === 'old' && (
                  <div className="option-item"><label>Age Group</label><select className="option-input" value={taxAgeGroup} onChange={e => setTaxAgeGroup(e.target.value)}>
                    <option value="below60">Below 60 years</option><option value="senior">60-80 years (Senior Citizen)</option><option value="supersenior">Above 80 years (Super Senior)</option>
                  </select></div>
                )}
              </div>
            </div>
            <div className="service-actions">
              <button className="process-btn" onClick={() => {
                const inc = taxIncome;
                let slabs, rebateLimit, rebateIncomeLimit;
                if (taxRegime === 'old') {
                  slabs = taxAgeGroup === 'supersenior'
                    ? [{min:0,max:500000,rate:0,label:'₹0 - ₹5L'},{min:500000,max:1000000,rate:20,label:'₹5L - ₹10L'},{min:1000000,max:Infinity,rate:30,label:'Above ₹10L'}]
                    : taxAgeGroup === 'senior'
                    ? [{min:0,max:300000,rate:0,label:'₹0 - ₹3L'},{min:300000,max:500000,rate:5,label:'₹3L - ₹5L'},{min:500000,max:1000000,rate:20,label:'₹5L - ₹10L'},{min:1000000,max:Infinity,rate:30,label:'Above ₹10L'}]
                    : [{min:0,max:250000,rate:0,label:'₹0 - ₹2.5L'},{min:250000,max:500000,rate:5,label:'₹2.5L - ₹5L'},{min:500000,max:1000000,rate:20,label:'₹5L - ₹10L'},{min:1000000,max:Infinity,rate:30,label:'Above ₹10L'}];
                  rebateLimit = 12500;
                  rebateIncomeLimit = 500000;
                } else {
                  slabs = [
                    {min:0,max:400000,rate:0,label:'₹0 - ₹4L'},
                    {min:400000,max:800000,rate:5,label:'₹4L - ₹8L'},
                    {min:800000,max:1200000,rate:10,label:'₹8L - ₹12L'},
                    {min:1200000,max:1600000,rate:15,label:'₹12L - ₹16L'},
                    {min:1600000,max:2000000,rate:20,label:'₹16L - ₹20L'},
                    {min:2000000,max:2400000,rate:25,label:'₹20L - ₹24L'},
                    {min:2400000,max:Infinity,rate:30,label:'Above ₹24L'}
                  ];
                  rebateLimit = 60000;
                  rebateIncomeLimit = 1200000;
                }
                const details = slabs.map(s => {
                  const taxable = Math.max(0, Math.min(inc, s.max) - s.min);
                  return { ...s, taxable, tax: taxable * s.rate / 100 };
                });
                let totalTax = details.reduce((s, d) => s + d.tax, 0);
                let rebate = 0, marginalRelief = 0;
                if (taxRegime === 'new' && inc > rebateIncomeLimit) {
                  const excess = inc - rebateIncomeLimit;
                  if (totalTax > excess) marginalRelief = totalTax - excess;
                }
                if (inc <= rebateIncomeLimit) rebate = Math.min(totalTax, rebateLimit);
                totalTax = Math.max(0, totalTax - rebate - marginalRelief);
                const cess = totalTax * 0.04;
                const regimeName = taxRegime === 'old' ? 'Old Regime' : 'New Regime';
                setTaxResult({
                  regime: regimeName,
                  details: details.filter(d => d.taxable > 0),
                  rebate: Math.round(rebate),
                  marginalRelief: Math.round(marginalRelief),
                  tax: Math.round(totalTax),
                  cess: Math.round(cess),
                  total: Math.round(totalTax + cess)
                });
              }}>Calculate Tax</button>
            </div>
            {taxResult && (
              <div className="utility-result">
                <div className="tax-breakdown">
                  <div className="tax-regime-badge">{taxResult.regime}</div>
                  <table className="tax-table">
                    <thead><tr><th>Slab</th><th>Rate</th><th>Taxable Amount</th><th>Tax</th></tr></thead>
                    <tbody>
                      {taxResult.details.map((d, i) => (
                        <tr key={i}>
                          <td>{d.label}</td>
                          <td>{d.rate}%</td>
                          <td>₹{d.taxable.toLocaleString()}</td>
                          <td>₹{Math.round(d.tax).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {taxResult.rebate > 0 && (
                    <div className="tax-rebate">Section 87A Rebate: -₹{taxResult.rebate.toLocaleString()}</div>
                  )}
                  {taxResult.marginalRelief > 0 && (
                    <div className="tax-rebate marginal-relief">Marginal Relief: -₹{taxResult.marginalRelief.toLocaleString()}</div>
                  )}
                  <div className="result-grid">
                    <div className="result-card highlight"><span className="result-value">₹{taxResult.tax.toLocaleString()}</span><span className="result-label">Income Tax</span></div>
                    <div className="result-card"><span className="result-value">₹{taxResult.cess.toLocaleString()}</span><span className="result-label">Health & Education Cess (4%)</span></div>
                    <div className="result-card"><span className="result-value">₹{taxResult.total.toLocaleString()}</span><span className="result-label">Total Tax Payable</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Currency Converter --- */}
        {toolId === 'currency-converter' && (
          <div className="utility-tool">
            <div className="tool-options">
              <h3 className="options-title">Currency Converter</h3>
              <div className="options-grid">
                <div className="option-item"><label>Amount</label><input type="number" className="option-input" value={currencyAmount} onChange={e => setCurrencyAmount(Math.max(0, Number(e.target.value)))} min={0} step={0.01} /></div>
                <div className="option-item"><label>From</label><select className="option-input" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
                  {['USD','EUR','GBP','JPY','INR','AUD','CAD','CHF','CNY','SGD','NZD','MXN','BRL','KRW','SEK','NOK','DKK','ZAR','TRY','HKD','MYR','THB','PHP','IDR'].map(c => <option key={c} value={c}>{c}</option>)}
                </select></div>
                <div className="option-item"><label>To</label><select className="option-input" value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
                  {['USD','EUR','GBP','JPY','INR','AUD','CAD','CHF','CNY','SGD','NZD','MXN','BRL','KRW','SEK','NOK','DKK','ZAR','TRY','HKD','MYR','THB','PHP','IDR'].map(c => <option key={c} value={c}>{c}</option>)}
                </select></div>
              </div>
            </div>
            <div className="service-actions">
              <button className="process-btn" disabled={convLoading} onClick={async () => {
                if (!currencyAmount || fromCurrency === toCurrency) { setConvertedAmount(currencyAmount); return; }
                setConvLoading(true);
                try {
                  const r = await fetch(`https://api.frankfurter.dev/v1/latest?from=${fromCurrency}&to=${toCurrency}`);
                  const d = await r.json();
                  if (!d.rates || d.rates[toCurrency] == null) throw new Error('Unsupported currency pair');
                  setConvertedAmount(currencyAmount * d.rates[toCurrency]);
                } catch (e) { alert('Conversion failed: ' + e.message); }
                setConvLoading(false);
              }}>{convLoading ? 'Converting...' : 'Convert'}</button>
            </div>
            {convertedAmount !== null && (
              <div className="utility-result">
                <div className="result-grid">
                  <div className="result-card highlight"><span className="result-value">{currencyAmount} {fromCurrency}</span><span className="result-label">=</span></div>
                  <div className="result-card highlight"><span className="result-value">{convertedAmount.toFixed(2)} {toCurrency}</span><span className="result-label">at live rate</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Time Zone Converter --- */}
        {toolId === 'timezone-converter' && (
          <div className="utility-tool">
            <div className="tool-options">
              <h3 className="options-title">Time Zone Converter</h3>
              <div className="options-grid">
                <div className="option-item"><label>Date & Time</label><input type="datetime-local" className="option-input" value={tzDateTime} onChange={e => setTzDateTime(e.target.value)} /></div>
                <div className="option-item"><label>From Time Zone</label><select className="option-input" value={fromTz} onChange={e => setFromTz(e.target.value)}>
                  {Intl.supportedValuesOf('timeZone').map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select></div>
                <div className="option-item"><label>To Time Zone</label><select className="option-input" value={toTz} onChange={e => setToTz(e.target.value)}>
                  {Intl.supportedValuesOf('timeZone').map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select></div>
              </div>
            </div>
            <div className="service-actions">
              <button className="process-btn" onClick={() => {
                if (!tzDateTime) return;
                const [dp, tp] = tzDateTime.split('T');
                const [y, M, d] = dp.split('-').map(Number);
                const [h, m] = tp.split(':').map(Number);
                const utc = Date.UTC(y, M - 1, d, h, m);
                const fromOff = getTzOffsetMinutes(fromTz, new Date(utc));
                const actualUtcMs = utc - fromOff * 60000;
                const toOff = getTzOffsetMinutes(toTz, new Date(actualUtcMs));
                const result = new Date(actualUtcMs + toOff * 60000);
                setConvertedTime(result.toLocaleString('en-US', { timeZone: toTz, dateStyle: 'full', timeStyle: 'medium' }));
              }}>Convert Time</button>
            </div>
            {convertedTime && (
              <div className="utility-result">
                <div className="result-card" style={{ textAlign: 'center', padding: '20px' }}>
                  <span className="result-label">Converted Time in {toTz}</span>
                  <span className="result-value" style={{ fontSize: '18px' }}>{convertedTime}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Unit Converter --- */}
        {toolId === 'unit-converter' && (
          <div className="utility-tool">
            <div className="tool-options">
              <h3 className="options-title">Unit Converter</h3>
              <div className="options-grid">
                <div className="option-item"><label>Category</label><select className="option-input" value={unitCategory} onChange={e => {
                  setUnitCategory(e.target.value); setFromUnit(''); setToUnit(''); setUnitResult(null);
                }}>
                  <option value="length">Length</option><option value="weight">Weight / Mass</option>
                  <option value="temperature">Temperature</option><option value="area">Area</option>
                  <option value="volume">Volume</option><option value="speed">Speed</option>
                  <option value="pressure">Pressure</option><option value="energy">Energy</option>
                </select></div>
                <div className="option-item"><label>Value</label><input type="number" className="option-input" value={unitValue} onChange={e => setUnitValue(Number(e.target.value))} min={0} /></div>
              </div>
            </div>
            {(function() {
              const units = { length: ['millimeter','centimeter','meter','kilometer','inch','foot','yard','mile','nautical mile'],
                weight: ['milligram','gram','kilogram','ounce','pound','ton'],
                temperature: ['celsius','fahrenheit','kelvin'],
                area: ['sq millimeter','sq centimeter','sq meter','hectare','sq kilometer','sq foot','sq yard','acre'],
                volume: ['milliliter','liter','gallon','quart','pint','cup'],
                speed: ['m/s','km/h','mph','knot'],
                pressure: ['pascal','bar','psi','atm','torr'],
                energy: ['joule','kilojoule','calorie','kilocalorie','watt hour','kWh'] };
              const conv = { length: { millimeter: 0.001, centimeter: 0.01, meter: 1, kilometer: 1000, inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.344, 'nautical mile': 1852 },
                weight: { milligram: 0.000001, gram: 0.001, kilogram: 1, ounce: 0.0283495, pound: 0.453592, ton: 1000 },
                temperature: null, area: { 'sq millimeter': 0.000001, 'sq centimeter': 0.0001, 'sq meter': 1, hectare: 10000, 'sq kilometer': 1000000, 'sq foot': 0.092903, 'sq yard': 0.836127, acre: 4046.86 },
                volume: { milliliter: 0.001, liter: 1, gallon: 3.78541, quart: 0.946353, pint: 0.473176, cup: 0.236588 },
                speed: { 'm/s': 1, 'km/h': 0.277778, mph: 0.44704, knot: 0.514444 },
                pressure: { pascal: 1, bar: 100000, psi: 6894.76, atm: 101325, torr: 133.322 },
                energy: { joule: 1, kilojoule: 1000, calorie: 4.184, kilocalorie: 4184, 'watt hour': 3600, kWh: 3600000 } };
              const u = units[unitCategory];
              const showFrom = fromUnit || u[0];
              const showTo = toUnit || u[1] || u[0];
              return (
                <>
                  <div className="tool-options"><div className="options-grid">
                    <div className="option-item"><label>From</label><select className="option-input" value={showFrom} onChange={e => { setFromUnit(e.target.value); setUnitResult(null); }}>
                      {u.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select></div>
                    <div className="option-item"><label>To</label><select className="option-input" value={showTo} onChange={e => { setToUnit(e.target.value); setUnitResult(null); }}>
                      {u.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select></div>
                  </div></div>
                  <div className="service-actions">
                    <button className="process-btn" onClick={() => {
                      const f = showFrom, t = showTo, v = unitValue;
                      if (!f || !t) return;
                      if (unitCategory === 'temperature') {
                        const c = { celsius: v => v, fahrenheit: v => (v - 32) * 5/9, kelvin: v => v - 273.15 };
                        const toFn = { celsius: v => v, fahrenheit: v => v * 9/5 + 32, kelvin: v => v + 273.15 };
                        const base = c[f](v);
                        setUnitResult(toFn[t](base));
                      } else {
                        const base = v * conv[unitCategory][f];
                        setUnitResult(base / conv[unitCategory][t]);
                      }
                    }}>Convert</button>
                  </div>
                  {unitResult !== null && (
                    <div className="utility-result">
                      <div className="result-grid">
                        <div className="result-card highlight"><span className="result-value">{unitValue} {showFrom}</span><span className="result-label">=</span></div>
                        <div className="result-card highlight"><span className="result-value">{unitResult.toFixed(6)} {showTo}</span><span className="result-label">converted</span></div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* --- BMI Calculator --- */}
        {toolId === 'bmi-calculator' && (
          <div className="utility-tool">
            <div className="tool-options">
              <h3 className="options-title">BMI Calculator</h3>
              <div className="options-grid">
                <div className="option-item">
                  <label>Weight (kg)</label>
                  <input type="number" className="option-input" value={bmiWeight} onChange={e => setBmiWeight(Math.max(0, Number(e.target.value)))} min={1} step={0.1} />
                </div>
                <div className="option-item">
                  <label>Height (cm)</label>
                  <input type="number" className="option-input" value={bmiHeight} onChange={e => setBmiHeight(Math.max(0, Number(e.target.value)))} min={1} step={0.1} />
                </div>
              </div>
            </div>
            <div className="service-actions">
              <button className="process-btn" onClick={() => {
                if (!bmiWeight || !bmiHeight) return;
                const heightM = bmiHeight / 100;
                const bmi = bmiWeight / (heightM * heightM);
                let category, color;
                if (bmi < 18.5) { category = 'Underweight'; color = '#60a5fa'; }
                else if (bmi < 25) { category = 'Normal'; color = '#4ade80'; }
                else if (bmi < 30) { category = 'Overweight'; color = '#facc15'; }
                else { category = 'Obese'; color = '#f87171'; }
                setBmiResult({ bmi: bmi.toFixed(1), category, color });
              }}>Calculate BMI</button>
            </div>
            {bmiResult && (
              <div className="utility-result">
                <div className="result-grid">
                  <div className="result-card highlight"><span className="result-value">{bmiResult.bmi}</span><span className="result-label">BMI</span></div>
                  <div className="result-card" style={{ borderColor: bmiResult.color }}><span className="result-value" style={{ color: bmiResult.color }}>{bmiResult.category}</span><span className="result-label">Category</span></div>
                </div>
                <div className="bmi-scale">
                  <div className="bmi-scale-bar">
                    <div className="bmi-scale-segment underweight"></div>
                    <div className="bmi-scale-segment normal"></div>
                    <div className="bmi-scale-segment overweight"></div>
                    <div className="bmi-scale-segment obese"></div>
                    <div className="bmi-marker" style={{ left: `${Math.min(Math.max((parseFloat(bmiResult.bmi) - 10) / 35 * 100, 0), 100)}%` }}></div>
                  </div>
                  <div className="bmi-labels">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Interest Calculator --- */}
        {toolId === 'interest-calculator' && (
          <div className="utility-tool">
            <div className="tool-options">
              <h3 className="options-title">Interest Calculator</h3>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px' }}>
                Calculate simple & compound interest. Rate is per ₹100 per month (e.g. ₹1.5 per ₹100/month)
              </p>
              <div className="options-grid">
                <div className="option-item">
                  <label>Date Money Taken</label>
                  <input type="date" className="option-input" value={intTakenDate} onChange={e => setIntTakenDate(e.target.value)} />
                </div>
                <div className="option-item">
                  <label>Principal Amount (₹)</label>
                  <input type="number" className="option-input" value={intAmount} onChange={e => setIntAmount(Math.max(0, Number(e.target.value)))} placeholder="e.g. 10000" min={1} />
                </div>
                <div className="option-item">
                  <label>Rate per ₹100 per Month (₹)</label>
                  <input type="number" className="option-input" value={intRate} onChange={e => setIntRate(Math.max(0, Number(e.target.value)))} placeholder="e.g. 1.5" min={0.01} step={0.01} />
                </div>
              </div>
            </div>
            <div className="service-actions">
              <button className="process-btn" onClick={() => {
                if (!intTakenDate || !intAmount || !intRate) return;
                const taken = new Date(intTakenDate);
                const now = new Date();
                const diffMs = now - taken;
                const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const totalMonths = diffMs / (1000 * 60 * 60 * 24 * 30.4375);
                const totalYears = totalMonths / 12;
                const principal = Number(intAmount);
                const ratePer100 = Number(intRate);
                const monthlyRate = ratePer100 / 100;
                const simpleInterest = Math.floor(principal * monthlyRate * totalMonths);
                const compoundInterest = Math.floor(principal * Math.pow(1 + monthlyRate, totalMonths) - principal);
                setIntResult({
                  totalDays,
                  totalMonths: Math.floor(totalMonths),
                  totalYears: Math.floor(totalYears),
                  simpleInterest,
                  compoundInterest,
                  simpleTotal: principal + simpleInterest,
                  compoundTotal: principal + compoundInterest,
                });
              }}>Calculate Interest</button>
            </div>
            {intResult && (
              <div className="utility-result">
                <div className="result-grid">
                  <div className="result-card highlight"><span className="result-value">{intResult.totalDays}</span><span className="result-label">Days Elapsed</span></div>
                  {intResult.totalMonths >= 1 && <div className="result-card highlight"><span className="result-value">{intResult.totalMonths}</span><span className="result-label">Months Elapsed</span></div>}
                  {intResult.totalYears >= 1 && <div className="result-card highlight"><span className="result-value">{intResult.totalYears}</span><span className="result-label">Years Elapsed</span></div>}
                </div>
                <div className="interest-breakdown">
                  <h4 style={{ color: '#f1f5f9', fontSize: '16px', margin: '20px 0 12px' }}>Simple Interest</h4>
                  <div className="result-grid">
                    <div className="result-card"><span className="result-value">₹{formatIndianNumber(intResult.simpleInterest)}</span><span className="result-label">Interest Amount</span></div>
                    <div className="result-card highlight"><span className="result-value">₹{formatIndianNumber(intResult.simpleTotal)}</span><span className="result-label">Total (Principal + Interest)</span></div>
                  </div>
                  <h4 style={{ color: '#f1f5f9', fontSize: '16px', margin: '20px 0 12px' }}>Compound Interest</h4>
                  <div className="result-grid">
                    <div className="result-card"><span className="result-value">₹{formatIndianNumber(intResult.compoundInterest)}</span><span className="result-label">Interest Amount</span></div>
                    <div className="result-card highlight"><span className="result-value">₹{formatIndianNumber(intResult.compoundTotal)}</span><span className="result-label">Total (Principal + Interest)</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Browser Notepad --- */}
        {toolId === 'browser-notepad' && (
          <div className="utility-tool">
            <div className="tool-options">
              <h3 className="options-title">Notepad</h3>
              <div className="notepad-bar">
                <span className="notepad-stats">{notepadText.length} chars · {notepadText.trim() ? notepadText.trim().split(/\s+/).length : 0} words</span>
                <span className="notepad-status">{notepadStatus}</span>
              </div>
            </div>
            <textarea className="notepad-textarea" value={notepadText} onChange={e => setNotepadText(e.target.value)} placeholder="Start typing..." />
            <div className="service-actions">
              <button className="process-btn" onClick={() => { setNotepadText(''); localStorage.removeItem('freeforge_notepad'); setNotepadStatus('Cleared'); setTimeout(() => setNotepadStatus(''), 2000); }}>Clear</button>
            </div>
          </div>
        )}

        {/* --- JSON Compare --- */}
        {toolId === 'json-compare' && (
          <div className="utility-tool">
            <div className="tool-options">
              <h3 className="options-title">JSON Compare</h3>
            </div>
            <div className="json-compare-grid">
              <textarea className="json-textarea" value={jsonA} onChange={e => setJsonA(e.target.value)} placeholder="First JSON object" />
              <textarea className="json-textarea" value={jsonB} onChange={e => setJsonB(e.target.value)} placeholder="Second JSON object" />
            </div>
            <div className="service-actions">
              <button className="process-btn" onClick={() => {
                try {
                  const a = JSON.parse(jsonA || '{}');
                  const b = JSON.parse(jsonB || '{}');
                  setJsonDiff(deepDiff(a, b));
                } catch { alert('Invalid JSON in one or both inputs'); }
              }}>Compare</button>
            </div>
            {jsonDiff !== null && (
              <div className="utility-result">
                {jsonDiff.length === 0 ? (
                  <div className="result-grid"><div className="result-card highlight"><span className="result-value" style={{color:'#4ade80'}}>Identical</span><span className="result-label">No differences found</span></div></div>
                ) : (
                  <div className="diff-list">
                    {jsonDiff.map((d, i) => (
                      <div key={i} className={`diff-item diff-${d.type}`}>
                        <div className="diff-path">{d.path}</div>
                        {d.type === 'changed' && <div className="diff-values"><span className="diff-old">{JSON.stringify(d.from)}</span> → <span className="diff-new">{JSON.stringify(d.to)}</span></div>}
                        {d.type === 'added' && <div className="diff-values"><span className="diff-new">{JSON.stringify(d.value)}</span></div>}
                        {d.type === 'removed' && <div className="diff-values"><span className="diff-old">{JSON.stringify(d.value)}</span></div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- JSON Parser --- */}
        {toolId === 'json-parser' && (
          <div className="utility-tool">
            <div className="tool-options">
              <h3 className="options-title">JSON Parser</h3>
            </div>
            <textarea className="json-textarea json-parser-input" value={jsonParserInput} onChange={e => { setJsonParserInput(e.target.value); setJsonParserOutput(''); setJsonParserError(''); }} placeholder="Paste your JSON here" />
            <div className="service-actions">
              <button className="process-btn" onClick={() => {
                try {
                  const parsed = JSON.parse(jsonParserInput);
                  setJsonParserOutput(JSON.stringify(parsed, null, 2));
                  setJsonParserError('');
                } catch (e) { setJsonParserError(e.message); setJsonParserOutput(''); }
              }}>Format / Validate</button>
              <button className="process-btn" onClick={() => {
                try {
                  const parsed = JSON.parse(jsonParserInput);
                  setJsonParserOutput(JSON.stringify(parsed));
                  setJsonParserError('');
                } catch (e) { setJsonParserError(e.message); setJsonParserOutput(''); }
              }}>Minify</button>
              {jsonParserOutput && (
                <button className="process-btn" onClick={() => navigator.clipboard.writeText(jsonParserOutput).then(() => { const b = document.querySelector('.json-parser-input'); if (b) b.focus(); })}>Copy</button>
              )}
            </div>
            {jsonParserError && <div className="json-error">{jsonParserError}</div>}
            {jsonParserOutput && (
              <div className="utility-result">
                <pre className="json-output">{jsonParserOutput}</pre>
              </div>
            )}
          </div>
        )}

        {/* --- cURL Parser --- */}
        {toolId === 'curl-parser' && (
          <div className="utility-tool">
            <div className="tool-options">
              <h3 className="options-title">cURL Parser</h3>
            </div>
            <textarea className="json-textarea" value={curlInput} onChange={e => setCurlInput(e.target.value)} placeholder={"Paste a cURL command, e.g.\ncurl -X POST https://api.example.com/users -H \"Content-Type: application/json\" -d '{\"name\": \"John\"}'"} rows={5} />
            <div className="service-actions">
              <button className="process-btn" onClick={() => {
                if (!curlInput.trim()) return;
                setCurlParsed(parseCurl(curlInput));
              }}>Parse</button>
            </div>
            {curlParsed && (
              <div className="utility-result">
                <div className="curl-result">
                  <div className="curl-section">
                    <div className="curl-row"><span className="curl-label">Method</span><span className={`curl-method curl-method-${curlParsed.method.toLowerCase()}`}>{curlParsed.method}</span></div>
                    <div className="curl-row"><span className="curl-label">URL</span><span className="curl-value curl-url">{curlParsed.url}</span></div>
                  </div>
                  {Object.keys(curlParsed.headers).length > 0 && (
                    <div className="curl-section">
                      <div className="curl-section-title">Headers</div>
                      <div className="curl-kv-list">
                        {Object.entries(curlParsed.headers).map(([k, v]) => (
                          <div key={k} className="curl-kv"><span className="curl-hk">{k}</span><span className="curl-hv">{v}</span></div>
                        ))}
                      </div>
                    </div>
                  )}
                  {curlParsed.body && (
                    <div className="curl-section">
                      <div className="curl-section-title">Body</div>
                      <pre className="curl-body">{(() => { try { return JSON.stringify(JSON.parse(curlParsed.body), null, 2); } catch { return curlParsed.body; } })()}</pre>
                    </div>
                  )}
                  {curlParsed.user && <div className="curl-section"><div className="curl-row"><span className="curl-label">Auth</span><span className="curl-value">{curlParsed.user}</span></div></div>}
                  {curlParsed.cookies && <div className="curl-section"><div className="curl-row"><span className="curl-label">Cookies</span><span className="curl-value">{curlParsed.cookies}</span></div></div>}
                  <div className="curl-section">
                    <div className="curl-section-title">JavaScript Fetch</div>
                    <pre className="curl-fetch-code">{curlToFetch(curlParsed)}</pre>
                    <button className="process-btn" style={{ marginTop: '8px' }} onClick={() => navigator.clipboard.writeText(curlToFetch(curlParsed))}>Copy Fetch Code</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Snake Game --- */}
        {toolId === 'snake-game' && <SnakeGame />}

        {/* --- 2048 Game --- */}
        {toolId === 'game-2048' && <Game2048 />}

        {/* --- Sudoku --- */}
        {toolId === 'sudoku' && <SudokuGame />}

        {/* --- Minesweeper --- */}
        {toolId === 'minesweeper' && <MinesweeperGame />}

        {/* --- Hangman --- */}
        {toolId === 'hangman' && <HangmanGame />}

        {/* --- Word Search --- */}
        {toolId === 'word-search' && <WordSearchGame />}

        {/* --- Simon Says --- */}
        {toolId === 'simon-says' && <SimonGame />}

        {/* --- Whack-a-Mole --- */}
        {toolId === 'whack-a-mole' && <WhackGame />}

        {/* --- Tic-Tac-Toe --- */}
        {toolId === 'tic-tac-toe' && <TicTacToeGame />}

        {/* --- Memory Cards --- */}
        {toolId === 'memory-cards' && <MemoryGame />}

        {/* --- Spin Wheel --- */}
        {toolId === 'spin-wheel' && <SpinWheelGame />}

        {/* --- Dice Roller --- */}
        {toolId === 'dice-roller' && <DiceRollerGame />}

        {/* --- Coin Toss --- */}
        {toolId === 'coin-toss' && <CoinTossGame />}

        {/* --- Truth or Dare --- */}
        {toolId === 'truth-or-dare' && <TruthDareGame />}

        {/* --- Rock Paper Scissors --- */}
        {toolId === 'rock-paper-scissors' && <RPSGame />}

        {/* --- Countdown Timer --- */}
        {toolId === 'countdown-timer' && <CountdownTimer />}

        {/* --- Stopwatch --- */}
        {toolId === 'stopwatch' && <StopwatchTool />}

        {/* --- Compass --- */}
        {toolId === 'compass' && <CompassTool />}

        <canvas ref={canvasRef} hidden />

        {tool.category !== 'utility' && tool.category !== 'game' && (
        <div className="service-actions">
          <button className="process-btn" onClick={handleProcess} disabled={!files.length || loading}>
            {loading ? <Loader2 className="spin" size={20} /> : null}
            {loading ? 'Processing...' : 'Process'}
          </button>
          {outputUrl && (
            <button className="download-btn" onClick={handleDownload}>
              <Download size={20} /> Download {outputName}
            </button>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default ServicePage;
