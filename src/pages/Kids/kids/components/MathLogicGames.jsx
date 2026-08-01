import { useState, useEffect, useCallback } from 'react';
import QuizTemplate from '../QuizTemplate';

const solution = [
  [1, 2, 3, 4],
  [4, 3, 1, 2],
  [3, 4, 2, 1],
  [2, 1, 4, 3]
];

export function SudokuKids() {
  const [grid, setGrid] = useState([
    [1, 0, 3, 0],
    [0, 4, 0, 2],
    [3, 0, 2, 0],
    [0, 1, 0, 4]
  ]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [solved, setSolved] = useState(false);
  const given = [[0,0],[1,1],[2,0],[2,2],[3,1],[3,3]];
  const isGiven = (r,c) => given.some(([gr,gc]) => gr===r && gc===c);

  const placeNum = (num) => {
    if (!selectedCell) return;
    const [r,c] = selectedCell;
    if (isGiven(r,c)) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);
  };

  useEffect(() => {
    const match = grid.every((row,r) => row.every((val,c) => val === solution[r][c]));
    if (match && grid.every(row => row.every(v => v !== 0))) setSolved(true);
  }, [grid]);

  if (solved) {
    return (
      <div className="activity-page">
        <div className="celebration">
          <h2>🎉 Sudoku Solved!</h2>
          <p style={{ fontSize: 48 }}>🧩</p>
          <button className="back-btn" style={{ marginTop: 20 }} onClick={() => window.location.hash = '#/kids'}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>🧩 Sudoku for Kids (4x4)</h2></div>
      <p className="activity-description">Fill the grid so each row, column, and 2x2 box has numbers 1-4</p>
      <div className="sudoku-grid">
        {grid.map((row, r) => row.map((val, c) => (
          <div
            key={`${r}-${c}`}
            className={`sudoku-cell ${given.some(([gr,gc]) => gr===r&&gc===c) ? 'given' : ''} ${selectedCell && selectedCell[0]===r && selectedCell[1]===c ? 'selected' : ''}`}
            onClick={() => { if (!isGiven(r,c)) setSelectedCell([r,c]); }}
          >
            {val !== 0 ? val : ''}
          </div>
        )))}
      </div>
      {selectedCell && !isGiven(selectedCell[0], selectedCell[1]) && (
        <div className="sudoku-numpad">
          {[1,2,3,4].map(n => (
            <button key={n} className="sudoku-num-btn" onClick={() => placeNum(n)}>{n}</button>
          ))}
        </div>
      )}
    </div>
  );
}

const lines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

export function TicTacToeAI() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState([]);

  const checkWinner = useCallback((squares) => {
    for (const [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a,b,c] };
      }
    }
    if (squares.every(s => s)) return { winner: 'draw', line: [] };
    return { winner: null, line: [] };
  }, []);

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setXIsNext(false);
    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinLine(result.line);
    }
  };

  useEffect(() => {
    if (xIsNext || winner) return;
    const empty = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (empty.length === 0) return;
    const aiMove = empty[Math.floor(Math.random() * empty.length)];
    setTimeout(() => {
      const newBoard = [...board];
      newBoard[aiMove] = 'O';
      setBoard(newBoard);
      setXIsNext(true);
      const result = checkWinner(newBoard);
      if (result.winner) {
        setWinner(result.winner);
        setWinLine(result.line);
      }
    }, 300);
   }, [xIsNext, winner, board, checkWinner]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinLine([]);
  };

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>❌ Tic Tac Toe vs AI</h2></div>
      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>
        {winner ? (winner === 'draw' ? 'Draw!' : `${winner} wins!`) : `${xIsNext ? 'Your' : 'AI thinking...'} turn (${xIsNext ? 'X' : 'O'})`}
      </p>
      <div className="tictactoe-grid">
        {board.map((cell, i) => (
          <div
            key={i}
            className={`tictactoe-cell ${winLine.includes(i) ? 'win' : ''}`}
            onClick={() => handleClick(i)}
            disabled={cell !== null || winner !== null || !xIsNext}
          >
            {cell}
          </div>
        ))}
      </div>
      {winner && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button className="back-btn" onClick={reset}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export function LogicPuzzle() {
  const puzzles = [
    { puzzle: 'You see me once in June, twice in November, but never in May. What am I?', options: ['The letter E', 'The number 1', 'Summer', 'Rain'], correct: 0 },
    { puzzle: 'What gets wetter the more it dries?', options: ['A towel', 'A sponge', 'The sun', 'A river'], correct: 0 },
    { puzzle: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?', options: ['A map', 'A globe', 'A book', 'A painting'], correct: 0 },
    { puzzle: 'What has keys but can\'t open locks?', options: ['A piano', 'A map', 'A computer', 'A treasure chest'], correct: 0 },
    { puzzle: 'What has a head and a tail but no body?', options: ['A coin', 'A snake', 'A pencil', 'A hammer'], correct: 0 },
    { puzzle: 'What runs all around a backyard yet never moves?', options: ['A fence', 'A path', 'A tree', 'A hose'], correct: 0 },
    { puzzle: 'What can travel around the world while staying in a corner?', options: ['A stamp', 'A plane', 'A ship', 'A letter'], correct: 0 },
    { puzzle: 'What has many teeth but can\'t bite?', options: ['A comb', 'A saw', 'A zipper', 'A fork'], correct: 0 },
    { puzzle: 'What invention lets you look right through a wall?', options: ['A window', 'A door', 'A mirror', 'A telescope'], correct: 0 },
    { puzzle: 'If you drop me I\'m sure to crack, but give me a smile and I\'ll always smile back. What am I?', options: ['A mirror', 'An egg', 'A glass', 'A bubble'], correct: 0 }
  ];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx) => {
    setAnswers(prev => ({ ...prev, [current]: idx }));
    if (current < puzzles.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  if (showResult) {
    const score = puzzles.filter((p, i) => answers[i] === p.correct).length;
    return (
      <div className="activity-page">
        <div className="celebration">
          <h2>🎉 Puzzle Complete!</h2>
          <p>You solved <strong>{score}</strong> out of <strong>{puzzles.length}</strong>!</p>
          <button className="back-btn" style={{ marginTop: 20 }} onClick={() => window.location.hash = '#/kids'}>Back</button>
        </div>
      </div>
    );
  }

  const p = puzzles[current];
  return (
    <div className="activity-page">
      <div className="activity-header"><h2>🧩 Logic Puzzles</h2></div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(current / puzzles.length) * 100}%` }} />
      </div>
      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>
        Puzzle {current + 1} of {puzzles.length}
      </div>
      <div className="logic-puzzle-text">
        <p>{p.puzzle}</p>
      </div>
      <div className="logic-options">
        {p.options.map((opt, i) => (
          <button
            key={i}
            className={`logic-option ${answers[current] !== undefined ? (i === p.correct ? 'correct' : (i === answers[current] ? 'wrong' : '')) : ''}`}
            onClick={() => handleAnswer(i)}
            disabled={answers[current] !== undefined}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SynonymsAntonyms() {
  const data = [
    { word: 'Happy', type: 'synonym', answer: 'Joyful', options: ['Joyful', 'Sad', 'Angry', 'Tired'] },
    { word: 'Big', type: 'synonym', answer: 'Large', options: ['Small', 'Large', 'Tiny', 'Short'] },
    { word: 'Fast', type: 'synonym', answer: 'Quick', options: ['Slow', 'Quick', 'Lazy', 'Heavy'] },
    { word: 'Smart', type: 'synonym', answer: 'Clever', options: ['Dull', 'Clever', 'Silly', 'Weak'] },
    { word: 'Hot', type: 'antonym', answer: 'Cold', options: ['Warm', 'Cold', 'Cool', 'Mild'] },
    { word: 'Day', type: 'antonym', answer: 'Night', options: ['Morning', 'Night', 'Noon', 'Dawn'] },
    { word: 'Up', type: 'antonym', answer: 'Down', options: ['High', 'Down', 'Top', 'Above'] },
    { word: 'Old', type: 'antonym', answer: 'New', options: ['Ancient', 'New', 'Young', 'Fresh'] }
  ];
  const [current, setCurrent] = useState(0);
  const [_score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const handleAnswer = (selected) => {
    const isCorrect = selected === data[current].answer;
    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      setFeedback(null);
      if (current < data.length - 1) setCurrent(c => c + 1);
    }, 1000);
  };

  const q = data[current];
  return (
    <div className="activity-page">
      <div className="activity-header"><h2>📚 Synonyms & Antonyms</h2></div>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${(current / data.length) * 100}%` }} /></div>
      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>
        Question {current + 1} of {data.length} — Find the <strong>{q.type}</strong> of <strong>{q.word}</strong>
      </div>
      <div className="quiz-options">
        {q.options.map((opt, i) => (
          <button key={i} className={`quiz-option ${feedback && opt === q.answer ? 'correct' : feedback === 'wrong' && opt === q.answer ? 'correct' : ''}`} onClick={() => !feedback && handleAnswer(opt)} disabled={feedback !== null}>
            {opt}
          </button>
        ))}
      </div>
      {feedback && <p style={{ textAlign: 'center', color: feedback === 'correct' ? '#22c55e' : '#ef4444', fontSize: 16 }}>{feedback === 'correct' ? '✅ Correct!' : `❌ Answer: ${q.answer}`}</p>}
    </div>
  );
}

export function GrammarQuiz() {
  const questions = [
    { question: 'Which is a noun?', options: ['Run', 'Beautiful', 'Dog', 'Quickly'], correctIndex: 2 },
    { question: 'Which is a verb?', options: ['Happy', 'Jump', 'Blue', 'Tall'], correctIndex: 1 },
    { question: 'Which is an adjective?', options: ['Eat', 'The', 'Red', 'And'], correctIndex: 2 },
    { question: 'Which is an adverb?', options: ['Cat', 'Slowly', 'Table', 'Big'], correctIndex: 1 },
    { question: 'Choose the correct plural: "one cat, two ___"', options: ['cats', 'cat', 'cates', 'catses'], correctIndex: 0 },
    { question: 'Choose the correct form: "She ___ to school"', options: ['go', 'goes', 'going', 'goed'], correctIndex: 1 },
    { question: 'Which sentence is correct?', options: ['He don\'t like it', 'He doesn\'t like it', 'He not like it', 'He no like it'], correctIndex: 1 },
    { question: 'Which is a proper noun?', options: ['dog', 'city', 'London', 'happy'], correctIndex: 2 },
    { question: 'Which is a pronoun?', options: ['Run', 'She', 'Beautiful', 'Quickly'], correctIndex: 1 },
    { question: 'Choose the correct form: "They ___ playing"', options: ['is', 'are', 'am', 'be'], correctIndex: 1 },
    { question: 'Which word is a conjunction?', options: ['But', 'Quickly', 'Happy', 'Table'], correctIndex: 0 },
    { question: 'Which sentence is correct?', options: ['I has a cat', 'I have a cat', 'I having a cat', 'I haves a cat'], correctIndex: 1 },
    { question: 'Which is a singular noun?', options: ['dogs', 'children', 'baby', 'mice'], correctIndex: 2 },
    { question: 'Choose the correct form: "He ___ happy"', options: ['am', 'is', 'are', 'be'], correctIndex: 1 },
    { question: 'Which is a preposition?', options: ['Run', 'Under', 'Big', 'And'], correctIndex: 1 },
    { question: 'Which sentence uses correct punctuation?', options: ['hello how are you', 'Hello, how are you?', 'hello, how are you', 'Hello how are you.'], correctIndex: 1 },
    { question: 'Choose the correct plural: "one baby, two ___"', options: ['babys', 'babies', 'babys', 'babyies'], correctIndex: 1 },
    { question: 'Which is an interjection?', options: ['The', 'Wow', 'Run', 'Blue'], correctIndex: 1 },
    { question: 'Choose the correct form: "We ___ going home"', options: ['is', 'am', 'are', 'be'], correctIndex: 2 },
    { question: 'Which sentence is correct?', options: ['The dogs runs fast', 'The dogs run fast', 'The dogs running fast', 'The dogs runned fast'], correctIndex: 1 },
    { question: 'Which is a common noun?', options: ['Paris', 'Monday', 'school', 'January'], correctIndex: 2 },
    { question: 'Choose the correct form: "It ___ a cat"', options: ['am', 'is', 'are', 'be'], correctIndex: 1 },
    { question: 'Which word means the opposite of "hot"?', options: ['warm', 'cold', 'heat', 'fire'], correctIndex: 1 },
    { question: 'Which sentence is correct?', options: ['She can sings well', 'She can sing well', 'She can singing well', 'She can to sing well'], correctIndex: 1 },
    { question: 'Which is a verb?', options: ['Beautiful', 'Quickly', 'Swim', 'Table'], correctIndex: 2 }
  ];
  return <QuizTemplate questions={questions} title="📝 Grammar Quiz" pageSize={5} />;
}
