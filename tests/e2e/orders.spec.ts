import { test, expect } from '@playwright/test';

test('admin orders drawer update status', async ({ page }) => {
  await page.goto('/admin/orders');
  const firstRow = page.locator('tbody tr').first();
  await expect(firstRow).toBeVisible();
  await firstRow.locator('[data-testid="order-id"]').click();

  const drawerSelector = '[data-testid="order-drawer"]';
  const drawer = page.locator(drawerSelector);

  // If drawer doesn't attach quickly, click again
  const attachedQuickly = await page.waitForSelector(drawerSelector, { state: 'attached', timeout: 1500 }).then(() => true).catch(() => false);
  if (!attachedQuickly) {
    await firstRow.locator('[data-testid="order-id"]').click();
  }

  await page.waitForSelector(drawerSelector, { state: 'attached' });
  await expect(page.getByRole('heading', { name: 'Order Details' })).toBeVisible();
  await expect(drawer).toBeVisible();

  await drawer.locator('select').selectOption({ label: 'Shipped' });
  await drawer.getByRole('button', { name: 'Update' }).click();

  await expect(firstRow.locator('td').nth(2)).toContainText('Shipped');
});
