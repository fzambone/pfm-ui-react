import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { useAuth } from '../useAuth';
import { PublicRoute } from './PublicRoute';

// vi.mock is hoisted above all imports at runtime by Vitest.
vi.mock('../useAuth', () => ({ useAuth: vi.fn() }));

const mockUseAuth = vi.mocked(useAuth);

function LoginPage(): React.ReactElement {
  return <p>Login page</p>;
}
function DashboardPage(): React.ReactElement {
  return <p>Dashboard page</p>;
}

function renderWithRoutes(initialPath: string): void {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PublicRoute', () => {
  it('renders the child outlet when the user is unauthenticated', () => {
    mockUseAuth.mockReturnValue({
      state: { isAuthenticated: false },
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRoutes('/login');

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard page')).toBeNull();
  });

  it('redirects to /dashboard when the user is already authenticated', () => {
    mockUseAuth.mockReturnValue({
      state: {
        isAuthenticated: true,
        token: 'tok',
        expiresAt: '2099-01-01T00:00:00Z',
      },
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRoutes('/login');

    expect(screen.getByText('Dashboard page')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).toBeNull();
  });
});
