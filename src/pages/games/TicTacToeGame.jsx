import { useState } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import './Games.css';

function checkWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(s => s)) return 'draw';
  return null;
}

export default function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [gameState, setGameState] = useState('playing');

  const handleClick = (i) => {
    if (board[i] || gameState !== 'playing') return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameState(winner === 'draw' ? 'draw' : 'won');
      setScores(s => ({ ...s, [winner === 'draw' ? 'draw' : winner]: s[winner === 'draw' ? 'draw' : winner] + 1 }));
    }
  };

  const reset = () => { setBoard(Array(9).fill(null)); setXIsNext(true); setGameState('playing'); };

  const winner = checkWinner(board);

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Tic-Tac-Toe</h2>
        <div className="game-controls">
          <span className="game-score">X: {scores.X}</span>
          <span className="game-score">O: {scores.O}</span>
          <span className="game-score">Draw: {scores.draw}</span>
          <button className="game-icon-btn" onClick={reset}><RotateCcw size={18} /></button>
        </div>
      </div>

      <div className="tictactoe-board">
        {board.map((cell, i) => (
          <button key={i} className={`ttt-cell ${cell ? 'ttt-' + cell.toLowerCase() : ''} ${winner === 'draw' ? '' : ''}`} onClick={() => handleClick(i)}>
            {cell && <span className={`ttt-mark ${cell === 'X' ? 'ttt-x' : 'ttt-o'}`}>{cell}</span>}
          </button>
        ))}
      </div>

      <div className="game-info">
        <p>{winner ? (winner === 'draw' ? "It's a draw!" : `${winner} wins!`) : `${xIsNext ? 'X' : 'O'}'s turn`}</p>
      </div>

      {(winner) && (
        <button className="game-start-btn" onClick={reset} style={{marginTop: 0}}>
          <RotateCcw size={16} /> Play Again
        </button>
      )}
    </div>
  );
}
