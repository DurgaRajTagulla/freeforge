import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cpu, Circle, Timer, Activity, CircuitBoard, ToggleLeft, ArrowRight } from 'lucide-react';
import './ECEHub.css';

const tools = [
  { icon: Cpu, title: 'Logic Gate Simulator', desc: 'Build digital circuits with AND, OR, NOT, NAND, NOR, XOR, XNOR gates. Drag, wire, toggle, see truth tables.', route: '/logic-gate-simulator', color: '#a855f7' },
  { icon: Circle, title: 'Resistor Color Code', desc: 'Decode 4/5/6-band resistor colors to resistance, tolerance & TCR. Or enter a value to find the bands.', route: '/resistor-color-code', color: '#f97316' },
  { icon: Timer, title: '555 Timer Calculator', desc: 'Compute frequency, duty cycle & pulse width for astable and monostable 555 timer circuits from R and C values.', route: '/timer-555', color: '#22c55e' },
  { icon: Activity, title: 'Signal Plotter', desc: 'Visualize sine, square, triangle, sawtooth, and AM/FM modulated signals interactively. Adjust frequency & amplitude.', route: '/signal-plotter', color: '#06b6d4' },
  { icon: CircuitBoard, title: 'Op-Amp Designer', desc: 'Design inverting and non-inverting op-amp circuits. Calculate gain, view circuit diagram, compute output voltage.', route: '/op-amp-designer', color: '#3b82f6' },
  { icon: ToggleLeft, title: 'Filter Design Tool', desc: 'Design RC/RL/RLC low-pass and high-pass filters. Calculate cutoff frequency from components or vice versa.', route: '/filter-design-tool', color: '#ec4899' },
];

export default function ECEHub() {
  const navigate = useNavigate();

  return (
    <div className="ece-page">
      <div className="ece-header">
        <div className="ece-header-content">
          <button className="ece-back" onClick={() => navigate('/students-hub')}>
            <ArrowLeft size={20} />
          </button>
          <Cpu size={48} className="ece-header-icon" />
          <h1 className="ece-header-title">ECE / EEE Tool Suite</h1>
          <p className="ece-header-subtitle">Essential tools for electronics students — logic gates, resistor codes, timer circuits, signal analysis, op-amp design, and filter design.</p>
        </div>
      </div>
      <div className="ece-grid">
        {tools.map((t, i) => (
          <div key={i} className="ece-card" onClick={() => navigate(t.route)} style={{ '--card-accent': t.color }}>
            <div className="ece-card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${t.color}22 0%, transparent 70%)` }} />
            <div className="ece-card-icon" style={{ background: `${t.color}18`, color: t.color }}><t.icon size={32} /></div>
            <h2 className="ece-card-title">{t.title}</h2>
            <p className="ece-card-desc">{t.desc}</p>
            <div className="ece-card-action">
              <span>Open Tool</span>
              <ArrowRight size={16} className="ece-card-arrow" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
