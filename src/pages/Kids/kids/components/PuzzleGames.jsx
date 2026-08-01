import { useState, useEffect, useCallback } from 'react';
import { shuffle } from './utils';

export function DragDropPuzzle() {
  const [positions, setPositions] = useState({});
  const [selectedPiece, setSelectedPiece] = useState(null);
  const pieces = ['🍎', '🌟', '🎈', '🍕'];
  const slots = [0, 1, 2, 3];
  const complete = Object.keys(positions).length === 4;
  return (
    <div className="activity-page">
      <div className="activity-header"><h2>🧩 Drag & Drop Puzzle</h2></div>
      {complete ? (
        <div className="celebration">
          <h2>🎉 Puzzle Complete!</h2>
          <p style={{ fontSize: 48 }}>🧩</p>
          <button className="back-btn" style={{ marginTop: 20 }} onClick={() => window.location.hash = '#/kids'}>Back</button>
        </div>
      ) : (
        <>
          <p className="activity-description">Select a piece, then click a slot to place it</p>
          <div className="puzzle-grid">
            {slots.map(slot => (
              <div
                key={slot}
                className={`puzzle-slot ${positions[slot] !== undefined ? 'filled' : ''}`}
                onClick={() => {
                  if (selectedPiece !== null) {
                    setPositions(prev => ({ ...prev, [slot]: selectedPiece }));
                    setSelectedPiece(null);
                  }
                }}
              >
                {positions[slot] !== undefined ? pieces[positions[slot]] : ''}
              </div>
            ))}
          </div>
          <div className="puzzle-pieces">
            {pieces.map((p, i) => (
              <div
                key={i}
                className={`puzzle-piece ${Object.values(positions).includes(i) ? 'placed' : ''} ${selectedPiece === i ? 'selected' : ''}`}
                onClick={() => { if (!Object.values(positions).includes(i)) setSelectedPiece(i); }}
              >
                {p}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ConnectFour() {
  const rows = 6, cols = 7;
  const [grid, setGrid] = useState(Array(rows).fill(null).map(() => Array(cols).fill(null)));
  const [player, setPlayer] = useState(1);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const dropPiece = (col) => {
    if (winner || gameOver) return;
    const newGrid = grid.map(row => [...row]);
    for (let r = rows - 1; r >= 0; r--) {
      if (newGrid[r][col] === null) {
        newGrid[r][col] = player;
        setGrid(newGrid);
        checkWin(newGrid, r, col, player);
        setPlayer(p => p === 1 ? 2 : 1);
        return;
      }
    }
  };

  const checkWin = (g, row, col, p) => {
    const dirs = [[0,1],[1,0],[1,1],[1,-1]];
    for (const [dr, dc] of dirs) {
      let count = 1;
      for (let d = 1; d < 4; d++) {
        const nr = row + dr * d, nc = col + dc * d;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc] === p) count++;
        else break;
      }
      for (let d = 1; d < 4; d++) {
        const nr = row - dr * d, nc = col - dc * d;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc] === p) count++;
        else break;
      }
      if (count >= 4) { setWinner(p); setGameOver(true); return; }
    }
    if (g.every(r => r.every(c => c !== null))) setGameOver(true);
  };

  const reset = () => {
    setGrid(Array(rows).fill(null).map(() => Array(cols).fill(null)));
    setPlayer(1);
    setWinner(null);
    setGameOver(false);
  };

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>🔴 Connect Four</h2></div>
      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>
        {winner ? `Player ${winner === 1 ? '🔴' : '🟡'} wins!` : gameOver ? 'Draw!' : `Player ${player === 1 ? '🔴' : '🟡'}'s turn`}
      </p>
      <div className="connect-four-grid">
        {grid.map((row, r) => row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={`connect-four-cell ${cell === 1 ? 'player1' : cell === 2 ? 'player2' : ''}`}
            onClick={() => dropPiece(c)}
            disabled={cell !== null || winner !== null}
          />
        )))}
      </div>
      {(winner || gameOver) && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button className="back-btn" onClick={reset}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export function MazeEscape() {
  const [playerPos, setPlayerPos] = useState([1, 1]);
  const endPos = [6, 6];

  const handleKey = useCallback((e) => {
    const [r, c] = playerPos;
    let nr = r, nc = c;
    if (e.key === 'ArrowUp') nr--;
    else if (e.key === 'ArrowDown') nr++;
    else if (e.key === 'ArrowLeft') nc--;
    else if (e.key === 'ArrowRight') nc++;
    else return;
    if (maze[nr]?.[nc] === 0) setPlayerPos([nr, nc]);
  }, [playerPos]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const won = playerPos[0] === endPos[0] && playerPos[1] === endPos[1];

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>🧩 Maze Escape</h2></div>
      <p className="activity-description">Use arrow keys to navigate from 🟢 to 🔴</p>
      <div className="maze-grid" style={{ gridTemplateColumns: `repeat(${maze[0].length}, 1fr)` }}>
        {maze.map((row, r) => row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={`maze-cell ${cell === 1 ? 'wall' : 'path'} ${r === 1 && c === 1 ? 'start' : ''} ${r === endPos[0] && c === endPos[1] ? 'end' : ''} ${r === playerPos[0] && c === playerPos[1] ? 'player' : ''}`}
          >
            {r === 1 && c === 1 ? '🟢' : r === endPos[0] && c === endPos[1] ? '🏁' : r === playerPos[0] && c === playerPos[1] ? '🧑' : ''}
          </div>
        )))}
      </div>
      {won && (
        <div className="celebration" style={{ minHeight: 80, padding: 16 }}>
          <h2>🎉 You Escaped!</h2>
          <button className="back-btn" style={{ marginTop: 12 }} onClick={() => { setPlayerPos([1, 1]); }}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export function SpotDifference() {
  const size = 4;
  const generatePattern = () => {
    const p = [];
    for (let i = 0; i < size * size; i++) {
      p.push(Math.random() > 0.5 ? '#60a5fa' : '#f1f5f9');
    }
    return p;
  };
  const [pattern1] = useState(generatePattern);
  const [pattern2, _setPattern2] = useState(() => {
    const p = [...generatePattern()];
    const diffIndices = new Set();
    while (diffIndices.size < 3) {
      diffIndices.add(Math.floor(Math.random() * p.length));
    }
    diffIndices.forEach(i => { p[i] = p[i] === '#60a5fa' ? '#f1f5f9' : '#60a5fa'; });
    return { pattern: p, diffs: diffIndices };
  });
  const [found, setFound] = useState(new Set());

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>🔍 Spot the Difference</h2></div>
      <p className="activity-description">Find 3 differences between the two patterns</p>
      <div className="spot-grid">
        <div className="spot-side">
          <h3>Pattern A</h3>
          <div className="spot-pattern" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {pattern1.map((color, i) => (
              <div key={i} className="spot-cell" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
        <div className="spot-side">
          <h3>Pattern B (click differences)</h3>
          <div className="spot-pattern" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {pattern2.pattern.map((color, i) => (
              <div
                key={i}
                className={`spot-cell clickable ${pattern2.diffs.has(i) ? (found.has(i) ? 'found' : 'difference') : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  if (pattern2.diffs.has(i)) setFound(prev => new Set([...prev, i]));
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
        Found: {found.size} / {pattern2.diffs.size}
      </p>
      {found.size === pattern2.diffs.size && (
        <div className="celebration" style={{ minHeight: 80, padding: 16 }}>
          <h2>🎉 All Differences Found!</h2>
          <button className="back-btn" style={{ marginTop: 12 }} onClick={() => window.location.hash = '#/kids'}>Back</button>
        </div>
      )}
    </div>
  );
}

export function EmojiStory() {
  const prompts = [
    { emojis: '🐕 🌳 🎾', hint: 'A dog playing in the park' },
    { emojis: '🌊 🏖️ ☀️', hint: 'A day at the beach' },
    { emojis: '🚀 🌙 ⭐', hint: 'A trip to the moon' },
    { emojis: '🐱 🏠 🐭', hint: 'A cat chasing a mouse' },
    { emojis: '🍕 🧀 🍅', hint: 'Making a pizza' },
    { emojis: '📚 🏫 ✏️', hint: 'A day at school' },
    { emojis: '🌧️ ☂️ 🐸', hint: 'A rainy day adventure' },
    { emojis: '🎂 🎈 🎁', hint: 'A birthday party' },
    { emojis: '🍦 🍧 🍫', hint: 'A trip to the ice cream shop' },
    { emojis: '🐠 🐡 🐟', hint: 'Exploring the underwater world' },
    { emojis: '🎪 🎠 🎡', hint: 'A fun day at the carnival' },
    { emojis: '🦁 🐘 🦒', hint: 'A trip to the zoo' },
    { emojis: '🌈 ☁️ 🌤️', hint: 'A sunny day after rain' },
    { emojis: '🎨 🖌️ 🖼️', hint: 'A creative afternoon of painting' },
    { emojis: '🚲 🌲 🌻', hint: 'A bike ride in the park' },
    { emojis: '🧩 🧩 🧩', hint: 'Putting together a puzzle' },
    { emojis: '🏖️ 🐚 🌊', hint: 'Building sandcastles on the beach' },
    { emojis: '🎤 🎵 🎧', hint: 'A fun karaoke night' },
    { emojis: '🧹 🪣 🧽', hint: 'Cleaning up the house' },
    { emojis: '🌸 🐛 🦋', hint: 'Watching a butterfly emerge' },
    { emojis: '🧙 🧙‍♂️ 🧙‍♀️', hint: 'A magical wizard adventure' },
    { emojis: '🦕 🌿 🦴', hint: 'Discovering dinosaurs' },
    { emojis: '🪁 🌬️ 🧵', hint: 'Flying a kite in the wind' },
    { emojis: '🍪 🥛 🍪', hint: 'Baking cookies with grandma' },
    { emojis: '🧒 👦 👧', hint: 'A playdate with friends' }
  ];
  const [current, setCurrent] = useState(0);
  const [story, setStory] = useState('');

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>✍️ Emoji Story Builder</h2></div>
      <p className="activity-description">Write a story using these emojis as inspiration</p>
      <div className="emoji-story-display">{prompts[current].emojis}</div>
      <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, marginBottom: 8 }}>💡 {prompts[current].hint}</p>
      <textarea
        className="emoji-story-textarea"
        placeholder="Write your story here..."
        value={story}
        onChange={e => setStory(e.target.value)}
      />
      <div style={{ textAlign: 'center', marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button className="story-submit-btn" disabled={story.trim().length < 10} onClick={() => {
          if (current < prompts.length - 1) { setCurrent(c => c + 1); setStory(''); }
          else { setCurrent(0); setStory(''); }
        }}>
          {current < prompts.length - 1 ? 'Next Story' : 'Start Over'}
        </button>
      </div>
    </div>
  );
}

export function BuildWords() {
  const wordList = ['CAT', 'DOG', 'SUN', 'BALL', 'FISH', 'BIRD', 'STAR', 'MOON', 'TREE', 'BOOK', 'FROG', 'BEAR', 'LION', 'SHIP', 'KITE', 'BELL', 'DRUM', 'LAMP', 'BOAT', 'LEAF', 'WIND', 'SNOW', 'RAIN', 'FIRE', 'DARK', 'WAVE', 'SEED', 'COIN', 'ROCK', 'SAND'];
  const [current, setCurrent] = useState(0);
  const word = wordList[current];
  const [letters, setLetters] = useState([]);
  const [built, setBuilt] = useState([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setLetters(shuffle(word.split('').map((l, i) => ({ letter: l, id: i }))));
    setBuilt([]);
    setSolved(false);
  }, [current, word]);

  const placeLetter = (id) => {
    if (built.includes(id)) return;
    setBuilt(prev => [...prev, id]);
  };

  const removeLetter = (pos) => {
    setBuilt(prev => prev.filter((_, i) => i !== pos));
  };

  useEffect(() => {
    if (built.length === word.length) {
      const result = built.map(id => letters.find(l => l.id === id).letter).join('');
      if (result === word) setSolved(true);
    }
  }, [built, letters, word]);

  const next = () => {
    if (current < wordList.length - 1) setCurrent(c => c + 1);
    else setCurrent(0);
  };

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>🔤 Build Words</h2></div>
      <p className="activity-description">Click the letters in the correct order</p>
      <div className="word-display">
        {Array(word.length).fill(null).map((_, i) => (
          <div key={i} className="word-slot" onClick={() => removeLetter(i)}>
            {built[i] !== undefined ? letters.find(l => l.id === built[i])?.letter : ''}
          </div>
        ))}
      </div>
      <div className="letter-tiles">
        {letters.map(l => (
          <div
            key={l.id}
            className={`letter-tile ${built.includes(l.id) ? 'used' : ''}`}
            onClick={() => placeLetter(l.id)}
          >
            {l.letter}
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', color: '#cbd5e1', fontSize: 16 }}>
        {built.length}/{word.length} letters placed
      </p>
      {solved && (
        <div className="celebration" style={{ minHeight: 80, padding: 16 }}>
          <h2>✅ "{word}"</h2>
          <button className="back-btn" style={{ marginTop: 12 }} onClick={next}>Next Word</button>
        </div>
      )}
    </div>
  );
}

const arrangeSentences = [
  'The cat sat on the mat',
  'I like to play outside',
  'She read a funny book',
  'We went to the zoo',
  'Birds sing in the morning',
  'He has a new bicycle',
  'They swam in the pool',
  'My mom makes good pizza',
  'The dog ran very fast',
  'It is a sunny day today',
  'The baby cried all night long',
  'I can count up to ten',
  'We saw many birds today',
  'The sun is very bright',
  'I like to eat apples',
  'The boy kicked the ball',
  'We went to the park',
  'She wore a blue dress',
  'I love my mom and dad',
  'The rain made a big puddle',
  'We climbed a tall tree',
  'He ate a yummy snack',
  'I can spell my name',
  'The cat chased the mouse',
  'We played in the snow',
  'The bird flew up high',
  'I like to draw pictures',
  'We ate lunch together',
  'The dog wagged his tail'
];

export function ArrangeSentences() {
  const [current, setCurrent] = useState(0);
  const [jumbled, setJumbled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const words = arrangeSentences[current].split(' ');
    setJumbled(shuffle(words.map((w, i) => ({ word: w, idx: i }))));
    setSelected([]);
    setSolved(false);
  }, [current]);

  const handleClick = (pos) => {
    if (selected.includes(pos)) return;
    setSelected(prev => [...prev, pos]);
  };

  const removeWord = (pos) => {
    setSelected(prev => prev.filter((_, i) => i !== pos));
  };

  useEffect(() => {
    if (selected.length === jumbled.length && jumbled.length > 0) {
      const built = selected.map(i => jumbled[i].word).join(' ');
      if (built === arrangeSentences[current]) setSolved(true);
    }
  }, [selected, jumbled, current]);

  const next = () => {
    if (current < arrangeSentences.length - 1) setCurrent(c => c + 1);
    else setCurrent(0);
  };

  const ansWords = selected.map(i => jumbled[i]?.word).filter(Boolean);

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>📝 Arrange Sentences</h2></div>
      <p className="activity-description">Click words in the correct order</p>
      <div className="sentence-answer">
        {ansWords.map((w, i) => (
          <span key={i} className="sentence-answer-word" onClick={() => removeWord(i)}>{w}</span>
        ))}
      </div>
      <div className="jumbled-words">
        {jumbled.map((item, i) => (
          <span
            key={i}
            className={`jumbled-word ${selected.includes(i) ? 'selected' : ''}`}
            onClick={() => handleClick(i)}
          >
            {item.word}
          </span>
        ))}
      </div>
      {solved && (
        <div className="celebration" style={{ minHeight: 80, padding: 16 }}>
          <h2>✅ Correct!</h2>
          <button className="back-btn" style={{ marginTop: 12 }} onClick={next}>Next</button>
        </div>
      )}
    </div>
  );
}
