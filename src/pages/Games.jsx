import { useNavigate } from 'react-router-dom';
import { Zap, Brain, Puzzle, Hash, Sparkles } from 'lucide-react';
import '../pages/games/Games.css';

const categories = [
  {
    name: 'Fun Games', icon: Zap, iconColor: '#22c55e',
    games: [
      { id: 'snake-game', icon: '🐍', desc: 'Obstacles, 3 levels, high scores' },
      { id: 'whack-a-mole', icon: '🔨', desc: 'Tap moles as they pop up in 30s' },
      { id: 'simon-says', icon: '🎨', desc: 'Remember and repeat color sequences' },
      { id: 'tic-tac-toe', icon: '❌', desc: 'Classic X vs O with score tracking' },
      { id: 'rock-paper-scissors', icon: '✊', desc: 'Beat the computer, streak tracker' },
    ],
  },
  {
    name: 'Party Games', icon: Sparkles, iconColor: '#f97316',
    games: [
      { id: 'spin-wheel', icon: '🎡', desc: 'Custom spin wheel with any items' },
      { id: 'truth-or-dare', icon: '🎭', desc: 'Truth or Dare challenges for groups' },
      { id: 'coin-toss', icon: '🪙', desc: 'Heads or tails with streak stats' },
      { id: 'dice-roller', icon: '🎲', desc: 'Roll 1-6 dice with history log' },
    ],
  },
  {
    name: 'Mind Games', icon: Brain, iconColor: '#60a5fa',
    games: [
      { id: 'memory-cards', icon: '🃏', desc: 'Flip and match pairs. 3 grid sizes' },
      { id: 'minesweeper', icon: '💣', desc: 'Flag mines, 3 difficulties, timer' },
      { id: 'hangman', icon: '🎯', desc: 'Guess words, 4 categories, hints' },
    ],
  },
  {
    name: 'Logic Games', icon: Puzzle, iconColor: '#a78bfa',
    games: [
      { id: 'sudoku', icon: '🧩', desc: '3 difficulties, hints, timer' },
      { id: 'word-search', icon: '🔤', desc: 'Find hidden words, click-drag' },
    ],
  },
  {
    name: 'Number Games', icon: Hash, iconColor: '#facc15',
    games: [
      { id: 'game-2048', icon: '🔢', desc: 'Merge tiles to 2048, undo support' },
    ],
  },
];

export default function Games() {
  const navigate = useNavigate();

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Games</h1>
        <p>Fun browser games — play instantly, no downloads needed</p>
      </div>

      {categories.map((cat, ci) => {
        const CatIcon = cat.icon;
        return (
          <section key={ci} className="tool-category">
            <h2 className="category-title">
              <CatIcon className="category-icon" style={{ color: cat.iconColor }} />
              {cat.name}
            </h2>
            <div className="tools-grid">
              {cat.games.map(game => (
                <button key={game.id} className="tool-card" onClick={() => navigate(`/service/${game.id}`)}>
                  <div className="tool-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', fontSize: '28px' }}>
                    {game.icon}
                  </div>
                  <h3 className="tool-title" style={{ textTransform: 'capitalize' }}>{game.id.replace(/-/g, ' ')}</h3>
                  <p className="tool-desc">{game.desc}</p>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
