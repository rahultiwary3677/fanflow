/**
 * Google Gemini AI Service
 * 
 * This module leverages the official @google/generative-ai SDK to 
 * provide venue-aware, context-sensitive responses.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Internal configuration for GenAI
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  systemInstruction: `You are FanFlow AI, a smart assistant for attendees at a large sporting venue called "Apex Arena".
  Provide specific, actionable advice based on live venue data.
  Suggest optimal routes, shortest queues, and best times to move.
  Be concise, friendly, and helpful. Use emojis sparingly.`
}) : null;

// Venue context injected into every Gemini prompt
const SYSTEM_PROMPT = `Current live venue data:
- Event: Premier League Final — City FC vs United FC (62')
- Weather: Clear, 24°C
- Capacitiy: 87%
- Best Exit: Gate C (East) - Low congestion
- Concession Wait: C3 (~2min), A1 (~4min), B2 (~12min)
- Restroom Wait: East (~1min), North (~3min), West (~5min)`;

/**
 * Smart mock response engine — used as a fallback.
 */
function getMockResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('restroom')) {
    return `🚻 **Shortest Restroom Line:** Head to the **East Restrooms** (~1 min wait). It's a 2-minute walk from your section.`;
  }
  
  if (msg.includes('food') || msg.includes('eat')) {
    return `🍔 **Fastest Food Stand:** **Stand C3 (East Grab & Go)** is currently at ~2 min wait. It's the most efficient choice right now.`;
  }

  if (msg.includes('score')) {
    return `⚽ **Live Score:** City FC 2 — 1 United FC (62'). Rodriguez just scored a beauty in the 58th minute!`;
  }

  return `Stadium status: 87% capacity. I recommend using the **East concourse** for moving around as it has the lowest traffic right now. How else can I help?`;
}

/**
 * Send a message to the Gemini API using the official SDK.
 */
export async function sendMessage(userMessage, history = []) {
  // If no SDK initialized, use mock
  if (!model) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return getMockResponse(userMessage);
  }

  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I have the live venue data for Apex Arena." }],
        },
        ...history.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }))
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.warn('Gemini SDK Error, falling back to mock:', error.message);
    return getMockResponse(userMessage);
  }
}
