import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { useAuth } from '../useAuth';
import { ProtectedRoute } from './ProtectedRoute';

// Mock useAuth so tests control auth state without a real provider or localStorage.
// vi.mock is hoisted by Vitest above all imports at runtime, so the mock is in
// place before any module under test executes — import order in source is irrelevant
// to when the mock takes effect.
vi.mock('../useAuth', () => ({ useAuth: vi.fn() }));

const mockUseAuth = vi.mocked(useAuth);

function ProtectedPage(): React.ReactElement {
  return <p>Protected content</p>;
}
function LoginPage(): React.ReactElement {
  return <p>Login page</p>;
}

function renderWithRoutes(initialPath: string): void {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<ProtectedPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('renders the child outlet when the user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      state: {
        isAuthenticated: true,
        token: 'tok',
        expiresAt: '2099-01-01T00:00:00Z',
      },
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRoutes('/dashboard');

    expect(screen.getByText('Protected content')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).toBeNull();
  });

  it('redirects to /login when the user is unauthenticated', () => {
    mockUseAuth.mockReturnValue({
      state: { isAuthenticated: false },
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRoutes('/dashboard');

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).toBeNull();
  });

  it('redirects to /login when navigating directly to a deep protected URL', () => {
    mockUseAuth.mockReturnValue({
      state: { isAuthenticated: false },
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRoutes('/dashboard');

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
