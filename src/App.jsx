import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Games from './pages/Games';
import Services from './pages/services/Services';
import ServicePage from './pages/services/ServicePage';
import './App.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <Flame className="navbar-logo-icon" size={22} />
          FreeForge
        </Link>
        <div className="navbar-links">
          <Link to="/games" className={`nav-link ${location.pathname === '/games' ? 'active' : ''}`}>
            Games
          </Link>
          <Link to="/services" className={`nav-link ${location.pathname === '/services' || location.pathname.startsWith('/service/') ? 'active' : ''}`}>
            Services
          </Link>
        </div>
      </div>
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
            <Route path="/service/:toolId" element={<ServicePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
