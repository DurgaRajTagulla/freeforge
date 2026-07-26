import { useNavigate } from 'react-router-dom';
import { BookOpen, FunctionSquare, Atom, ArrowRight, Calculator, Brain, Beaker, Ruler, Sigma, FlaskConical, Hash, LineChart, BarChart3, CircuitBoard } from 'lucide-react';
import './StudentsHub.css';

const cards = [
  {
    icon: FunctionSquare,
    title: 'Formula Hub',
    desc: 'Formulas for Math, Physics & Chemistry — Class 6 to 12.',
    route: '/formula-hub',
    features: ['Mathematics', 'Physics', 'Chemistry', 'Class 6–12'],
    color: '#fbbf24',
  },
  {
    icon: Atom,
    title: 'Periodic Table',
    desc: 'Interactive table of all 118 elements with detailed properties.',
    route: '/periodic-table',
    features: ['118 Elements', 'Color-coded', 'Detail Panel', 'Search'],
    color: '#60a5fa',
  },
  {
    icon: LineChart,
    title: 'Graph Plotter',
    desc: 'Plot y = f(x) graphs with pan, zoom & live preview.',
    route: '/graph-plotter',
    features: ['Interactive', 'Pan & Zoom', 'Presets', 'Live Preview'],
    color: '#22c55e',
  },
  {
    icon: BarChart3,
    title: 'SFD & BMD Generator',
    desc: 'SFD & BMD for simply supported & cantilever beams.',
    route: '/sfd-bmd-generator',
    features: ['Point Loads', 'UDL', 'Reactions', 'Max Values'],
    color: '#22c55e',
  },
  {
    icon: CircuitBoard,
    title: 'ECE / EEE Tool Suite',
    desc: 'Resistor decoder, 555 timer, signal plotter, op-amp & filter tools.',
    route: '/ece-hub',
    features: ['Resistor Code', '555 Timer', 'Signal Plotter', 'Op-Amp'],
    color: '#f97316',
  },
];

export default function StudentsHub() {
  const navigate = useNavigate();

  return (
    <div className="sh-page">
      <div className="sh-header">
        <div className="sh-header-content">
          <BookOpen size={48} className="sh-header-icon" />
          <h1 className="sh-header-title">Students Hub</h1>
          <p className="sh-header-subtitle">Your essential study toolkit — quick formulas and interactive periodic table. Built for NEET, JEE & board exam preparation.</p>
        </div>
      </div>

      <div className="sh-grid">
        {cards.map((card, i) => (
          <div key={i} className="sh-card" onClick={() => navigate(card.route)} style={{ '--card-accent': card.color }}>
            <div className="sh-card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${card.color}22 0%, transparent 70%)` }} />
            <div className="sh-card-icon-wrap" style={{ background: `${card.color}18`, color: card.color }}>
              <card.icon size={36} />
            </div>
            <h2 className="sh-card-title">{card.title}</h2>
            <p className="sh-card-desc">{card.desc}</p>
            <div className="sh-card-features">
              {card.features.map((f, j) => (
                <span key={j} className="sh-card-tag" style={{ background: `${card.color}15`, color: card.color }}>{f}</span>
              ))}
            </div>
            <div className="sh-card-action">
              <span>Explore Now</span>
              <ArrowRight size={18} className="sh-card-arrow" />
            </div>
          </div>
        ))}
      </div>

      <div className="sh-topics">
        <h2 className="sh-topics-title">What you'll find inside</h2>
        <div className="sh-topics-grid">
          <div className="sh-topic-card">
            <Calculator size={24} />
            <span>Algebra</span>
          </div>
          <div className="sh-topic-card">
            <Sigma size={24} />
            <span>Calculus</span>
          </div>
          <div className="sh-topic-card">
            <Brain size={24} />
            <span>Trigonometry</span>
          </div>
          <div className="sh-topic-card">
            <Ruler size={24} />
            <span>Geometry</span>
          </div>
          <div className="sh-topic-card">
            <Beaker size={24} />
            <span>Chemistry</span>
          </div>
          <div className="sh-topic-card">
            <Atom size={24} />
            <span>Physics</span>
          </div>
          <div className="sh-topic-card">
            <FlaskConical size={24} />
            <span>Equilibrium</span>
          </div>
          <div className="sh-topic-card">
            <Hash size={24} />
            <span>Statistics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
