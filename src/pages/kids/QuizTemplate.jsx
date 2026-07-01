import { useState, useEffect } from 'react';
import './KidsActivities.css';

export default function QuizTemplate({ questions: allQuestions, title, pageSize }) {
  const [page, setPage] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [setScoreTrack, setSetScoreTrack] = useState(0);

  const totalPages = pageSize ? Math.ceil(allQuestions.length / pageSize) : 1;
  const questions = pageSize
    ? allQuestions.slice(page * pageSize, (page + 1) * pageSize)
    : allQuestions;
  const total = questions.length;
  const isComplete = currentQ >= total;
  const progress = total > 0 ? ((currentQ) / total) * 100 : 0;

  useEffect(() => {
    setCurrentQ(0);
    setFeedback(null);
    setSelectedAnswer(null);
    setSetScoreTrack(0);
  }, [page]);

  useEffect(() => {
    if (isComplete && total > 0) {
      if (pageSize && page < totalPages - 1) {
        // Set complete, show set complete screen (handled in render)
      } else {
        setShowCelebration(true);
      }
    }
  }, [isComplete, total, pageSize, page, totalPages]);

  const handleAnswer = (index) => {
    if (feedback !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentQ].correctIndex) {
      setFeedback('correct');
      setScore(s => s + 1);
      setSetScoreTrack(s => s + 1);
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      if (currentQ < total - 1) {
        setCurrentQ(q => q + 1);
      } else {
        setCurrentQ(q => q + 1);
      }
    }, 1500);
  };

  if (showCelebration) {
    const pct = total > 0 ? Math.round((score / (allQuestions.length)) * 100) : 0;
    return (
      <div className="activity-page">
        <div className="celebration">
          <h2>🎉 Great Job!</h2>
          <p style={{ fontSize: 48, margin: '12px 0' }}>
            {pct >= 100 ? '🌟' : pct >= 70 ? '⭐' : '💪'}
          </p>
          <p>You scored <strong>{score}</strong> out of <strong>{allQuestions.length}</strong>!</p>
          <p>{pct >= 100 ? 'Perfect Score! Amazing! 🌟' : pct >= 70 ? 'Well done! Keep it up! ⭐' : 'Good try! Practice makes perfect! 💪'}</p>
          <button className="back-btn" style={{ marginTop: 20 }} onClick={() => window.location.hash = '#/kids'}>
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="activity-page">
        <div className="activity-header">
          <h2>{title}</h2>
        </div>
        <p style={{ textAlign: 'center', color: '#94a3b8' }}>No questions available.</p>
      </div>
    );
  }

  // Show set complete screen between sets
  if (isComplete && pageSize && page < totalPages - 1) {
    const setPct = questions.length > 0 ? Math.round((setScoreTrack / questions.length) * 100) : 0;
    return (
      <div className="activity-page" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', minHeight: 300 }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ fontSize: 48, margin: '0 0 12px' }}>
            {setPct >= 100 ? '🌟' : setPct >= 70 ? '⭐' : '💪'}
          </p>
          <h2>Set {page + 1} Complete!</h2>
          <p style={{ color: '#94a3b8', fontSize: 15, margin: '8px 0 20px' }}>
            You got {setScoreTrack} of {questions.length} correct
          </p>
          <button className="process-btn" onClick={() => setPage(p => p + 1)} style={{ fontSize: 16, padding: '12px 32px' }}>
            Next Set →
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="activity-page">
      <div className="activity-header">
        <h2>{title}</h2>
        <div className="activity-score">Score: {score}/{currentQ + (page * pageSize || 0)}{totalPages > 1 ? `  Set ${page + 1}/${totalPages}` : ''}</div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>
        Question {currentQ + 1} of {total}
      </div>
      <div className="quiz-question">
        {q.emoji && <span className="quiz-emoji">{q.emoji}</span>}
        {q.colors && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
            {q.colors.map((c, i) => (
              <div key={i} style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #334155', backgroundColor: c }} />
            ))}
          </div>
        )}
        <p className="quiz-question-text">{q.question}</p>
      </div>
      <div className="quiz-options">
        {q.options.map((opt, i) => (
          <button
            key={i}
            className={`quiz-option ${
              feedback !== null && i === q.correctIndex ? 'correct' :
              feedback !== null && i === selectedAnswer && feedback === 'wrong' ? 'wrong' : ''
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
