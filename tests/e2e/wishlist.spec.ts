import { test, expect } from '@playwright/test';

test('wishlist page renders saved items from persistence (deterministic)', async ({ page }) => {
  // Seed wishlist before app scripts run to avoid UI timing issues
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('gg-wishlist', JSON.stringify({
        state: {
          items: [
            {
              id: 1,
              title: 'Abstract Harmony',
              artist: 'Elena Rodriguez',
              price: 299,
              image: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800'
            }
          ]
        }
      }));
    } catch {}
  });

  await page.goto('/wishlist', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-testid="wishlist-empty"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="wishlist-item"]')).toHaveCount(1);
});
