import { useState, useRef, useEffect } from 'react';
import { Search, Play, Pause, Music, DiscAlbum, Clock, User } from 'lucide-react';
import './MusicPage.css';

const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || '';
const JAMENDO_API = CLIENT_ID
  ? `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json`
  : null;

export default function MusicPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [error, setError] = useState('');
  const audioRef = useRef(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const searchSongs = async (q) => {
    if (!q.trim() || !JAMENDO_API) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${JAMENDO_API}&search=${encodeURIComponent(q)}&limit=20&include=musicinfo`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setError('Failed to fetch songs. Try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(searchTimeout.current);
    if (val.trim()) {
      searchTimeout.current = setTimeout(() => searchSongs(val), 400);
    } else {
      setResults([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchSongs(query);
  };

  const togglePlay = (track) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(track.audio);
      audioRef.current.play().catch(() => {});
      setPlayingId(track.id);
      audioRef.current.onended = () => setPlayingId(null);
    }
  };

  const formatDuration = (sec) => {
    const s = parseInt(sec, 10);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${String(rem).padStart(2, '0')}`;
  };

  const albumImage = (track) => track.album_image || track.image || '';

  return (
    <div className="music-page">
      <div className="music-header">
        <div className="music-header-icon">
          <Music size={28} />
        </div>
        <h1>Music Search</h1>
        <p className="music-subtitle">Discover independent music from Jamendo</p>
      </div>

      <form className="music-search-bar" onSubmit={handleSearch}>
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search for songs, artists, albums..."
          value={query}
          onChange={handleInputChange}
        />
      </form>

      {error && <div className="music-error">{error}</div>}

      {loading && (
        <div className="music-loading">
          <div className="spinner" />
          <p>Searching...</p>
        </div>
      )}

      {!loading && !error && results.length === 0 && query && (
        <div className="music-empty">
          <Music size={48} />
          <p>No songs found for "{query}"</p>
        </div>
      )}

      {!loading && !error && results.length === 0 && !query && !CLIENT_ID && (
        <div className="music-empty">
          <Music size={48} />
          <p>Set up your Jamendo API key to get started</p>
          <p className="music-hint">Create a .env file with VITE_JAMENDO_CLIENT_ID=your_key</p>
        </div>
      )}

      {!loading && !error && results.length === 0 && !query && CLIENT_ID && (
        <div className="music-empty">
          <Music size={48} />
          <p>Search for any song to get started</p>
        </div>
      )}

      <div className="music-results">
        {results.map((track) => (
          <div key={track.id} className={`music-track ${playingId === track.id ? 'playing' : ''}`}>
            <img
              src={albumImage(track)}
              alt={track.album_name}
              className="track-art"
              loading="lazy"
            />
            <div className="track-info">
              <div className="track-title">{track.name}</div>
              <div className="track-artist">
                <User size={13} />
                {track.artist_name}
              </div>
              <div className="track-meta">
                <span>
                  <DiscAlbum size={12} />
                  {track.album_name}
                </span>
                <span>
                  <Clock size={12} />
                  {formatDuration(track.duration)}
                </span>
              </div>
            </div>
            {track.audio && (
              <button
                className={`play-btn ${playingId === track.id ? 'active' : ''}`}
                onClick={() => togglePlay(track)}
                title={playingId === track.id ? 'Pause' : 'Play'}
              >
                {playingId === track.id ? <Pause size={18} /> : <Play size={18} />}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
