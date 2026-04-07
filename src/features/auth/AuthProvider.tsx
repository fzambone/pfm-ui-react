import { useCallback, useMemo, useState } from 'react';

import { AuthContext } from './AuthContext';
import { clearToken, getToken, saveToken } from './tokenService';
import { type AuthContextValue, type AuthState } from './types';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Wrap the application root with AuthProvider to make auth state available
 * to every component via useAuth().
 *
 * On mount it reads from the token service: if a valid (non-expired) token
 * is in storage, the user starts as authenticated without re-logging in.
 *
 * React rendering note: useState with an initialiser function runs once on
 * mount, so getToken() is only called during the first render — not on every
 * re-render. This is the idiomatic way to derive initial state from an
 * external source without a useEffect.
 */
export function AuthProvider({
  children,
}: AuthProviderProps): React.ReactElement {
  const [state, setState] = useState<AuthState>(() => {
    const stored = getToken();
    if (stored === null) return { isAuthenticated: false };
    return {
      isAuthenticated: true,
      token: stored.token,
      expiresAt: stored.expiresAt,
    };
  });

  // useCallback keeps the reference stable so consumers that memoize won't
  // re-render unnecessarily when the provider itself re-renders.
  const login = useCallback((token: string, expiresAt: string): void => {
    saveToken({ token, expiresAt });
    setState({ isAuthenticated: true, token, expiresAt });
  }, []);

  const logout = useCallback((): void => {
    clearToken();
    setState({ isAuthenticated: false });
  }, []);

  // useMemo ensures the context value reference is stable when state hasn't
  // changed — prevents re-renders of all consumers on unrelated provider renders.
  const value = useMemo<AuthContextValue>(
    () => ({ state, login, logout }),
    [state, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
