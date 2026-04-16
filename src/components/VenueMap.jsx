import { useState, useEffect, useRef } from 'react';
import { venueZones, pointsOfInterest, eventData, getRecommendedRoute } from '../services/venueData';

/**
 * VenueMap Component
 * 
 * Interactive venue map with real-time crowd heatmap,
 * points of interest, and smart navigation routes.
 * 
 * In production, this would overlay on Google Maps with
 * indoor mapping. Here we render a stylized SVG venue layout.
 */
export default function VenueMap() {
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [filter, setFilter] = useState('all'); // all, restroom, food, medical
  const [crowdPulse, setCrowdPulse] = useState(0);

  // Animate crowd heatmap pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setCrowdPulse(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const filteredPOIs = filter === 'all'
    ? pointsOfInterest
    : pointsOfInterest.filter(p => p.type === filter);

  function getStatusColor(status) {
    switch (status) {
      case 'low': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'heavy': return '#ef4444';
      default: return '#94a3b8';
    }
  }

  function getPOIIcon(type) {
    switch (type) {
      case 'restroom': return '🚻';
      case 'food': return '🍔';
      case 'medical': return '🏥';
      case 'shop': return '🛍️';
      default: return '📍';
    }
  }

  function getWaitColor(wait) {
    if (wait <= 2) return 'var(--success)';
    if (wait <= 5) return 'var(--warning)';
    return 'var(--danger)';
  }

  const routes = showRoutes ? getRecommendedRoute() : [];

  return (
    <div className="map-view animate-fade-in">
      {/* Match banner */}
      <div className="glass-panel widget" style={{ padding: '14px 20px', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {eventData.half} · {eventData.minute}'
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
            {eventData.teams.home} {eventData.score.home} — {eventData.score.away} {eventData.teams.away}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse-glow 2s infinite' }}></span>
          <span style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: '📍 All' },
          { key: 'restroom', label: '🚻 Restrooms' },
          { key: 'food', label: '🍔 Food' },
          { key: 'medical', label: '🏥 Medical' },
        ].map(f => (
          <button
            key={f.key}
            className={`chip ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
            style={{
              background: filter === f.key ? 'var(--accent-primary)' : 'var(--glass-bg)',
              border: `1px solid ${filter === f.key ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
              color: 'white',
              padding: '8px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontFamily: 'inherit',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Interactive Venue Map */}
      <div className="map-placeholder" style={{ minHeight: '340px' }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {/* Stadium outline */}
          <ellipse cx="50" cy="50" rx="44" ry="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="35" ry="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />

          {/* Pitch / center field */}
          <rect x="30" y="30" width="40" height="40" rx="3" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.2)" strokeWidth="0.3" />
          <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(16,185,129,0.15)" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="6" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="0.2" />

          {/* Crowd heatmap zones */}
          {venueZones.map(zone => (
            <g key={zone.id}>
              <circle
                cx={zone.x}
                cy={zone.y}
                r={12 + Math.sin(crowdPulse * 0.06) * 2}
                fill={getStatusColor(zone.status)}
                opacity={0.12 + zone.crowdLevel * 0.15}
              />
              <circle
                cx={zone.x}
                cy={zone.y}
                r={6}
                fill={getStatusColor(zone.status)}
                opacity={0.3}
              />
              <text
                x={zone.x}
                y={zone.y + 18}
                textAnchor="middle"
                fill="white"
                fontSize="2.5"
                fontWeight="600"
                opacity="0.7"
              >
                {zone.gate}
              </text>
              <text
                x={zone.x}
                y={zone.y + 21.5}
                textAnchor="middle"
                fill={getStatusColor(zone.status)}
                fontSize="2"
                fontWeight="500"
              >
                {zone.label}
              </text>
            </g>
          ))}

          {/* Points of interest */}
          {filteredPOIs.map(poi => (
            <g
              key={poi.id}
              onClick={() => setSelectedPOI(poi)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={poi.x}
                cy={poi.y}
                r="3"
                fill="var(--bg-panel)"
                stroke={getWaitColor(poi.wait)}
                strokeWidth="0.5"
              />
              <text
                x={poi.x}
                y={poi.y + 1.2}
                textAnchor="middle"
                fontSize="3"
                dominantBaseline="middle"
              >
                {getPOIIcon(poi.type)}
              </text>
            </g>
          ))}

          {/* User location indicator */}
          <circle cx="55" cy="38" r="2" fill="var(--accent-primary)" opacity="0.9">
            <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="38" r="5" fill="var(--accent-primary)" opacity="0.15">
            <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="55" y="33" textAnchor="middle" fill="var(--accent-primary)" fontSize="2.2" fontWeight="700">YOU</text>
        </svg>

        {/* Legend */}
        <div style={{
          position: 'absolute', bottom: '10px', left: '10px', right: '10px',
          display: 'flex', gap: '12px', justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.85)', borderRadius: '10px',
          padding: '8px 12px', fontSize: '0.7rem',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span> Low
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}></span> Moderate
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span> Heavy
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)', animation: 'pulse-glow 2s infinite' }}></span> You
          </span>
        </div>
      </div>

      {/* Selected POI details */}
      {selectedPOI && (
        <div className="glass-panel widget animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="widget-title">
                {getPOIIcon(selectedPOI.type)} {selectedPOI.name}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <span style={{ color: getWaitColor(selectedPOI.wait), fontWeight: 600, fontSize: '0.9rem' }}>
                  ~{selectedPOI.wait} min wait
                </span>
                {selectedPOI.premium && (
                  <span style={{ color: 'var(--warning)', fontSize: '0.8rem' }}>🔒 Premium Only</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedPOI(null)}
              style={{
                background: 'none', border: 'none', color: 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '1.2rem', padding: '4px',
              }}
            >
              ✕
            </button>
          </div>
          <button
            className="action-btn primary"
            onClick={() => setShowRoutes(!showRoutes)}
          >
            🗺️ {showRoutes ? 'Hide Routes' : 'Show Route to Here'}
          </button>
        </div>
      )}

      {/* Route recommendations */}
      {showRoutes && (
        <div className="glass-panel widget animate-fade-in">
          <div className="widget-title">🗺️ Recommended Routes</div>
          {routes.map((route, i) => (
            <div
              key={i}
              style={{
                padding: '12px',
                background: i === 0 ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                borderRadius: '10px',
                border: `1px solid ${i === 0 ? 'rgba(16,185,129,0.2)' : 'var(--glass-border)'}`,
                marginBottom: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{route.name}</span>
                <span className={`badge ${route.congestion === 'low' ? 'fast' : ''}`}
                  style={{
                    background: route.congestion === 'heavy' ? 'rgba(239, 68, 68, 0.2)' : undefined,
                    color: route.congestion === 'heavy' ? 'var(--danger)' : undefined,
                  }}
                >
                  {route.time}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {route.steps.map((step, si) => (
                  <div key={si} style={{ paddingLeft: '4px' }}>→ {step}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick stats at the bottom */}
      {!selectedPOI && !showRoutes && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Venue Capacity</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>87%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--warning)' }}>52,200 / 60,000</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Best Exit</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>Gate C</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>East · Low traffic</div>
          </div>
        </div>
      )}
    </div>
  );
}
