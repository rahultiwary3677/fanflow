import { useState } from 'react';
import { eventData } from '../services/venueData';

/**
 * MatchCenter Component
 * 
 * Provides live match statistics, tactical lineups, 
 * and detailed game metadata.
 */
export default function MatchCenter() {
  const [view, setView] = useState('stats'); // 'stats' or 'lineup'

  const stats = [
    { label: 'Possession', home: 58, away: 42, unit: '%' },
    { label: 'Shots', home: 12, away: 7, unit: '' },
    { label: 'Shots on Target', home: 5, away: 3, unit: '' },
    { label: 'Pass Accuracy', home: 84, away: 76, unit: '%' },
    { label: 'Corners', home: 6, away: 2, unit: '' },
    { label: 'Fouls', home: 9, away: 11, unit: '' },
  ];

  const formation = {
    home: [
      { pos: 'GK', name: 'L. Martinez', x: 50, y: 88 },
      { pos: 'DF', name: 'R. Diaz', x: 20, y: 70 },
      { pos: 'DF', name: 'C. Romero', x: 50, y: 72 },
      { pos: 'DF', name: 'N. Otamendi', x: 80, y: 70 },
      { pos: 'MF', name: 'E. Fernandez', x: 30, y: 50 },
      { pos: 'MF', name: 'A. Mac Allister', x: 70, y: 50 },
      { pos: 'MF', name: 'R. De Paul', x: 50, y: 45 },
      { pos: 'FW', name: 'L. Messi', x: 50, y: 25 },
      { pos: 'FW', name: 'J. Alvarez', x: 20, y: 28 },
      { pos: 'FW', name: 'A. Di Maria', x: 80, y: 28 },
    ],
  };

  return (
    <div className="match-center animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Switcher */}
      <div className="glass-panel" style={{ padding: '4px', display: 'flex', borderRadius: '12px' }}>
        <button
          onClick={() => setView('stats')}
          style={{
            flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
            background: view === 'stats' ? 'var(--accent-gradient)' : 'transparent',
            color: 'white', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s'
          }}
        >
          Match Stats
        </button>
        <button
          onClick={() => setView('lineup')}
          style={{
            flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
            background: view === 'lineup' ? 'var(--accent-gradient)' : 'transparent',
            color: 'white', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s'
          }}
        >
          Tactical Lineup
        </button>
      </div>

      {view === 'stats' ? (
        <div className="stats-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {stats.map((stat, i) => (
            <div key={i} className="glass-panel widget" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>{stat.home}{stat.unit}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
                <span>{stat.away}{stat.unit}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ 
                  width: `${(stat.home / (stat.home + stat.away)) * 100}%`, 
                  background: 'var(--accent-primary)',
                  transition: 'width 1s ease-out'
                }} />
                <div style={{ 
                  width: `${(stat.away / (stat.home + stat.away)) * 100}%`, 
                  background: 'var(--accent-secondary)',
                  opacity: 0.8,
                  transition: 'width 1s ease-out'
                }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="lineup-view animate-fade-in">
          <div className="glass-panel" style={{ 
            height: '500px', width: '100%', position: 'relative', 
            background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            overflow: 'hidden'
          }}>
            {/* Pitch markings */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(16, 185, 129, 0.2)' }} />
            <div style={{ 
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '100px', height: '100px', borderRadius: '50%', border: '1px solid rgba(16, 185, 129, 0.2)'
            }} />
            
            {/* Players */}
            {formation.home.map((p, i) => (
              <div key={i} style={{
                position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
                transform: 'translate(-50%, -50%)', textAlign: 'center',
                animation: `float ${3 + i % 2}s infinite ease-in-out`,
                animationDelay: `${i * 0.1}s`
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'var(--accent-gradient)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px',
                  boxShadow: '0 0 15px var(--accent-glow)', border: '2px solid white'
                }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{p.pos}</span>
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {p.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
