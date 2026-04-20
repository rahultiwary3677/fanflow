import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Concessions from '../components/Concessions';

describe('Concessions Component', () => {
  it('renders the food list correctly', () => {
    render(<Concessions onNavigate={() => {}} />);
    expect(screen.getByText(/Food & Beverages/i)).toBeDefined();
    expect(screen.getByText(/Classic Hot Dog/i)).toBeDefined();
  });

  it('adds an item to the cart when clicked', () => {
    render(<Concessions onNavigate={() => {}} />);
    const hotDog = screen.getByText(/Classic Hot Dog/i);
    fireEvent.click(hotDog);
    
    expect(screen.getByText(/Cart \(1 items\)/i)).toBeDefined();
    expect(screen.getAllByText(/\$6.99/i).length).toBeGreaterThanOrEqual(2);
  });

  it('filters items by category', () => {
    render(<Concessions onNavigate={() => {}} />);
    const drinkFilter = screen.getByText(/Drinks/i);
    fireEvent.click(drinkFilter);
    
    expect(screen.queryByText(/Classic Hot Dog/i)).toBeNull();
    expect(screen.getByText(/Draft Beer/i)).toBeDefined();
  });

  it('shows the Google Pay button when items are in cart', () => {
    render(<Concessions onNavigate={() => {}} />);
    const hotDog = screen.getByText(/Classic Hot Dog/i);
    fireEvent.click(hotDog);
    
    expect(screen.getByText(/Pay with Google Pay/i)).toBeDefined();
  });
});
