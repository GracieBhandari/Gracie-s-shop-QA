// Flow 1: the application loads successfully.

const { test, expect } = require('@playwright/test');

test('TC-CAT-001: home page loads with categories and featured products', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle("Gracie's Shop");
  await expect(page.getByRole('heading', { name: 'Little things that make home feel lovely' })).toBeVisible();
  await expect(page.getByTestId('shop-now')).toBeVisible();

  // Categories and featured products are loaded from the API
  await expect(page.getByTestId('category-card')).toHaveCount(4);
  await expect(page.getByTestId('featured-products').getByTestId('product-card')).toHaveCount(4);

  // A visitor sees the login and register links
  await expect(page.getByTestId('login-link')).toBeVisible();
  await expect(page.getByTestId('register-link')).toBeVisible();
});
