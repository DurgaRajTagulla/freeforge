import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Shield, Lock, Eye, FileText, ArrowRight, Check, Loader2, Wrench, Flame, Star } from 'lucide-react';
import { extractResumeFromPDF } from '../utils/pdfParser';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          navigate('/editor', { state: { resumeData: data } });
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportPDF = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const resumeData = await extractResumeFromPDF(file);
        navigate('/editor', { state: { resumeData } });
      } catch (error) {
        console.error('Error parsing PDF:', error);
        alert('Error parsing PDF file. Please try again or import a JSON file instead.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="dashboard-new">
      <main className="dashboard-main">
        <section className="hero-section">
          <Flame className="hero-flame-icon" size={64} />
          <h1 className="hero-title">FreeForge</h1>
          <p className="hero-subtitle">
            Free all-in-one tool suite. Build ATS-friendly resumes, compress images, merge PDFs, convert currencies, and 24+ more tools — all free, all private.
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

        <section className="import-section">
          <div className="import-cards">
            <div className="import-card">
              <div className="import-icon-wrapper">
                <Upload className="import-icon" />
              </div>
              <h2 className="import-title">Import JSON</h2>
              <p className="import-description">
                Have an exported resume? Import your JSON file to continue editing.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportJSON}
                accept=".json"
                style={{ display: 'none' }}
              />
              <button 
                className="import-button"
                onClick={() => fileInputRef.current.click()}
              >
                <Upload className="button-icon" />
                Import JSON File
              </button>
            </div>

            <div className="import-card">
              <div className="import-icon-wrapper pdf">
                <FileText className="import-icon" />
              </div>
              <h2 className="import-title">Import PDF Resume</h2>
              <p className="import-description">
                Upload your existing PDF resume. We'll extract the text and pre-fill your data.
              </p>
              <input
                type="file"
                ref={pdfInputRef}
                onChange={handleImportPDF}
                accept=".pdf"
                style={{ display: 'none' }}
              />
              <button 
                className="import-button pdf"
                onClick={() => pdfInputRef.current.click()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="button-icon spinning" />
                    Extracting Data...
                  </>
                ) : (
                  <>
                    <FileText className="button-icon" />
                    Import PDF File
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="preview-section">
          <h2 className="section-title">Professional Templates</h2>
          <p className="section-subtitle">Choose from ATS-optimized templates</p>
          <div className="preview-card">
            <div className="resume-preview-mini">
              <div className="preview-header-mini">
                <div className="preview-name">JOHN PROFESSIONAL</div>
                <div className="preview-title">Senior Project Manager</div>
                <div className="preview-contact">john@email.com • 555-0123 • New York, NY</div>
              </div>
              <div className="preview-section-mini">
                <div className="preview-section-title">PROFESSIONAL SUMMARY</div>
                <div className="preview-lines">
                  <div className="preview-line"></div>
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                </div>
              </div>
              <div className="preview-section-mini">
                <div className="preview-section-title">WORK EXPERIENCE</div>
                <div className="preview-lines">
                  <div className="preview-line"></div>
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                </div>
              </div>
              <div className="preview-section-mini">
                <div className="preview-section-title">SKILLS</div>
                <div className="preview-tags">
                  <span className="preview-tag"></span>
                  <span className="preview-tag"></span>
                  <span className="preview-tag"></span>
                </div>
              </div>
            </div>
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
