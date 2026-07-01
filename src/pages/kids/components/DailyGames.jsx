import { useState } from 'react';
import { shuffle } from './utils';
import QuizTemplate from '../QuizTemplate';

export function WordOfDay() {
  const words = [
    { word: 'Enormous', type: 'adjective', def: 'Very large or huge', example: 'The elephant was enormous.' },
    { word: 'Brave', type: 'adjective', def: 'Ready to face danger or pain', example: 'The brave firefighter saved the cat.' },
    { word: 'Discover', type: 'verb', def: 'To find something new', example: 'She wants to discover new places.' },
    { word: 'Brilliant', type: 'adjective', def: 'Very bright or clever', example: 'That was a brilliant idea!' },
    { word: 'Journey', type: 'noun', def: 'A trip or travel from one place to another', example: 'They went on a long journey.' },
    { word: 'Curious', type: 'adjective', def: 'Eager to learn or know more', example: 'The curious kitten explored the garden.' },
    { word: 'Gentle', type: 'adjective', def: 'Soft and kind', example: 'She had a gentle touch.' },
    { word: 'Gigantic', type: 'adjective', def: 'Extremely large', example: 'A gigantic whale swam by.' },
    { word: 'Whisper', type: 'verb', def: 'To speak very softly', example: 'He had to whisper in the library.' },
    { word: 'Magnificent', type: 'adjective', def: 'Extremely beautiful and impressive', example: 'The sunset was magnificent.' }
  ];
  const [current] = useState(() => words[Math.floor(Math.random() * words.length)]);
  const [quiz, setQuiz] = useState(null);
  const [_answered, setAnswered] = useState(false);

  const startQuiz = () => {
    const wrong = words.filter(w => w.word !== current.word);
    const opts = shuffle([current, wrong[Math.floor(Math.random() * wrong.length)], wrong[Math.floor(Math.random() * wrong.length)], wrong[Math.floor(Math.random() * wrong.length)]]).slice(0, 4);
    setQuiz({ question: `What does "${current.word}" mean?`, options: opts.map(w => w.def), correctIndex: opts.indexOf(current) });
    setAnswered(false);
  };

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>📖 Word of the Day</h2></div>
      {!quiz ? (
        <>
          <div className="word-of-day-card">
            <h3>{current.word}</h3>
            <span className="word-type">{current.type}</span>
            <p className="word-def">{current.def}</p>
            <p className="word-example">💬 "{current.example}"</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className="story-submit-btn" onClick={startQuiz}>Take Quiz</button>
          </div>
        </>
      ) : (
        <QuizTemplate questions={[{ question: quiz.question, options: quiz.options, correctIndex: quiz.correctIndex, emoji: '📖' }]} title="Word Quiz" />
      )}
    </div>
  );
}

export function CountryOfDay() {
  const countries = [
    { name: 'Japan', capital: 'Tokyo', fact: 'Japan has over 6,800 islands.', continent: 'Asia' },
    { name: 'Brazil', capital: 'Brasília', fact: 'Brazil is home to the Amazon rainforest.', continent: 'South America' },
    { name: 'Australia', capital: 'Canberra', fact: 'Australia is both a country and a continent.', continent: 'Oceania' },
    { name: 'Egypt', capital: 'Cairo', fact: 'The Great Pyramids are in Egypt.', continent: 'Africa' },
    { name: 'Canada', capital: 'Ottawa', fact: 'Canada has the longest coastline in the world.', continent: 'North America' },
    { name: 'France', capital: 'Paris', fact: 'The Eiffel Tower is in Paris.', continent: 'Europe' },
    { name: 'India', capital: 'New Delhi', fact: 'India is the seventh-largest country by area.', continent: 'Asia' },
    { name: 'Kenya', capital: 'Nairobi', fact: 'Kenya is known for its savannah and wildlife.', continent: 'Africa' }
  ];
  const [current] = useState(() => countries[Math.floor(Math.random() * countries.length)]);
  const [quizActive, setQuizActive] = useState(false);

  if (quizActive) {
    const otherCapitals = countries.filter(c => c.name !== current.name).map(c => c.capital);
    const opts = shuffle([current.capital, ...otherCapitals.slice(0, 3)]);
    return (
      <QuizTemplate
        questions={[{ question: `What is the capital of ${current.name}?`, options: opts, correctIndex: opts.indexOf(current.capital), emoji: '🌍' }]}
        title="Country Quiz"
      />
    );
  }

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>🌍 Country of the Day</h2></div>
      <div className="word-of-day-card">
        <h3>{current.name}</h3>
        <p className="word-def"><strong>Continent:</strong> {current.continent}</p>
        <div className="fact-card" style={{ margin: '12px 0 0' }}>
          <h3>💡 Did You Know?</h3>
          <p>{current.fact}</p>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button className="story-submit-btn" onClick={() => setQuizActive(true)}>Take Capital Quiz</button>
      </div>
    </div>
  );
}

export function WorldMapPuzzle() {
  const continents = [
    { name: 'Asia', position: 'Center-East' },
    { name: 'Africa', position: 'Center' },
    { name: 'North America', position: 'Top-Left' },
    { name: 'South America', position: 'Bottom-Left' },
    { name: 'Antarctica', position: 'Bottom' },
    { name: 'Europe', position: 'Top-Center' },
    { name: 'Australia', position: 'Bottom-Right' }
  ];
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState({});
  const [highlighted, setHighlighted] = useState(null);

  const handleContinentClick = (name) => {
    setSelected(name);
  };

  const handlePositionClick = (pos) => {
    if (!selected) return;
    setPlaced(prev => ({ ...prev, [pos]: selected }));
    setSelected(null);
  };

  const complete = Object.keys(placed).length === continents.length;

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>🌍 World Map Puzzle</h2></div>
      <p className="activity-description">Click a continent name, then click its position on the map</p>
      <div className="continent-grid">
        <div>
          <h3 style={{ color: '#60a5fa', fontSize: 14, marginBottom: 8, textAlign: 'center' }}>Continents</h3>
          {continents.map(c => (
            <div
              key={c.name}
              className={`continent-name ${selected === c.name ? 'selected' : ''} ${Object.values(placed).includes(c.name) ? 'matched' : ''}`}
              onClick={() => handleContinentClick(c.name)}
              disabled={Object.values(placed).includes(c.name)}
            >
              {Object.values(placed).includes(c.name) ? '✅ ' : ''}{c.name}
            </div>
          ))}
        </div>
        <div>
          <h3 style={{ color: '#60a5fa', fontSize: 14, marginBottom: 8, textAlign: 'center' }}>Positions</h3>
          {continents.map(c => (
            <div
              key={c.position}
              className={`continent-position ${placed[c.position] ? 'filled' : ''} ${highlighted === c.position ? 'highlight' : ''}`}
              onClick={() => handlePositionClick(c.position)}
              onMouseEnter={() => setHighlighted(c.position)}
              onMouseLeave={() => setHighlighted(null)}
            >
              {placed[c.position] || c.position}
            </div>
          ))}
        </div>
      </div>
      {complete && (
        <div className="celebration" style={{ minHeight: 80, padding: 16 }}>
          <h2>🎉 World Map Complete!</h2>
          <button className="back-btn" style={{ marginTop: 12 }} onClick={() => window.location.hash = '#/kids'}>Back</button>
        </div>
      )}
    </div>
  );
}

export function ChessKids() {
  const initialBoard = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖']
  ];
  const [board, setBoard] = useState(initialBoard.map(r => [...r]));
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState('white');
  const [message, setMessage] = useState('White\'s turn. Click a piece to select it.');

  const isWhite = (piece) => piece && piece.charCodeAt(0) >= 9812 && piece.charCodeAt(0) <= 9817;
  const isBlack = (piece) => piece && piece.charCodeAt(0) >= 9818 && piece.charCodeAt(0) <= 9823;

  const getValidMoves = (r, c) => {
    const piece = board[r][c];
    if (!piece) return [];
    const moves = [];
    const pieceType = piece.toLowerCase();
    const forward = isWhite(piece) ? -1 : 1;
    const startRow = isWhite(piece) ? 6 : 1;

    if (pieceType === '♟') {
      if (r + forward >= 0 && r + forward < 8 && !board[r + forward][c]) {
        moves.push([r + forward, c]);
        if (r === startRow && !board[r + 2 * forward][c]) moves.push([r + 2 * forward, c]);
      }
      if (c > 0 && board[r + forward]?.[c - 1] && (isWhite(piece) ? isBlack(board[r + forward][c - 1]) : isWhite(board[r + forward][c - 1]))) {
        moves.push([r + forward, c - 1]);
      }
      if (c < 7 && board[r + forward]?.[c + 1] && (isWhite(piece) ? isBlack(board[r + forward][c + 1]) : isWhite(board[r + forward][c + 1]))) {
        moves.push([r + forward, c + 1]);
      }
    } else if (pieceType === '♜' || pieceType === '♖') {
      const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
      dirs.forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
          const nr = r + dr * i, nc = c + dc * i;
          if (nr < 0 || nr > 7 || nc < 0 || nc > 7) break;
          if (board[nr][nc]) {
            if ((isWhite(piece) ? isBlack(board[nr][nc]) : isWhite(board[nr][nc]))) moves.push([nr, nc]);
            break;
          }
          moves.push([nr, nc]);
        }
      });
    } else if (pieceType === '♞' || pieceType === '♘') {
      const jumps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      jumps.forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!board[nr][nc] || (isWhite(piece) ? isBlack(board[nr][nc]) : isWhite(board[nr][nc])))) {
          moves.push([nr, nc]);
        }
      });
    } else if (pieceType === '♝' || pieceType === '♗') {
      const dirs = [[1,1],[1,-1],[-1,1],[-1,-1]];
      dirs.forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
          const nr = r + dr * i, nc = c + dc * i;
          if (nr < 0 || nr > 7 || nc < 0 || nc > 7) break;
          if (board[nr][nc]) {
            if ((isWhite(piece) ? isBlack(board[nr][nc]) : isWhite(board[nr][nc]))) moves.push([nr, nc]);
            break;
          }
          moves.push([nr, nc]);
        }
      });
    } else if (pieceType === '♛' || pieceType === '♕') {
      const dirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
      dirs.forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
          const nr = r + dr * i, nc = c + dc * i;
          if (nr < 0 || nr > 7 || nc < 0 || nc > 7) break;
          if (board[nr][nc]) {
            if ((isWhite(piece) ? isBlack(board[nr][nc]) : isWhite(board[nr][nc]))) moves.push([nr, nc]);
            break;
          }
          moves.push([nr, nc]);
        }
      });
    } else if (pieceType === '♚' || pieceType === '♔') {
      const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
      dirs.forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!board[nr][nc] || (isWhite(piece) ? isBlack(board[nr][nc]) : isWhite(board[nr][nc])))) {
          moves.push([nr, nc]);
        }
      });
    }
    return moves;
  };

  const [validMoves, setValidMoves] = useState([]);

  const handleSquareClick = (r, c) => {
    if (selected) {
      if (validMoves.some(([mr, mc]) => mr === r && mc === c)) {
        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = newBoard[selected[0]][selected[1]];
        newBoard[selected[0]][selected[1]] = '';
        setBoard(newBoard);
        setTurn(t => t === 'white' ? 'black' : 'white');
        setMessage(`${turn === 'white' ? 'Black' : 'White'}'s turn.`);
        setSelected(null);
        setValidMoves([]);
      } else {
        setSelected(null);
        setValidMoves([]);
        setMessage(`${turn.charAt(0).toUpperCase() + turn.slice(1)}'s turn.`);
      }
      return;
    }
    const piece = board[r][c];
    if (!piece) return;
    if ((turn === 'white' && isWhite(piece)) || (turn === 'black' && isBlack(piece))) {
      setSelected([r, c]);
      const moves = getValidMoves(r, c);
      setValidMoves(moves);
      setMessage(`Selected ${piece}. ${moves.length} valid moves.`);
    }
  };

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>♟️ Chess for Kids</h2></div>
      <p className="chess-info">{message}</p>
      <div className="chess-board">
        {board.map((row, r) => row.map((piece, c) => {
          const isLight = (r + c) % 2 === 0;
          const isSelected = selected && selected[0] === r && selected[1] === c;
          const isValid = validMoves.some(([mr, mc]) => mr === r && mc === c);
          return (
            <div
              key={`${r}-${c}`}
              className={`chess-square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isValid ? 'valid-move' : ''}`}
              onClick={() => handleSquareClick(r, c)}
            >
              {piece || ''}
            </div>
          );
        }))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button className="back-btn" onClick={() => {
          setBoard(initialBoard.map(r => [...r]));
          setSelected(null);
          setTurn('white');
          setValidMoves([]);
          setMessage('White\'s turn. Click a piece to select it.');
        }}>Reset Board</button>
      </div>
    </div>
  );
}
