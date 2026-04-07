import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import App from './App';
import { AuthProvider } from './features/auth/AuthProvider';

// The App routes are now guarded by ProtectedRoute which reads from AuthProvider.
// Mock the token service so AuthProvider initialises with an authenticated user —
// App.test.tsx tests routing structure, not auth behaviour.
vi.mock('./features/auth/tokenService', () => ({
  getToken: vi
    .fn()
    .mockReturnValue({ token: 'test-tok', expiresAt: '2099-01-01T00:00:00Z' }),
  saveToken: vi.fn(),
  clearToken: vi.fn(),
}));

/*
 * MemoryRouter: In tests we can't use BrowserRouter (no real browser URL bar).
 * MemoryRouter lets us set initialEntries to simulate navigating to a URL.
 * Think of it like a mock HTTP request in Go — you control the input URL
 * without needing a real server.
 *
 * AuthProvider must wrap App (mirroring main.tsx) so ProtectedRoute can read
 * auth state. The mocked token service above sets the authenticated state.
 */
function renderWithRouter(initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <App />
      </AuthProvider>
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

  // --- PageHeader/PageContent structure ---

  it('dashboard page uses PageHeader with subtitle', () => {
    renderWithRouter(['/dashboard']);
    expect(screen.getByText(/financial overview/i)).toBeInTheDocument();
  });

  it('households page uses PageHeader with subtitle', () => {
    renderWithRouter(['/households']);
    expect(screen.getByText(/shared financial spaces/i)).toBeInTheDocument();
  });

  it('settings page uses PageHeader with subtitle', () => {
    renderWithRouter(['/settings']);
    expect(screen.getByText(/configure your account/i)).toBeInTheDocument();
  });

  it('404 page has a link back to dashboard', () => {
    renderWithRouter(['/unknown']);
    expect(
      screen.getByRole('link', { name: /back to dashboard/i }),
    ).toBeInTheDocument();
  });
});
