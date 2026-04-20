import { useState } from 'react';
import { menuItems, pointsOfInterest } from '../services/venueData';
import { logAppEvent } from '../services/firebase';

/**
 * Concessions Component
 */
export default function Concessions({ onNavigate }) {
  const [cart, setCart] = useState([]);
  const [selectedStand, setSelectedStand] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);

  const foodStands = pointsOfInterest.filter(p => p.type === 'food');

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  function addToCart(item) {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function removeFromCart(itemId) {
    setCart(prev => {
      const existing = prev.find(c => c.id === itemId);
      if (existing && existing.qty > 1) {
        return prev.map(c => c.id === itemId ? { ...c, qty: c.qty - 1 } : c);
      }
      return prev.filter(c => c.id !== itemId);
    });
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const maxPrepTime = cart.length > 0 ? Math.max(...cart.map(i => i.prepTime)) : 0;

  async function handlePlaceOrder() {
    if (cart.length === 0) return;
    
    // Simulated Google Pay API sequence
    setIsProcessing(true);
    
    // Simulate real network/auth delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setOrderPlaced(true);

    // Track analytics for the purchase
    logAppEvent('purchase_complete', {
      value: cartTotal,
      currency: 'USD',
      items_count: cartCount
    });
    
    // Auto-select fastest stand
    const fastest = foodStands.reduce((a, b) => a.wait < b.wait ? a : b);
    setSelectedStand(fastest);
  }

  function getWaitColor(wait) {
    if (wait <= 2) return 'var(--success)';
    if (wait <= 5) return 'var(--warning)';
    return 'var(--danger)';
  }

  // Order placed confirmation screen
  if (orderPlaced) {
    const stand = selectedStand || foodStands[0];
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const totalWait = stand.wait + maxPrepTime;

    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel widget animate-scale-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>✅</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Order Placed!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Paid with Google Pay. Order #{orderNum} has been sent to
          </p>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '12px',
            marginTop: '12px',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{stand.name}</div>
            <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '4px' }}>
              ~{stand.wait} min stand wait + ~{maxPrepTime} min prep = <strong>~{totalWait} min total</strong>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="glass-panel widget">
          <div className="widget-title">📋 Order Summary</div>
          {cart.map(item => (
            <div key={item.id} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: '1px solid var(--glass-border)',
            }}>
              <span>{item.emoji} {item.name} × {item.qty}</span>
              <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            paddingTop: '12px', fontWeight: 700, fontSize: '1.1rem',
          }}>
            <span>Total</span>
            <span style={{ color: 'var(--accent-primary)' }}>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Directions button */}
        <button
          className="action-btn primary"
          onClick={onNavigate}
          id="navigate-to-pickup"
        >
          🗺️ Navigate to Pickup Location
        </button>

        <button
          className="action-btn"
          onClick={() => {
            setCart([]);
            setOrderPlaced(false);
            setSelectedStand(null);
          }}
        >
          Place Another Order
        </button>
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '4px' }}>
          🍔 Food & Beverages
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Pre-order to skip the line and get back to the action faster
        </p>
      </div>

      {/* Pickup stand status */}
      <div className="glass-panel widget animate-scale-in" style={{ animationDelay: '0.1s' }}>
        <div className="widget-title">📍 Pickup Locations — Live Wait Times</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {foodStands.map(stand => (
            <div
              key={stand.id}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px', borderRadius: '10px',
                background: stand.wait <= 2 ? 'rgba(16, 185, 129, 0.06)' : 'transparent',
                border: `1px solid ${stand.wait <= 2 ? 'rgba(16,185,129,0.15)' : 'var(--glass-border)'}`,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{stand.name}</div>
                {stand.premium && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--warning)' }}>🔒 Premium ticket holders</div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: getWaitColor(stand.wait), fontWeight: 700 }}>~{stand.wait} min</div>
                {stand.wait <= 2 && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>✅ Recommended</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { key: 'all', label: 'All Items' },
          { key: 'food', label: '🍔 Food' },
          { key: 'drink', label: '🥤 Drinks' },
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            style={{
              background: activeCategory === cat.key ? 'var(--accent-primary)' : 'var(--glass-bg)',
              border: `1px solid ${activeCategory === cat.key ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
              color: 'white', padding: '8px 16px', borderRadius: '20px',
              cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit', fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      <div className="food-grid">
        {filteredItems.map((item, i) => (
          <div
            key={item.id}
            className="food-card glass-panel animate-scale-in"
            style={{ animationDelay: `${i * 0.05 + 0.1}s` }}
            onClick={() => addToCart(item)}
            role="button"
            tabIndex={0}
            aria-label={`Add ${item.name} to cart, $${item.price}`}
          >
            <span className="food-icon">{item.emoji}</span>
            <span className="food-name">{item.name}</span>
            <span className="food-price">${item.price.toFixed(2)}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              ~{item.prepTime} min prep
            </span>
          </div>
        ))}
      </div>

      {/* Cart floating bar */}
      {cart.length > 0 && (
        <div
          className="glass-panel animate-slide-up"
          style={{
            position: 'sticky', bottom: '0',
            padding: '16px 20px',
            display: 'flex', flexDirection: 'column', gap: '12px',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700 }}>
              🛒 Cart ({cartCount} items)
            </span>
            <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          {/* Cart items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
            {cart.map(item => (
              <div key={item.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: '0.85rem',
              }}>
                <span>{item.emoji} {item.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                    style={{
                      background: 'rgba(239,68,68,0.15)', border: 'none', color: 'var(--danger)',
                      width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                    }}
                  >−</button>
                  <span style={{ fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{item.qty}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                    style={{
                      background: 'rgba(16,185,129,0.15)', border: 'none', color: 'var(--success)',
                      width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                    }}
                  >+</button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="action-btn primary"
            onClick={handlePlaceOrder}
            id="place-order-btn"
            disabled={isProcessing}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: isProcessing ? '#000' : 'var(--accent-primary)'
            }}
          >
            {isProcessing ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" strokeDasharray="31.4" />
                </svg>
                Processing with Google Pay...
              </>
            ) : (
              <>
                <span style={{ fontSize: '1.1rem' }}>📱</span> Pay with Google Pay
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

