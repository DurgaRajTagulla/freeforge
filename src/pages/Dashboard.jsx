import { useNavigate } from 'react-router-dom';
import {
  Shield, Lock, ArrowRight, Check, Flame, FileText,
  Image, Merge, Calculator, Wifi, QrCode, Ruler,
  Target, Puzzle, Brain, Zap, Hash, X,
  Cloud, LandPlot, GraduationCap
} from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const popularTools = [
    { icon: Image, label: 'Compress Image', path: '/service/image-compress' },
    { icon: Merge, label: 'Merge PDF', path: '/service/merge-pdf' },
    { icon: Calculator, label: 'EMI Calculator', path: '/service/emi-calculator' },
    { icon: QrCode, label: 'QR Generator', path: '/service/qr-code-generator' },
    { icon: Ruler, label: 'Unit Converter', path: '/service/unit-converter' },
    { icon: Cloud, label: 'Weather', path: '/service/weather' },
  ];

  const popularGames = [
    { icon: Zap, label: 'Snake', path: '/games/snake-game' },
    { icon: Target, label: '2048', path: '/games/game-2048' },
    { icon: Puzzle, label: 'Sudoku', path: '/games/sudoku' },
    { icon: Brain, label: 'Memory Cards', path: '/games/memory-cards' },
    { icon: Hash, label: 'Minesweeper', path: '/games/minesweeper' },
    { icon: X, label: 'Tic Tac Toe', path: '/games/tic-tac-toe' },
  ];

  return (
    <div className="dashboard-new">
      <main className="dashboard-main">
        <section className="hero-section">
          <div className="hero-content">
            <Flame className="hero-flame-icon" size={64} />
            <h1 className="hero-title">FreeForge</h1>
            <p className="hero-subtitle">
              Everything you need, all in one place. Access 24+ free tools, play 14 browser games, explore career guides, learn with kids activities, read multi-language news, find tour guides, and more. No sign-ups, no servers — just your browser.
            </p>
            <div className="hero-actions">
            <button className="cta-button resume" onClick={() => navigate('/editor')}>
                <FileText size={20} />
                Build Resume
                <ArrowRight className="cta-icon" />
              </button>
              <button className="cta-button survey" onClick={() => navigate('/land-survey')}>
                <LandPlot size={20} />
                Land Survey
                <ArrowRight className="cta-icon" />
              </button>
              <button className="cta-button kids" onClick={() => navigate('/kids')}>
                <GraduationCap size={20} />
                Kids Hub
                <ArrowRight className="cta-icon" />
              </button>
            </div>
          </div>
        </section>

        <section className="tools-preview-section tools-section-tools">
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular Tools</h2>
              <p className="section-subtitle">Most used free utilities</p>
            </div>
            <button className="see-all-btn" onClick={() => navigate('/services')}>
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="tools-grid">
            {popularTools.map((tool, i) => (
              <div className="tool-card" key={i} onClick={() => navigate(tool.path)}>
                <div className="tool-icon">
                  <tool.icon size={24} />
                </div>
                <span className="tool-label">{tool.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="tools-preview-section tools-section-games">
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular Games</h2>
              <p className="section-subtitle">Most played browser games</p>
            </div>
            <button className="see-all-btn" onClick={() => navigate('/games')}>
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="tools-grid">
            {popularGames.map((game, i) => (
              <div className="tool-card" key={i} onClick={() => navigate(game.path)}>
                <div className="tool-icon">
                  <game.icon size={24} />
                </div>
                <span className="tool-label">{game.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Why Choose FreeForge?</h2>
          <p className="section-subtitle">Built with privacy at its core</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon free">
                <Check className="icon" />
              </div>
              <h3 className="feature-title">100% Free</h3>
              <p className="feature-description">
                No hidden fees, no subscriptions. Everything is completely free, forever.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon secure">
                <Lock className="icon" />
              </div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                Your data never leaves your browser. No servers, no storage, no tracking.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon private">
                <Shield className="icon" />
              </div>
              <h3 className="feature-title">No Data Collection</h3>
              <p className="feature-description">
                We don't collect, store, or share any of your personal information.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon offline">
                <Wifi className="icon" />
              </div>
              <h3 className="feature-title">Works Offline</h3>
              <p className="feature-description">
                Everything runs locally in your browser. No internet required after loading.
              </p>
            </div>
          </div>
        </section>

        <section className="privacy-section">
          <div className="privacy-card">
            <Shield className="privacy-icon" />
            <h3 className="privacy-title">Your Privacy Matters</h3>
            <p className="privacy-description">
              FreeForge is a completely standalone application. We have no API endpoints,
              no database, and no server-side storage. Your data stays in your browser
              and is never transmitted anywhere. When you close this tab, your data is gone
              unless you export it as JSON.
            </p>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>FreeForge — Free All-in-One Tool Suite</p>
      </footer>
    </div>
  );
}

export default Dashboard;
