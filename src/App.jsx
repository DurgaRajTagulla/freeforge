import { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Flame, Menu, X, FileText, Wrench, Gamepad2, Briefcase, HelpCircle, Map, GraduationCap, Newspaper, LandPlot, BookOpen } from 'lucide-react';
import './App.css';
import ChatBot from './components/ChatBot/ChatBot';
import './components/ChatBot/ChatBot.css';


const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Editor = lazy(() => import('./pages/Editor/Editor'));
const Games = lazy(() => import('./pages/Games/Games'));
const Kids = lazy(() => import('./pages/Kids/Kids'));
const KidsActivityPage = lazy(() => import('./pages/Kids/kids/KidsActivityPage'));
const Services = lazy(() => import('./pages/Services/Services'));
const ServicePage = lazy(() => import('./pages/Services/ServicePage'));
const HelpPage = lazy(() => import('./pages/HelpPage/HelpPage'));
const CareerGuide = lazy(() => import('./pages/CareerGuide/CareerGuide'));
const NewsFeed = lazy(() => import('./pages/NewsFeed/NewsFeed'));
const TourGuide = lazy(() => import('./pages/TourGuide/TourGuide'));
const LandSurvey = lazy(() => import('./pages/LandSurvey/LandSurvey'));
const FormulaHub = lazy(() => import('./pages/FormulaHub/FormulaHub'));
const PeriodicTable = lazy(() => import('./pages/PeriodicTable/PeriodicTable'));
const StudentsHub = lazy(() => import('./pages/StudentsHub/StudentsHub'));
const GraphPlotter = lazy(() => import('./pages/GraphPlotter/GraphPlotter'));
const LogicGateSimulator = lazy(() => import('./pages/LogicGateSimulator/LogicGateSimulator'));
const SFDBMDGenerator = lazy(() => import('./pages/SFDBMDGenerator/SFDBMDGenerator'));
const ECEHub = lazy(() => import('./pages/ECEHub/ECEHub'));
const ResistorColorCode = lazy(() => import('./pages/ResistorColorCode/ResistorColorCode'));
const Timer555 = lazy(() => import('./pages/Timer555/Timer555'));
const SignalPlotter = lazy(() => import('./pages/SignalPlotter/SignalPlotter'));
const OpAmpDesigner = lazy(() => import('./pages/OpAmpDesigner/OpAmpDesigner'));
const FilterDesignTool = lazy(() => import('./pages/FilterDesignTool/FilterDesignTool'));
const CodePlayground = lazy(() => import('./pages/CodePlayground/CodePlayground'));

const GAME_IDS = ['snake-game','game-2048','sudoku','minesweeper','hangman','word-search','simon-says','whack-a-mole','tic-tac-toe','memory-cards','spin-wheel','dice-roller','coin-toss','truth-or-dare'];

function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="loading-ring">
        <Flame size={48} className="spin-fix" style={{ color: '#f97316', filter: 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.4))' }} />
      </div>
    </div>
  );
}

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const toolId = location.pathname.replace('/service/', '');
  const isGameService = location.pathname.startsWith('/service/') && GAME_IDS.includes(toolId);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const navLinks = (
    <>
      <Link to="/editor" className={`nav-link ${location.pathname === '/editor' ? 'active' : ''}`} onClick={closeMenu}>
        <FileText size={16} />
        Resume Builder
      </Link>
      <Link to="/services" className={`nav-link ${location.pathname === '/services' || (location.pathname.startsWith('/service/') && !isGameService) ? 'active' : ''}`} onClick={closeMenu}>
        <Wrench size={16} />
        Tools
      </Link>
      <Link to="/kids" className={`nav-link ${location.pathname === '/kids' ? 'active' : ''}`} onClick={closeMenu}>
        <GraduationCap size={16} />
        Kids Hub
      </Link>
      <Link to="/students-hub" className={`nav-link ${location.pathname === '/students-hub' ? 'active' : ''}`} onClick={closeMenu}>
        <BookOpen size={16} />
        Students Hub
      </Link>
      <Link to="/games" className={`nav-link ${location.pathname === '/games' || isGameService ? 'active' : ''}`} onClick={closeMenu}>
        <Gamepad2 size={16} />
        Games
      </Link>
      <Link to="/land-survey" className={`nav-link ${location.pathname === '/land-survey' ? 'active' : ''}`} onClick={closeMenu}>
        <LandPlot size={16} />
        Land Survey
      </Link>
      <Link to="/career-guide" className={`nav-link ${location.pathname === '/career-guide' ? 'active' : ''}`} onClick={closeMenu}>
        <Briefcase size={16} />
        Career Guide
      </Link>
      <Link to="/tour-guide" className={`nav-link ${location.pathname === '/tour-guide' ? 'active' : ''}`} onClick={closeMenu}>
        <Map size={16} />
        Tour Guide
      </Link>
      <Link to="/help" className={`nav-link ${location.pathname === '/help' ? 'active' : ''}`} onClick={closeMenu}>
        <HelpCircle size={16} />
        I Need Help
      </Link>
      <Link to="/news" className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`} onClick={closeMenu}>
        <Newspaper size={16} />
        News Feed
      </Link>
    </>
  );

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <Flame className="navbar-logo-icon" size={22} />
            FreeForge
          </Link>
          <div className="navbar-links">
            {navLinks}
          </div>
        </div>
        <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {menuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={closeMenu}></div>
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <Flame className="navbar-logo-icon" size={20} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>FreeForge</span>
            </div>
            {navLinks}
          </div>
        </>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content full-content">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/formula-hub" element={<FormulaHub />} />
              <Route path="/periodic-table" element={<PeriodicTable />} />
              <Route path="/students-hub" element={<StudentsHub />} />
              <Route path="/graph-plotter" element={<GraphPlotter />} />
              <Route path="/logic-gate-simulator" element={<LogicGateSimulator />} />
              <Route path="/sfd-bmd-generator" element={<SFDBMDGenerator />} />
              <Route path="/ece-hub" element={<ECEHub />} />
              <Route path="/resistor-color-code" element={<ResistorColorCode />} />
              <Route path="/timer-555" element={<Timer555 />} />
              <Route path="/signal-plotter" element={<SignalPlotter />} />
              <Route path="/op-amp-designer" element={<OpAmpDesigner />} />
              <Route path="/filter-design-tool" element={<FilterDesignTool />} />
              <Route path="/code-playground" element={<CodePlayground />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:toolId" element={<ServicePage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/kids" element={<Kids />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/career-guide" element={<CareerGuide />} />
              <Route path="/news" element={<NewsFeed />} />
              <Route path="/land-survey" element={<LandSurvey />} />
              <Route path="/tour-guide" element={<TourGuide />} />
              <Route path="/kids/activity/:activityId" element={<KidsActivityPage />} />
              <Route path="/service/:toolId" element={<ServicePage />} />
            </Routes>
          </Suspense>
        </main>
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
