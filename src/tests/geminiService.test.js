import { describe, it, expect, vi } from 'vitest';
import { sendMessage } from '../services/geminiService';

describe('Gemini AI Service', () => {
  it('returns a mock response when no API key is present', async () => {
    const response = await sendMessage('Where is the food?');
    expect(response).toContain('Food Stand');
  });

  it('handles restroom queries with venue-specific advice', async () => {
    const response = await sendMessage('I need a restroom');
    expect(response).toContain('Restroom');
    expect(response).toContain('min wait');
  });

  it('handles score queries', async () => {
    const response = await sendMessage('What is the score?');
    expect(response).toContain('City FC');
    expect(response).toContain('United FC');
  });
});
