/**
 * Google Gemini AI Service
 * 
 * This module handles interaction with the Google Gemini API for the
 * FanFlow AI assistant. It provides venue-aware, context-sensitive
 * responses about crowd levels, navigation, food ordering, and more.
 * 
 * To use the live Gemini API, set your API key in a .env file:
 *   VITE_GEMINI_API_KEY=your_key_here
 * 
 * When no key is present, smart mock responses are used.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Venue context injected into every Gemini prompt
const SYSTEM_PROMPT = `You are FanFlow AI, a smart assistant for attendees at a large sporting venue called "Apex Arena" — a 60,000-seat multi-purpose stadium.

Current live venue data:
- Current event: Premier League Final — City FC vs United FC
- Quarter/Half: Second Half, 62nd minute
- Weather: Clear, 24°C
- Overall crowd density: 87% capacity
- Gate A (North): Moderate congestion
- Gate B (South): Heavy congestion — avoid
- Gate C (East): Low congestion — recommended exit
- Gate D (West): Moderate congestion

Concession stand wait times:
- Stand A1 (North Food Court): ~4 min wait
- Stand B2 (South Food Court): ~12 min wait — very busy
- Stand C3 (East Grab & Go): ~2 min wait — fastest
- Stand D4 (West Premium Lounge): ~1 min wait (premium ticket holders only)

Restroom wait times:
- North Restrooms: ~3 min
- South Restrooms: ~8 min
- East Restrooms: ~1 min — shortest
- West Restrooms: ~5 min

Parking:
- Lot P1 (North): 70% full
- Lot P2 (South): 95% full — nearly full
- Lot P3 (East): 40% full — recommended
- Lot P4 (West): 60% full

You should:
1. Provide specific, actionable advice based on the live data above.
2. Suggest optimal routes, shortest queues, and best times to move.
3. Be concise, friendly, and helpful.
4. Proactively warn about congested areas.
5. If asked about food, recommend the fastest pickup location.
6. Use emojis sparingly for a modern feel.`;

/**
 * Smart mock response engine — uses keyword matching to simulate
 * intelligent venue-aware responses when no API key is configured.
 */
function getMockResponse(userMessage) {
  const msg = userMessage.toLowerCase();

  // Restroom queries
  if (msg.includes('restroom') || msg.includes('bathroom') || msg.includes('toilet') || msg.includes('washroom')) {
    return `🚻 **Restroom Wait Times Right Now:**

| Location | Wait Time | Status |
|----------|----------|--------|
| East Restrooms | ~1 min | ✅ Shortest |
| North Restrooms | ~3 min | 🟢 Good |
| West Restrooms | ~5 min | 🟡 Moderate |
| South Restrooms | ~8 min | 🔴 Busy |

**My recommendation:** Head to the **East Restrooms** — they're the closest to your section and practically empty right now. Take the corridor past Gate C, it's a 2-minute walk.`;
  }

  // Food / concession queries
  if (msg.includes('food') || msg.includes('eat') || msg.includes('hungry') || msg.includes('snack') || msg.includes('drink') || msg.includes('beer') || msg.includes('hot dog') || msg.includes('pizza') || msg.includes('order') || msg.includes('concession')) {
    return `🍔 **Concession Stand Status:**

| Stand | Wait | Best For |
|-------|------|----------|
| C3 (East Grab & Go) | ~2 min | ✅ Fastest |
| A1 (North Food Court) | ~4 min | 🟢 Good variety |
| D4 (West Premium) | ~1 min | 🔒 Premium only |
| B2 (South Food Court) | ~12 min | 🔴 Avoid |

**Tip:** I'd suggest **Stand C3** — you can grab a hot dog and drink in under 3 minutes. Want me to show you the fastest route there, or would you like to pre-order for express pickup?`;
  }

  // Navigation / route / directions
  if (msg.includes('route') || msg.includes('direction') || msg.includes('how do i get') || msg.includes('navigate') || msg.includes('find') || msg.includes('where is') || msg.includes('way to') || msg.includes('section') || msg.includes('seat')) {
    return `🗺️ **Navigation Assist**

Based on current crowd flow, here's your best route:

1. Head through the **East corridor** (low traffic)  
2. Follow signs to **Gate C** area  
3. Use the inner concourse to reach your destination  

⚠️ **Avoid the South concourse** — it's heavily congested due to halftime traffic from the South stands.

Estimated walk time: **3-4 minutes** via this route vs. 8+ minutes through the south.

Want me to pull up the interactive map?`;
  }

  // Parking / exit / leave
  if (msg.includes('parking') || msg.includes('car') || msg.includes('exit') || msg.includes('leave') || msg.includes('go home') || msg.includes('uber') || msg.includes('taxi') || msg.includes('rideshare')) {
    return `🚗 **Exit & Parking Info:**

| Lot | Capacity | Status |
|-----|----------|--------|
| P3 (East) | 40% full | ✅ Easy exit |
| P4 (West) | 60% full | 🟡 Moderate |
| P1 (North) | 70% full | 🟡 Moderate |
| P2 (South) | 95% full | 🔴 Gridlock |

**Best exit strategy:** Use **Gate C (East)** — it connects directly to Lot P3 with minimal pedestrian crossover.

🕐 **Pro tip:** If you leave at the 85th minute or wait 15 minutes after the final whistle, you'll avoid the worst of the rush.`;
  }

  // Score / game / match
  if (msg.includes('score') || msg.includes('game') || msg.includes('match') || msg.includes('play') || msg.includes('goal') || msg.includes('half')) {
    return `⚽ **Live Match Update:**

**City FC 2 — 1 United FC**  
📍 62nd minute | Second Half

⚡ **Recent highlights:**  
- 58' — City FC goal! (Rodriguez, assisted by Kim)  
- 45' — United FC equalizer (Johnson, free kick)  
- 23' — City FC opening goal (Martinez, penalty)  

The atmosphere is electric! 🔥 The next 30 minutes are going to be intense.`;
  }

  // Crowd / congestion / busy
  if (msg.includes('crowd') || msg.includes('busy') || msg.includes('congested') || msg.includes('packed') || msg.includes('wait') || msg.includes('line') || msg.includes('queue')) {
    return `📊 **Live Crowd Density:**

The venue is at **87% capacity** right now. Here's the breakdown:

| Zone | Density | Recommendation |
|------|---------|---------------|
| North | 🟡 Moderate | Okay to move |
| South | 🔴 Heavy | ⚠️ Avoid |
| East | 🟢 Low | ✅ Best route |
| West | 🟡 Moderate | Okay to move |

**Smart tip:** The second half just started, so the South concourse is clearing up from halftime. Give it another 5 minutes and South will ease to moderate.`;
  }

  // Help / what can you do
  if (msg.includes('help') || msg.includes('what can you') || msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return `👋 **Welcome to FanFlow AI!**

I'm your smart venue assistant for today's match at Apex Arena. Here's what I can help with:

🗺️ **Navigation** — "How do I get to Section 102?"  
🚻 **Restrooms** — "Where's the shortest restroom line?"  
🍔 **Food & Drinks** — "What's the fastest food stand?"  
🚗 **Parking & Exit** — "Best way to get to my car?"  
📊 **Crowd Info** — "Which areas are congested?"  
⚽ **Match Updates** — "What's the current score?"  

Just ask me anything! I have real-time data on crowd flow, wait times, and optimal routes. 🏟️`;
  }

  // Default
  return `Great question! Based on current venue conditions at Apex Arena:

📍 **Quick Status:** 87% capacity | East side is your best bet for movement right now.

I can help you with:
- 🗺️ Finding the fastest route anywhere in the venue
- 🍔 Locating the shortest food & drink lines
- 🚻 Finding restrooms with minimal wait
- 🚗 Planning your exit strategy
- ⚽ Live match updates

What would you like to know more about?`;
}

/**
 * Send a message to the Gemini API (or get a mock response).
 * @param {string} userMessage - The user's message
 * @param {Array} history - Chat history for context
 * @returns {Promise<string>} - The assistant's response
 */
export async function sendMessage(userMessage, history = []) {
  // If no API key, use smart mock responses
  if (!GEMINI_API_KEY) {
    // Simulate network delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
    return getMockResponse(userMessage);
  }

  try {
    // Build conversation history for Gemini
    const contents = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood! I am FanFlow AI, ready to assist attendees at Apex Arena with real-time venue information.' }]
      },
      ...history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API error, falling back to mock response');
      return getMockResponse(userMessage);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getMockResponse(userMessage);
  } catch (error) {
    console.warn('Gemini API unavailable, using mock response:', error.message);
    return getMockResponse(userMessage);
  }
}
