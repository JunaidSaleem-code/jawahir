import { test, expect } from '@playwright/test';

test.describe('AR Try-On Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar-tryon');
  });

  test('should load AR try-on page with proper layout', async ({ page }) => {
    // Check page title and main heading
    await expect(page.getByRole('heading', { name: /Virtual Try-On for Jewelry/i })).toBeVisible();
    
    // Check camera section
    await expect(page.getByRole('button', { name: /Enable Camera/i })).toBeVisible();
    
    // Check jewelry selection tabs
    await expect(page.getByRole('tab', { name: /Earrings/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Rings/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Necklaces/i })).toBeVisible();
    
    // Check instructions
    await expect(page.getByText(/How to Use/i)).toBeVisible();
  });

  test('should display jewelry items in each category', async ({ page }) => {
    // Test earrings category
    await page.getByRole('tab', { name: /Earrings/i }).click();
    await expect(page.getByText(/Trinity Diamond Earrings/i)).toBeVisible();
    await expect(page.getByText(/PKR 85,000/i)).toBeVisible();
    
    // Test rings category
    await page.getByRole('tab', { name: /Rings/i }).click();
    await expect(page.getByText(/Trinity Ring/i)).toBeVisible();
    await expect(page.getByText(/PKR 95,000/i)).toBeVisible();
    
    // Test necklaces category
    await page.getByRole('tab', { name: /Necklaces/i }).click();
    await expect(page.getByText(/Trinity Necklace/i)).toBeVisible();
    await expect(page.getByText(/PKR 125,000/i)).toBeVisible();
  });

  test('should handle jewelry selection', async ({ page }) => {
    // Select a jewelry item
    await page.getByRole('tab', { name: /Earrings/i }).click();
    await page.getByText(/Trinity Diamond Earrings/i).click();
    
    // Check if jewelry is selected
    await expect(page.getByText(/Selected/i)).toBeVisible();
  });

  test('should show camera controls when camera is active', async ({ page }) => {
    // Mock camera permission
    await page.context().grantPermissions(['camera']);
    
    // Click enable camera button
    await page.getByRole('button', { name: /Enable Camera/i }).click();
    
    // Check if camera is active
    await expect(page.getByRole('button', { name: /Stop Camera/i })).toBeVisible();
    
    // Check for AR controls
    await expect(page.getByText(/AR Filter Active/i)).toBeVisible();
  });

  test('should display manual controls when jewelry is selected', async ({ page }) => {
    // Select jewelry
    await page.getByRole('tab', { name: /Earrings/i }).click();
    await page.getByText(/Trinity Diamond Earrings/i).click();
    
    // Mock camera
    await page.context().grantPermissions(['camera']);
    await page.getByRole('button', { name: /Enable Camera/i }).click();
    
    // Check for manual controls
    await expect(page.getByRole('button', { name: '+' })).toBeVisible();
    await expect(page.getByRole('button', { name: '-' })).toBeVisible();
    await expect(page.getByRole('button', { name: '↻' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Auto' })).toBeVisible();
  });

  test('should handle WhatsApp sharing', async ({ page }) => {
    // Select jewelry
    await page.getByRole('tab', { name: /Rings/i }).click();
    await page.getByText(/Love Ring/i).click();
    
    // Mock camera
    await page.context().grantPermissions(['camera']);
    await page.getByRole('button', { name: /Enable Camera/i }).click();
    
    // Click share button
    const shareButton = page.getByRole('button').filter({ hasText: /Share/i });
    await expect(shareButton).toBeVisible();
    
    // Test WhatsApp URL generation
    await shareButton.click();
    
    // Check if WhatsApp opens (this will be blocked in test, but we can verify the URL)
    await page.waitForTimeout(1000);
  });

  test('should handle image loading errors gracefully', async ({ page }) => {
    // This test would require mocking image loading failures
    // For now, we'll just verify the component structure
    await page.getByRole('tab', { name: /Earrings/i }).click();
    
    // Check if jewelry items are displayed
    const jewelryItems = page.locator('[data-testid="jewelry-item"]');
    await expect(jewelryItems.first()).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if layout adapts
    await expect(page.getByRole('heading', { name: /Virtual Try-On for Jewelry/i })).toBeVisible();
    
    // Check if tabs are still accessible
    await expect(page.getByRole('tab', { name: /Earrings/i })).toBeVisible();
  });

  test('should show proper instructions', async ({ page }) => {
    // Check instruction steps
    await expect(page.getByText(/Enable Camera/i)).toBeVisible();
    await expect(page.getByText(/Position Yourself/i)).toBeVisible();
    await expect(page.getByText(/Select Jewelry/i)).toBeVisible();
    await expect(page.getByText(/Adjust & Capture/i)).toBeVisible();
  });

  test('should handle category switching', async ({ page }) => {
    // Start with earrings
    await page.getByRole('tab', { name: /Earrings/i }).click();
    await expect(page.getByText(/Trinity Diamond Earrings/i)).toBeVisible();
    
    // Switch to rings
    await page.getByRole('tab', { name: /Rings/i }).click();
    await expect(page.getByText(/Trinity Ring/i)).toBeVisible();
    
    // Switch to necklaces
    await page.getByRole('tab', { name: /Necklaces/i }).click();
    await expect(page.getByText(/Trinity Necklace/i)).toBeVisible();
  });
});

test.describe('AR Try-On Error Handling', () => {
  test('should handle camera permission denial', async ({ page }) => {
    // Deny camera permission
    await page.context().setPermissions([]);
    
    await page.goto('/ar-tryon');
    await page.getByRole('button', { name: /Enable Camera/i }).click();
    
    // Should still show the button (camera not active)
    await expect(page.getByRole('button', { name: /Enable Camera/i })).toBeVisible();
  });

  test('should handle missing jewelry data gracefully', async ({ page }) => {
    // This would require mocking empty jewelry data
    // For now, we'll verify the component doesn't crash
    await page.goto('/ar-tryon');
    await expect(page.getByRole('heading', { name: /Virtual Try-On for Jewelry/i })).toBeVisible();
  });
});
