import './KidsActivities.css';

export default function QuizIntro({ title, emoji, content, facts, referenceList, referenceTitle, onStart }) {
  return (
    <div className="activity-page">
      <div className="quiz-intro">
        <div className="quiz-intro-header">
          <span className="quiz-intro-emoji">{emoji}</span>
          <h2>{title}</h2>
        </div>
        <div className="quiz-intro-content">
          {content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        {referenceList && referenceList.length > 0 && (
          <div className="quiz-intro-reference">
            <h3>{referenceTitle || '📋 Reference Guide'}</h3>
            <div className="reference-grid">
              {referenceList.map((item, i) => (
                <div key={i} className="reference-item">
                  <span className="reference-emoji">{item.emoji || item.icon}</span>
                  <span className="reference-label">{item.label}</span>
                  {item.sublabel && <span className="reference-sublabel">{item.sublabel}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        {facts && facts.length > 0 && (
          <div className="quiz-intro-facts">
            <h3>💡 Fun Facts</h3>
            <ul>
              {facts.map((fact, i) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
          </div>
        )}
        <button className="quiz-intro-start" onClick={onStart}>
          Start Quiz →
        </button>
      </div>
    </div>
  );
}
