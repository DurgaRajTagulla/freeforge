import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Shield, Lock, FileText, ArrowRight, Check, Wrench, Flame, Star,
  Gamepad2, GraduationCap, RefreshCw, Quote, Briefcase, Newspaper, Map, HelpCircle,
  Image, Merge, Calculator, Wifi, QrCode, Ruler, Scale, ChevronRight, Target, Puzzle, Brain, Zap
} from 'lucide-react';
import './Dashboard.css';

function DailyQuote() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToday = () => new Date().toISOString().split('T')[0];

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://zenquotes.io/api/random');
      const data = await res.json();
      if (data && data[0]) {
        const newQuote = { text: data[0].q, author: data[0].a };
        setQuote(newQuote);
        localStorage.setItem('dailyQuote', JSON.stringify({ ...newQuote, date: getToday() }));
      } else {
        throw new Error('No quote data');
      }
    } catch {
      const fallback = { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", date: getToday() };
      setQuote(fallback);
      localStorage.setItem('dailyQuote', JSON.stringify(fallback));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem('dailyQuote');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.date === getToday()) {
        setQuote(parsed);
        setLoading(false);
        return;
      }
    }
    fetchQuote();
  }, []);

  return (
    <div className="sticky-note">
      <div className="sticky-pin" />
      <div className="sticky-header">
        <span className="sticky-label">Daily Motivation</span>
        <button className="sticky-refresh" onClick={fetchQuote} disabled={loading} title="New quote">
          <RefreshCw size={14} className={loading ? 'spinning' : ''} />
        </button>
      </div>
      {loading ? (
        <div className="sticky-loading">Loading...</div>
      ) : (
        <>
          <div className="sticky-quote">
            <Quote size={18} className="sticky-quote-icon" />
            <p className="sticky-quote-text">{quote.text}</p>
          </div>
          <p className="sticky-author">— {quote.author}</p>
        </>
      )}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const popularTools = [
    { icon: Image, label: 'Compress Image', path: '/service/image-compress' },
    { icon: Merge, label: 'Merge PDF', path: '/service/merge-pdf' },
    { icon: Calculator, label: 'EMI Calculator', path: '/service/emi-calculator' },
    { icon: QrCode, label: 'QR Generator', path: '/service/qr-code-generator' },
  ];

  const popularGames = [
    { icon: Zap, label: 'Snake', path: '/games/snake-game' },
    { icon: Target, label: '2048', path: '/games/game-2048' },
    { icon: Puzzle, label: 'Sudoku', path: '/games/sudoku' },
    { icon: Brain, label: 'Memory Cards', path: '/games/memory-cards' },
  ];

  const stats = [
    { value: '24+', label: 'Free Tools' },
    { value: '14', label: 'Browser Games' },
    { value: '40+', label: 'Kids Activities' },
    { value: '100%', label: 'Free & Private' },
  ];

  return (
    <div className="dashboard-new">
      <main className="dashboard-main">
        <section className="hero-section">
          <div className="hero-content">
            <Flame className="hero-flame-icon" size={64} />
            <h1 className="hero-title">FreeForge</h1>
            <p className="hero-subtitle">
              Free all-in-one platform. Build ATS-friendly resumes, use 24+ tools (image, PDF, calculator, QR, converters), play 14 browser games, explore Kids Learning Hub (40+ activities), discover Career Guide (14 paths), read multi-language News, find Tour Guides, and access Government Help services — all free, all private, all in your browser.
            </p>
            <div className="hero-actions">
              <button className="cta-button primary" onClick={() => navigate('/editor')}>
                <FileText size={20} />
                Start Building Resume
                <ArrowRight className="cta-icon" />
              </button>
              <button className="cta-button outline" onClick={() => navigate('/services')}>
                Explore All Tools
                <ArrowRight className="cta-icon" />
              </button>
            </div>
          </div>
          <DailyQuote />
        </section>

        <section className="stats-bar">
          {stats.map((stat, i) => (
            <div className="stat-item" key={i}>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="featured-section">
          <div className="featured-card">
            <div className="featured-badge">
              <Star size={14} />
              Our #1 Priority
            </div>
            <div className="featured-content">
              <div className="featured-text">
                <h2 className="featured-title">Free Resume Builder</h2>
                <p className="featured-description">
                  Build professional, ATS-friendly resumes completely free. Your data never leaves your browser — no servers, no databases, no tracking.
                </p>
                <div className="featured-features">
                  <div className="featured-feature">
                    <Lock size={16} />
                    <span>100% Private</span>
                  </div>
                  <div className="featured-feature">
                    <FileText size={16} />
                    <span>ATS-Optimized PDF</span>
                  </div>
                  <div className="featured-feature">
                    <Check size={16} />
                    <span>Rich Text Editor</span>
                  </div>
                  <div className="featured-feature">
                    <Upload size={16} />
                    <span>Import JSON/PDF</span>
                  </div>
                </div>
                <button className="cta-button primary" onClick={() => navigate('/editor')}>
                  Start Building Resume
                  <ArrowRight className="cta-icon" />
                </button>
              </div>
              <div className="featured-visual">
                <div className="resume-preview">
                  <div className="resume-header">
                    <div className="resume-name-line" />
                    <div className="resume-title-line" />
                    <div className="resume-contact-line" />
                  </div>
                  <div className="resume-section">
                    <div className="resume-section-line" />
                    <div className="resume-content-lines">
                      <div className="resume-line full" />
                      <div className="resume-line full" />
                      <div className="resume-line short" />
                    </div>
                  </div>
                  <div className="resume-section">
                    <div className="resume-section-line" />
                    <div className="resume-content-lines">
                      <div className="resume-line full" />
                      <div className="resume-line full" />
                      <div className="resume-line short" />
                    </div>
                  </div>
                </div>
              </div>
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

        <section className="explore-section">
          <h2 className="section-title">Explore More</h2>
          <p className="section-subtitle">Discover everything FreeForge has to offer</p>
          <div className="explore-grid">
            <div className="explore-card games" onClick={() => navigate('/games')}>
              <div className="explore-card-bg" />
              <Gamepad2 size={40} className="explore-card-icon" />
              <h3 className="explore-card-title">Free Browser Games</h3>
              <p className="explore-card-desc">Play Snake, 2048, Sudoku, Memory Cards and 10+ more games. No downloads needed!</p>
              <span className="explore-card-tag">14 Games</span>
            </div>
            <div className="explore-card kids" onClick={() => navigate('/kids')}>
              <div className="explore-card-bg" />
              <GraduationCap size={40} className="explore-card-icon" />
              <h3 className="explore-card-title">Kids Learning Hub</h3>
              <p className="explore-card-desc">Fun educational activities for kids — alphabets, numbers, science, math games and more.</p>
              <span className="explore-card-tag">40+ Activities</span>
            </div>
            <div className="explore-card career" onClick={() => navigate('/career-guide')}>
              <div className="explore-card-bg" />
              <Briefcase size={40} className="explore-card-icon" />
              <h3 className="explore-card-title">Career Guide</h3>
              <p className="explore-card-desc">Explore 14 career paths — UPSC, Banking, IT, Engineering, Teaching, Defence and more.</p>
              <span className="explore-card-tag">14 Paths</span>
            </div>
            <div className="explore-card news" onClick={() => navigate('/news')}>
              <div className="explore-card-bg" />
              <Newspaper size={40} className="explore-card-icon" />
              <h3 className="explore-card-title">News Feed</h3>
              <p className="explore-card-desc">Stay updated with multi-language news from BBC, The Hindu, Indian Express and more.</p>
              <span className="explore-card-tag">3 Languages</span>
            </div>
            <div className="explore-card tour" onClick={() => navigate('/tour-guide')}>
              <div className="explore-card-bg" />
              <Map size={40} className="explore-card-icon" />
              <h3 className="explore-card-title">Tour Guide</h3>
              <p className="explore-card-desc">Explore famous temples, tourist destinations across India with detailed guides.</p>
              <span className="explore-card-tag">27+ Destinations</span>
            </div>
            <div className="explore-card help" onClick={() => navigate('/help')}>
              <div className="explore-card-bg" />
              <HelpCircle size={40} className="explore-card-icon" />
              <h3 className="explore-card-title">I Need Help</h3>
              <p className="explore-card-desc">Indian government services directory — tax, passport, legal help, cyber crime and more.</p>
              <span className="explore-card-tag">14 Categories</span>
            </div>
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
