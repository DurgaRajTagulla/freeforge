import { useState, useEffect, useCallback } from 'react';
import './KidsActivities.css';

function generateOptions(correctAnswer) {
  const opts = new Set([correctAnswer]);
  while (opts.size < 4) {
    const offset = Math.floor(Math.random() * 9) + 1;
    const variation = Math.random() > 0.5 ? correctAnswer + offset : correctAnswer - offset;
    if (variation >= 0) opts.add(variation);
  }
  return shuffle([...opts]);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL_PROBLEMS = 10;
const TIME_LIMIT = 10;

export default function MathGame({ title, generateProblem }) {
  const [problems, setProblems] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [timerActive, setTimerActive] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const probs = [];
    for (let i = 0; i < TOTAL_PROBLEMS; i++) {
      probs.push(generateProblem());
    }
    setProblems(probs);
  }, [generateProblem]);

  useEffect(() => {
    if (problems.length > 0 && currentIdx < problems.length) {
      const p = problems[currentIdx];
      setOptions(generateOptions(p.answer));
      setTimeLeft(TIME_LIMIT);
      setFeedback(null);
      setSelectedAnswer(null);
      setTimerActive(true);
    }
  }, [currentIdx, problems]);

  useEffect(() => {
    if (!timerActive || feedback !== null) return;
    if (timeLeft <= 0) {
      setFeedback('timeout');
      setSelectedAnswer(-1);
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
        if (currentIdx < TOTAL_PROBLEMS - 1) {
          setCurrentIdx(i => i + 1);
        } else {
          setShowCelebration(true);
        }
      }, 1500);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, feedback, currentIdx]);

  const handleAnswer = useCallback((index) => {
    if (feedback !== null) return;
    setTimerActive(false);
    setSelectedAnswer(index);
    const isCorrect = options[index] === problems[currentIdx].answer;
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      if (currentIdx < TOTAL_PROBLEMS - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        setShowCelebration(true);
      }
    }, 1500);
  }, [feedback, options, currentIdx, problems]);

  if (showCelebration) {
    const pct = Math.round((score / TOTAL_PROBLEMS) * 100);
    return (
      <div className="activity-page">
        <div className="celebration">
          <h2>🎉 Math Master!</h2>
          <p style={{ fontSize: 48, margin: '12px 0' }}>
            {pct >= 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}
          </p>
          <p>You scored <strong>{score}</strong> out of <strong>{TOTAL_PROBLEMS}</strong>!</p>
          <p>{pct >= 100 ? 'Perfect! You\'re a math genius! 🏆' : pct >= 70 ? 'Great job! ⭐' : 'Keep practicing! 💪'}</p>
          <button className="back-btn" style={{ marginTop: 20 }} onClick={() => window.location.hash = '#/kids'}>
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  if (problems.length === 0 || currentIdx >= problems.length) {
    return (
      <div className="activity-page">
        <div className="activity-header">
          <h2>{title}</h2>
        </div>
        <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading problems...</p>
      </div>
    );
  }

  const problem = problems[currentIdx];
  const timerPct = (timeLeft / TIME_LIMIT) * 100;
  const timerColor = timeLeft <= 3 ? '#ef4444' : timeLeft <= 5 ? '#facc15' : '#22c55e';

  return (
    <div className="activity-page">
      <div className="activity-header">
        <h2>{title}</h2>
        <div className="activity-score">Score: {score}/{currentIdx}</div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(currentIdx / TOTAL_PROBLEMS) * 100}%` }} />
      </div>
      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, marginBottom: 4 }}>
        Problem {currentIdx + 1} of {TOTAL_PROBLEMS}
      </div>
      <div className="timer-container">
        <div className="countdown-timer" style={{ color: timerColor }}>{timeLeft}s</div>
        <div className="timer-bar">
          <div className="timer-fill" style={{ width: `${timerPct}%`, background: timerColor }} />
        </div>
      </div>
      <div className="math-game">
        {problem.emoji && <span className="math-emoji">{problem.emoji}</span>}
        <div className="math-problem">{problem.question}</div>
      </div>
      <div className="math-options">
        {options.map((opt, i) => (
          <button
            key={i}
            className={`math-option ${
              feedback === 'correct' && i === selectedAnswer ? 'correct' :
              feedback === 'wrong' && i === selectedAnswer ? 'wrong' :
              feedback === 'wrong' && options[i] === problem.answer ? 'correct' :
              feedback === 'timeout' && options[i] === problem.answer ? 'correct' : ''
            }`}
            onClick={() => handleAnswer(i)}
            disabled={feedback !== null}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
