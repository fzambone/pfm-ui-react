// In dev the Vite proxy forwards /auth/* to the remote API server-side — no CORS needed.
// In production this is an empty string so paths are relative to the deployed host.
// Set VITE_API_BASE_URL only when the frontend and API are on separate domains in production.
const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

export interface LoginResult {
  token: string;
  expiresAt: string; // ISO 8601 — mapped from snake_case `expires_at` in the response
}

/**
 * Typed error thrown by callLogin for all failure modes:
 * - status 401 — invalid credentials
 * - other non-2xx — server or gateway error
 * - status 0 — network failure (fetch rejected before a response arrived)
 */
export class LoginError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'LoginError';
  }
}

/**
 * Calls POST /auth/login with the provided credentials.
 * Returns a LoginResult on success (200).
 * Throws a LoginError for all failure modes so callers never receive a raw
 * fetch Response or untyped rejection.
 */
export async function callLogin(
  email: string,
  password: string,
): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new LoginError(
        response.status,
        `Login failed with status ${String(response.status)}`,
      );
    }

    // The backend uses snake_case; map to camelCase for the rest of the app.
    const data = (await response.json()) as { token: string; expires_at: string };
    return { token: data.token, expiresAt: data.expires_at };
  } catch (error) {
    if (error instanceof LoginError) throw error;
    // Network failure — fetch itself rejected (no HTTP response received).
    throw new LoginError(0, 'Network error — unable to reach the server');
  }
}
