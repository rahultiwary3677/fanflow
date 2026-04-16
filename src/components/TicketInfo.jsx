import { useState } from 'react';
import { eventData } from '../services/venueData';

/**
 * TicketInfo Component
 * 
 * Digital ticket display with seat information, QR code placeholder,
 * parking details, and quick-access venue info.
 */
export default function TicketInfo() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Mock ticket data
  const ticket = {
    section: '114',
    row: 'F',
    seat: '12',
    gate: 'Gate C (East)',
    parking: 'Lot P3, Spot E-42',
    ticketType: 'Standard',
    barcode: 'FAN-2026-48291',
  };

  function handleFeedbackSubmit() {
    setFeedbackSent(true);
  }

  return (
    <div className="ticket-view animate-slide-up">
      {/* Digital Ticket Card */}
      <div className="ticket-card glass-panel animate-scale-in">
        <div className="ticket-header">
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
              {eventData.half} · {eventData.minute}'
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '6px 0' }}>
              {eventData.teams.home} vs {eventData.teams.away}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              🏟️ {eventData.venue} · {eventData.weather.temp}°C {eventData.weather.condition}
            </div>
          </div>
          <div style={{
            background: 'var(--accent-gradient)', padding: '8px 14px',
            borderRadius: '10px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {eventData.score.home} - {eventData.score.away}
            </div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}>LIVE</div>
          </div>
        </div>

        {/* Dotted separator */}
        <div style={{
          borderTop: '2px dashed rgba(255,255,255,0.1)',
          margin: '16px 0',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', left: -28, top: -12, width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-dark)' }}></div>
          <div style={{ position: 'absolute', right: -28, top: -12, width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-dark)' }}></div>
        </div>

        {/* Seat info grid */}
        <div className="ticket-details-grid">
          <div className="ticket-detail">
            <span className="ticket-label">Section</span>
            <span className="ticket-value">{ticket.section}</span>
          </div>
          <div className="ticket-detail">
            <span className="ticket-label">Row</span>
            <span className="ticket-value">{ticket.row}</span>
          </div>
          <div className="ticket-detail">
            <span className="ticket-label">Seat</span>
            <span className="ticket-value">{ticket.seat}</span>
          </div>
          <div className="ticket-detail">
            <span className="ticket-label">Type</span>
            <span className="ticket-value" style={{ fontSize: '1rem' }}>{ticket.ticketType}</span>
          </div>
        </div>

        {/* QR Code placeholder */}
        <div style={{
          margin: '16px auto 12px auto', width: '120px', height: '120px',
          background: 'white', borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '4px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '3px' }}>
            {Array.from({ length: 25 }, (_, i) => (
              <div key={i} style={{
                width: '14px', height: '14px',
                background: Math.random() > 0.4 ? '#1e293b' : 'white',
                borderRadius: '2px',
              }}></div>
            ))}
          </div>
          <span style={{ fontSize: '0.55rem', color: '#64748b', marginTop: '4px' }}>{ticket.barcode}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '16px' }}>
          <button 
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#000', color: '#fff', border: '1px solid #333',
              padding: '10px 24px', borderRadius: '24px',
              fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => e.target.style.background = '#222'}
            onMouseOut={(e) => e.target.style.background = '#000'}
          >
            <span style={{ fontSize: '1.2rem' }}>👛</span> Add to Google Wallet
          </button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="ticket-info-cards">
        <div className="glass-panel info-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span style={{ fontSize: '1.5rem' }}>🚪</span>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Entry Gate</div>
            <div style={{ fontWeight: 700 }}>{ticket.gate}</div>
          </div>
        </div>
        <div className="glass-panel info-card animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <span style={{ fontSize: '1.5rem' }}>🅿️</span>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Parking</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{ticket.parking}</div>
          </div>
        </div>
      </div>

      {/* Emergency SOS */}
      <div className="glass-panel animate-slide-up" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', animationDelay: '0.2s' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)', border: '2px solid var(--danger)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', flexShrink: 0,
        }}>
          🆘
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Emergency Assistance</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Medical help, security, or lost & found
          </div>
        </div>
        <button
          className="action-btn"
          style={{
            width: 'auto', marginTop: 0, padding: '10px 18px',
            background: 'rgba(239, 68, 68, 0.15)', borderColor: 'var(--danger)',
            color: 'var(--danger)', fontWeight: 700,
          }}
          id="sos-btn"
        >
          SOS
        </button>
      </div>

      {/* Feedback Section */}
      <div className="glass-panel animate-slide-up" style={{ padding: '20px', animationDelay: '0.25s' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>⭐ Rate Your Experience</h3>
        {feedbackSent ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
            <p style={{ fontWeight: 600 }}>Thanks for your feedback!</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Your input helps us improve.</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              How's your experience at Apex Arena today?
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none', border: 'none', fontSize: '2rem',
                    cursor: 'pointer', transition: 'transform 0.2s',
                    transform: rating >= star ? 'scale(1.2)' : 'scale(1)',
                    filter: rating >= star ? 'none' : 'grayscale(1) opacity(0.4)',
                  }}
                  aria-label={`Rate ${star} stars`}
                >
                  ⭐
                </button>
              ))}
            </div>
            {rating > 0 && (
              <button
                className="action-btn primary animate-scale-in"
                onClick={handleFeedbackSubmit}
              >
                Submit Rating ({rating}/5)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
