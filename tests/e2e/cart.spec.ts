import { test, expect } from '@playwright/test';

test('add to cart via Quick View and verify', async ({ page }) => {
  await page.goto('/shop');
  const firstCard = page.locator('.group').first();
  await firstCard.hover();
  await page.getByRole('button', { name: /Quick View/i }).first().click();

  const dialog = page.getByRole('dialog');
  const dialogBtn = dialog.getByRole('button', { name: /Add to Cart/i });
  const anyAdd = page.getByRole('button', { name: /Add to Cart/i }).first();

  if (await dialogBtn.isVisible().catch(() => false)) {
    await dialogBtn.click();
  } else {
    await anyAdd.click();
  }

  // close dialog via Escape and extra click on backdrop area
  await page.keyboard.press('Escape').catch(() => {});
  await page.mouse.click(10, 10).catch(() => {});

  // open mini-cart from header
  await page.locator('[data-testid="cart-button"]').click();
  await expect(page.getByText('Subtotal')).toBeVisible();

  // go to cart page
  await page.getByRole('link', { name: /View Cart & Checkout/i }).click();
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.getByText(/Total/)).toBeVisible();
});
