import { useState, useMemo, useEffect, useCallback } from 'react';
import './KidsActivities.css';

const NUMBERS = Array.from({ length: 20 }, (_, i) => String(i + 1));
const TELUGU = ['అ','ఆ','ఇ','ఈ','ఉ','ఊ','ఋ','ౠ','ఎ','ఏ','ఐ','ఒ','ఓ','ఔ','అం','అః'];
const HINDI = ['अ','आ','इ','ई','उ','ऊ','ऋ','ॠ','ऎ','ए','ऐ','ऒ','ओ','औ','अं','अः'];

function playBeep(freq, duration) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

function speak(text, lang) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    u.pitch = 1.1;
    if (lang) u.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(lang || ''));
    if (match) u.voice = match;
    window.speechSynthesis.speak(u);
  } catch {}
}

const voiceMap = {
  a: 'ey', b: 'bee', c: 'see', d: 'dee', e: 'ee', f: 'ef', g: 'jee',
  h: 'aych', i: 'eye', j: 'jay', k: 'kay', l: 'el', m: 'em', n: 'en',
  o: 'oh', p: 'pee', q: 'cue', r: 'ar', s: 'es', t: 'tee',
  u: 'you', v: 'vee', w: 'double-you', x: 'ex', y: 'wye', z: 'zee'
};

const scriptVoiceMap = {
  'అ': 'a', 'ఆ': 'aa', 'ఇ': 'i', 'ఈ': 'ee', 'ఉ': 'u', 'ఊ': 'oo',
  'ఋ': 'ru', 'ౠ': 'roo', 'ఎ': 'eh', 'ఏ': 'ay', 'ఐ': 'eye',
  'ఒ': 'o', 'ఓ': 'oh', 'ఔ': 'ow', 'అం': 'am', 'అః': 'aha',
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
  'ऋ': 'ri', 'ॠ': 'ree', 'ऎ': 'eh', 'ए': 'ay', 'ऐ': 'eye',
  'ऒ': 'o', 'ओ': 'oh', 'औ': 'ow', 'अं': 'am', 'अः': 'aha'
};

const languageLabels = {
  capital: '🔠 Capital',
  small: '🔡 Small',
  numbers: '🔢 1-20',
  telugu: 'తెలుగు అచ్చులు',
  hindi: 'हिंदी स्वर'
};

export default function AlphabetMatchGrid() {
  const [mode, setMode] = useState('capital');
  const [revealed, setRevealed] = useState(new Set());
  const [wrongLetter, setWrongLetter] = useState(null);
  const [score, setScore] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  const alphabet = useMemo(() => {
    switch (mode) {
      case 'numbers': return NUMBERS;
      case 'telugu': return TELUGU;
      case 'hindi': return HINDI;
      case 'capital': return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      case 'small': return 'abcdefghijklmnopqrstuvwxyz'.split('');
      default: return [];
    }
  }, [mode]);

  const total = alphabet.length;

  const nextLetter = useMemo(() => {
    const remaining = alphabet.filter(l => !revealed.has(l));
    if (remaining.length === 0) return null;
    return remaining[Math.floor(Math.random() * remaining.length)];
  }, [revealed, alphabet]);

  const isComplete = revealed.size === total;

  const langForMode = mode === 'telugu' ? 'te' : mode === 'hindi' ? 'hi' : 'en';

  useEffect(() => {
    if (nextLetter && soundOn) {
      const text = mode === 'telugu' || mode === 'hindi' ? (scriptVoiceMap[nextLetter] || nextLetter) : (voiceMap[nextLetter.toLowerCase()] || nextLetter);
      speak(text);
    }
  }, [nextLetter]);

  const handleLetterClick = useCallback((letter) => {
    if (revealed.has(letter)) return;
    if (letter === nextLetter) {
      if (soundOn) playBeep(880, 0.15);
      setRevealed(new Set([...revealed, letter]));
      setScore(s => s + 1);
    } else {
      if (soundOn) playBeep(220, 0.3);
      setWrongLetter(letter);
      setTimeout(() => setWrongLetter(null), 400);
    }
  }, [revealed, nextLetter]);

  const handleReset = () => {
    setRevealed(new Set());
    setScore(0);
    setWrongLetter(null);
  };

  const toggleMode = (m) => {
    if (m === mode) return;
    setMode(m);
    handleReset();
  };

  const modeLabel = mode === 'capital' ? 'capital letter' : mode === 'small' ? 'small letter' : mode === 'numbers' ? 'number' : mode === 'telugu' ? 'తెలుగు అచ్చు' : 'हिंदी स्वर';
  const isScript = mode === 'telugu' || mode === 'hindi';
  const displayModes = ['capital', 'small', 'numbers', 'telugu', 'hindi'];

  if (isComplete) {
    return (
      <div className="activity-page">
        <div className="celebration">
          <h2>🎉 Amazing!</h2>
          <p style={{ fontSize: 48, margin: '12px 0' }}>🏆</p>
          <p>You revealed all {total} {modeLabel}s!</p>
          <p>Score: <strong>{score}</strong>/{total}</p>
          <button className="back-btn" style={{ marginTop: 20 }} onClick={handleReset}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-page">
      <div className="activity-header">
        <h2>🔤 Alphabet & Number Match</h2>
        <div className="activity-score">
          Score: {score}/{total}  Revealed: {revealed.size}/{total}
          <button className="sound-toggle" onClick={() => setSoundOn(v => !v)} title="Toggle sound">
            {soundOn ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
      <p className="activity-description">Find and tap the matching {modeLabel} in the grid</p>

      <div className="toggle-bar">
        {displayModes.map(m => (
          <button
            key={m}
            className={`toggle-btn ${mode === m ? 'active' : ''}`}
            onClick={() => toggleMode(m)}
          >
            {languageLabels[m]}
          </button>
        ))}
      </div>

      <div className={`alphabet-grid ${mode === 'numbers' ? 'numbers-grid' : ''} ${isScript ? 'script-grid' : ''}`}>
        {alphabet.map(letter => {
          const isRevealed = revealed.has(letter);
          const isWrong = wrongLetter === letter;
          return (
            <button
              key={letter}
              className={`alphabet-cell ${isRevealed ? 'revealed' : ''} ${isWrong ? 'wrong' : ''} ${isScript ? 'script-cell' : ''}`}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <div className="letter-to-find">
        <span className="letter-to-find-label">Find this {modeLabel}:</span>
        <span className={`letter-to-find-letter ${isScript ? 'script-letter' : ''}`}>{nextLetter}</span>
      </div>
    </div>
  );
}
