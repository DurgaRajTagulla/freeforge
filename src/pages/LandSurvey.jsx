import { useState, useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Polygon, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { area, length } from '@turf/turf';
import { MapPin, Navigation, Crosshair, Ruler, LandPlot, Trash2, Download, ExternalLink, Search, Info, AlertCircle, CheckCircle, Compass, ArrowLeft, FileText, LocateFixed, X, Map as MapIcon } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './LandSurvey.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CENT_TO_SQFT = 435.6;
const ACRE_TO_SQFT = 43560;
const SQYD_TO_SQFT = 9;
const HECTARE_TO_SQFT = 107639;

const apDistricts = [
  'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna',
  'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam',
  'Vizianagaram', 'West Godavari', 'YSR Kadapa', 'Nandyal',
  'Sri Sathya Sai', 'Annamayya', 'Alluri Sitharama Raju', 'Parvathipuram Manyam',
  'Kakinada', 'Konaseema', 'Eluru', 'NT Rama Rao', 'Palnadu', 'Bapatla'
];

const tsDistricts = [
  'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon',
  'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
  'Khammam', 'Komaram Bheem', 'Mahabubabad', 'Mahabubnagar', 'Mancherial',
  'Medak', 'Medchal Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda',
  'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla',
  'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad',
  'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
];

function convertArea(sqft) {
  return {
    sqft: Math.round(sqft * 100) / 100,
    sqyd: Math.round((sqft / SQYD_TO_SQFT) * 100) / 100,
    cents: Math.round((sqft / CENT_TO_SQFT) * 100) / 100,
    acres: Math.round((sqft / ACRE_TO_SQFT) * 100) / 100,
    hectares: Math.round((sqft / HECTARE_TO_SQFT) * 100) / 100,
    sqm: Math.round((sqft / 10.764) * 100) / 100,
  };
}

function AccuracyCircle({ center, accuracy }) {
  if (!center || !accuracy) return null;
  return (
    <Circle
      center={center}
      radius={accuracy}
      pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.1, weight: 1 }}
    />
  );
}

function MapController({ followPos, onMapClick }) {
  const map = useMap();
  const prevPos = useRef(null);
  useEffect(() => {
    if (!followPos) { prevPos.current = null; return; }
    if (prevPos.current === null) map.setView(followPos, 18);
    prevPos.current = followPos;
  }, [followPos, map]);
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng);
    }
  });
  return null;
}

function LocateButton({ onLocate }) {
  const map = useMap();
  const handleClick = () => {
    map.locate({ setView: true, maxZoom: 17 });
    map.once('locationfound', (e) => {
      if (onLocate) onLocate([e.latlng.lat, e.latlng.lng]);
    });
  };
  return (
    <button className="survey-locate-btn" onClick={handleClick} title="Locate me">
      <LocateFixed size={18} />
    </button>
  );
}

export default function LandSurvey() {
  const [tracking, setTracking] = useState(false);
  const [path, setPath] = useState([]);
  const [calculatedArea, setCalculatedArea] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('idle');
  const [watchId, setWatchId] = useState(null);
  const [mapCenter, setMapCenter] = useState([17.385, 78.4867]);
  const [currentPos, setCurrentPos] = useState(null);
  const [unit, setUnit] = useState('cents');
  const [crossCheck, setCrossCheck] = useState({ state: '', district: '', mandal: '', village: '', surveyNo: '' });
  const [showCrossCheck, setShowCrossCheck] = useState(false);
  const [history, setHistory] = useState([]);
  const [centroid, setCentroid] = useState(null);
  const [surveyNo, setSurveyNo] = useState('');
  const [copied, setCopied] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [showSurveyGuide, setShowSurveyGuide] = useState(false);
  const [gpsMsg, setGpsMsg] = useState('');
  const pathRef = useRef(path);
  pathRef.current = path;

  useEffect(() => {
    const saved = localStorage.getItem('survey-history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch {}
    }
  }, []);

  const removeHistoryEntry = useCallback((id) => {
    const updated = history.filter(e => e.id !== id);
    setHistory(updated);
    localStorage.setItem('survey-history', JSON.stringify(updated));
  }, [history]);

  const clearAllHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('survey-history');
  }, []);

  const saveToHistory = useCallback((areaData, pointCount, center, sNo) => {
    const entry = {
      id: Date.now(), date: new Date().toLocaleString(), ...areaData,
      points: pointCount, centroid: center, surveyNo: sNo || ''
    };
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem('survey-history', JSON.stringify(updated));
  }, [history]);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsMsg('Geolocation not supported on this device');
      return;
    }
    setPath([]);
    setCalculatedArea(null);
    setGpsMsg('Acquiring GPS signal...');
    setGpsStatus('acquiring');

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy: acc } = pos.coords;
        setAccuracy(Math.round(acc));
        setCurrentPos([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setGpsStatus('tracking');
        const msg = acc > 30 ? 'Low accuracy indoors — keep walking' : '';
        setGpsMsg(msg);
        setPath(prev => {
          if (prev.length === 0) return [[latitude, longitude]];
          const last = prev[prev.length - 1];
          const dist = Math.sqrt((last[0] - latitude) ** 2 + (last[1] - longitude) ** 2) * 111320;
          if (dist < 3) return prev;
          return [...prev, [latitude, longitude]];
        });
      },
      (err) => {
        setGpsStatus('error');
        const msgs = {
          1: 'Location permission denied. Enable GPS in browser settings.',
          2: 'GPS unavailable. Try using Manual Mode below.',
          3: 'GPS request timed out.'
        };
        setGpsMsg(msgs[err.code] || 'GPS error occurred');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
    setWatchId(id);
  }, []);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
    setGpsStatus('idle');

    if (path.length >= 3) {
      const closedPath = [...path, path[0]];
      const geojsonCoords = closedPath.map(p => [p[1], p[0]]);
      const polygon = { type: 'Polygon', coordinates: [geojsonCoords] };
      const areaSqMeters = area(polygon);
      const areaSqFt = areaSqMeters * 10.764;
      const converted = convertArea(areaSqFt);
      setCalculatedArea(converted);
      const perimeterMeters = length(polygon, { units: 'meters' });
      converted.perimeter = Math.round(perimeterMeters * 100) / 100;
      const avgLat = path.reduce((s, p) => s + p[0], 0) / path.length;
      const avgLng = path.reduce((s, p) => s + p[1], 0) / path.length;
      const center = [avgLat, avgLng];
      setCentroid(center);
      reverseGeocode(avgLat, avgLng);
      saveToHistory(converted, path.length, center, surveyNo);
    } else {
      setGpsMsg('Walk at least 3 corners of your land to calculate area.');
    }
  }, [watchId, path, saveToHistory]);

  const reverseGeocode = useCallback(async (lat, lng) => {
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=14`,
        { headers: { 'User-Agent': 'FreeForge-App/1.0' } }
      );
      const data = await res.json();
      if (data?.address) {
        const a = data.address;
        const info = {
          village: a.village || a.hamlet || a.town || a.municipality || '',
          mandal: a.county || a.suburb || a.neighbourhood || '',
          district: a.state_district || a.region || '',
          state: a.state || '',
          display: data.display_name || ''
        };
        setLocationInfo(info);
      }
    } catch {
      setLocationInfo(null);
    }
    setGeocoding(false);
  }, []);

  const resetSurvey = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
    setPath([]);
    setCalculatedArea(null);
    setAccuracy(null);
    setCurrentPos(null);
    setGpsStatus('idle');
    setGpsMsg('');
  }, [watchId]);

  const handleStartStop = () => {
    if (tracking) {
      stopTracking();
    } else {
      setTracking(true);
      startTracking();
    }
  };

  const openPortal = (portal) => {
    const urls = {
      meebhoomi: 'https://meebhoomi.ap.gov.in',
      dharani: 'https://dharani.telangana.gov.in/knowLandStatus',
      bhuvan: 'https://bhuvan.nrsc.gov.in',
      ccla: 'https://ccla.telangana.gov.in'
    };
    window.open(urls[portal], '_blank', 'noopener');
  };

  const openBhuvanAtLocation = () => {
    if (!centroid) return;
    const [lat, lng] = centroid;
    window.open(
      `https://bhuvan.nrsc.gov.in/ngmaps?mode=Hybrid#18/${lat}/${lng}`,
      'bhuvan',
      'width=1200,height=800,scrollbars=yes'
    );
    setShowSurveyGuide(true);
  };

  const showUnit = (u) => {
    const labels = { sqft: 'Sq Ft', sqyd: 'Sq Yd', cents: 'Cents', acres: 'Acres', hectares: 'Hectares', sqm: 'Sq M' };
    return labels[u] || u;
  };

  const formatNum = (n) => {
    if (n === null || n === undefined) return '—';
    return n.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  };

  const perimeterKm = calculatedArea ? (calculatedArea.perimeter / 1000).toFixed(2) : null;

  return (
    <div className="survey-page">
      <div className="survey-header">
        <div className="survey-header-top">
          <div>
            <h1 className="survey-title">
              <LandPlot size={28} />
              Land Survey
            </h1>
            <p className="survey-desc">
              Walk around your land boundary to measure area. Supports <strong>AP</strong> &amp; <strong>Telangana</strong> cross-check.
            </p>
          </div>
        </div>
      </div>

      <div className="survey-main-grid">
        <div className="survey-map-section">
          <div className="survey-map-container">
            <MapContainer center={mapCenter} zoom={17} className="survey-map" zoomControl={false}>
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController followPos={currentPos} onMapClick={manualMode ? (latlng) => {
                setPath(prev => [...prev, [latlng.lat, latlng.lng]]);
              } : null} />
              <LocateButton onLocate={(pos) => setMapCenter(pos)} />
              {currentPos && tracking && (
                <Marker position={currentPos}>
                  <div className="survey-gps-pulse" />
                </Marker>
              )}
              {path.map((pos, idx) => (
                <Marker
                  key={idx}
                  position={pos}
                  icon={L.divIcon({
                    className: 'survey-point-marker',
                    html: `<div class="survey-point-dot" style="background:${tracking ? '#f97316' : '#3b82f6'}">${idx + 1}</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                />
              ))}
              {path.length >= 2 && (
                <Polyline
                  positions={path}
                  pathOptions={{ color: tracking ? '#f97316' : '#3b82f6', weight: 3, opacity: 0.9 }}
                />
              )}
              {!tracking && path.length >= 3 && (
                <Polygon
                  positions={[...path, path[0]]}
                  pathOptions={{
                    color: '#22c55e', weight: 2, fillColor: '#22c55e', fillOpacity: 0.15
                  }}
                />
              )}
              {centroid && !tracking && (
                <Marker
                  position={centroid}
                  icon={L.divIcon({
                    className: 'survey-centroid-marker',
                    html: '<div class="survey-centroid-dot">📍</div>',
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                  })}
                />
              )}
              {currentPos && accuracy && (
                <AccuracyCircle center={currentPos} accuracy={accuracy} />
              )}
            </MapContainer>
          </div>

          <div className="survey-controls">
            <div className="survey-gps-info">
              <div className="survey-gps-status">
                <div className={`survey-status-dot ${gpsStatus}`} />
                <span>
                  {gpsStatus === 'idle' && 'Ready'}
                  {gpsStatus === 'acquiring' && 'Acquiring GPS...'}
                  {gpsStatus === 'tracking' && 'Tracking'}
                  {gpsStatus === 'error' && 'GPS Error'}
                </span>
              </div>
              {accuracy && <span className="survey-accuracy">Accuracy: ±{accuracy}m</span>}
              {path.length > 0 && <span className="survey-points">{path.length} points</span>}
            </div>

            <div className="survey-btn-group">
              <button
                className={`survey-btn ${tracking ? 'survey-btn-danger' : 'survey-btn-primary'}`}
                onClick={handleStartStop}
                disabled={gpsStatus === 'acquiring' && !tracking}
              >
                <Navigation size={18} />
                {tracking ? 'Finish Survey' : 'Start Survey'}
              </button>
              <button className="survey-btn survey-btn-secondary" onClick={resetSurvey} disabled={path.length === 0 && !calculatedArea}>
                <Trash2 size={18} />
                Reset
              </button>
            </div>

            {path.length > 0 && !tracking && (
              <button className="survey-btn survey-btn-ghost survey-btn-undo" onClick={() => setPath(prev => prev.slice(0, -1))}>
                <ArrowLeft size={14} />
                Undo Last Point ({path.length})
              </button>
            )}

            <div className="survey-mode-toggle">
              <button
                className={`survey-mode-btn ${!manualMode ? 'active' : ''}`}
                onClick={() => setManualMode(false)}
              >
                <Navigation size={14} />
                GPS
              </button>
              <button
                className={`survey-mode-btn ${manualMode ? 'active' : ''}`}
                onClick={() => setManualMode(true)}
              >
                <MapPin size={14} />
                Manual
              </button>
            </div>

            {manualMode && (
              <div className="survey-manual-hint">
                <MapPin size={14} />
                Click on the map to place boundary points
              </div>
            )}

            {gpsMsg && <div className="survey-gps-msg"><AlertCircle size={14} />{gpsMsg}</div>}
          </div>
        </div>

        <div className="survey-results-section">
          {path.length > 0 && !calculatedArea && (
            <div className="survey-point-list">
              <div className="survey-point-list-header">
                <MapPin size={16} />
                <span>Boundary Points ({path.length})</span>
              </div>
              <div className="survey-point-list-body">
                {path.map((pos, idx) => {
                  const prev = idx > 0 ? path[idx - 1] : null;
                  const segDist = prev
                    ? Math.sqrt((prev[0] - pos[0]) ** 2 + (prev[1] - pos[1]) ** 2) * 111320
                    : 0;
                  return (
                    <div key={idx} className="survey-point-item">
                      <span className="survey-point-num">{idx + 1}</span>
                      <span className="survey-point-coords">
                        {pos[0].toFixed(6)}, {pos[1].toFixed(6)}
                      </span>
                      {segDist > 0 && (
                        <span className="survey-point-dist">
                          {segDist < 1 ? '<1m' : `${Math.round(segDist)}m`}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {calculatedArea ? (
            <div className="survey-results-card">
              <div className="survey-results-header">
                <CheckCircle size={20} className="survey-check-icon" />
                <h3>Survey Complete</h3>
              </div>
              <div className="survey-unit-select">
                <label>Preferred unit:</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="cents">Cents</option>
                  <option value="acres">Acres</option>
                  <option value="sqyd">Sq Yards</option>
                  <option value="sqft">Sq Feet</option>
                  <option value="hectares">Hectares</option>
                  <option value="sqm">Sq Meters</option>
                </select>
              </div>
              <div className="survey-area-large">
                <span className="survey-area-value">{formatNum(calculatedArea[unit])}</span>
                <span className="survey-area-unit">{showUnit(unit)}</span>
              </div>
              <div className="survey-area-all">
                {['sqft', 'sqyd', 'cents', 'acres', 'hectares', 'sqm'].map(u => (
                  <div key={u} className={`survey-area-row ${u === unit ? 'active' : ''}`} onClick={() => setUnit(u)}>
                    <span className="survey-row-unit">{showUnit(u)}</span>
                    <span className="survey-row-val">{formatNum(calculatedArea[u])}</span>
                  </div>
                ))}
              </div>
              {calculatedArea.perimeter && (
                <div className="survey-perimeter">
                  <Ruler size={14} />
                  Perimeter: {calculatedArea.perimeter.toFixed(1)} m ({perimeterKm} km)
                </div>
              )}
              <div className="survey-points-info">
                <MapPin size={14} /> {path.length} boundary points recorded
              </div>
              <div className="survey-points-info">
                {centroid && (
                  <span>📍 {centroid[0].toFixed(6)}, {centroid[1].toFixed(6)}</span>
                )}
              </div>

              {locationInfo && (
                <div className="survey-location-card">
                  <MapPin size={14} className="survey-location-icon" />
                  <div className="survey-location-details">
                    {locationInfo.village && <span className="survey-loc-village">{locationInfo.village}</span>}
                    <span className="survey-loc-sub">
                      {[locationInfo.mandal, locationInfo.district, locationInfo.state].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
              )}

              <details className="survey-details">
                <summary><Search size={14} /> Cross-Check & Survey Number</summary>
                <div className="survey-details-body">
                  <div className="survey-detail-row">
                    <span>Survey Number</span>
                    <div className="survey-survey-no-input">
                      <input type="text" placeholder="e.g. 123/45" value={surveyNo} onChange={e => setSurveyNo(e.target.value)} />
                      <button className="survey-btn survey-btn-sm survey-btn-primary" onClick={() => { const updated = history.map(e => e.id === history[0]?.id ? { ...e, surveyNo } : e); setHistory(updated); localStorage.setItem('survey-history', JSON.stringify(updated)); }}>Save</button>
                    </div>
                  </div>
                  <div className="survey-detail-row">
                    <span>Portals</span>
                    <div className="survey-portal-row">
                      <button className="survey-portal-mini ap" onClick={() => openPortal('meebhoomi')}><FileText size={14} /> Meebhoomi <ExternalLink size={12} /></button>
                      <button className="survey-portal-mini ts" onClick={() => openPortal('dharani')}><FileText size={14} /> Dharani <ExternalLink size={12} /></button>
                      <button className="survey-portal-mini central isro" onClick={openBhuvanAtLocation}><MapIcon size={14} /> Bhuvan <ExternalLink size={12} /></button>
                    </div>
                  </div>
                  <div className="survey-detail-row">
                    <span>Coordinates</span>
                    <button className="survey-btn survey-btn-sm" onClick={() => { navigator.clipboard.writeText(`${centroid[0].toFixed(6)}, ${centroid[1].toFixed(6)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                      <MapIcon size={14} /> {copied ? 'Copied!' : 'Copy Coords'}
                    </button>
                  </div>
                </div>
              </details>
            </div>
          ) : (
            <div className="survey-placeholder">
              <Compass size={48} />
              <h3>Start a Survey</h3>
              <p>Tap <strong>"Start Survey"</strong> and walk around your land boundary. For small spaces or indoors, switch to <strong>Manual Mode</strong> and click points on the map.</p>
              <div className="survey-tips">
                <h4>Two ways to survey:</h4>
                <ul>
                  <li><strong>GPS Mode</strong> — Walk the boundary, phone tracks automatically</li>
                  <li><strong>Manual Mode</strong> — Click points on the map for small rooms</li>
                  <li>Complete at least 3 points for area calculation</li>
                  <li>GPS works best outdoors with clear sky view</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="survey-tools-section">
        <div className="survey-tool-card">
          <h3><Search size={18} /> Cross-Check with Government Records</h3>
          <p className="survey-tool-desc">After measuring your land, cross-check with official state portals.</p>
          <div className="survey-portal-grid">
            <button className="survey-portal-btn ap" onClick={() => openPortal('meebhoomi')}>
              <FileText size={20} />
              <div>
                <strong>Meebhoomi (AP)</strong>
                <small>Andhra Pradesh Land Records</small>
              </div>
              <ExternalLink size={16} />
            </button>
            <button className="survey-portal-btn ts" onClick={() => openPortal('dharani')}>
              <FileText size={20} />
              <div>
                <strong>Dharani (Telangana)</strong>
                <small>TS Integrated Land Records</small>
              </div>
              <ExternalLink size={16} />
            </button>
            <button className="survey-portal-btn central" onClick={() => openPortal('bhuvan')}>
              <MapIcon size={20} />
              <div>
                <strong>Bhuvan (ISRO)</strong>
                <small>Satellite Imagery &amp; Maps</small>
              </div>
              <ExternalLink size={16} />
            </button>
          </div>
          <details className="survey-guide">
            <summary><Info size={14} /> How to check records on Meebhoomi</summary>
            <ol>
              <li>Visit <strong>meebhoomi.ap.gov.in</strong> and login with mobile OTP</li>
              <li>Click <strong>"1B / ROR-1B"</strong> or <strong>"Adangal"</strong></li>
              <li>Select District, Mandal, and Village</li>
              <li>Search by <strong>Survey Number</strong> or <strong>Account Number</strong></li>
              <li>Compare the official area with your GPS measurement</li>
            </ol>
          </details>
          <details className="survey-guide">
            <summary><Info size={14} /> How to check records on Dharani (TS)</summary>
            <ol>
              <li>Visit <strong>dharani.telangana.gov.in/knowLandStatus</strong></li>
              <li>Select <strong>District → Mandal → Village</strong></li>
              <li>Enter <strong>Survey Number</strong> or <strong>Pattadar Passbook Number</strong></li>
              <li>View ownership details and extent of land</li>
              <li>Match the official extent with your GPS survey</li>
            </ol>
          </details>
        </div>
      </div>

      {history.length > 0 && (
        <div className="survey-history-section">
          <div className="survey-history-header">
            <h3><FileText size={18} /> Survey History</h3>
            <button className="survey-btn survey-btn-sm survey-btn-danger" onClick={clearAllHistory} title="Clear all history">
              <Trash2 size={14} /> Clear All
            </button>
          </div>
          <div className="survey-history-grid">
            {history.map(entry => (
              <div key={entry.id} className="survey-history-card">
                <button className="survey-history-remove" onClick={() => removeHistoryEntry(entry.id)} title="Remove entry">
                  <X size={14} />
                </button>
                <div className="survey-history-date">{entry.date}</div>
                <div className="survey-history-area">
                  <span className="survey-history-val">{formatNum(entry.cents)}</span>
                  <span className="survey-history-unit">cents</span>
                </div>
                <div className="survey-history-meta">
                  {entry.acres} acres &middot; {entry.points} points
                </div>
                {entry.surveyNo && <div className="survey-history-survey-no">Survey #: {entry.surveyNo}</div>}
                {entry.centroid && (
                  <div className="survey-history-coords">
                    <code>{entry.centroid[0].toFixed(4)}, {entry.centroid[1].toFixed(4)}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showSurveyGuide && (
        <div className="survey-guide-overlay" onClick={() => setShowSurveyGuide(false)}>
          <div className="survey-guide-modal" onClick={(e) => e.stopPropagation()}>
            <button className="survey-guide-close" onClick={() => setShowSurveyGuide(false)}>
              <X size={18} />
            </button>
            <div className="survey-guide-modal-header">
              <Crosshair size={22} />
              <h3>Find Your Survey Number on Bhuvan</h3>
            </div>
            <p className="survey-guide-modal-sub">A new window opened with your land coordinates. Follow these steps:</p>
            <div className="survey-guide-steps">
              <div className="survey-guide-step">
                <div className="guide-step-badge">1</div>
                <div>
                  <strong>Look for the Red Dot</strong>
                  <p>Bhuvan has centered on your land. You'll see a <strong>red dot</strong> marking your coordinates.</p>
                </div>
              </div>
              <div className="survey-guide-step">
                <div className="guide-step-badge">2</div>
                <div>
                  <strong>Zoom In</strong>
                  <p>Use the <strong>+</strong> button or scroll wheel to zoom in until you see parcel boundaries.</p>
                </div>
              </div>
              <div className="survey-guide-step">
                <div className="guide-step-badge">3</div>
                <div>
                  <strong>Find Survey Number Labels</strong>
                  <p>On Bhuvan's satellite/hybrid view, survey numbers appear as <strong>text labels</strong> on each parcel (e.g., "123/45"). If you don't see them, switch to <strong>Map view</strong> or enable the <strong>Cadastral</strong> layer.</p>
                </div>
              </div>
              <div className="survey-guide-step">
                <div className="guide-step-badge">4</div>
                <div>
                  <strong>Type & Save</strong>
                  <p>Enter the survey number in the <strong>"Survey Number"</strong> field below and click <strong>Save</strong>.</p>
                </div>
              </div>
            </div>
            <div className="survey-guide-tip">
              <Info size={14} />
              <span>Tip: If Bhuvan shows "We couldn't find exact match", try the older viewer at <strong>bhuvan-app1.nrsc.gov.in/bhuvan2d</strong></span>
            </div>
            <button className="survey-btn survey-btn-primary survey-guide-gotit" onClick={() => setShowSurveyGuide(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}

      <div className="survey-footer">
        <p>GPS-based land measurement is approximate (±5-10m accuracy). Always verify with official survey records from Meebhoomi or Dharani.</p>
      </div>
    </div>
  );
}
