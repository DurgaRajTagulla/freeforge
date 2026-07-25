import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const knowledge = [
  { keywords: ['resume', 'builder', 'cv', 'editor', 'create resume'], response: 'Our **Resume Builder** helps you create a professional resume with a drag-and-drop editor. You can format text, add images, and export as PDF.', link: { text: 'Go to Resume Builder →', to: '/editor' } },
  { keywords: ['tool', 'service', 'services', 'utility'], response: 'We offer **20+ free tools** including image compression, PDF merging, unit conversion, EMI calculator, QR generator, weather, and more!', link: { text: 'Browse All Tools →', to: '/services' } },
  { keywords: ['image', 'compress image', 'crop', 'rotate', 'watermark', 'convert image'], response: 'Our Image Tools let you **compress, crop, rotate, convert** between formats (JPG/PNG/WebP), and add watermarks.', link: { text: 'Image Tools →', to: '/services' } },
  { keywords: ['pdf', 'merge pdf', 'split pdf', 'compress pdf', 'unlock pdf', 'rotate pdf', 'pdf to image', 'image to pdf'], response: 'We have **8 PDF tools**: merge, split, compress, rotate, unlock PDFs, convert PDF to images, and images to PDF.', link: { text: 'PDF Tools →', to: '/services' } },
  { keywords: ['calculator', 'emi', 'emi calculator', 'age calculator', 'income tax', 'bmi', 'interest'], response: 'Use our calculators: **EMI Calculator**, **Age Calculator**, **Income Tax Calculator** (India), **BMI Calculator**, and **Interest Calculator**.', link: { text: 'View Calculators →', to: '/services' } },
  { keywords: ['converter', 'unit converter', 'timezone', 'time zone'], response: 'Convert between over 50 units of length, weight, temperature, and more with our **Unit Converter**. Also convert time across time zones.', link: { text: 'Unit Converter →', to: '/service/unit-converter' } },
  { keywords: ['qr', 'qr code'], response: 'Generate QR codes instantly for any text or URL with our **QR Code Generator**. No sign-up needed.', link: { text: 'QR Generator →', to: '/service/qr-code-generator' } },
  { keywords: ['weather'], response: 'Check **current weather**, a 7-day forecast, and live conditions for any location using our Weather tool.', link: { text: 'Check Weather →', to: '/service/weather' } },
  { keywords: ['typing', 'typing speed', 'speed test'], response: 'Test and improve your **typing speed and accuracy** with our Typing Speed Test tool.', link: { text: 'Typing Test →', to: '/service/typing-speed' } },
  { keywords: ['notes', 'markdown', 'notepad', 'browser notepad'], response: 'Write notes with **Markdown formatting** that auto-saves in your browser. No account needed.', link: { text: 'Markdown Notes →', to: '/service/markdown-notes' } },
  { keywords: ['json', 'json compare', 'json parser', 'curl'], response: 'Tools for developers: **JSON Parser** to format/validate, **JSON Compare** for side-by-side diff, and **cURL Parser** to decode curl commands.', link: { text: 'Developer Tools →', to: '/services' } },
  { keywords: ['compass'], response: 'Use your device orientation as a **digital compass**. Works on mobile devices with built-in sensors.', link: { text: 'Open Compass →', to: '/service/compass' } },
  { keywords: ['timer', 'countdown', 'stopwatch'], response: 'Set a **Countdown Timer** with alarm or use the **Stopwatch** with lap tracking for precision timing.', link: { text: 'Timers →', to: '/services' } },
  { keywords: ['game', 'games', 'play'], response: 'We have **14 free browser games**: Snake, 2048, Sudoku, Minesweeper, Hangman, Tic-Tac-Toe, Memory Cards, Whack-a-Mole, Simon Says, Spin Wheel, Dice Roller, Coin Toss, Truth or Dare, and Word Search!', link: { text: 'Play Games →', to: '/games' } },
  { keywords: ['snake'], response: '**Snake Game** — Classic snake with 3 difficulty levels (Easy/Medium/Hard), obstacles, and high scores. Use arrow keys or WASD.', link: { text: 'Play Snake →', to: '/games/snake-game' } },
  { keywords: ['2048'], response: '**2048** — Slide tiles and merge matching numbers to reach 2048. Has undo support!', link: { text: 'Play 2048 →', to: '/games/game-2048' } },
  { keywords: ['sudoku'], response: '**Sudoku** — Logic puzzle with 3 difficulty levels, hints, and a timer.', link: { text: 'Play Sudoku →', to: '/games/sudoku' } },
  { keywords: ['minesweeper'], response: '**Minesweeper** — Flag all mines without detonating them. 3 difficulty levels with timer.', link: { text: 'Play Minesweeper →', to: '/games/minesweeper' } },
  { keywords: ['hangman'], response: '**Hangman** — Guess the word before the man is hanged. 4 word categories with hints.', link: { text: 'Play Hangman →', to: '/games/hangman' } },
  { keywords: ['tic tac toe', 'tictactoe'], response: '**Tic-Tac-Toe** — Classic X vs O, play against a friend or the AI.', link: { text: 'Play Tic-Tac-Toe →', to: '/games/tic-tac-toe' } },
  { keywords: ['memory', 'memory cards'], response: '**Memory Cards** — Flip cards and find matching pairs across 3 grid sizes.', link: { text: 'Play Memory →', to: '/games/memory-cards' } },
  { keywords: ['whack', 'mole'], response: '**Whack-a-Mole** — Tap moles as they pop up. 30 seconds to get the highest score!', link: { text: 'Play Whack-a-Mole →', to: '/games/whack-a-mole' } },
  { keywords: ['simon', 'simon says'], response: '**Simon Says** — Remember and repeat increasingly long color sequences.', link: { text: 'Play Simon Says →', to: '/games/simon-says' } },
  { keywords: ['spin', 'wheel', 'spin wheel'], response: '**Spin Wheel** — Create a custom spin wheel with your own items. Great for decision-making!', link: { text: 'Spin Wheel →', to: '/games/spin-wheel' } },
  { keywords: ['dice', 'roller'], response: '**Dice Roller** — Roll 1-6 dice at once with a history log of all rolls.', link: { text: 'Dice Roller →', to: '/games/dice-roller' } },
  { keywords: ['coin', 'coin toss'], response: '**Coin Toss** — Heads or tails with streak tracking and flip history.', link: { text: 'Coin Toss →', to: '/games/coin-toss' } },
  { keywords: ['truth', 'dare'], response: '**Truth or Dare** — Party game with random challenges. Add your own truths and dares!', link: { text: 'Truth or Dare →', to: '/games/truth-or-dare' } },
  { keywords: ['word search'], response: '**Word Search** — Find hidden words in a letter grid. Words can be horizontal, vertical, or diagonal.', link: { text: 'Word Search →', to: '/games/word-search' } },
  { keywords: ['kids', 'kids hub', 'children', 'activity', 'learning'], response: '**Kids Hub** has fun learning activities: math games, drawing canvas, alphabet match, shape matching, and quizzes for children.', link: { text: 'Explore Kids Hub →', to: '/kids' } },
  { keywords: ['career', 'career guide', 'job', 'guidance'], response: '**Career Guide** provides career guidance, job search tips, and professional development resources.', link: { text: 'Career Guide →', to: '/career-guide' } },
  { keywords: ['news', 'news feed'], response: '**News Feed** brings you multi-language news from various sources. Read articles in your preferred language.', link: { text: 'News Feed →', to: '/news' } },
  { keywords: ['tour', 'tour guide', 'travel'], response: '**Tour Guide** helps you find travel guides and explore destinations.', link: { text: 'Tour Guide →', to: '/tour-guide' } },
  { keywords: ['survey', 'land survey', 'land', 'gps'], response: '**Land Survey** measures land area using GPS. Walk the boundary to calculate area in cents/acres/sqft. Supports AP and Telangana cross-check with Meebhoomi and Dharani portals.', link: { text: 'Land Survey →', to: '/land-survey' } },
  { keywords: ['help', 'need help', 'support'], response: 'Visit the **I Need Help** page for FAQs, troubleshooting tips, and support information.', link: { text: 'Help Page →', to: '/help' } },
  { keywords: ['free', 'freeforge', 'about', 'what is'], response: '**FreeForge** is a free, all-in-one browser app with 24+ tools, 14 games, resume builder, kids activities, news, career guides, and more. Everything runs locally in your browser — no sign-ups, no servers, no data collection.' },
  { keywords: ['privacy', 'data', 'sign up', 'signup', 'account', 'login', 'register'], response: 'FreeForge does **not** collect any data, require sign-ups, or use servers. Everything runs in your browser locally. No images, PDFs, or files are uploaded anywhere.' },
  { keywords: ['hello', 'hi', 'hey', 'greetings', 'namaste'], response: 'Hello! 👋 I\'m FreeForge Assistant. Ask me about any tool, game, or feature on this website!' },
  { keywords: ['thank', 'thanks'], response: 'You\'re welcome! 😊 Is there anything else you\'d like to know?' },
];

function getAnswer(query) {
  const q = query.toLowerCase();
  let best = null, bestScore = 0;
  for (const item of knowledge) {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw)) score += kw.length;
    }
    if (score > bestScore) { bestScore = score; best = item; }
  }
  return bestScore > 0 ? best : { response: 'I\'m not sure about that. Try asking about specific tools, games, or features! You can say things like "show me games", "what tools do you have", "resume builder", etc.', link: null };
}

const suggestions = ['What tools do you have?', 'Show me games', 'Tell me about FreeForge', 'Resume builder', 'Image tools', 'Land Survey'];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! 👋 I\'m FreeForge Assistant. Ask me about any tool, game, or feature on this site!' }
  ]);
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatEnd = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = (text) => {
    const q = text.trim();
    if (!q) return;
    setShowSuggestions(false);
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    const result = getAnswer(q);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: result.response, link: result.link }]);
    }, 300);
    setInput('');
  };

  return (
    <>
      <button className={`chatbot-toggle ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Chat">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <Bot size={20} />
            <span>FreeForge Assistant</span>
          </div>
          <div className="chatbot-body">
            {showSuggestions && (
              <div className="chatbot-suggestions">
                {suggestions.map((s, i) => (
                  <button key={i} className="chatbot-suggestion-btn" onClick={() => handleSend(s)}>{s}</button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg ${m.role}`}>
                <div className="chatbot-msg-text">{m.text}</div>
                {m.link && (
                  <button className="chatbot-link-btn" onClick={() => { navigate(m.link.to); setOpen(false); }}>
                    {m.link.text}
                  </button>
                )}
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
          <div className="chatbot-input-bar">
            <input className="chatbot-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend(input)} placeholder="Ask about any feature..." />
            <button className="chatbot-send-btn" onClick={() => handleSend(input)}><Send size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}
