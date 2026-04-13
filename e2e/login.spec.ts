import { expect, test } from '@playwright/test';

import { TEST_EMAIL, TEST_PASSWORD, loginAsTestUser } from './helpers/auth';

test.describe('Login page', () => {
  test('happy path: valid credentials redirect to /dashboard', async ({
    page,
  }) => {
    await loginAsTestUser(page);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(
      page.getByRole('heading', { name: /dashboard/i }),
    ).toBeVisible();
  });

  test('shows an inline error on invalid credentials (401)', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill('definitely-wrong-password');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText(
      /invalid email or password/i,
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test('submit button is disabled while the request is in flight', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);

    // Intercept the login API to introduce an artificial delay so we can
    // assert on the loading state before the response arrives.
    await page.route('**/auth/login', async (route) => {
      await new Promise((r) => setTimeout(r, 300));
      await route.continue();
    });

    const submitButton = page.getByRole('button', { name: /sign in/i });
    await submitButton.click();

    await expect(submitButton).toBeDisabled();
    await page.waitForURL('**/dashboard');
  });

  test('authenticated users who navigate to /login are redirected to /dashboard', async ({
    page,
  }) => {
    await loginAsTestUser(page);
    await page.goto('/login');

    await expect(page).toHaveURL(/\/dashboard/);
  });
});
