import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/features/auth/useAuth';

import { AppLayout } from './AppLayout';

// vi.mock is hoisted by Vitest above all imports, so the mock is in place before
// the module under test runs. The static import of useAuth above reflects the mocked module.
vi.mock('@/features/auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockLogout = vi.fn();
const mockUseAuth = vi.mocked(useAuth);

function renderWithRouter(ui?: React.ReactElement) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={ui ?? <div data-testid="page-content">Page Content</div>}
          />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      state: {
        isAuthenticated: true,
        token: 'tok',
        expiresAt: '2099-01-01T00:00:00Z',
      },
      login: vi.fn(),
      logout: mockLogout,
    });
  });

  // --- Structure ---

  it('renders a sidebar and main content area', () => {
    renderWithRouter();
    expect(
      screen.getByRole('complementary', { name: /sidebar/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders child route content via Outlet', () => {
    renderWithRouter();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  // --- Desktop (sidebar visible by default) ---

  it('shows sidebar on desktop by default', () => {
    renderWithRouter();
    const sidebar = screen.getByRole('complementary', { name: /sidebar/i });
    // On desktop the sidebar is visible (not hidden)
    expect(sidebar).toBeVisible();
  });

  // --- Mobile toggle ---

  it('has a menu button for mobile sidebar toggle', () => {
    renderWithRouter();
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });

  it('toggles sidebar visibility when menu button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const menuButton = screen.getByRole('button', { name: /menu/i });

    // Click to open
    await user.click(menuButton);
    // The mobile overlay should appear
    expect(
      screen.getByRole('complementary', { name: /sidebar/i }),
    ).toBeVisible();
  });

  it('closes mobile sidebar when Escape is pressed', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    // Open sidebar
    await user.click(screen.getByRole('button', { name: /menu/i }));

    // Press Escape
    await user.keyboard('{Escape}');
    // Sidebar overlay should be hidden (isMobileOpen = false)
    // The sidebar element still exists but the overlay is gone
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('closes mobile sidebar when clicking the backdrop overlay', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    // Open sidebar
    await user.click(screen.getByRole('button', { name: /menu/i }));

    // Click the backdrop
    const overlay = screen.getByRole('presentation');
    await user.click(overlay);
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  // --- Content area ---

  it('renders content area with consistent padding', () => {
    renderWithRouter();
    const main = screen.getByRole('main');
    expect(main.className).toMatch(/p-/);
  });

  // --- Design tokens ---

  it('uses design tokens for sidebar styling (glass, border, blur)', () => {
    renderWithRouter();
    const sidebar = screen.getByRole('complementary', { name: /sidebar/i });
    expect(sidebar.className).toMatch(/bg-glass/);
    expect(sidebar.className).toMatch(/glass-edge/);
  });

  // --- Overflow ---

  it('sidebar scrolls independently with overflow-y-auto', () => {
    renderWithRouter();
    const sidebar = screen.getByRole('complementary', { name: /sidebar/i });
    expect(sidebar.className).toMatch(/overflow-y-auto/);
  });

  // --- Logout ---

  describe('logout button', () => {
    it('renders a Sign out button in the sidebar', () => {
      renderWithRouter();
      expect(
        screen.getByRole('button', { name: /sign out/i }),
      ).toBeInTheDocument();
    });

    it('calls logout when the Sign out button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      await user.click(screen.getByRole('button', { name: /sign out/i }));
      expect(mockLogout).toHaveBeenCalledOnce();
    });

    it('navigates to /login after logout', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      await user.click(screen.getByRole('button', { name: /sign out/i }));
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('is keyboard-accessible — activatable with Enter', async () => {
      const user = userEvent.setup();
      renderWithRouter();
      const logoutButton = screen.getByRole('button', { name: /sign out/i });
      logoutButton.focus();
      expect(logoutButton).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(mockLogout).toHaveBeenCalledOnce();
    });
  });
});
