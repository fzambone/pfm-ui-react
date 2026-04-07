import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import App from './App';

/*
 * MemoryRouter: In tests we can't use BrowserRouter (no real browser URL bar).
 * MemoryRouter lets us set initialEntries to simulate navigating to a URL.
 * Think of it like a mock HTTP request in Go — you control the input URL
 * without needing a real server.
 */
function renderWithRouter(initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  );
}

describe('App routing', () => {
  it('renders dashboard page at /', () => {
    renderWithRouter(['/']);
    expect(
      screen.getByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument();
  });

  it('renders dashboard page at /dashboard', () => {
    renderWithRouter(['/dashboard']);
    expect(
      screen.getByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument();
  });

  it('renders households page at /households', () => {
    renderWithRouter(['/households']);
    expect(
      screen.getByRole('heading', { name: /households/i }),
    ).toBeInTheDocument();
  });

  it('renders settings page at /settings', () => {
    renderWithRouter(['/settings']);
    expect(
      screen.getByRole('heading', { name: /settings/i }),
    ).toBeInTheDocument();
  });

  it('renders 404 page for unknown routes', () => {
    renderWithRouter(['/some/unknown/path']);
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
