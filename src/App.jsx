import { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Flame, Menu, X } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Games from './pages/Games';
import Kids from './pages/Kids';
import KidsActivityPage from './pages/kids/KidsActivityPage';
import Services from './pages/services/Services';
import ServicePage from './pages/services/ServicePage';
import './App.css';

const GAME_IDS = ['snake-game','game-2048','sudoku','minesweeper','hangman','word-search','simon-says','whack-a-mole','tic-tac-toe','memory-cards','spin-wheel','dice-roller','coin-toss','truth-or-dare','rock-paper-scissors'];

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const toolId = location.pathname.replace('/service/', '');
  const isGameService = location.pathname.startsWith('/service/') && GAME_IDS.includes(toolId);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <Flame className="navbar-logo-icon" size={22} />
          FreeForge
        </Link>
        <div className="navbar-links">
          <Link to="/editor" className={`nav-link ${location.pathname === '/editor' ? 'active' : ''}`}>
            Resume Builder
          </Link>
          <Link to="/services" className={`nav-link ${location.pathname === '/services' || (location.pathname.startsWith('/service/') && !isGameService) ? 'active' : ''}`}>
            Tools
          </Link>
          <Link to="/games" className={`nav-link ${location.pathname === '/games' || isGameService ? 'active' : ''}`}>
            Games
          </Link>
          <Link to="/kids" className={`nav-link ${location.pathname === '/kids' ? 'active' : ''}`}>
            Kids Hub
          </Link>
        </div>
      </div>
      <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <Link to="/editor" className={`mobile-nav-link ${location.pathname === '/editor' ? 'active' : ''}`} onClick={closeMenu}>
              Resume Builder
            </Link>
            <Link to="/services" className={`mobile-nav-link ${location.pathname === '/services' || (location.pathname.startsWith('/service/') && !isGameService) ? 'active' : ''}`} onClick={closeMenu}>
              Tools
            </Link>
            <Link to="/games" className={`mobile-nav-link ${location.pathname === '/games' || isGameService ? 'active' : ''}`} onClick={closeMenu}>
              Games
            </Link>
            <Link to="/kids" className={`mobile-nav-link ${location.pathname === '/kids' ? 'active' : ''}`} onClick={closeMenu}>
              Kids Hub
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content full-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/games" element={<Games />} />
            <Route path="/services" element={<Services />} />
            <Route path="/kids" element={<Kids />} />
            <Route path="/kids/activity/:activityId" element={<KidsActivityPage />} />
            <Route path="/service/:toolId" element={<ServicePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
