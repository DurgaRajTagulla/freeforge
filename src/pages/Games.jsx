import { useNavigate } from 'react-router-dom';
import '../pages/games/Games.css';

const games = [
  { id: 'snake-game', title: 'Snake Game', icon: '🐍', desc: 'Classic snake game with obstacles, 3 difficulty levels and high scores' },
  { id: 'game-2048', title: '2048', icon: '🔢', desc: 'Slide and merge tiles to reach 2048. Undo support and best score tracking' },
  { id: 'sudoku', title: 'Sudoku', icon: '🧩', desc: 'Logic puzzle with 3 difficulty levels, hints and error highlighting' },
  { id: 'minesweeper', title: 'Minesweeper', icon: '💣', desc: 'Flag all the mines without detonating them. 3 difficulty levels' },
  { id: 'hangman', title: 'Hangman', icon: '🎯', desc: 'Guess the word letter by letter. Categories, hints and keyboard support' },
  { id: 'word-search', title: 'Word Search', icon: '🔤', desc: 'Find hidden words in the grid. Click and drag to select' },
  { id: 'simon-says', title: 'Simon Says', icon: '🎨', desc: 'Remember and repeat the color sequence. Normal and strict modes' },
  { id: 'whack-a-mole', title: 'Whack-a-Mole', icon: '🔨', desc: 'Tap the moles as they pop up! 30 seconds of fast-paced fun' },
];

export default function Games() {
  const navigate = useNavigate();

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Games</h1>
        <p>Fun browser games — play instantly, no downloads needed</p>
      </div>

      <div className="tools-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {games.map(game => (
          <button key={game.id} className="tool-card" onClick={() => navigate(`/service/${game.id}`)}>
            <div className="tool-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', fontSize: '28px' }}>
              {game.icon}
            </div>
            <h3 className="tool-title">{game.title}</h3>
            <p className="tool-desc">{game.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
