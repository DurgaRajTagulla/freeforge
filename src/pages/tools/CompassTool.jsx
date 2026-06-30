import { useState, useEffect } from 'react';
import { Navigation } from 'lucide-react';

function getDirection(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export default function CompassTool() {
  const [heading, setHeading] = useState(0);
  const [supported, setSupported] = useState(true);
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    if (!('DeviceOrientationEvent' in window)) {
      setSupported(false);
      return;
    }
    const handler = (e) => {
      let deg = e.alpha;
      if (deg !== null && deg !== undefined) {
        setHeading(Math.round(deg));
        setWatching(true);
      }
    };
    window.addEventListener('deviceorientation', handler, true);
    return () => window.removeEventListener('deviceorientation', handler, true);
  }, []);

  // Fallback: manual compass with click
  const [manualAngle, setManualAngle] = useState(0);

  useEffect(() => {
    if (supported && watching) return;
    setHeading(manualAngle);
  }, [manualAngle, supported, watching]);

  const direction = getDirection(heading);

  return (
    <div className="utility-tool">
      <div className="tool-options">
        <h3 className="options-title">Compass</h3>
        {!supported && (
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 12px' }}>
            Device orientation not available. Use the dial below.
          </p>
        )}
      </div>

      <div className="compass-display">
        <div className="compass-ring">
          <div className="compass-needle" style={{ transform: `rotate(${-heading}deg)` }}>
            <div className="compass-north">N</div>
            <Navigation size={32} className="compass-arrow" />
          </div>
        </div>
        <div className="compass-degrees">{heading}°</div>
        <div className="compass-direction">{direction}</div>
      </div>

      {!supported && (
        <div className="tool-options" style={{ marginTop: '16px' }}>
          <label style={{ color: '#e2e8f0', fontSize: '13px', marginBottom: '8px', display: 'block' }}>Rotate Dial</label>
          <input
            type="range"
            className="option-slider"
            min={0}
            max={359}
            value={manualAngle}
            onChange={e => setManualAngle(Number(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}
