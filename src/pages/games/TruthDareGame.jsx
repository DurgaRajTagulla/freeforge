import { useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import './Games.css';

const TRUTHS = [
  "What is your most embarrassing moment?",
  "What is a secret you've never told anyone?",
  "What is the biggest lie you've ever told?",
  "What is your biggest fear?",
  "Who is your secret crush?",
  "What is the most childish thing you still do?",
  "What is the last lie you told?",
  "What is your most controversial opinion?",
  "What is the worst date you've been on?",
  "What is something you're glad your parents don't know?",
  "What is the weirdest thing you've searched online?",
  "What is a habit you have that annoys others?",
  "What is the most trouble you've been in?",
  "What is your most useless talent?",
  "What is the best compliment you've ever received?",
  "What is something you're secretly good at?",
  "What is the most embarrassing song on your playlist?",
  "What is a rule you love to break?",
  "What is the last thing you googled?",
  "What is your biggest regret?",
];

const DARES = [
  "Do 20 pushups right now",
  "Sing the chorus of your favorite song",
  "Do your best impression of a celebrity",
  "Dance for 30 seconds without music",
  "Speak in an accent for the next 3 turns",
  "Post an embarrassing selfie (delete after 1 min)",
  "Let someone draw on your face with a marker",
  "Eat something spicy",
  "Call a random contact and sing happy birthday",
  "Do your best animal impression",
  "Run around the room 5 times",
  "Speak without closing your mouth for 1 minute",
  "Text your crush something nice",
  "Do a handstand against the wall",
  "Talk like a robot for the next 2 minutes",
  "Let someone tickle you for 15 seconds",
  "Do 30 jumping jacks",
  "Make a funny face and hold it for 10 seconds",
  "Pretend to be a waiter and take everyone's order",
  "Do your best slow-motion walk",
];

export default function TruthDareGame() {
  const [type, setType] = useState(null);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);

  const pick = useCallback((choice) => {
    const pool = choice === 'truth' ? TRUTHS : DARES;
    const item = pool[Math.floor(Math.random() * pool.length)];
    setType(choice);
    setCurrent(item);
    setHistory(h => [`${choice === 'truth' ? '🔴' : '🟢'} ${item}`, ...h].slice(0, 20));
  }, []);

  return (
    <div className="game-container">
      <div className="game-header">
        <h2 className="game-title">Truth or Dare</h2>
        <div className="game-controls">
          <button className="game-icon-btn" onClick={() => { setCurrent(null); setType(null); }}><RotateCcw size={18} /></button>
        </div>
      </div>

      <p className="game-info" style={{ marginBottom: '16px' }}>Pick Truth or Dare and take the challenge!</p>

      <div className="td-buttons">
        <button className="td-btn td-truth" onClick={() => pick('truth')}>🔴 Truth</button>
        <button className="td-btn td-dare" onClick={() => pick('dare')}>🟢 Dare</button>
      </div>

      {current && (
        <div className={`td-card td-${type}`}>
          <div className="td-type">{type === 'truth' ? '🔴 TRUTH' : '🟢 DARE'}</div>
          <div className="td-text">{current}</div>
        </div>
      )}

      {history.length > 0 && (
        <div className="td-history">
          <h4 style={{ color: '#94a3b8', margin: '0 0 8px', fontSize: '13px' }}>Previous Rounds</h4>
          {history.map((h, i) => (
            <div key={i} className="td-history-item">{h}</div>
          ))}
        </div>
      )}
    </div>
  );
}
