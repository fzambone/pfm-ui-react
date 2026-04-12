import { type Page } from '@playwright/test';

// Credentials for the seeded E2E test user.
// Set E2E_EMAIL and E2E_PASSWORD in your environment (or .env.local) before
// running E2E tests. The placeholders below will NOT authenticate against
// a real backend — replace them once the test user is provisioned.
export const TEST_EMAIL = process.env['E2E_EMAIL'] ?? 'e2e-user@example.com';
export const TEST_PASSWORD = process.env['E2E_PASSWORD'] ?? 'changeme';

/**
 * Navigates to /login and signs in as the seeded test user.
 * Waits for the redirect to /dashboard before returning so subsequent
 * test steps can assume they are on an authenticated page.
 */
export async function loginAsTestUser(page: Page): Promise<void> {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/dashboard');
}
