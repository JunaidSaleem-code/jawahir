import { test, expect } from '@playwright/test';

test('account form reflects persisted values (fast)', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('gg-account', JSON.stringify({ state: { name: 'Test User', email: 'test@example.com', phone: '+92 300 0000000', shippingAddress: 'Test User\nStreet 1\nCity', billingAddress: '' } }));
    } catch {}
  });

  await page.goto('/account');
  await expect(page.locator('[data-testid="account-name"]')).toHaveValue('Test User');
  await expect(page.locator('[data-testid="account-email"]')).toHaveValue('test@example.com');
});
