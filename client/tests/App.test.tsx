import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { App } from '../src/App';

describe('App', () => {
  it('renders the app shell with navigation', () => {
    render(<App />);
    expect(screen.getByText('SquadForge')).toBeInTheDocument();
  });

  it('renders the Demand Center heading on root route', () => {
    render(<App />);
    const headings = screen.getAllByRole('heading', { name: /demand center/i });
    expect(headings.length).toBeGreaterThan(0);
  });

  it('displays navigation items', () => {
    render(<App />);
    expect(screen.getByText('Resource Queue')).toBeDefined();
    expect(screen.getByText('Analytics')).toBeDefined();
    expect(screen.getByText('Team Config')).toBeDefined();
  });
});
