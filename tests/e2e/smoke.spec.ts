import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('home renders and links work', async ({ page, browserName }) => {
    await page.goto('/');
    await expect(page.getByText('Transform Your')).toBeVisible();
    if (browserName === 'webkit') {
      await page.locator('a[href="/shop"]').first().click();
    } else {
      await page.getByRole('link', { name: 'Shop', exact: true }).first().click();
    }
    await expect(page).toHaveURL(/\/shop/);
  });

  test('product card quick view opens', async ({ page }) => {
    await page.goto('/shop');
    const firstCard = page.locator('.group').first();
    await firstCard.hover();
    await page.getByRole('button', { name: /Quick View/i }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('button', { name: /Add to Cart/i })).toBeVisible();
  });
});
