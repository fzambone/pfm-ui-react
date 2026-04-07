import { expect, test } from '@playwright/test';

test('app loads and displays the dashboard heading', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /unified dashboard/i }),
  ).toBeVisible();
});
