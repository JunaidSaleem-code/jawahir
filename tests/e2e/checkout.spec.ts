import { test, expect } from '@playwright/test';

test.describe('Checkout (Stripe mock)', () => {
  test('proceeds to Stripe Checkout URL from cart', async ({ page }) => {
    // Add to cart via UI (more reliable than localStorage seeding)
    await page.goto('/shop');
    const firstCard = page.locator('.group').first();
    await firstCard.hover();
    await page.getByRole('button', { name: /Quick View/i }).first().click();

    const dialog = page.getByRole('dialog');
    const addBtn = dialog.getByRole('button', { name: /Add to Cart/i });
    if (await addBtn.isVisible().catch(() => false)) {
      await addBtn.click();
    } else {
      await page.getByRole('button', { name: /Add to Cart/i }).first().click();
    }

    // Close dialog and use header mini-cart to navigate (more reliable)
    await page.keyboard.press('Escape').catch(() => {});
    await page.mouse.click(10, 10).catch(() => {});
    await page.locator('[data-testid="cart-button"]').click();
    await page.getByRole('link', { name: /View Cart & Checkout/i }).click();
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByText(/Total/)).toBeVisible();

    // Intercept session creation and Stripe navigation
    await page.route('**/api/checkout', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: 'https://checkout.stripe.com/test-session' })
      });
    });

    let navigatedToStripe = false;
    await page.route('https://checkout.stripe.com/**', async route => {
      navigatedToStripe = true;
      await route.abort();
    });

    const button = page.getByRole('button', { name: /Secure Checkout/i });
    await expect(button).toBeVisible();
    await button.click();

    await expect.poll(() => navigatedToStripe, { timeout: 10_000 }).toBeTruthy();
  });
});


