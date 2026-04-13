import { act, renderHook } from '@testing-library/react';
import { type NavigateFunction, useNavigate } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginError, callLogin } from '../api/login';
import { useAuth } from '../useAuth';
import { useLoginForm } from './useLoginForm';

// Mock all external dependencies so the hook is tested in isolation.
// useLoginForm only uses useNavigate from react-router, so a full module mock is safe here.
vi.mock('react-router', () => ({ useNavigate: vi.fn() }));

vi.mock('../useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('../api/login', () => ({
  callLogin: vi.fn(),
  LoginError: class LoginError extends Error {
    public status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
}));

const mockNavigate = vi.fn() as unknown as NavigateFunction;
const mockLogin = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  vi.mocked(useAuth).mockReturnValue({
    state: { isAuthenticated: false },
    login: mockLogin,
    logout: vi.fn(),
  });
});

describe('useLoginForm', () => {
  describe('initial state', () => {
    it('starts with empty fields, no error, not loading', () => {
      const { result } = renderHook(() => useLoginForm());

      expect(result.current.email).toBe('');
      expect(result.current.password).toBe('');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.emailError).toBeNull();
      expect(result.current.passwordError).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('field changes', () => {
    it('updates email when handleEmailChange is called', () => {
      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.handleEmailChange('user@example.com');
      });

      expect(result.current.email).toBe('user@example.com');
    });

    it('updates password when handlePasswordChange is called', () => {
      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.handlePasswordChange('secret');
      });

      expect(result.current.password).toBe('secret');
    });
  });

  describe('handleSubmit — validation', () => {
    it('does not call the API when email is empty', async () => {
      const { result } = renderHook(() => useLoginForm());

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(callLogin).not.toHaveBeenCalled();
      expect(result.current.emailError).toMatch(/email/i);
      expect(result.current.error).toBeNull();
    });

    it('does not call the API when password is empty', async () => {
      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.handleEmailChange('a@b.com');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(callLogin).not.toHaveBeenCalled();
      expect(result.current.passwordError).toMatch(/password/i);
      expect(result.current.error).toBeNull();
    });
  });

  describe('handleSubmit — success', () => {
    it('calls login() with token and expiresAt and navigates to /dashboard', async () => {
      vi.mocked(callLogin).mockResolvedValueOnce({
        token: 'tok-abc',
        expiresAt: '2099-01-01T00:00:00Z',
      });

      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.handleEmailChange('user@example.com');
        result.current.handlePasswordChange('secret');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockLogin).toHaveBeenCalledWith('tok-abc', '2099-01-01T00:00:00Z');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
        replace: true,
      });
      expect(result.current.error).toBeNull();
    });

    it('sets isLoading to true during the request and false after', async () => {
      let resolveLogin!: (v: { token: string; expiresAt: string }) => void;
      vi.mocked(callLogin).mockReturnValueOnce(
        new Promise((res) => {
          resolveLogin = res;
        }),
      );

      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.handleEmailChange('user@example.com');
        result.current.handlePasswordChange('secret');
      });

      let submitPromise!: Promise<void>;
      act(() => {
        submitPromise = result.current.handleSubmit();
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveLogin({ token: 'tok', expiresAt: '2099-01-01T00:00:00Z' });
        await submitPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('handleSubmit — errors', () => {
    it('sets an "invalid credentials" error on 401', async () => {
      vi.mocked(callLogin).mockRejectedValueOnce(
        new LoginError(401, 'invalid'),
      );

      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.handleEmailChange('bad@example.com');
        result.current.handlePasswordChange('wrong');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.error).toMatch(/invalid email or password/i);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('sets a generic error on non-401 LoginError', async () => {
      vi.mocked(callLogin).mockRejectedValueOnce(
        new LoginError(500, 'server error'),
      );

      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.handleEmailChange('a@b.com');
        result.current.handlePasswordChange('pw');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.error).toMatch(/something went wrong/i);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('sets isLoading to false after an error', async () => {
      vi.mocked(callLogin).mockRejectedValueOnce(
        new LoginError(401, 'invalid'),
      );

      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.handleEmailChange('a@b.com');
        result.current.handlePasswordChange('pw');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
