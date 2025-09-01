import { test, expect } from '@playwright/test';

test.describe('Payments Overview @payments-overview', () => {
  test('displays payments table and allows sending links', async ({ page, context }) => {
    // Go to payments page
    await page.goto('/payments');

    // Wait for the page to load
    await expect(page.getByRole('heading', { name: 'Payments' })).toBeVisible();

    // Check that the payments table is visible
    const paymentsTable = page.getByTestId('payments-table');
    await expect(paymentsTable).toBeVisible();

    // Check that payment items are displayed
    const paymentItems = page.getByTestId('payment-item');
    await expect(paymentItems.first()).toBeVisible();

    // Find the first pending payment with a Send Link button
    const firstSendButton = page.getByTestId('send-link-btn').first();
    await expect(firstSendButton).toBeVisible();

    // Get the payment ID for tracking
    const paymentId = await firstSendButton.getAttribute('data-payment-id');
    expect(paymentId).toBeTruthy();

    // Click Send Link button
    await firstSendButton.click();

    // Wait a bit for the optimistic update
    await page.waitForTimeout(500);

    // Check that the payment status has changed to "Processing"
    const paymentItem = page.getByTestId('payment-item').filter({ 
      has: page.locator(`[data-payment-id="${paymentId}"]`) 
    });
    await expect(paymentItem.getByText('Processing')).toBeVisible();

    // Verify the Send Link button is no longer visible for this payment
    await expect(
      paymentItem.getByTestId('send-link-btn')
    ).not.toBeVisible();
  });

  test('filters payments by status and search', async ({ page }) => {
    await page.goto('/payments');

    // Wait for initial load
    await expect(page.getByTestId('payments-table')).toBeVisible();
    
    // Filter by pending status
    const statusFilter = page.getByTestId('status-filter');
    await statusFilter.click();
    await page.getByText('Pending', { exact: true }).click();

    // Wait for filtered results
    await page.waitForTimeout(500);

    // All visible items should be pending
    const paymentItems = await page.getByTestId('payment-item').all();
    for (const item of paymentItems) {
      await expect(item.getByText('Pending')).toBeVisible();
    }

    // Search for a specific member
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('Anna');

    // Wait for search results
    await page.waitForTimeout(500);

    // Should show fewer results
    const searchResults = await page.getByTestId('payment-item').all();
    expect(searchResults.length).toBeLessThanOrEqual(paymentItems.length);
  });

  test('handles reload and persistence', async ({ page }) => {
    await page.goto('/payments');

    // Wait for initial load
    await expect(page.getByTestId('payments-table')).toBeVisible();
    
    // Count initial payments
    const initialPayments = await page.getByTestId('payment-item').count();
    expect(initialPayments).toBeGreaterThan(0);

    // Reload the page
    await page.reload();

    // Wait for page to load again
    await expect(page.getByRole('heading', { name: 'Payments' })).toBeVisible();
    await expect(page.getByTestId('payments-table')).toBeVisible();

    // Verify payments are still present
    const reloadedPayments = await page.getByTestId('payment-item').count();
    expect(reloadedPayments).toBe(initialPayments);
  });

  test('refresh button updates the list', async ({ page }) => {
    await page.goto('/payments');

    // Wait for initial load
    await expect(page.getByTestId('payments-table')).toBeVisible();

    // Click refresh button
    const refreshButton = page.getByTestId('payments-refresh');
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();

    // Verify the table is still visible after refresh
    await expect(page.getByTestId('payments-table')).toBeVisible();
  });

  test('displays empty state when no payments', async ({ page }) => {
    // Mock empty response
    await page.route('/api/payments*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], next_cursor: null }),
      });
    });

    await page.goto('/payments');

    // Should show empty state message
    await expect(page.getByText('No payments to display')).toBeVisible();
    await expect(page.getByText('All payments are up to date')).toBeVisible();
  });

  test('displays error state and retry button', async ({ page }) => {
    // Mock error response
    await page.route('/api/payments*', async route => {
      await route.abort('failed');
    });

    await page.goto('/payments');

    // Should show error state
    await expect(page.getByText('Can\'t load payments. Please try again.')).toBeVisible();
    
    // Should have retry button
    const retryButton = page.getByTestId('retry-button');
    await expect(retryButton).toBeVisible();
    
    // Remove the mock to allow retry to work
    await page.unroute('/api/payments*');
    
    // Click retry
    await retryButton.click();
    
    // Should eventually show the table
    await expect(page.getByTestId('payments-table')).toBeVisible();
  });

  test('accessibility: proper landmarks and labels', async ({ page }) => {
    await page.goto('/payments');

    // Check main landmark
    await expect(page.getByRole('main')).toBeVisible();

    // Check table structure
    const paymentsTable = page.getByRole('table');
    await expect(paymentsTable).toBeVisible();

    // Check column headers
    await expect(page.getByRole('columnheader', { name: 'Member' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Amount' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Due Date' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();

    // Check button accessibility
    const sendButtons = page.getByTestId('send-link-btn');
    const firstSendButton = sendButtons.first();
    
    if (await firstSendButton.isVisible()) {
      const ariaLabel = await firstSendButton.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/Send payment link to/); // Should contain member name
    }

    // Check refresh button
    const refreshButton = page.getByTestId('payments-refresh');
    const refreshAriaLabel = await refreshButton.getAttribute('aria-label');
    expect(refreshAriaLabel).toBe('Refresh');
  });
});