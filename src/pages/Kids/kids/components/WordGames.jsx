import { useState, useEffect, useCallback } from 'react';
import { shuffle } from './utils';

const hangmanWords = ['apple', 'tiger', 'house', 'planet', 'garden', 'puzzle', 'monkey', 'rocket', 'forest', 'ocean'];

export function Hangman() {
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const maxWrong = 6;

  useEffect(() => {
    setWord(hangmanWords[Math.floor(Math.random() * hangmanWords.length)]);
    setGuessed(new Set());
    setWrongCount(0);
  }, []);

  const display = word.split('').map(c => guessed.has(c) ? c : '_');
  const won = display.join('') === word;
  const lost = wrongCount >= maxWrong;

  const handleGuess = (letter) => {
    if (guessed.has(letter) || won || lost) return;
    setGuessed(prev => new Set([...prev, letter]));
    if (!word.includes(letter)) setWrongCount(c => c + 1);
  };

  const reset = () => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessed(new Set());
    setWrongCount(0);
  };

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>🎯 Hangman</h2></div>
      <div className="hangman-lives">Lives: {'❤️'.repeat(maxWrong - wrongCount)}{'🖤'.repeat(wrongCount)}</div>
      <div className="hangman-word">
        {display.map((c, i) => (
          <span key={i} className={`hangman-letter ${c === ' ' ? 'space' : ''} ${c !== '_' ? 'revealed' : ''}`}>
            {c}
          </span>
        ))}
      </div>
      {(won || lost) ? (
        <div className="celebration" style={{ minHeight: 100, padding: 20 }}>
          <h2>{won ? '🎉 You Won!' : '😢 Game Over'}</h2>
          <p>The word was: <strong>{word}</strong></p>
          <button className="back-btn" style={{ marginTop: 12, marginRight: 8 }} onClick={reset}>Play Again</button>
          <button className="back-btn" style={{ marginTop: 12 }} onClick={() => window.location.hash = '#/kids'}>Back</button>
        </div>
      ) : (
        <>
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, marginBottom: 12 }}>Guess a letter</p>
          <div className="hangman-letters">
            {'abcdefghijklmnopqrstuvwxyz'.split('').map(l => (
              <button
                key={l}
                className={`hangman-key ${guessed.has(l) ? (word.includes(l) ? 'used-correct' : 'used-wrong') : ''}`}
                onClick={() => handleGuess(l)}
                disabled={guessed.has(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function WordSearch() {
  const grid = [
    ['C','A','T','D','O','G','E','F'],
    ['A','P','P','L','E','H','I','G'],
    ['R','B','O','O','K','O','F','I'],
    ['S','U','N','S','U','N','S','R'],
    ['T','R','E','E','F','I','H','L'],
    ['A','B','C','D','E','S','T','E'],
    ['R','I','V','E','R','E','A','T'],
    ['F','I','S','H','G','L','R','S']
  ];
  const words = ['CAT', 'DOG', 'SUN', 'TREE', 'FISH', 'RIVER', 'STAR', 'APPLE'];
  const [found, setFound] = useState(new Set());
  const [selectedCells, setSelectedCells] = useState([]);

  const allWords = [
    { word: 'CAT', positions: [[0,0],[0,1],[0,2]] },
    { word: 'DOG', positions: [[0,3],[0,4],[0,5]] },
    { word: 'APPLE', positions: [[1,0],[1,1],[1,2],[1,3],[1,4]] },
    { word: 'SUN', positions: [[3,0],[3,1],[3,2]] },
    { word: 'TREE', positions: [[4,0],[4,1],[4,2],[4,3]] },
    { word: 'FISH', positions: [[7,0],[7,1],[7,2],[7,3]] },
    { word: 'STAR', positions: [[4,4],[4,5],[4,6],[4,7]] },
    { word: 'RIVER', positions: [[6,0],[6,1],[6,2],[6,3],[6,4]] }
  ];

  const checkSelection = (cells) => {
    for (const w of allWords) {
      if (found.has(w.word)) continue;
      const match = w.positions.length === cells.length &&
        w.positions.every(([r,c], i) => r === cells[i][0] && c === cells[i][1]);
      if (match) {
        setFound(prev => new Set([...prev, w.word]));
        return;
      }
    }
  };

  const handleCellClick = (r, c) => {
    if (found.has(grid[r][c])) return;
    if (selectedCells.length > 0) {
      const newCells = [...selectedCells, [r,c]];
      setSelectedCells(newCells);
      checkSelection(newCells);
    }
  };

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>🔤 Word Search</h2></div>
      <div className="word-list">
        {words.map(w => (
          <span key={w} className={`word-list-item ${found.has(w) ? 'found' : ''}`}>{w}</span>
        ))}
      </div>
      <div className="word-search-grid" style={{ gridTemplateColumns: `repeat(${grid[0].length}, 1fr)` }}>
        {grid.map((row, r) => row.map((char, c) => (
          <div
            key={`${r}-${c}`}
            className={`word-search-cell ${found.size > 0 && allWords.some(w => w.word === [...found].find(f => w.word === f) && w.positions.some(([pr,pc]) => pr===r&&pc===c)) ? 'found' : ''} ${selectedCells.some(([sr,sc]) => sr===r&&sc===c) ? 'selected' : ''}`}
            onClick={() => handleCellClick(r, c)}
          >
            {char}
          </div>
        )))}
      </div>
      {found.size === words.length && (
        <div className="celebration" style={{ minHeight: 100, padding: 20 }}>
          <h2>🎉 All Words Found!</h2>
          <button className="back-btn" style={{ marginTop: 12 }} onClick={() => window.location.hash = '#/kids'}>Back</button>
        </div>
      )}
    </div>
  );
}

const crosswordClues = [
  { clue: 'Frozen water', answer: 'ICE', row: 0, col: 0, dir: 'across' },
  { clue: 'Opposite of hot', answer: 'COLD', row: 0, col: 0, dir: 'down' },
  { clue: 'Not fast', answer: 'SLOW', row: 2, col: 0, dir: 'across' },
  { clue: 'Celestial body', answer: 'STAR', row: 2, col: 1, dir: 'down' },
  { clue: 'Body of water', answer: 'LAKE', row: 4, col: 0, dir: 'across' }
];

export function Crossword() {
  const rows = 6, cols = 6;
  const [grid, setGrid] = useState(() => {
    const g = Array(rows).fill(null).map(() => Array(cols).fill(''));
    crosswordClues.forEach(c => {
      if (c.dir === 'across') {
        for (let i = 0; i < c.answer.length; i++) g[c.row][c.col + i] = c.answer[i];
      } else {
        for (let i = 0; i < c.answer.length; i++) g[c.row + i][c.col] = c.answer[i];
      }
    });
    return g;
  });
  const [solved, setSolved] = useState(false);

  const checkSolve = useCallback(() => {
    const allFilled = clue => {
      if (clue.dir === 'across') {
        return clue.answer.split('').every((_, i) => grid[clue.row][clue.col + i] !== '');
      }
      return clue.answer.split('').every((_, i) => grid[clue.row + i][clue.col] !== '');
    };
    if (crosswordClues.every(allFilled)) setSolved(true);
  }, [grid]);

  useEffect(() => { checkSolve(); }, [grid, checkSolve]);

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>📝 Crossword</h2></div>
      <p className="activity-description">Click a cell and type the letter. Clues below.</p>
      <div className="crossword-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array(rows).fill(null).map((_, r) => Array(cols).fill(null).map((_, c) => {
          const isUsed = grid[r][c] !== '';
          return (
            <div key={`${r}-${c}`} className={`crossword-cell ${isUsed ? '' : 'empty'}`}>
              {isUsed ? (
                <input
                  type="text"
                  maxLength={1}
                  value={grid[r][c] === ' ' ? '' : grid[r][c]}
                  onChange={e => {
                    const newGrid = grid.map(row => [...row]);
                    newGrid[r][c] = e.target.value.toUpperCase();
                    setGrid(newGrid);
                  }}
                />
              ) : ''}
            </div>
          );
        }))}
      </div>
      <div className="crossword-clues">
        <p style={{ color: '#60a5fa', fontWeight: 600, marginBottom: 8 }}>Clues:</p>
        {crosswordClues.map((clue, i) => (
          <div key={i} className="crossword-clue">
            <strong>{clue.dir === 'across' ? '→' : '↓'}</strong> {clue.clue} ({clue.answer.length} letters)
          </div>
        ))}
      </div>
      {solved && (
        <div className="celebration" style={{ minHeight: 80, padding: 16 }}>
          <h2>🎉 Crossword Complete!</h2>
          <button className="back-btn" style={{ marginTop: 12 }} onClick={() => window.location.hash = '#/kids'}>Back</button>
        </div>
      )}
    </div>
  );
}

const sentenceBuilderSentences = [
  { words: ['The', 'cat', 'is', 'sleeping'] },
  { words: ['I', 'love', 'to', 'read', 'books'] },
  { words: ['She', 'plays', 'in', 'the', 'park'] },
  { words: ['We', 'are', 'going', 'to', 'school'] },
  { words: ['Birds', 'fly', 'in', 'the', 'sky'] },
  { words: ['He', 'has', 'a', 'red', 'ball'] },
  { words: ['They', 'eat', 'lunch', 'together'] },
  { words: ['The', 'sun', 'is', 'very', 'bright'] },
  { words: ['My', 'dog', 'likes', 'to', 'run'] },
  { words: ['A', 'fish', 'lives', 'in', 'water'] }
];

export function SentenceBuilder() {
  const [current, setCurrent] = useState(0);
  const [jumbled, setJumbled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setJumbled(shuffle(sentenceBuilderSentences[current].words.map((w, i) => ({ word: w, origIdx: i }))));
    setSelected([]);
    setSolved(false);
  }, [current]);

  const handleWordClick = (idx) => {
    if (selected.includes(idx)) return;
    setSelected(prev => [...prev, idx]);
  };

  const handleSelectedClick = (pos) => {
    setSelected(prev => prev.filter((_, i) => i !== pos));
  };

  useEffect(() => {
    if (selected.length === sentenceBuilderSentences[current].words.length) {
      const built = selected.map(idx => jumbled[idx].word);
      const correct = built.join(' ') === sentenceBuilderSentences[current].words.join(' ');
      if (correct) setSolved(true);
    }
  }, [selected, jumbled, current]);

  const nextSentence = () => {
    if (current < sentenceBuilderSentences.length - 1) setCurrent(c => c + 1);
    else setCurrent(0);
  };

  return (
    <div className="activity-page">
      <div className="activity-header"><h2>📝 Sentence Builder</h2></div>
      <p className="activity-description">Click words in the correct order to build the sentence</p>
      <div className="sentence-builder">
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>Sentence {current + 1} of {sentences.length}</p>
        <div className="sentence-answer">
          {selected.map((idx, pos) => (
            <span key={pos} className="sentence-answer-word" onClick={() => handleSelectedClick(pos)}>
              {jumbled[idx].word}
            </span>
          ))}
        </div>
        <div className="jumbled-words">
          {jumbled.map((item, idx) => (
            <span
              key={idx}
              className={`jumbled-word ${selected.includes(idx) ? 'selected' : ''}`}
              onClick={() => handleWordClick(idx)}
            >
              {item.word}
            </span>
          ))}
        </div>
        {solved && (
          <div className="celebration" style={{ minHeight: 80, padding: 16 }}>
            <h2>✅ Correct!</h2>
            <button className="back-btn" style={{ marginTop: 12 }} onClick={nextSentence}>
              {current < sentences.length - 1 ? 'Next Sentence' : 'Start Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function SpellingBee() {
  const words = [
    { word: 'APPLE', hint: 'A fruit that keeps the doctor away' },
    { word: 'TIGER', hint: 'A large striped cat' },
    { word: 'HOUSE', hint: 'Where you live' },
    { word: 'PLANET', hint: 'Earth is one of these' },
    { word: 'GARDEN', hint: 'Where flowers grow' },
    { word: 'PUZZLE', hint: 'A brain teaser' },
    { word: 'MONKEY', hint: 'Lives in trees and loves bananas' },
    { word: 'ROCKET', hint: 'Flies to space' },
    { word: 'FOREST', hint: 'Full of trees' },
    { word: 'OCEAN', hint: 'Very large body of water' }
  ];
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleCheck = () => {
    if (guess.toUpperCase() === words[current].word) {
      setFeedback('correct');
      setTimeout(() => {
        setCurrent(c => (c + 1) % words.length);
        setGuess('');
        setFeedback('');
      }, 1500);
    } else {
      setFeedback('wrong');
    }
  };

  const w = words[current];
  return (
    <div className="activity-page">
      <div className="activity-header"><h2>🐝 Spelling Bee</h2></div>
      <div className="spelling-content">
        <p className="spelling-hint">Hint: {w.hint}</p>
        <p className="spelling-blank">{w.word.split('').map(() => '_').join(' ')}</p>
        <input
          type="text"
          className={`spelling-input ${feedback === 'correct' ? 'correct' : feedback === 'wrong' ? 'wrong' : ''}`}
          value={guess}
          onChange={e => { setGuess(e.target.value); setFeedback(''); }}
          placeholder="Type the word..."
          maxLength={w.word.length}
        />
        <button className="story-submit-btn" onClick={handleCheck} disabled={!guess.trim()}>Check</button>
        {feedback === 'correct' && <p className="spelling-feedback correct">✅ Correct!</p>}
        {feedback === 'wrong' && <p className="spelling-feedback wrong">❌ Try again!</p>}
      </div>
    </div>
  );
}
