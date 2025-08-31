import { test, expect } from '@playwright/test';

test.describe('Payments Overview @payments-overview', () => {
  test('displays fees list and allows payment', async ({ page, context }) => {
    // Go to payments page
    await page.goto('/payments');

    // Wait for the page to load
    await expect(page.getByRole('heading', { name: 'Payments' })).toBeVisible();

    // Check that the fees list is visible
    const feesList = page.getByTestId('fees-list');
    await expect(feesList).toBeVisible();

    // Check that fee items are displayed
    const feeItems = page.getByTestId('fee-item');
    await expect(feeItems.first()).toBeVisible();

    // Find the first unpaid fee with a Pay button
    const firstPayButton = page.getByTestId('fee-pay-btn').first();
    await expect(firstPayButton).toBeVisible();

    // Get the fee ID for tracking
    const feeId = await firstPayButton.getAttribute('data-fee-id');
    expect(feeId).toBeTruthy();

    // Click Pay button and wait for popup
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      firstPayButton.click(),
    ]);

    // Verify the popup opens to the checkout URL
    await expect(popup).toHaveURL(/checkout/);

    // Close the popup and go back to main page
    await popup.close();

    // Wait a bit for the optimistic update
    await page.waitForTimeout(500);

    // Check that the fee status has changed to "Processing"
    const feeItem = page.getByTestId('fee-item').filter({ 
      has: page.locator(`[data-fee-id="${feeId}"]`) 
    });
    await expect(feeItem.getByText('Processing')).toBeVisible();

    // Verify the Pay button is no longer visible for this fee
    await expect(
      feeItem.getByTestId('fee-pay-btn')
    ).not.toBeVisible();
  });

  test('handles reload and persistence', async ({ page }) => {
    await page.goto('/payments');

    // Wait for initial load
    await expect(page.getByTestId('fees-list')).toBeVisible();
    
    // Count initial fees
    const initialFees = await page.getByTestId('fee-item').count();
    expect(initialFees).toBeGreaterThan(0);

    // Reload the page
    await page.reload();

    // Wait for page to load again
    await expect(page.getByRole('heading', { name: 'Payments' })).toBeVisible();
    await expect(page.getByTestId('fees-list')).toBeVisible();

    // Verify fees are still present
    const reloadedFees = await page.getByTestId('fee-item').count();
    expect(reloadedFees).toBe(initialFees);
  });

  test('refresh button updates the list', async ({ page }) => {
    await page.goto('/payments');

    // Wait for initial load
    await expect(page.getByTestId('fees-list')).toBeVisible();

    // Click refresh button
    const refreshButton = page.getByTestId('fees-refresh');
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();

    // Verify the list is still visible after refresh
    await expect(page.getByTestId('fees-list')).toBeVisible();
  });

  test('displays empty state when no fees', async ({ page }) => {
    // Mock empty response (in a real test, you'd set up the mock differently)
    await page.route('/api/clubs/*/fees*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], next_cursor: null }),
      });
    });

    await page.goto('/payments');

    // Should show empty state message
    await expect(page.getByText('No fees to display')).toBeVisible();
    await expect(page.getByText('All payments are up to date')).toBeVisible();
  });

  test('accessibility: proper landmarks and labels', async ({ page }) => {
    await page.goto('/payments');

    // Check main landmark
    await expect(page.getByRole('main')).toBeVisible();

    // Check list structure
    const feesList = page.getByRole('list', { name: /fees/i });
    await expect(feesList).toBeVisible();

    // Check list items
    const feeItems = page.getByRole('listitem');
    expect(await feeItems.count()).toBeGreaterThan(0);

    // Check button accessibility
    const payButtons = page.getByTestId('fee-pay-btn');
    const firstPayButton = payButtons.first();
    
    if (await firstPayButton.isVisible()) {
      const ariaLabel = await firstPayButton.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/Pay \d+/); // Should contain "Pay" and an amount
    }

    // Check refresh button
    const refreshButton = page.getByTestId('fees-refresh');
    const refreshAriaLabel = await refreshButton.getAttribute('aria-label');
    expect(refreshAriaLabel).toBe('Refresh');
  });
});