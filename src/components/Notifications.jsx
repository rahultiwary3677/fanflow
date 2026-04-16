import { useState } from 'react';
import { smartAlerts } from '../services/venueData';

/**
 * Notifications Component
 * 
 * Real-time smart alerts panel that provides proactive
 * venue intelligence — crowd warnings, order updates,
 * optimal timing suggestions, and safety alerts.
 */
export default function Notifications() {
  const [alerts, setAlerts] = useState(smartAlerts);
  const [dismissed, setDismissed] = useState(new Set());

  function dismissAlert(id) {
    setDismissed(prev => new Set([...prev, id]));
  }

  function clearAll() {
    setDismissed(new Set(alerts.map(a => a.id)));
  }

  const visibleAlerts = alerts.filter(a => !dismissed.has(a.id));

  function getAlertStyle(type) {
    switch (type) {
      case 'warning':
        return { borderLeft: '3px solid var(--warning)', background: 'rgba(245, 158, 11, 0.06)' };
      case 'success':
        return { borderLeft: '3px solid var(--success)', background: 'rgba(16, 185, 129, 0.06)' };
      case 'danger':
        return { borderLeft: '3px solid var(--danger)', background: 'rgba(239, 68, 68, 0.06)' };
      default:
        return { borderLeft: '3px solid var(--accent-primary)', background: 'rgba(59, 130, 246, 0.06)' };
    }
  }

  return (
    <div className="notifications-view animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>🔔 Smart Alerts</h2>
        {visibleAlerts.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Clear all
          </button>
        )}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
        Proactive updates based on real-time venue conditions
      </p>

      {visibleAlerts.length === 0 ? (
        <div className="glass-panel animate-scale-in" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✨</div>
          <p style={{ fontWeight: 600, marginBottom: '4px' }}>All caught up!</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            We'll notify you when there's something important.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visibleAlerts.map((alert, i) => (
            <div
              key={alert.id}
              className="glass-panel animate-slide-up"
              style={{
                padding: '16px',
                ...getAlertStyle(alert.type),
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                  <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{alert.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                      {alert.title}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.4 }}>
                      {alert.message}
                    </p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '6px', display: 'inline-block' }}>
                      {alert.time}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '1rem', padding: '2px 6px', flexShrink: 0,
                  }}
                  aria-label="Dismiss alert"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proactive Tips Section */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>💡 Smart Tips</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { tip: 'Best time for restrooms is during active play — 70% shorter lines', icon: '🚻' },
            { tip: 'Pre-order food now for halftime pickup — avoid the 12-min rush', icon: '🍔' },
            { tip: 'Gate C (East) will be fastest exit — plan your route early', icon: '🚗' },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-panel animate-slide-up"
              style={{
                animationDelay: `${i * 0.1 + 0.3}s`,
                padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center',
                fontSize: '0.85rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{item.tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
