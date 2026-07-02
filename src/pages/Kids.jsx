import { useNavigate } from 'react-router-dom';
import './Kids.css';

const activityId = (label) => {
  const map = {
    'Alphabet & Number Match': 'alphabet-match',
    'Count the Objects': 'count-the-objects',
    'Shape Matching': 'shape-matching',
    'Color Recognition': 'color-recognition',
    'Vehicle Identification': 'vehicle-identification',
    'Trace Letters': 'trace-letters',
    'Addition Race': 'addition-race',
    'Subtraction Challenge': 'subtraction-challenge',
    'Multiplication Tables': 'multiplication-tables',
    'Division Practice': 'division-practice',
    'Fractions Game': 'fractions-game',
    'Clock Reading': 'clock-reading',
    'Human Body Quiz': 'human-body-quiz',
    'Solar System Explorer': 'solar-system',
    'Plant Life Cycle': 'plant-life-cycle',
    'Weather Quiz': 'weather-quiz',
    'Animal Classification': 'animal-classification',
    'Guess the Country Flag': 'country-flags',
    'Indian States & Capitals': 'indian-states',
    'Snake with Math Questions': 'snake-math',
    'Memory Match': 'memory-match',
    'Tic Tac Toe vs AI': 'tic-tac-toe-ai',
    'Chess for Kids': 'chess-kids',
    '2048': 'game-2048-kids',
    'Connect Four': 'connect-four',
    'Simon Says': 'simon-says-kids',
    'Whack-a-Mole': 'whack-mole-kids',
    'Maze Escape': 'maze-escape',
    'Spot the Difference': 'spot-difference',
    'Daily Math Challenge': 'daily-math',
    'Word of the Day': 'word-of-day',
    'Country of the Day': 'country-of-day',
    'Brain Teaser': 'brain-teaser',
    'Daily Spelling Quiz': 'daily-spelling',
    'General Knowledge Quiz': 'gk-quiz',
    'Logic Puzzle': 'logic-puzzle',
    'Geometry Challenge': 'geometry-challenge',
    'Draw and Color': 'draw-color',
    'Dot-to-Dot': 'dot-to-dot',
    'Connect the Letters': 'connect-letters',
    'Trace Numbers': 'trace-numbers',
    'Build Words from Letters': 'build-words',
    'Arrange Sentences': 'arrange-sentences',
    'Match Pictures to Words': 'match-pictures-words',
    'Emoji Story Builder': 'emoji-story'
  };
  return map[label] || label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

const GRADIENTS = [
  'linear-gradient(135deg, #22c55e, #16a34a)',
  'linear-gradient(135deg, #3b82f6, #2563eb)',
  'linear-gradient(135deg, #f97316, #ea580c)',
  'linear-gradient(135deg, #a855f7, #9333ea)',
  'linear-gradient(135deg, #ec4899, #db2777)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
  'linear-gradient(135deg, #facc15, #eab308)',
  'linear-gradient(135deg, #ef4444, #dc2626)',
];

const SECTIONS = [
  {
    title: '🎨 Preschool (Ages 3–5)',
    iconColor: '#22c55e',
    items: [
      { icon: '🔤', name: 'Alphabet & Number Match', desc: 'Match letters and numbers in grid' },
      { icon: '🔢', name: 'Count the Objects', desc: 'Practice counting skills' },
      { icon: '🔺', name: 'Shape Matching', desc: 'Match shapes to their names' },
      { icon: '🌈', name: 'Color Recognition', desc: 'Learn and identify colors' },
      { icon: '🚗', name: 'Vehicle Identification', desc: 'Identify different vehicles' },
      { icon: '✋', name: 'Trace Letters', desc: 'Practice writing letters' },
    ],
  },
  {
    title: '📚 Primary School (Ages 6–10)',
    subs: [
      {
        sub: 'Mathematics',
        iconColor: '#3b82f6',
        items: [
          { icon: '➕', name: 'Addition Race', desc: 'Timed addition practice' },
          { icon: '➖', name: 'Subtraction Challenge', desc: 'Subtraction drills' },
          { icon: '✖️', name: 'Multiplication Tables', desc: 'Master multiplication' },
          { icon: '➗', name: 'Division Practice', desc: 'Division exercises' },
          { icon: '🍕', name: 'Fractions Game', desc: 'Learn fraction basics' },
      { icon: '🕐', name: 'Clock Reading', desc: 'Learn to tell time' },
    ],
      },
      {
        sub: 'Science',
        iconColor: '#a855f7',
        items: [
          { icon: '🧍', name: 'Human Body Quiz', desc: 'Learn body parts and organs' },
          { icon: '🌌', name: 'Solar System Explorer', desc: 'Explore planets and space' },
          { icon: '🌱', name: 'Plant Life Cycle', desc: 'How plants grow' },
          { icon: '🌤️', name: 'Weather Quiz', desc: 'Learn weather phenomena' },
          { icon: '🐾', name: 'Animal Classification', desc: 'Classify animal types' },
        ],
      },
      {
        sub: 'Geography',
        iconColor: '#06b6d4',
        items: [
          { icon: '🏳️', name: 'Guess the Country Flag', desc: 'Identify flags from around the world' },
          { icon: '🇮🇳', name: 'Indian States & Capitals', desc: 'Indian geography quiz' },
        ],
      },
    ],
  },
  {
    title: '✍️ Interactive Activities',
    iconColor: '#ec4899',
    items: [
      { icon: '🔤', name: 'Build Words from Letters', desc: 'Arrange letters into words' },
      { icon: '📝', name: 'Arrange Sentences', desc: 'Order jumbled sentences' },
      { icon: '📖', name: 'Emoji Story Builder', desc: 'Write stories from emojis' },
    ],
  },
];

export default function Kids() {
  const navigate = useNavigate();

  return (
    <div className="kids-page">
      <div className="kids-page-header">
        <h1>Kids Learning Hub</h1>
        <p>Fun educational activities for preschool and primary school children</p>
      </div>
      <div className="kids-page-grid">
        {SECTIONS.map((section, si) => (
          <section key={si} className="kids-section">
            <h2 className="kids-page-section-title">{section.title}</h2>
            {section.items && (
              <div className="tools-grid">
                {section.items.map((item, ii) => (
                  <button
                    key={ii}
                    className="tool-card"
                    onClick={() => navigate(`/kids/activity/${activityId(item.name)}`)}
                  >
                    <div className="tool-icon" style={{ background: GRADIENTS[ii % GRADIENTS.length], fontSize: 24 }}>
                      {item.icon}
                    </div>
                    <h3 className="tool-title">{item.name}</h3>
                    <p className="tool-desc">{item.desc}</p>
                  </button>
                ))}
              </div>
            )}
            {section.subs && section.subs.map((sub, si2) => (
              <div key={si2} className="kids-page-subsection">
                <h3 className="kids-page-sub-title">{sub.sub}</h3>
                <div className="tools-grid">
                  {sub.items.map((item, ii) => (
                    <button
                      key={ii}
                      className="tool-card"
                      onClick={() => navigate(`/kids/activity/${activityId(item.name)}`)}
                    >
                      <div className="tool-icon" style={{ background: GRADIENTS[ii % GRADIENTS.length], fontSize: 24 }}>
                        {item.icon}
                      </div>
                      <h3 className="tool-title">{item.name}</h3>
                      <p className="tool-desc">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
