import { useState, useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Polygon, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { area, length } from '@turf/turf';
import { jsPDF } from 'jspdf';
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

class GPSKalmanFilter {
  constructor() {
    this.lat = null; this.lng = null;
    this.latP = 1; this.lngP = 1;
    this.q = 0.01; this.r = 25;
  }
  update(lat, lng, accuracy) {
    this.r = Math.max(accuracy * accuracy, 1);
    this.latP += this.q; this.lngP += this.q;
    const kLat = this.latP / (this.latP + this.r);
    if (this.lat !== null) this.lat += kLat * (lat - this.lat); else this.lat = lat;
    this.latP = (1 - kLat) * this.latP;
    const kLng = this.lngP / (this.lngP + this.r);
    if (this.lng !== null) this.lng += kLng * (lng - this.lng); else this.lng = lng;
    this.lngP = (1 - kLng) * this.lngP;
    return [this.lat, this.lng];
  }
  reset() { this.lat = null; this.lng = null; this.latP = 1; this.lngP = 1; }
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

function MapController({ followPos, fitPath, fitKey, onMapClick }) {
  const map = useMap();
  const prevPos = useRef(null);
  const prevFitKey = useRef(null);
  useEffect(() => {
    if (!followPos) { prevPos.current = null; return; }
    if (prevPos.current === null) map.setView(followPos, 18);
    prevPos.current = followPos;
  }, [followPos, map]);
  useEffect(() => {
    if (!fitPath) { prevFitKey.current = null; return; }
    if (prevFitKey.current === fitKey) return;
    const bounds = L.latLngBounds(fitPath);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 20 });
    prevFitKey.current = fitKey;
  }, [fitPath, fitKey, map]);
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
  const [surveyMode, setSurveyMode] = useState('walk');
  const [cornerPhase, setCornerPhase] = useState('idle');
  const [cornerSamples, setCornerSamples] = useState(0);
  const [showSurveyGuide, setShowSurveyGuide] = useState(false);
  const [showStartInfo, setShowStartInfo] = useState(false);
  const [gpsMsg, setGpsMsg] = useState('');
  const [fitKey, setFitKey] = useState(0);
  const mapRef = useRef(null);
  const gpsReadyTimer = useRef(null);
  const kfRef = useRef(new GPSKalmanFilter());
  const cornerReadingsRef = useRef([]);
  const cornerPhaseRef = useRef('idle');
  const pathRef = useRef(path);
  pathRef.current = path;

  useEffect(() => {
    const saved = localStorage.getItem('survey-history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 640) {
      setShowStartInfo(true);
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

  const saveToHistory = useCallback((areaData, coords, center, sNo) => {
    const entry = {
      id: Date.now(), date: new Date().toLocaleString(), ...areaData,
      points: coords.length, pathData: coords, centroid: center, surveyNo: sNo || ''
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
    if (gpsReadyTimer.current) clearTimeout(gpsReadyTimer.current);
    kfRef.current.reset();
    setPath([]);
    setCalculatedArea(null);
    cornerReadingsRef.current = [];
    setCornerSamples(0);
    cornerPhaseRef.current = 'idle';
    setCornerPhase('idle');
    setGpsMsg(surveyMode === 'corner' ? 'GPS ready — tap &quot;Record Corner&quot;' : 'Acquiring GPS signal...');
    setGpsStatus(surveyMode === 'corner' ? 'tracking' : 'acquiring');

    let firstPointSet = false;
    let lastPointTime = 0;
    const trackStartTime = Date.now();
    const mode = surveyMode;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy: acc } = pos.coords;
        setAccuracy(Math.round(acc));
        setCurrentPos([latitude, longitude]);
        setMapCenter([latitude, longitude]);

        if (mode === 'corner') {
          setGpsStatus('tracking');
          if (cornerPhaseRef.current === 'collecting') {
            const readings = cornerReadingsRef.current;
            readings.push({ lat: latitude, lng: longitude, accuracy: acc });
            setCornerSamples(readings.length);
            if (readings.length >= 8) {
              const recent = readings.slice(-5);
              const latVar = recent.reduce((s, r) => s + Math.abs(r.lat - recent[0].lat), 0) / recent.length;
              const lngVar = recent.reduce((s, r) => s + Math.abs(r.lng - recent[0].lng), 0) / recent.length;
              if ((latVar < 0.00002 && lngVar < 0.00002) || readings.length >= 20) {
                cornerPhaseRef.current = 'ready';
                setCornerPhase('ready');
                setGpsMsg('Corner ready — tap &quot;Lock Corner&quot;');
              } else {
                setGpsMsg(`Collecting sample ${readings.length} — stand still...`);
              }
            } else {
              setGpsMsg(`Collecting sample ${readings.length}/8 — stand still...`);
            }
          }
          return;
        }

        setGpsStatus('tracking');
        const [fLat, fLng] = kfRef.current.update(latitude, longitude, acc);
        const elapsed = Date.now() - trackStartTime;
        if (!firstPointSet) {
          if (elapsed < 8000 || acc > 15) {
            if (elapsed > 15000) {
              firstPointSet = true;
              lastPointTime = Date.now();
              setGpsMsg('GPS ready (low accuracy — results may vary)');
              if (gpsReadyTimer.current) clearTimeout(gpsReadyTimer.current);
              gpsReadyTimer.current = setTimeout(() => setGpsMsg(''), 3000);
              setPath(prev => [...prev, [fLat, fLng]]);
              return;
            }
            if (acc > 30) setGpsMsg(`GPS settling... (${Math.round(acc)}m accuracy)`);
            else setGpsMsg(`Wait for GPS to settle — current accuracy ±${Math.round(acc)}m`);
            return;
          }
          firstPointSet = true;
          lastPointTime = Date.now();
          setGpsMsg('GPS ready — start walking');
          if (gpsReadyTimer.current) clearTimeout(gpsReadyTimer.current);
          gpsReadyTimer.current = setTimeout(() => setGpsMsg(''), 2500);
          setPath(prev => [...prev, [fLat, fLng]]);
          return;
        }
        const now = Date.now();
        if (now - lastPointTime < 3000) return;
        const last = pathRef.current[pathRef.current.length - 1];
        const dist = Math.sqrt((last[0] - fLat) ** 2 + (last[1] - fLng) ** 2) * 111320;
        if (dist < 3) return;
        lastPointTime = now;
        setPath(prev => [...prev, [fLat, fLng]]);
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
  }, [surveyMode]);

  const stopTracking = useCallback(() => {
    if (gpsReadyTimer.current) clearTimeout(gpsReadyTimer.current);
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
    setGpsStatus('idle');
    cornerPhaseRef.current = 'idle';
    setCornerPhase('idle');

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
      saveToHistory(converted, path, center, surveyNo);
    } else {
      setGpsMsg('Walk at least 3 corners of your land to calculate area.');
    }
  }, [watchId, path, saveToHistory]);

  const recordCorner = useCallback(() => {
    cornerReadingsRef.current = [];
    cornerPhaseRef.current = 'collecting';
    setCornerPhase('collecting');
    setCornerSamples(0);
    setGpsMsg('Collecting GPS samples — stand still...');
  }, []);

  const lockCorner = useCallback(() => {
    const readings = cornerReadingsRef.current;
    if (readings.length === 0) return;
    const avgLat = readings.reduce((s, r) => s + r.lat, 0) / readings.length;
    const avgLng = readings.reduce((s, r) => s + r.lng, 0) / readings.length;
    setPath(prev => [...prev, [avgLat, avgLng]]);
    cornerReadingsRef.current = [];
    cornerPhaseRef.current = 'idle';
    setCornerPhase('idle');
    setCornerSamples(0);
    setGpsMsg('Corner locked! Move to next corner, tap "Record Corner"');
  }, []);

  const cancelCorner = useCallback(() => {
    cornerReadingsRef.current = [];
    cornerPhaseRef.current = 'idle';
    setCornerPhase('idle');
    setCornerSamples(0);
    setGpsMsg('Tap "Record Corner" at each corner point');
  }, []);

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
    if (gpsReadyTimer.current) clearTimeout(gpsReadyTimer.current);
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
    cornerPhaseRef.current = 'idle';
    setCornerPhase('idle');
    cornerReadingsRef.current = [];
    setCornerSamples(0);
  }, [watchId]);

  const loadSurvey = useCallback((entry) => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
    setCurrentPos(null);
    setGpsStatus('idle');
    setGpsMsg('');
    if (entry.pathData && entry.pathData.length > 0) {
      setPath(entry.pathData);
      setCentroid(entry.centroid || null);
      if (entry.centroid) setMapCenter(entry.centroid);
      setFitKey(k => k + 1);
      setCalculatedArea({
        sqft: entry.sqft, sqyd: entry.sqyd, cents: entry.cents,
        acres: entry.acres, hectares: entry.hectares, sqm: entry.sqm,
        perimeter: entry.perimeter
      });
    } else if (entry.centroid) {
      setPath([]);
      setCentroid(entry.centroid);
      setMapCenter(entry.centroid);
      setCalculatedArea(null);
      setFitKey(k => k + 1);
      setGpsMsg('Path data not available for this entry');
    }
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

  const handleDownloadImage = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const mapEl = mapRef.current;
    if (!mapEl) return;
    const mapCanvas = await html2canvas(mapEl, { useCORS: true, scale: 2 });
    const mapW = mapCanvas.width;
    const mapH = mapCanvas.height;
    const infoH = 220;
    const canvas = document.createElement('canvas');
    canvas.width = mapW;
    canvas.height = mapH + infoH;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(mapCanvas, 0, 0);
    const grad = ctx.createLinearGradient(0, mapH, 0, mapH + infoH);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, mapH, mapW, infoH);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Land Survey Report', 16, mapH + 28);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText(new Date().toLocaleString(), 16, mapH + 46);
    const unitLabels = { sqft: 'Sq Ft', sqyd: 'Sq Yd', cents: 'Cents', acres: 'Acres', hectares: 'Hectares', sqm: 'Sq M' };
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '12px sans-serif';
    const c = calculatedArea;
    if (c) {
      let x1 = 16, x2 = mapW / 2 + 8, y = mapH + 72;
      ['cents', 'acres', 'sqft', 'sqyd', 'hectares', 'sqm'].forEach((u, i) => {
        const col = i < 3 ? x1 : x2;
        const row = i % 3;
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(unitLabels[u] + ':', col, y + row * 22);
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(formatNum(c[u]), col + 70, y + row * 22);
      });
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Perimeter:', x1, y + 66);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillText(c.perimeter.toFixed(1) + ' m', x1 + 70, y + 66);
    }
    if (centroid) {
      const yPos = mapH + 170;
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Coordinates:', 16, yPos);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillText(centroid[0].toFixed(6) + ', ' + centroid[1].toFixed(6), 16, yPos + 18);
    }
    if (locationInfo) {
      const yPos = mapH + 206;
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Location:', 16, yPos);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillText([locationInfo.village, locationInfo.mandal, locationInfo.district].filter(Boolean).join(', '), 16, yPos + 18);
    }
    const link = document.createElement('a');
    link.download = `land-survey-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleDownloadPDF = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const mapEl = mapRef.current;
    if (!mapEl) return;
    const mapCanvas = await html2canvas(mapEl, { useCORS: true, scale: 2 });
    const imgData = mapCanvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfW = 190;
    const mapImgH = (mapCanvas.height * pdfW) / mapCanvas.width;
    pdf.addImage(imgData, 'PNG', 10, 10, pdfW, mapImgH);
    let y = mapImgH + 20;
    pdf.setFontSize(14);
    pdf.setTextColor(34, 197, 94);
    pdf.text('Land Survey Report', 10, y);
    y += 6;
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(new Date().toLocaleString(), 10, y);
    y += 8;
    const unitLabels = { sqft: 'Sq Ft', sqyd: 'Sq Yd', cents: 'Cents', acres: 'Acres', hectares: 'Hectares', sqm: 'Sq M' };
    pdf.setFontSize(9);
    const c = calculatedArea;
    if (c) {
      pdf.setTextColor(148, 163, 184);
      pdf.text('Cents:', 10, y);
      pdf.setTextColor(241, 245, 249);
      pdf.text(formatNum(c.cents), 40, y);
      y += 5;
      pdf.setTextColor(148, 163, 184);
      pdf.text('Acres:', 10, y);
      pdf.setTextColor(241, 245, 249);
      pdf.text(formatNum(c.acres), 40, y);
      y += 5;
      pdf.setTextColor(148, 163, 184);
      pdf.text('Sq Ft:', 10, y);
      pdf.setTextColor(241, 245, 249);
      pdf.text(formatNum(c.sqft), 40, y);
      y += 5;
      pdf.setTextColor(148, 163, 184);
      pdf.text('Sq Yd:', 10, y);
      pdf.setTextColor(241, 245, 249);
      pdf.text(formatNum(c.sqyd), 40, y);
      y += 5;
      pdf.setTextColor(148, 163, 184);
      pdf.text('Hectares:', 10, y);
      pdf.setTextColor(241, 245, 249);
      pdf.text(formatNum(c.hectares), 40, y);
      y += 5;
      pdf.setTextColor(148, 163, 184);
      pdf.text('Sq M:', 10, y);
      pdf.setTextColor(241, 245, 249);
      pdf.text(formatNum(c.sqm), 40, y);
      y += 5;
      pdf.setTextColor(148, 163, 184);
      pdf.text('Perimeter:', 10, y);
      pdf.setTextColor(241, 245, 249);
      pdf.text(c.perimeter.toFixed(1) + ' m', 40, y);
      y += 8;
    }
    if (centroid) {
      pdf.setTextColor(148, 163, 184);
      pdf.text('Coordinates:', 10, y);
      pdf.setTextColor(241, 245, 249);
      pdf.text(centroid[0].toFixed(6) + ', ' + centroid[1].toFixed(6), 10, y + 5);
      y += 12;
    }
    if (locationInfo) {
      pdf.setTextColor(148, 163, 184);
      pdf.text('Location:', 10, y);
      pdf.setTextColor(241, 245, 249);
      pdf.text([locationInfo.village, locationInfo.mandal, locationInfo.district].filter(Boolean).join(', '), 10, y + 5);
    }
    pdf.save(`land-survey-${Date.now()}.pdf`);
  };

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
                  Walk around your land boundary to measure your area for free.
                </p>
              </div>
              <button className="survey-guide-info-btn" onClick={() => setShowStartInfo(true)} title="Guide Info">
                <Info size={18} />
                <span>Guide Info</span>
              </button>
            </div>
      </div>

      <div className="survey-main-grid">
        <div className="survey-map-section">
          <div className="survey-map-container" ref={mapRef}>
            <MapContainer center={mapCenter} zoom={17} className="survey-map" zoomControl={false}>
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController followPos={currentPos} fitPath={!tracking && path.length >= 3 ? path : null} fitKey={fitKey} onMapClick={manualMode ? (latlng) => {
                setPath(prev => [...prev, [latlng.lat, latlng.lng]]);
              } : null} />
              <LocateButton onLocate={(pos) => setMapCenter(pos)} />
              {currentPos && tracking && (
                <Marker position={currentPos}>
                  <div className="survey-gps-pulse" />
                </Marker>
              )}
              {path.length >= 2 && (
                <Polyline
                  positions={path}
                  pathOptions={{ color: tracking ? '#f97316' : '#3b82f6', weight: 3, opacity: 0.9 }}
                />
              )}
              {(surveyMode === 'corner' || !tracking) && path.length >= 3 && (
                <Polygon
                  positions={[...path, path[0]]}
                  pathOptions={{
                    color: tracking ? '#3b82f6' : '#22c55e',
                    weight: 2,
                    fillColor: tracking ? '#3b82f6' : '#22c55e',
                    fillOpacity: 0.12
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
            {tracking && gpsMsg && surveyMode === 'walk' && (
              <div className="survey-gps-overlay">
                <div className="survey-gps-overlay-content">
                  <div className="survey-gps-spinner" />
                  <div className="survey-gps-overlay-text">{gpsMsg}</div>
                </div>
              </div>
            )}
            {tracking && surveyMode === 'corner' && cornerPhase === 'collecting' && (
              <div className="survey-gps-overlay">
                <div className="survey-gps-overlay-content">
                  <div className="survey-gps-spinner" />
                  <div className="survey-gps-overlay-text">{gpsMsg}</div>
                </div>
              </div>
            )}
            {tracking && surveyMode === 'corner' && cornerPhase === 'ready' && (
              <div className="survey-gps-overlay">
                <div className="survey-gps-overlay-content">
                  <div className="survey-corner-ready-icon">✓</div>
                  <div className="survey-gps-overlay-text">Corner ready — tap &quot;Lock Corner&quot;</div>
                  <div className="survey-corner-ready-hint">Accuracy: ±{accuracy || '?'}m · {cornerSamples} samples</div>
                </div>
              </div>
            )}
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
              {path.length > 0 && <span className="survey-points">{surveyMode === 'corner' ? `${path.length} corners` : `${path.length} points`}</span>}
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

            {tracking && surveyMode === 'corner' && (
              <div className="survey-corner-controls">
                {cornerPhase === 'idle' && (
                  <>
                    <button className="survey-btn survey-btn-corner-record" onClick={recordCorner}>
                      <MapPin size={16} /> Record Corner
                    </button>
                    <div className="survey-corner-hint">
                      <Navigation size={12} />
                      {path.length === 0
                        ? 'Stand at corner point 1, then tap "Record Corner"'
                        : `Move to next corner (${path.length + 1}), then tap "Record Corner"`}
                    </div>
                  </>
                )}
                {cornerPhase === 'collecting' && (
                  <div className="survey-corner-collecting">
                    <div className="survey-corner-samples-label">Collecting samples — stand still...</div>
                    <div className="survey-corner-progress">
                      <div className="survey-corner-bar-track">
                        <div className="survey-corner-bar-fill" style={{ width: `${Math.min((cornerSamples / 20) * 100, 100)}%` }} />
                      </div>
                      <span className="survey-corner-samples">{cornerSamples}/20</span>
                    </div>
                    <button className="survey-btn survey-btn-sm survey-btn-secondary" onClick={cancelCorner}>
                      <X size={14} /> Cancel Corner
                    </button>
                  </div>
                )}
                {cornerPhase === 'ready' && (
                  <>
                    <div className="survey-corner-ready-banner">
                      <CheckCircle size={16} /> Ready to lock
                    </div>
                    <button className="survey-btn survey-btn-corner-lock" onClick={lockCorner}>
                      <CheckCircle size={16} /> Lock Corner
                    </button>
                  </>
                )}
              </div>
            )}

            {path.length > 0 && !tracking && surveyMode === 'walk' && (
              <button className="survey-btn survey-btn-ghost survey-btn-undo" onClick={() => setPath(prev => prev.slice(0, -1))}>
                <ArrowLeft size={14} />
                Undo Last Point ({path.length})
              </button>
            )}

            <div className="survey-mode-toggle">
              <button
                className={`survey-mode-btn ${surveyMode === 'walk' ? 'active' : ''}`}
                onClick={() => setSurveyMode('walk')}
                disabled={tracking}
              >
                <Navigation size={14} />
                Walk
              </button>
              <button
                className={`survey-mode-btn ${surveyMode === 'corner' ? 'active' : ''}`}
                onClick={() => setSurveyMode('corner')}
                disabled={tracking}
              >
                <MapPin size={14} />
                Corner
              </button>
            </div>

            {surveyMode === 'walk' && (
              <div className="survey-mode-toggle">
                <button
                  className={`survey-mode-btn ${!manualMode ? 'active' : ''}`}
                  onClick={() => setManualMode(false)}
                  disabled={tracking}
                >
                  <Navigation size={14} />
                  GPS
                </button>
                <button
                  className={`survey-mode-btn ${manualMode ? 'active' : ''}`}
                  onClick={() => setManualMode(true)}
                  disabled={tracking}
                >
                  <MapPin size={14} />
                  Manual
                </button>
              </div>
            )}

            {manualMode && surveyMode === 'walk' && (
              <div className="survey-manual-hint">
                <MapPin size={14} />
                Click on the map to place boundary points
              </div>
            )}

            {!tracking && surveyMode === 'corner' && path.length === 0 && (
              <div className="survey-manual-hint">
                <MapPin size={14} />
                Stand at each corner and tap "Record Corner" to collect averaged GPS samples
              </div>
            )}

          </div>
        </div>

        <div className="survey-results-section">
          {path.length > 0 && !calculatedArea && (
            <div className="survey-point-badge">
              <MapPin size={14} /> {path.length} points recorded
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
              <div className="survey-export-actions">
                <button className="survey-btn survey-btn-sm survey-btn-export" onClick={handleDownloadImage}>
                  <Download size={14} /> Download Image
                </button>
                <button className="survey-btn survey-btn-sm survey-btn-export" onClick={handleDownloadPDF}>
                  <FileText size={14} /> Download PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="survey-placeholder">
              <Compass size={48} />
              <h3>Start a Survey</h3>
              <p>Choose a mode below, then tap <strong>"Start Survey"</strong>.</p>
              <div className="survey-tips">
                <div className="survey-mode-info">
                  <div className="survey-mode-info-icon">🚶</div>
                  <div>
                    <strong>Walk Mode</strong>
                    <p>Walk around your land boundary. GPS tracks automatically with Kalman filtering. For small areas, select <strong>Manual</strong> and tap points on the map. GPS settling takes 10–15s.</p>
                  </div>
                </div>
                <div className="survey-mode-info">
                  <div className="survey-mode-info-icon">🎯</div>
                  <div>
                    <strong>Corner Mode</strong>
                    <p>Government-style precision. Stand at each corner, tap <strong>"Record Corner"</strong>, wait for GPS to average readings, then <strong>"Lock Corner"</strong>. Clean straight boundary lines.</p>
                  </div>
                </div>
                <ul>
                  <li>Complete at least 3 points for area calculation</li>
                  <li>GPS works best outdoors with clear sky view</li>
                  <li>Always verify with official records (Meebhoomi / Dharani)</li>
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
              <div key={entry.id} className="survey-history-card" onClick={() => loadSurvey(entry)}>
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
                  {entry.pathData ? <span className="survey-history-badge">Map</span> : <span className="survey-history-badge old">No map</span>}
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

      {showStartInfo && (
        <div className="survey-guide-overlay" onClick={() => setShowStartInfo(false)}>
          <div className="survey-guide-modal survey-start-modal" onClick={(e) => e.stopPropagation()}>
            <button className="survey-guide-close" onClick={() => setShowStartInfo(false)}>
              <X size={18} />
            </button>
            <div className="survey-start-info-content">
              <Compass size={40} />
              <h3>Start a Survey</h3>
              <p>Choose a mode below, then tap <strong>"Start Survey"</strong>.</p>
              <div className="survey-tips">
                <div className="survey-mode-info">
                  <div className="survey-mode-info-icon">🚶</div>
                  <div>
                    <strong>Walk Mode</strong>
                    <p>Walk around your land boundary. GPS tracks automatically with Kalman filtering. For small areas, select <strong>Manual</strong> and tap points on the map. GPS settling takes 10–15s.</p>
                  </div>
                </div>
                <div className="survey-mode-info">
                  <div className="survey-mode-info-icon">🎯</div>
                  <div>
                    <strong>Corner Mode</strong>
                    <p>Government-style precision. Stand at each corner, tap <strong>"Record Corner"</strong>, wait for GPS to average readings, then <strong>"Lock Corner"</strong>. Clean straight boundary lines.</p>
                  </div>
                </div>
                <ul>
                  <li>Complete at least 3 points for area calculation</li>
                  <li>GPS works best outdoors with clear sky view</li>
                  <li>Always verify with official records (Meebhoomi / Dharani)</li>
                </ul>
              </div>
            </div>
            <button className="survey-btn survey-btn-primary survey-guide-gotit" onClick={() => setShowStartInfo(false)}>
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
