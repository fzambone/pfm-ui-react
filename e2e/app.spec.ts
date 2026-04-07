import { expect, test } from '@playwright/test';

test('app loads and redirects to dashboard', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});
