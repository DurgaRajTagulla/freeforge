import { useNavigate } from 'react-router-dom';
import { Upload, Shield, Lock, Eye, FileText, ArrowRight, Check, Wrench, Flame, Star, Gamepad2, GraduationCap } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-new">
      <main className="dashboard-main">
        <section className="hero-section">
          <Flame className="hero-flame-icon" size={64} />
          <h1 className="hero-title">FreeForge</h1>
          <p className="hero-subtitle">
            Free all-in-one tool suite. Build ATS-friendly resumes, compress images, merge PDFs, convert currencies, play free browser games, explore the Kids Learning Hub, and 24+ more tools — all free, all private.
          </p>
        </section>

        <section className="priority-section">
          <div className="priority-card">
            <div className="priority-badge">Our #1 Priority</div>
            <h2 className="priority-title">
              <Star className="priority-star" size={28} />
              Free Resume Building
            </h2>
            <p className="priority-description">
              Build professional, ATS-friendly resumes completely free. Your data never leaves your browser — no servers, no databases, no tracking.
            </p>
            <div className="priority-features">
              <div className="priority-feature">
                <Lock size={18} />
                <span>100% Private — Data stays in your browser</span>
              </div>
              <div className="priority-feature">
                <FileText size={18} />
                <span>ATS-Optimized PDF with selectable text</span>
              </div>
              <div className="priority-feature">
                <Check size={18} />
                <span>Rich text editor for bullet points & formatting</span>
              </div>
              <div className="priority-feature">
                <Upload size={18} />
                <span>Import from JSON or existing PDF resume</span>
              </div>
            </div>
            <button className="cta-button" onClick={() => navigate('/editor')}>
              Start Building Resume
              <ArrowRight className="cta-icon" />
            </button>
          </div>
        </section>

        <section className="services-cta-section">
          <div className="services-cta-card">
            <Wrench className="services-cta-icon" />
            <h3 className="services-cta-title">24+ Free Tools at Your Disposal</h3>
            <p className="services-cta-description">
              Resume Builder is our <strong>#1 priority</strong> — build ATS-friendly resumes with our powerful editor. 
              But that's not all! We also offer <strong>24 additional free tools</strong>: image compressor, 
              PDF merger, currency converter, JSON formatter, and many more. 
              Everything runs locally in your browser — no uploads, no servers, just free tools.
            </p>
            <button className="cta-button secondary" onClick={() => navigate('/services')}>
              Explore All Tools
              <ArrowRight className="cta-icon" />
            </button>
          </div>
        </section>

        <section className="services-cta-section">
          <div className="services-cta-card" style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(34, 197, 94, 0.25) 100%)', borderColor: 'rgba(34, 197, 94, 0.25)' }}>
            <Gamepad2 className="services-cta-icon" style={{ color: '#4ade80' }} />
            <h3 className="services-cta-title">Play Free Browser Games</h3>
            <p className="services-cta-description">
              Take a break with our <strong>free browser games</strong>! Play <strong>Snake</strong>, <strong>2048</strong>, 
              and <strong>Sudoku</strong> — no downloads needed. Track your high scores and challenge yourself 
              with different difficulty levels.
            </p>
            <button className="cta-button secondary" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }} onClick={() => navigate('/games')}>
              Play Games
              <ArrowRight className="cta-icon" />
            </button>
          </div>
        </section>

        <section className="services-cta-section">
          <div className="services-cta-card" style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(168, 85, 247, 0.25) 100%)', borderColor: 'rgba(168, 85, 247, 0.25)' }}>
            <GraduationCap className="services-cta-icon" style={{ color: '#c084fc' }} />
            <h3 className="services-cta-title">Kids Learning Hub</h3>
            <p className="services-cta-description">
              Fun and interactive <strong>educational activities for kids</strong>! Learn <strong>alphabets, numbers, shapes, colors</strong>, 
              and explore <strong>science, geography, and math</strong> through games. 
              Includes matching games, quizzes, puzzles, and more — all designed to make learning fun and engaging.
            </p>
            <button className="cta-button secondary" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }} onClick={() => navigate('/kids')}>
              Explore Kids Hub
              <ArrowRight className="cta-icon" />
            </button>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Why Choose FreeForge?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon free">
                <Check className="icon" />
              </div>
              <h3 className="feature-title">100% Free</h3>
              <p className="feature-description">
                No hidden fees, no subscriptions. Build unlimited resumes completely free.
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
                <Eye className="icon" />
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
              no database, and no server-side storage. Your resume data stays in your browser 
              and is never transmitted anywhere. When you close this tab, your data is gone 
              unless you export it as JSON.
            </p>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>FreeForge - Free All-in-One Tool Suite</p>
      </footer>
    </div>
  );
}

export default Dashboard;
