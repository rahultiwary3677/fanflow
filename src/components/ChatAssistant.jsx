import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/geminiService';

/**
 * ChatAssistant Component
 * 
 * AI-powered venue assistant using Google Gemini API.
 * Provides real-time venue guidance, navigation help,
 * food recommendations, and crowd intelligence.
 */
export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 **Welcome to FanFlow AI!**

I'm your smart venue assistant for today's match at **Apex Arena**. I have real-time data on crowd levels, wait times, and optimal routes.

Try asking me:
- 🚻 "Where's the shortest restroom line?"
- 🍔 "What's the fastest food stand?"
- 🗺️ "How do I get to Section 102?"
- 📊 "Which areas are congested?"
- ⚽ "What's the score?"`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick suggestion chips
  const suggestions = [
    '🚻 Nearest restroom?',
    '🍔 Fast food options',
    '📊 Crowd levels',
    '⚽ Live score',
  ];

  async function handleSend(text) {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    // Add user message
    const userMsg = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Get AI response (Gemini or mock)
      const response = await sendMessage(messageText, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ Sorry, I encountered an issue. Please try again!' },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  /**
   * Simple markdown-like rendering for bold text and tables.
   */
  function renderContent(text) {
    // Split into lines to handle tables
    const lines = text.split('\n');
    const elements = [];
    let tableLines = [];
    let inTable = false;

    function flushTable() {
      if (tableLines.length < 2) {
        // Not a real table, render as text
        tableLines.forEach((line, i) => {
          elements.push(<p key={`t-${elements.length}-${i}`}>{renderInline(line)}</p>);
        });
      } else {
        const headers = tableLines[0].split('|').filter(c => c.trim());
        const rows = tableLines.slice(2).map(l => l.split('|').filter(c => c.trim()));
        elements.push(
          <div key={`table-${elements.length}`} className="chat-table-wrapper">
            <table className="chat-table">
              <thead>
                <tr>{headers.map((h, i) => <th key={i}>{renderInline(h.trim())}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{renderInline(cell.trim())}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      tableLines = [];
      inTable = false;
    }

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('|')) {
        inTable = true;
        tableLines.push(trimmed);
        return;
      }

      if (inTable) flushTable();

      if (trimmed === '') {
        elements.push(<br key={`br-${idx}`} />);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        elements.push(
          <div key={`li-${idx}`} style={{ paddingLeft: '12px', display: 'flex', gap: '6px' }}>
            <span>•</span>
            <span>{renderInline(trimmed.slice(2))}</span>
          </div>
        );
      } else if (/^\d+\.\s/.test(trimmed)) {
        const match = trimmed.match(/^(\d+\.)\s(.*)/);
        elements.push(
          <div key={`ol-${idx}`} style={{ paddingLeft: '12px', display: 'flex', gap: '6px' }}>
            <span>{match[1]}</span>
            <span>{renderInline(match[2])}</span>
          </div>
        );
      } else {
        elements.push(<p key={`p-${idx}`}>{renderInline(trimmed)}</p>);
      }
    });

    if (inTable) flushTable();

    return <>{elements}</>;
  }

  function renderInline(text) {
    // Bold **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  }

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.role}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {msg.role === 'assistant' ? renderContent(msg.content) : msg.content}
          </div>
        ))}

        {isLoading && (
          <div className="chat-message assistant typing-indicator">
            <div className="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        {/* Suggestion chips — shown only at the start */}
        {messages.length <= 1 && (
          <div className="suggestion-chips">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="chip"
                onClick={() => handleSend(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          placeholder="Ask about the venue..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          aria-label="Chat input"
          id="chat-input"
        />
        <button
          className="send-btn"
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          id="send-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}
