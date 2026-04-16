import { useState } from 'react';
import './App.css';
import ChatAssistant from './components/ChatAssistant';
import VenueMap from './components/VenueMap';
import Concessions from './components/Concessions';
import Notifications from './components/Notifications';
import TicketInfo from './components/TicketInfo';
import { eventData } from './services/venueData';

/**
 * FanFlow - Smart Sporting Venue Assistant
 * 
 * Main application shell with responsive layout,
 * tab navigation, and live event status bar.
 */

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
  { id: 'assistant', label: 'Assistant', icon: Icons.Chat },
  { id: 'food', label: 'Food', icon: Icons.Food },
  { id: 'alerts', label: 'Alerts', icon: Icons.Bell, badge: 3 },
  { id: 'ticket', label: 'My Ticket', icon: Icons.Ticket },
];

function App() {
  const [activeTab, setActiveTab] = useState('assistant');

  return (
    <div className="app-container">
      {/* Live Event Status Bar */}
      <div className="status-bar">
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
      <header className="header">
        <div className="header-left">
          <h1>FanFlow</h1>
          <span className="header-subtitle">Apex Arena</span>
        </div>
        <div className="header-right">
          <span className="weather-badge">
            ☀️ {eventData.weather.temp}°C
          </span>
          <button className="profile-btn" aria-label="Profile">
            <Icons.User />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content" id="main-content">
        {activeTab === 'assistant' && <ChatAssistant />}
        {activeTab === 'map' && <VenueMap />}
        {activeTab === 'food' && <Concessions onNavigate={() => setActiveTab('map')} />}
        {activeTab === 'alerts' && <Notifications />}
        {activeTab === 'ticket' && <TicketInfo />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-label={tab.label}
              id={`nav-${tab.id}`}
            >
              <div className="nav-icon-wrapper">
                <IconComponent />
                {tab.badge && activeTab !== tab.id && (
                  <span className="nav-badge">{tab.badge}</span>
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
