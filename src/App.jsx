import { useState, lazy, Suspense, useEffect } from 'react';
import './App.css';
import { eventData } from './services/venueData';
import { logAppEvent } from './services/firebase';

// Lazy load components for optimal performance
const ChatAssistant = lazy(() => import('./components/ChatAssistant'));
const VenueMap = lazy(() => import('./components/VenueMap'));
const Concessions = lazy(() => import('./components/Concessions'));
const Notifications = lazy(() => import('./components/Notifications'));
const TicketInfo = lazy(() => import('./components/TicketInfo'));
const MatchCenter = lazy(() => import('./components/MatchCenter'));

/**
 * FanFlow - Smart Sporting Venue Assistant
 */

// Loader Component
const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <div className="pulse-glow" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-gradient)' }}></div>
  </div>
);

// Google Identity Mock Component (The "One Tap" feel)
const GoogleIdentityPrompt = ({ onSignIn }) => (
  <div className="glass-panel animate-slide-up" style={{
    position: 'fixed', top: '80px', right: '20px', zIndex: 1000,
    width: '280px', padding: '16px', background: 'rgba(255,255,255,0.95)',
    color: '#000', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', borderRadius: '12px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <svg width="24" height="24" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sign in with Google</div>
        <div style={{ fontSize: '0.75rem', color: '#666' }}>Secure entry for fans</div>
      </div>
    </div>
    <button 
      onClick={onSignIn}
      style={{
        width: '100%', padding: '8px', borderRadius: '6px',
        background: '#fff', border: '1px solid #dadce0',
        fontWeight: 500, cursor: 'pointer', display: 'flex', 
        alignItems: 'center', justifyContent: 'center', gap: '8px'
      }}
    >
      Continue as Stadium Fan
    </button>
  </div>
);

// Inline SVG Icons
const Icons = {
  Map: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Chat: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  Food: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
  ),
  Ticket: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/><path d="M7 15h.01"/><path d="M11 15h2"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
};

const tabs = [
  { id: 'map', label: 'Map', icon: Icons.Map },
  { id: 'match', label: 'Match', icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10 10 10 0 0 1 10-10"/><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M12 2l0 4"/><path d="M12 18l0 4"/><path d="M2 12l4 0"/><path d="M18 12l4 0"/></svg> },
  { id: 'assistant', label: 'Assistant', icon: Icons.Chat },
  { id: 'food', label: 'Food', icon: Icons.Food },
  { id: 'alerts', label: 'Alerts', icon: Icons.Bell, badge: 3 },
  { id: 'ticket', label: 'My Ticket', icon: Icons.Ticket },
];

function App() {
  const [activeTab, setActiveTab] = useState('assistant');
  const [user, setUser] = useState(null);
  const [showIdentity, setShowIdentity] = useState(true);

  // App initialization analytics
  useEffect(() => {
    logAppEvent('app_initialized', { theme: 'premium_dark' });
    // Mock auto-dismiss after delay for demo
    const timer = setTimeout(() => setShowIdentity(false), 9000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (id) => {
    setActiveTab(id);
    logAppEvent('tab_view_change', { tab_id: id });
  };

  const handleSignIn = () => {
    setUser({ name: 'Stadium Fan', email: 'fan@example.com' });
    setShowIdentity(false);
    logAppEvent('google_identity_login_success');
    alert('Signed in via Google Identity Services! 🛡️');
  };

  return (
    <div className="app-container" role="main">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {showIdentity && <GoogleIdentityPrompt onSignIn={handleSignIn} />}

      {/* Live Event Status Bar */}
      <div className="status-bar" role="status">
        <div className="status-bar-inner">
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span>LIVE</span>
          </div>
          <span className="status-match">
            {eventData.teams.home} {eventData.score.home} — {eventData.score.away} {eventData.teams.away}
          </span>
          <span className="status-time">{eventData.minute}'</span>
        </div>
      </div>

      {/* Header */}
      <header className="header" role="banner">
        <div className="header-left">
          <h1>FanFlow</h1>
          <span className="header-subtitle" aria-label="Venue Name">Apex Arena</span>
        </div>
        <div className="header-right">
          <span className="weather-badge" aria-label={`Weather: ${eventData.weather.temp} degrees celsius`}>
            ☀️ {eventData.weather.temp}°C
          </span>
          <button 
            className="profile-btn" 
            style={{ borderColor: user ? 'var(--success)' : 'transparent' }}
            aria-label={user ? `Profile for ${user.name}` : "Open User Profile"} 
            onClick={() => user ? alert(`Logged in as ${user.name}`) : setShowIdentity(true)}
          >
            {user ? <span style={{ fontSize: '0.7rem' }}>👤</span> : <Icons.User />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content" id="main-content" aria-live="polite">
        <Suspense fallback={<Loader />}>
          {activeTab === 'assistant' && <ChatAssistant />}
          {activeTab === 'map' && <VenueMap />}
          {activeTab === 'match' && <MatchCenter />}
          {activeTab === 'food' && <Concessions onNavigate={() => handleTabChange('map')} />}
          {activeTab === 'alerts' && <Notifications />}
          {activeTab === 'ticket' && <TicketInfo />}
        </Suspense>
      </main>

      {/* Animated Background Blobs */}
      <div className="bg-blobs" aria-hidden="true">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav" role="navigation" aria-label="Primary navigation menu">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              id={`nav-${tab.id}`}
            >
              <div className="nav-icon-wrapper" aria-hidden="true">
                <IconComponent />
                {tab.badge && !isActive && (
                  <span className="nav-badge" aria-label={`${tab.badge} unread notifications`}>{tab.badge}</span>
                )}
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default App;
