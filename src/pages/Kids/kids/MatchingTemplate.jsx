import { useState, useEffect, useRef } from 'react';
import './KidsActivities.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchingTemplate({ pairs, title, itemLabel, compact: compactProp, pageSize: desktopSize }) {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [wrongAnim, setWrongAnim] = useState(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [page, setPage] = useState(0);
  const prevPage = useRef(-1);

  const isMobile = window.innerWidth < 640;
  const compact = compactProp || isMobile;
  const pageSize = desktopSize ? (isMobile ? Math.min(6, desktopSize) : desktopSize) : undefined;

  const totalPages = pageSize ? Math.ceil(pairs.length / pageSize) : 1;
  const pagePairs = pageSize ? pairs.slice(page * pageSize, (page + 1) * pageSize) : pairs;

  useEffect(() => {
    if (prevPage.current !== page) {
      const currentPairs = pageSize ? pairs.slice(page * pageSize, (page + 1) * pageSize) : pairs;
      setLeftItems(shuffle(currentPairs));
      setRightItems(shuffle(currentPairs.map(p => ({ id: p.id, label: p.match }))));
      setSelectedLeft(null);
      setMatchedIds(new Set());
      setScore(0);
      setShowCelebration(false);
      prevPage.current = page;
    }
  }, [page, pairs, pageSize]);

  useEffect(() => {
    if (matchedIds.size === pagePairs.length && pagePairs.length > 0) {
      if (pageSize && page < totalPages - 1) {
        setTimeout(() => setPage(p => p + 1), 800);
      } else {
        setShowCelebration(true);
      }
    }
  }, [matchedIds, pagePairs.length, pageSize, page, totalPages]);

  const handleLeftClick = (id) => {
    if (matchedIds.has(id) || wrongAnim) return;
    setSelectedLeft(prev => prev === id ? null : id);
  };

  const handleRightClick = (id) => {
    if (!selectedLeft || matchedIds.has(id) || wrongAnim) return;
    if (selectedLeft === id) {
      setMatchedIds(prev => new Set([...prev, id]));
      setScore(s => s + 1);
      setSelectedLeft(null);
    } else {
      setWrongAnim(id);
      setTimeout(() => {
        setWrongAnim(null);
        setSelectedLeft(null);
      }, 600);
    }
  };

  if (showCelebration) {
    return (
      <div className="activity-page">
        <div className="celebration">
          <h2>🎉 Amazing!</h2>
          <p style={{ fontSize: 48, margin: '12px 0' }}>🏆</p>
          <p>You matched all {pairs.length} pairs!</p>
          <p>Score: <strong>{score}</strong>/{pairs.length}</p>
          <button className="back-btn" style={{ marginTop: 20 }} onClick={() => window.location.hash = '#/kids'}>
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-page">
      <div className="activity-header">
        <h2>{title}</h2>
        <div className="activity-score">Score: {score}/{pagePairs.length}{totalPages > 1 ? `  Set ${page + 1}/${totalPages}` : ''}</div>
      </div>
      {itemLabel && (
        <p className="activity-description">Click a {itemLabel} on the left, then click its match on the right</p>
      )}
      <div className={`matching-rows ${compact ? 'compact' : ''}`}>
        {leftItems.map((item, i) => {
          const right = rightItems[i];
          return (
            <div key={item.id} className="matching-row">
              <button
                className={`match-card ${selectedLeft === item.id ? 'selected' : ''} ${matchedIds.has(item.id) ? 'matched' : ''} ${compact ? 'compact' : ''}`}
                onClick={() => handleLeftClick(item.id)}
                disabled={matchedIds.has(item.id)}
              >
                {item.item}
              </button>
              {right && (
                <button
                  className={`match-card ${wrongAnim === right.id ? 'shake' : ''} ${matchedIds.has(right.id) ? 'matched' : ''} ${compact ? 'compact' : ''}`}
                  onClick={() => handleRightClick(right.id)}
                  disabled={matchedIds.has(right.id)}
                >
                  {right.label}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
