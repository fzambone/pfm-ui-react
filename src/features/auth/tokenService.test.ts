import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clearToken, getToken, saveToken } from './tokenService';

// Pin a fixed "now" so expiry comparisons are deterministic.
const FIXED_NOW = new Date('2026-04-07T12:00:00Z');

describe('tokenService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('saveToken', () => {
    it('persists token and expiresAt to localStorage', () => {
      saveToken({ token: 'abc123', expiresAt: '2026-04-08T12:00:00Z' });

      const raw = localStorage.getItem('auth_token');
      expect(raw).not.toBeNull();

      const parsed: unknown = JSON.parse(raw!);
      expect(parsed).toEqual({
        token: 'abc123',
        expiresAt: '2026-04-08T12:00:00Z',
      });
    });
  });

  describe('getToken', () => {
    it('returns the AuthToken when the token is valid (not expired)', () => {
      saveToken({ token: 'valid-token', expiresAt: '2026-04-08T12:00:00Z' });

      const result = getToken();

      expect(result).toEqual({
        token: 'valid-token',
        expiresAt: '2026-04-08T12:00:00Z',
      });
    });

    it('returns null when no token is stored', () => {
      expect(getToken()).toBeNull();
    });

    it('returns null when the stored token is expired', () => {
      // expires_at is in the past relative to FIXED_NOW
      saveToken({ token: 'old-token', expiresAt: '2026-04-06T12:00:00Z' });

      expect(getToken()).toBeNull();
    });

    it('returns null when expiresAt equals the current time (boundary: treat as expired)', () => {
      // exactly now — must be treated as expired
      saveToken({
        token: 'boundary-token',
        expiresAt: FIXED_NOW.toISOString(),
      });

      expect(getToken()).toBeNull();
    });

    it('returns null when localStorage contains a malformed JSON value', () => {
      localStorage.setItem('auth_token', 'not-valid-json{{');

      expect(() => getToken()).not.toThrow();
      expect(getToken()).toBeNull();
    });

    it('returns null when localStorage value is missing expected fields', () => {
      localStorage.setItem(
        'auth_token',
        JSON.stringify({ unexpected: 'shape' }),
      );

      expect(getToken()).toBeNull();
    });
  });

  describe('clearToken', () => {
    it('removes token data from localStorage', () => {
      saveToken({ token: 'to-clear', expiresAt: '2026-04-08T12:00:00Z' });
      clearToken();

      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('returns null from getToken after clearing', () => {
      saveToken({ token: 'to-clear', expiresAt: '2026-04-08T12:00:00Z' });
      clearToken();

      expect(getToken()).toBeNull();
    });
  });
});
