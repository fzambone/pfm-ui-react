import { expect, test } from '@playwright/test';

import { loginAsTestUser } from './helpers/auth';

test('app loads and redirects to dashboard', async ({ page }) => {
  await loginAsTestUser(page);
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});
