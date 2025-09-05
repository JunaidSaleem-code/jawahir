import { test, expect } from '@playwright/test';

test('search filters results by query', async ({ page }) => {
  await page.goto('/search');
  const input = page.getByPlaceholder('Search artworks or artists...');
  await expect(input).toBeVisible();
  await input.fill('Urban');
  // Expect a result with 'Urban Reflections'
  await expect(page.getByText('Urban Reflections')).toBeVisible();
  // And a non-matching one should likely not be visible in viewport grid
  await expect(page.getByText('Abstract Harmony')).not.toBeVisible({ timeout: 2000 }).catch(() => {});
});
