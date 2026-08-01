import { useState, useCallback } from 'react';
import { RotateCcw, Lightbulb, Trophy } from 'lucide-react';
import './Games.css';

const DIFFICULTIES = { Easy: 35, Medium: 45, Hard: 55 };

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const br = Math.floor(row / 3) * 3, bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) for (let c = bc; c < bc + 3; c++) if (board[r][c] === num) return false;
  return true;
}

function solveSudoku(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;
            if (solveSudoku(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generatePuzzle(removeCount) {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));
  solveSudoku(board);
  const solution = board.map(r => [...r]);
  let removed = 0;
  const positions = shuffle([...Array(81).keys()]);
  for (const pos of positions) {
    if (removed >= removeCount) break;
    const r = Math.floor(pos / 9), c = pos % 9;
    if (board[r][c] !== 0) {
      board[r][c] = 0;
      removed++;
    }
  }
  return { puzzle: board, solution };
}

function getHintsCount(diff) {
  if (diff === 'Easy') return 5;
  if (diff === 'Medium') return 3;
  return 1;
}

export default function SudokuGame() {
  const [difficulty, setDifficulty] = useState('Medium');
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(DIFFICULTIES.Medium).puzzle);
  const [solution, setSolution] = useState(() => generatePuzzle(DIFFICULTIES.Medium).solution);
  const [userBoard, setUserBoard] = useState(() => puzzle.map(r => [...r]));
  const [selected, setSelected] = useState(null);
  const [hints, setHints] = useState(getHintsCount('Medium'));
  const [errors, setErrors] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const startNew = useCallback((diff) => {
    const { puzzle: p, solution: s } = generatePuzzle(DIFFICULTIES[diff]);
    setPuzzle(p);
    setSolution(s);
    setUserBoard(p.map(r => [...r]));
    setDifficulty(diff);
    setSelected(null);
    setHints(getHintsCount(diff));
    setErrors([]);
    setCompleted(false);
    setTimer(0);
    setTimerRunning(true);
  }, []);

  // Timer
  useState(() => {
    if (!timerRunning || completed) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning, completed]);

  const handleCellClick = (r, c) => {
    if (puzzle[r][c] !== 0) return;
    setSelected([r, c]);
  };

  const handleNumber = (num) => {
    if (!selected || completed) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return;
    const newBoard = userBoard.map(row => [...row]);
    newBoard[r][c] = num;
    setUserBoard(newBoard);

    if (num !== 0 && num !== solution[r][c]) {
      setErrors(prev => [...prev, `${r},${c}`]);
    } else {
      setErrors(prev => prev.filter(e => e !== `${r},${c}`));
    }

    // Check completion
    let full = true;
    for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) {
      if (newBoard[i][j] === 0 || newBoard[i][j] !== solution[i][j]) full = false;
    }
    if (full) { setCompleted(true); setTimerRunning(false); }
  };

  const useHint = () => {
    if (hints <= 0 || !selected || completed) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0 || userBoard[r][c] === solution[r][c]) return;
    const newBoard = userBoard.map(row => [...row]);
    newBoard[r][c] = solution[r][c];
    setUserBoard(newBoard);
    setHints(h => h - 1);
    setErrors(prev => prev.filter(e => e !== `${r},${c}`));
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Sudoku</h2>
        <div className="game-controls">
          <span className="game-score">⏱ {formatTime(timer)}</span>
          <span className="game-high-score"><Lightbulb size={14} /> Hints: {hints}</span>
          <button className="game-icon-btn" onClick={() => startNew(difficulty)}><RotateCcw size={18} /></button>
        </div>
      </div>

      <div className="sudoku-diff-select">
        {Object.keys(DIFFICULTIES).map(d => (
          <button key={d} className={`level-btn ${difficulty === d ? 'active' : ''}`} onClick={() => startNew(d)}>{d}</button>
        ))}
      </div>

      <div className="sudoku-board">
        {userBoard.map((row, r) => row.map((val, c) => {
          const isGiven = puzzle[r][c] !== 0;
          const isSelected = selected && selected[0] === r && selected[1] === c;
          const isError = errors.includes(`${r},${c}`);
          const sameRow = selected && selected[0] === r;
          const sameCol = selected && selected[1] === c;
          const sameBox = selected && Math.floor(selected[0] / 3) === Math.floor(r / 3) && Math.floor(selected[1] / 3) === Math.floor(c / 3);
          const highlight = !isGiven && (sameRow || sameCol || sameBox);
          const thickRight = c % 3 === 2 && c < 8;
          const thickBottom = r % 3 === 2 && r < 8;

          return (
            <button
              key={`${r}-${c}`}
              className={`sudoku-cell ${isGiven ? 'given' : 'editable'} ${isSelected ? 'selected' : ''} ${isError ? 'error' : ''} ${highlight ? 'highlight' : ''} ${thickRight ? 'thick-right' : ''} ${thickBottom ? 'thick-bottom' : ''}`}
              onClick={() => handleCellClick(r, c)}
            >
              {val !== 0 ? val : ''}
            </button>
          );
        }))}
      </div>

      <div className="sudoku-numpad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button key={n} className="numpad-btn" onClick={() => handleNumber(n)}>{n}</button>
        ))}
        <button className="numpad-btn numpad-erase" onClick={() => handleNumber(0)}>✕</button>
      </div>

      <div className="sudoku-actions">
        <button className="hint-btn" onClick={useHint} disabled={hints <= 0 || completed}>
          <Lightbulb size={16} /> Use Hint
        </button>
      </div>

      {completed && (
        <div className="game-complete-msg">
          <Trophy size={24} />
          <h3>Puzzle Complete!</h3>
          <p>Time: {formatTime(timer)}</p>
          <button className="game-start-btn" onClick={() => startNew(difficulty)}><RotateCcw size={16} /> New Puzzle</button>
        </div>
      )}

      <div className="game-info">
        <p>Click cell then tap number • Tap ✕ to erase</p>
      </div>
    </div>
  );
}
