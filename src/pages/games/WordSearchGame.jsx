import { useState, useRef, useCallback } from 'react';
import { RotateCcw, Timer, Trophy } from 'lucide-react';
import './Games.css';

const WORD_LIST = [
  'REACT', 'JAVASCRIPT', 'PYTHON', 'CODING', 'ALGORITHM',
  'DATABASE', 'FUNCTION', 'VARIABLE', 'LOOP', 'STRING',
  'BOOLEAN', 'OBJECT', 'ARRAY', 'CLASS', 'MODULE',
  'COMPONENT', 'TEMPLATE', 'BROWSER', 'SERVER', 'CLIENT',
  'NETWORK', 'SECURITY', 'CLOUD', 'DEVICE', 'MOBILE',
];

const DIRECTIONS = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];

function generateBoard(size, words) {
  const board = Array(size).fill(null).map(() => Array(size).fill(''));
  const placed = [];

  for (const word of words) {
    let attempts = 0;
    while (attempts < 100) {
      const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const nr = r + dir[0] * i, nc = c + dir[1] * i;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) { fits = false; break; }
        if (board[nr][nc] !== '' && board[nr][nc] !== word[i]) { fits = false; break; }
      }
      if (fits) {
        const cells = [];
        for (let i = 0; i < word.length; i++) {
          const nr = r + dir[0] * i, nc = c + dir[1] * i;
          board[nr][nc] = word[i];
          cells.push(`${nr},${nc}`);
        }
        placed.push({ word, cells });
        break;
      }
      attempts++;
    }
  }

  // Fill empty cells
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
    if (board[r][c] === '') board[r][c] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  }

  return { board, placed };
}

export default function WordSearchGame() {
  const [size] = useState(12);
  const [wordsToFind] = useState(() => {
    const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  });
  const [gameData, setGameData] = useState(() => generateBoard(12, wordsToFind));
  const [found, setFound] = useState([]);
  const [selected, setSelected] = useState([]);
  const [timer, setTimer] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [startCell, setStartCell] = useState(null);
  const boardRef = useRef(null);

  useState(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const getCellsBetween = (r1, c1, r2, c2) => {
    const cells = [];
    const dr = Math.sign(r2 - r1);
    const dc = Math.sign(c2 - c1);
    const rowDist = Math.abs(r2 - r1);
    const colDist = Math.abs(c2 - c1);

    if (rowDist === colDist || rowDist === 0 || colDist === 0) {
      let r = r1, c = c1;
      while (r !== r2 + dr || c !== c2 + dc) {
        cells.push(`${r},${c}`);
        r += dr; c += dc;
      }
    }
    return cells;
  };

  const handleMouseDown = (r, c) => {
    setStartCell([r, c]);
    setSelected([`${r},${c}`]);
  };

  const handleMouseEnter = (r, c) => {
    if (!startCell) return;
    const cells = getCellsBetween(startCell[0], startCell[1], r, c);
    if (cells.length > 0) setSelected(cells);
  };

  const handleMouseUp = () => {
    if (!startCell || gameState !== 'playing') return;
    const word = selected.map(key => {
      const [r, c] = key.split(',').map(Number);
      return gameData.board[r][c];
    }).join('');

    const reverseWord = word.split('').reverse().join('');

    for (const placed of gameData.placed) {
      if (!found.includes(placed.word) && (placed.word === word || placed.word === reverseWord)) {
        const newFound = [...found, placed.word];
        setFound(newFound);
        if (newFound.length === gameData.placed.length) {
          setGameState('won');
        }
        break;
      }
    }

    setSelected([]);
    setStartCell(null);
  };

  const isCellSelected = (r, c) => selected.includes(`${r},${c}`);
  const isCellFound = (r, c) => found.some(w => {
    const placed = gameData.placed.find(p => p.word === w);
    return placed && placed.cells.includes(`${r},${c}`);
  });

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Word Search</h2>
        <div className="game-controls">
          <span className="game-score">⏱ {formatTime(timer)}</span>
          <span className="game-high-score">Found: {found.length}/{gameData.placed.length}</span>
          <button className="game-icon-btn" onClick={() => { setGameData(generateBoard(size, wordsToFind)); setFound([]); setSelected([]); setTimer(0); setGameState('playing'); }}><RotateCcw size={18} /></button>
        </div>
      </div>

      <div className="word-search-words">
        {gameData.placed.map(p => (
          <span key={p.word} className={`ws-word ${found.includes(p.word) ? 'found' : ''}`}>{p.word}</span>
        ))}
      </div>

      <div
        ref={boardRef}
        className="word-search-board"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {gameData.board.map((row, r) => row.map((letter, c) => (
          <button
            key={`${r}-${c}`}
            className={`ws-cell ${isCellSelected(r, c) ? 'selected' : ''} ${isCellFound(r, c) ? 'found' : ''}`}
            onMouseDown={() => handleMouseDown(r, c)}
            onMouseEnter={() => handleMouseEnter(r, c)}
            onTouchStart={() => handleMouseDown(r, c)}
            onTouchEnd={handleMouseUp}
          >
            {letter}
          </button>
        )))}
      </div>

      {gameState === 'won' && (
        <div className="game-overlay">
          <h3>All Words Found!</h3>
          <p>Time: {formatTime(timer)}</p>
          <button className="game-start-btn" onClick={() => { setGameData(generateBoard(size, wordsToFind)); setFound([]); setTimer(0); setGameState('playing'); }}><RotateCcw size={16} /> New Puzzle</button>
        </div>
      )}

      <div className="game-info">
        <p>Click and drag to select words horizontally, vertically or diagonally</p>
      </div>
    </div>
  );
}
