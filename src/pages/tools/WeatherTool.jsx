import { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Cloud, CloudRain, Sun, Snowflake, CloudLightning, CloudDrizzle, CloudFog, Wind, Droplets, Eye, Gauge } from 'lucide-react';

const weatherIcons = {
  'clear': Sun, 'cloudy': Cloud, 'rain': CloudRain, 'snow': Snowflake,
  'thunder': CloudLightning, 'drizzle': CloudDrizzle, 'fog': CloudFog, 'wind': Wind
};

function getWeatherType(code) {
  if (code === 0) return 'clear';
  if (code <= 3) return 'cloudy';
  if (code <= 48) return 'fog';
  if (code <= 59) return 'drizzle';
  if (code <= 69) return 'rain';
  if (code <= 79) return 'snow';
  if (code <= 84) return 'rain';
  if (code <= 99) return 'thunder';
  return 'cloudy';
}

export default function WeatherTool() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState({ lat: null, lon: null, city: '' });
  const [useGps, setUseGps] = useState(true);
  const [searchCity, setSearchCity] = useState('');

  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,visibility&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
      );
      if (!res.ok) throw new Error('Failed to fetch weather');
      const data = await res.json();
      setWeather(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported. Search for a city instead.');
      setUseGps(false);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(l => ({ ...l, lat: pos.coords.latitude, lon: pos.coords.longitude }));
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setError('Could not get location. Search for a city instead.');
        setUseGps(false);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleCitySearch = async () => {
    if (!searchCity.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=5&language=en&format=json`
      );
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        setError('City not found. Try a different name.');
        setLoading(false);
        return;
      }
      const result = data.results[0];
      setLocation({ lat: result.latitude, lon: result.longitude, city: result.name + (result.admin1 ? ', ' + result.admin1 : '') + ', ' + result.country });
      fetchWeather(result.latitude, result.longitude);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const windDir = (deg) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  };

  const weatherType = weather ? getWeatherType(weather.current.weather_code) : 'clear';
  const WeatherIcon = weatherIcons[weatherType] || Sun;
  const isDay = weather ? weather.current.is_day : true;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="utility-tool">
      <div className="tool-options">
        <h3 className="options-title">
          <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Weather
        </h3>

        {!useGps && (
          <div className="options-grid">
            <div className="option-item full-width" style={{ display: 'flex', gap: '8px', flexDirection: 'row', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label>City Name</label>
                <input
                  type="text" className="option-input" style={{ width: '100%' }}
                  value={searchCity} onChange={e => setSearchCity(e.target.value)}
                  placeholder="e.g. London, New York, Tokyo"
                  onKeyDown={e => e.key === 'Enter' && handleCitySearch()}
                />
              </div>
              <button className="process-btn" onClick={handleCitySearch} style={{ padding: '8px 20px', whiteSpace: 'nowrap', height: '38px' }}>
                Search
              </button>
            </div>
          </div>
        )}
      </div>

      {loading && !weather && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
          <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p>Fetching weather data...</p>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '16px', color: '#f87171', textAlign: 'center', marginBottom: '12px' }}>
          {error}
          {!useGps && (
            <div style={{ marginTop: '8px' }}>
              <button className="process-btn" onClick={getLocation} style={{ padding: '6px 16px', fontSize: '13px' }}>
                <MapPin size={14} /> Use My Location
              </button>
            </div>
          )}
        </div>
      )}

      {weather && (
        <>
          <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #1e293b)', borderRadius: '12px', padding: '24px', marginBottom: '16px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>
                  {location.city || `${location.lat?.toFixed(2)}, ${location.lon?.toFixed(2)}`}
                </div>
                <div style={{ fontSize: '42px', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>
                  {weather.current.temperature_2m}{weather.current_units?.temperature_2m}
                </div>
                <div style={{ fontSize: '15px', color: '#94a3b8', marginTop: '4px' }}>
                  Feels like {weather.current.apparent_temperature}{weather.current_units?.apparent_temperature}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <WeatherIcon size={56} color={isDay ? '#facc15' : '#818cf8'} strokeWidth={1.5} />
                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', textTransform: 'capitalize' }}>
                  {weatherType === 'clear' ? (isDay ? 'Clear Sky' : 'Clear Night') : weatherType}
                </div>
              </div>
            </div>
          </div>

          <div className="result-grid" style={{ marginBottom: '16px' }}>
            <div className="result-card"><Droplets size={20} color="#60a5fa" /><span className="result-label">Humidity</span><span className="result-value" style={{ fontSize: '18px' }}>{weather.current.relative_humidity_2m}%</span></div>
            <div className="result-card"><Wind size={20} color="#93c5fd" /><span className="result-label">Wind</span><span className="result-value" style={{ fontSize: '18px' }}>{weather.current.wind_speed_10m} {weather.current_units?.wind_speed_10m}</span><span style={{ fontSize: '12px', color: '#64748b' }}>{windDir(weather.current.wind_direction_10m)}</span></div>
            <div className="result-card"><Gauge size={20} color="#a78bfa" /><span className="result-label">Pressure</span><span className="result-value" style={{ fontSize: '18px' }}>{weather.current.pressure_msl} {weather.current_units?.pressure_msl}</span></div>
            <div className="result-card"><Eye size={20} color="#fbbf24" /><span className="result-label">Visibility</span><span className="result-value" style={{ fontSize: '18px' }}>{weather.current.visibility ? (weather.current.visibility / 1000).toFixed(1) + ' km' : 'N/A'}</span></div>
          </div>

          {weather.daily && (
            <div className="tool-options" style={{ marginBottom: '0' }}>
              <h3 className="options-title">7-Day Forecast</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
                {weather.daily.time.map((date, i) => {
                  if (i === 0) return null;
                  const d = new Date(date);
                  const dayType = getWeatherType(weather.daily.weather_code[i]);
                  const DayIcon = weatherIcons[dayType] || Sun;
                  return (
                    <div key={i} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{i === 1 ? 'Tomorrow' : dayNames[d.getDay()]}</div>
                      <DayIcon size={24} color="#94a3b8" style={{ margin: '6px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '13px' }}>
                        <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{Math.round(weather.daily.temperature_2m_max[i])}°</span>
                        <span style={{ color: '#64748b' }}>{Math.round(weather.daily.temperature_2m_min[i])}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="service-actions" style={{ marginTop: '16px' }}>
            <button className="process-btn" onClick={() => fetchWeather(location.lat, location.lon)} style={{ padding: '8px 20px', fontSize: '13px' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </>
      )}
    </div>
  );
}
