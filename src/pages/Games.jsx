import { useNavigate } from 'react-router-dom';
import { Gamepad2, ArrowLeft } from 'lucide-react';
import '../pages/games/Games.css';

const games = [
  { id: 'snake-game', title: 'Snake Game', icon: '🐍', desc: 'Classic snake game with obstacles, 3 difficulty levels and high scores' },
  { id: 'game-2048', title: '2048', icon: '🔢', desc: 'Slide and merge tiles to reach 2048. Undo support and best score tracking' },
  { id: 'sudoku', title: 'Sudoku', icon: '🔢', desc: 'Logic puzzle with 3 difficulty levels, hints and error highlighting' },
];

export default function Games() {
  const navigate = useNavigate();

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Games</h1>
        <p>Fun browser games — play instantly, no downloads needed</p>
      </div>

      <div className="tools-grid" style={{ maxWidth: '800px', margin: '0 auto' }}>
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
