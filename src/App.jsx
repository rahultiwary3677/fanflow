import { useState, useEffect } from 'react';
import './App.css';
import ChatAssistant from './components/ChatAssistant';
import VenueMap from './components/VenueMap';
import Concessions from './components/Concessions';

// Inline SVG Icons mapped
const Icons = {
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
  ),
  MessageSquare: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
  ),
  Coffee: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  )
};

function App() {
  const [activeTab, setActiveTab] = useState('assistant');

  return (
    <div className="app-container animate-fade-in">
      <header className="header">
        <h1>FanFlow</h1>
        <button className="profile-btn" aria-label="Profile">
          <Icons.User />
        </button>
      </header>

      <main className="main-content">
        {activeTab === 'assistant' && <ChatAssistant />}
        {activeTab === 'map' && <VenueMap />}
        {activeTab === 'food' && <Concessions onNavigate={() => setActiveTab('map')} />}
      </main>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <Icons.MapPin />
          <span>Venue Map</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'assistant' ? 'active' : ''}`}
          onClick={() => setActiveTab('assistant')}
        >
          <Icons.MessageSquare />
          <span>Assistant</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'food' ? 'active' : ''}`}
          onClick={() => setActiveTab('food')}
        >
          <Icons.Coffee />
          <span>Food & Beverage</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
