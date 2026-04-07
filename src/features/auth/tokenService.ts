import { type AuthToken } from './types';

const STORAGE_KEY = 'auth_token';

// Checks that an unknown value has the shape of AuthToken.
// Guards against corrupted or unexpected localStorage data.
function isAuthToken(value: unknown): value is AuthToken {
  return (
    typeof value === 'object' &&
    value !== null &&
    'token' in value &&
    'expiresAt' in value &&
    typeof (value as Record<string, unknown>).token === 'string' &&
    typeof (value as Record<string, unknown>).expiresAt === 'string'
  );
}

/**
 * Persists the token and its expiry to localStorage.
 */
export function saveToken(authToken: AuthToken): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authToken));
}

/**
 * Returns the stored AuthToken if one exists and has not expired.
 * Returns null if there is no token, the token is expired, or the stored
 * value is malformed — never throws.
 *
 * Expiry boundary: a token whose expiresAt equals the current time is
 * treated as expired (strictly less than now is required to be valid).
 */
export function getToken(): AuthToken | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isAuthToken(parsed)) return null;

    // Treat tokens expiring at or before now as expired.
    const expiresAt = new Date(parsed.expiresAt);
    if (expiresAt <= new Date()) return null;

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Removes all token data from localStorage.
 */
export function clearToken(): void {
  localStorage.removeItem(STORAGE_KEY);
}
