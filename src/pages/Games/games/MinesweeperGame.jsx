import { useState, useCallback, useEffect } from 'react';
import { RotateCcw, Flag } from 'lucide-react';
import './Games.css';

const DIFFICULTIES = {
  Easy: { rows: 9, cols: 9, mines: 10 },
  Medium: { rows: 16, cols: 16, mines: 40 },
  Hard: { rows: 16, cols: 30, mines: 99 },
};

function getHighScore(diff) {
  try { const h = JSON.parse(localStorage.getItem('freeforge_minesweeper_high') || '{}'); return h[diff] || null; } catch { return null; }
}
function setHighScore(diff, time) {
  const h = JSON.parse(localStorage.getItem('freeforge_minesweeper_high') || '{}');
  if (!h[diff] || time < h[diff]) { h[diff] = time; localStorage.setItem('freeforge_minesweeper_high', JSON.stringify(h)); }
}

function createBoard(rows, cols, mines, firstClick) {
  const board = Array(rows).fill(null).map(() => Array(cols).fill(null).map(() => ({ mine: false, revealed: false, flagged: false, adjacent: 0 })));
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine && !(Math.abs(r - firstClick[0]) <= 1 && Math.abs(c - firstClick[1]) <= 1)) {
      board[r][c].mine = true;
      placed++;
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) count++;
      }
      board[r][c].adjacent = count;
    }
  }
  return board;
}

function reveal(board, r, c) {
  if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;
  if (board[r][c].revealed || board[r][c].flagged) return;
  board[r][c].revealed = true;
  if (board[r][c].adjacent === 0 && !board[r][c].mine) {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) reveal(board, r + dr, c + dc);
  }
}



export default function MinesweeperGame() {
  const [diff, setDiff] = useState('Easy');
  const [board, setBoard] = useState(null);
  const [gameState, setGameState] = useState('menu');
  const [timer, setTimer] = useState(0);
  const [flags, setFlags] = useState(0);
  const [highScores, setHighScores] = useState({});

  useEffect(() => { setHighScores({ Easy: getHighScore('Easy'), Medium: getHighScore('Medium'), Hard: getHighScore('Hard') }); }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const startGame = useCallback(() => {
    const { rows, cols, mines: _mines } = DIFFICULTIES[diff];
    setBoard(Array(rows).fill(null).map(() => Array(cols).fill(null).map(() => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))));
    setGameState('playing');
    setTimer(0);
    setFlags(0);
  }, [diff]);

  const handleCellClick = (r, c) => {
    if (gameState !== 'playing' || !board) return;
    if (board[r][c].revealed || board[r][c].flagged) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    // First click - generate board
    if (!newBoard.some(row => row.some(cell => cell.revealed))) {
      const generated = createBoard(DIFFICULTIES[diff].rows, DIFFICULTIES[diff].cols, DIFFICULTIES[diff].mines, [r, c]);
      reveal(generated, r, c);
      setBoard(generated);
      return;
    }

    if (newBoard[r][c].mine) {
      // Game over - reveal all mines
      newBoard.forEach(row => row.forEach(cell => { if (cell.mine) cell.revealed = true; }));
      setBoard(newBoard);
      setGameState('lost');
      return;
    }

    reveal(newBoard, r, c);
    setBoard(newBoard);

    // Check win
    const unrevealed = newBoard.flat().filter(c => !c.revealed && !c.mine).length;
    if (unrevealed === 0) {
      setGameState('won');
      setHighScore(diff, timer);
      setHighScores({ Easy: getHighScore('Easy'), Medium: getHighScore('Medium'), Hard: getHighScore('Hard') });
    }
  };

  const handleRightClick = (e, r, c) => {
    e.preventDefault();
    if (gameState !== 'playing' || !board || board[r][c].revealed) return;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[r][c].flagged = !newBoard[r][c].flagged;
    setBoard(newBoard);
    setFlags(prev => newBoard[r][c].flagged ? prev + 1 : prev - 1);
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Minesweeper</h2>
        <div className="game-controls">
          <span className="game-score"><Flag size={14} /> {DIFFICULTIES[diff].mines - flags}</span>
          <span className="game-score">⏱ {formatTime(timer)}</span>
          <button className="game-icon-btn" onClick={startGame}><RotateCcw size={18} /></button>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="game-overlay">
          <h3>Minesweeper</h3>
          <p>Left click to reveal • Right click to flag</p>
          <div className="level-select">
            {Object.keys(DIFFICULTIES).map(d => (
              <button key={d} className={`level-btn ${diff === d ? 'active' : ''}`} onClick={() => setDiff(d)}>
                {d} {highScores[d] ? `(${highScores[d]}s)` : ''}
              </button>
            ))}
          </div>
          <button className="game-start-btn" onClick={startGame}>Start Game</button>
        </div>
      )}

      {board && (
        <div className="minesweeper-board" style={{ gridTemplateColumns: `repeat(${DIFFICULTIES[diff].cols}, 1fr)` }}>
          {board.map((row, r) => row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              className={`mine-cell ${cell.revealed ? 'revealed' : ''} ${cell.flagged ? 'flagged' : ''} ${cell.revealed && cell.mine ? 'mine' : ''}`}
              onClick={() => handleCellClick(r, c)}
              onContextMenu={(e) => handleRightClick(e, r, c)}
            >
              {cell.flagged && !cell.revealed ? '🚩' : cell.revealed ? (cell.mine ? '💣' : (cell.adjacent > 0 ? cell.adjacent : '')) : ''}
            </button>
          )))}
        </div>
      )}

      {(gameState === 'won' || gameState === 'lost') && (
        <div className="game-overlay">
          <h3>{gameState === 'won' ? 'You Win!' : 'Game Over!'}</h3>
          <p>Time: {formatTime(timer)}</p>
          <button className="game-start-btn" onClick={startGame}><RotateCcw size={16} /> Play Again</button>
        </div>
      )}

      <div className="game-info">
        <p>Left click reveal • Right click flag • Mobile: tap to reveal, long press to flag</p>
      </div>
    </div>
  );
}
