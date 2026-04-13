import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginError, callLogin } from './login';

// Spy on the global fetch so no real network calls are made.
const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockClear();
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('callLogin', () => {
  it('returns token and expiresAt on a successful (200) response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          token: 'tok-abc',
          expires_at: '2099-01-01T00:00:00Z',
        }),
    });

    const result = await callLogin('user@example.com', 'secret');

    expect(result).toEqual({
      token: 'tok-abc',
      expiresAt: '2099-01-01T00:00:00Z',
    });
  });

  it('maps snake_case expires_at to camelCase expiresAt', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          token: 'tok-xyz',
          expires_at: '2030-06-15T08:00:00Z',
        }),
    });

    const { expiresAt } = await callLogin('a@b.com', 'pw');

    expect(expiresAt).toBe('2030-06-15T08:00:00Z');
  });

  it('throws LoginError with status 401 on invalid credentials', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'invalid credentials' }),
    });

    const error = await callLogin('bad@example.com', 'wrong').catch(
      (e: unknown) => e,
    );
    expect(error).toBeInstanceOf(LoginError);
    expect((error as LoginError).status).toBe(401);
  });

  it('throws LoginError with the response status for non-401 errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'internal server error' }),
    });

    const error = await callLogin('a@b.com', 'pw').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(LoginError);
    expect((error as LoginError).status).toBe(500);
  });

  it('throws LoginError on a network failure (fetch rejects)', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const error = await callLogin('a@b.com', 'pw').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(LoginError);
    expect((error as LoginError).status).toBe(0);
  });

  it('sends the correct request shape to the correct endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({ token: 'tok', expires_at: '2099-01-01T00:00:00Z' }),
    });

    await callLogin('user@example.com', 'mypassword');

    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/auth/login');
    expect(options.method).toBe('POST');
    expect((options.headers as Record<string, string>)['Content-Type']).toBe(
      'application/json',
    );
    expect(options.body).toBe(
      JSON.stringify({ email: 'user@example.com', password: 'mypassword' }),
    );
  });
});
