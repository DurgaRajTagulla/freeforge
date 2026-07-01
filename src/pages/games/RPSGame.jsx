import { useState } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import './Games.css';

const CHOICES = [
  { name: 'rock', emoji: '🪨', beats: 'scissors' },
  { name: 'paper', emoji: '📄', beats: 'rock' },
  { name: 'scissors', emoji: '✂️', beats: 'paper' },
];

function getHighScore() {
  try { return parseInt(localStorage.getItem('freeforge_rps_high') || '0', 10); } catch { return 0; }
}
function setHighScore(score) {
  const high = getHighScore();
  if (score > high) localStorage.setItem('freeforge_rps_high', String(score));
}

export default function RPSGame() {
  const [player, setPlayer] = useState(null);
  const [computer, setComputer] = useState(null);
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({ player: 0, computer: 0, draws: 0 });
  const [highScore, setHigh] = useState(getHighScore);
  const [round, setRound] = useState(0);

  const play = (choice) => {
    const comp = CHOICES[Math.floor(Math.random() * 3)];
    setPlayer(choice);
    setComputer(comp);

    if (choice.name === comp.name) {
      setResult('draw');
      setScores(s => ({ ...s, draws: s.draws + 1 }));
    } else if (choice.beats === comp.name) {
      setResult('win');
      setScores(s => ({ ...s, player: s.player + 1 }));
      setHighScore(highScore + 1);
      setHigh(getHighScore());
    } else {
      setResult('lose');
      setScores(s => ({ ...s, computer: s.computer + 1 }));
    }
    setRound(r => r + 1);
  };

  const reset = () => { setPlayer(null); setComputer(null); setResult(null); setScores({ player: 0, computer: 0, draws: 0 }); setRound(0); };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Rock Paper Scissors</h2>
        <div className="game-controls">
          <span className="game-score">You: {scores.player}</span>
          <span className="game-score">CPU: {scores.computer}</span>
          <span className="game-high-score"><Trophy size={14} /> Best: {highScore}</span>
          <button className="game-icon-btn" onClick={reset}><RotateCcw size={18} /></button>
        </div>
      </div>

      <div className="rps-arena">
        <div className="rps-player">
          <div className="rps-label">You</div>
          <div className={`rps-choice ${player ? 'rps-chosen' : ''}`}>
            {player ? player.emoji : '?'}
          </div>
        </div>
        <div className="rps-vs">VS</div>
        <div className="rps-player">
          <div className="rps-label">Computer</div>
          <div className={`rps-choice ${computer ? 'rps-chosen' : ''} ${result === 'win' ? 'rps-winner' : result === 'lose' ? 'rps-loser' : ''}`}>
            {computer ? computer.emoji : '?'}
          </div>
        </div>
      </div>

      {result && (
        <div className={`rps-result rps-${result}`}>
          {result === 'win' ? '🎉 You Win!' : result === 'lose' ? '😞 You Lose!' : '🤝 Draw!'}
        </div>
      )}

      <div className="rps-choices">
        {CHOICES.map(c => (
          <button key={c.name} className="rps-btn" onClick={() => play(c)} disabled={!!player && !!result}>
            <span className="rps-btn-emoji">{c.emoji}</span>
            <span className="rps-btn-name">{c.name}</span>
          </button>
        ))}
      </div>

      {round > 0 && (
        <div className="game-info">
          <p>Round {round} · {scores.draws} draws</p>
        </div>
      )}
    </div>
  );
}
