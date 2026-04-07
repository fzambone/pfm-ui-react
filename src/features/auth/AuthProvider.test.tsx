import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider } from './AuthProvider';
import { clearToken, getToken, saveToken } from './tokenService';
import { useAuth } from './useAuth';

// Isolate the token service — these tests verify context behaviour, not storage.
// vi.mock is hoisted by Vitest above all imports, so the mock is in place before
// the module under test runs. The static imports above reflect the mocked module.
vi.mock('./tokenService', () => ({
  getToken: vi.fn(),
  saveToken: vi.fn(),
  clearToken: vi.fn(),
}));

const mockGetToken = vi.mocked(getToken);
const mockSaveToken = vi.mocked(saveToken);
const mockClearToken = vi.mocked(clearToken);

// Helper: a consumer component that exposes auth state via accessible text.
function AuthConsumer(): React.ReactElement {
  const { state, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="status">
        {state.isAuthenticated ? 'authenticated' : 'unauthenticated'}
      </span>
      {state.isAuthenticated && <span data-testid="token">{state.token}</span>}
      <button
        onClick={() => {
          login('tok-123', '2099-01-01T00:00:00Z');
        }}
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial load', () => {
    it('treats the user as authenticated when a valid token exists in storage', () => {
      mockGetToken.mockReturnValue({
        token: 'stored-token',
        expiresAt: '2099-01-01T00:00:00Z',
      });

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>,
      );

      expect(screen.getByTestId('status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
    });

    it('treats the user as unauthenticated when no token is stored', () => {
      mockGetToken.mockReturnValue(null);

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>,
      );

      expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated');
      expect(screen.queryByTestId('token')).toBeNull();
    });

    it('treats the user as unauthenticated when the stored token is expired', () => {
      // getToken already returns null for expired tokens (enforced by tokenService).
      // The context trusts the service — null means unauthenticated.
      mockGetToken.mockReturnValue(null);

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>,
      );

      expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated');
    });
  });

  describe('login()', () => {
    it('updates state to authenticated and persists the token', () => {
      mockGetToken.mockReturnValue(null);

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>,
      );

      act(() => {
        screen.getByRole('button', { name: 'Login' }).click();
      });

      expect(screen.getByTestId('status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('token')).toHaveTextContent('tok-123');
      expect(mockSaveToken).toHaveBeenCalledWith({
        token: 'tok-123',
        expiresAt: '2099-01-01T00:00:00Z',
      });
    });
  });

  describe('logout()', () => {
    it('updates state to unauthenticated and clears the token', () => {
      mockGetToken.mockReturnValue({
        token: 'stored-token',
        expiresAt: '2099-01-01T00:00:00Z',
      });

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>,
      );

      act(() => {
        screen.getByRole('button', { name: 'Logout' }).click();
      });

      expect(screen.getByTestId('status')).toHaveTextContent('unauthenticated');
      expect(screen.queryByTestId('token')).toBeNull();
      expect(mockClearToken).toHaveBeenCalledOnce();
    });
  });

  describe('multiple consumers', () => {
    it('all consumers reflect the same state after login', () => {
      mockGetToken.mockReturnValue(null);

      render(
        <AuthProvider>
          <AuthConsumer />
          <AuthConsumer />
        </AuthProvider>,
      );

      act(() => {
        // Click the first Login button — both consumers share the same context.
        screen.getAllByRole('button', { name: 'Login' })[0]?.click();
      });

      const statuses = screen.getAllByTestId('status');
      expect(statuses).toHaveLength(2);
      statuses.forEach((el) => {
        expect(el).toHaveTextContent('authenticated');
      });
    });
  });

  describe('useAuth()', () => {
    it('throws a descriptive error when used outside AuthProvider', () => {
      // Suppress React's error boundary console noise during this test.
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      expect(() => render(<AuthConsumer />)).toThrow(
        /useAuth must be used within an AuthProvider/,
      );

      consoleSpy.mockRestore();
    });
  });
});
