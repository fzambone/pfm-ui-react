import { expect, test } from '@playwright/test';

import { loginAsTestUser } from './helpers/auth';

test.describe('Logout', () => {
  test('happy path: login → access protected route → logout → redirected to /login', async ({
    page,
  }) => {
    await loginAsTestUser(page);
    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByRole('button', { name: /sign out/i }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('after logout, navigating to a protected route redirects to /login', async ({
    page,
  }) => {
    await loginAsTestUser(page);

    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('after logout, the browser back button does not re-authenticate', async ({
    page,
  }) => {
    await loginAsTestUser(page);
    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/login/);

    await page.goBack();
    // The back button may briefly show the previous URL, but ProtectedRoute
    // immediately redirects to /login since the token is gone from storage.
    await expect(page).toHaveURL(/\/login/);
  });
});
