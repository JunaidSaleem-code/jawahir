import { test, expect } from '@playwright/test';

// This test enables auto-approve and submits a review on a deterministic PDP.

test('submit review and see it on PDP (auto-approve)', async ({ page }) => {
  // Ensure auto-approve is enabled before app scripts run
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('gg-reviews', JSON.stringify({ state: { reviews: [], votes: [], settings: { autoApprove: true } } }));
    } catch {}
  });

  await page.goto('/product/1');
  const reviewsTab = page.getByRole('tab', { name: 'Reviews', exact: true });
  await expect(reviewsTab).toBeVisible();
  await reviewsTab.click();
  // Ensure the form is scrolled into view and rendered
  await page.getByText('Write a Review', { exact: false }).scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForSelector('[data-testid="review-title"]', { state: 'visible', timeout: 8000 });
  await page.waitForSelector('[data-testid="review-text"]', { state: 'visible', timeout: 8000 });

  // Fill review form
  await page.getByLabel('Rate 5 stars').click().catch(() => {});
  await page.locator('[data-testid="review-title"]').fill('Lovely piece');
  await page.locator('[data-testid="review-text"]').fill('High quality print and vivid colors.');
  await page.getByRole('button', { name: 'Submit Review' }).click();

  await expect(page.getByText('Lovely piece')).toBeVisible();
});
