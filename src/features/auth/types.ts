export interface AuthToken {
  token: string;
  expiresAt: string; // ISO 8601 / RFC 3339 UTC — e.g. "2026-04-07T12:00:00Z"
}
