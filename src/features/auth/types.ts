export interface AuthToken {
  token: string;
  expiresAt: string; // ISO 8601 / RFC 3339 UTC — e.g. "2026-04-07T12:00:00Z"
}

// Discriminated union: components narrow on isAuthenticated to access token fields.
export type AuthState =
  | { isAuthenticated: false }
  | { isAuthenticated: true; token: string; expiresAt: string };

export interface AuthContextValue {
  state: AuthState;
  login: (token: string, expiresAt: string) => void;
  logout: () => void;
}
