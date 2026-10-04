// Flow 2: browsing the product catalog.

const { test, expect } = require('@playwright/test');

test('TC-CAT-003: shop page lists all 20 products', async ({ page }) => {
  await page.goto('/products.html');

  await expect(page.getByRole('heading', { name: 'All products' })).toBeVisible();
  await expect(page.getByTestId('results-summary')).toHaveText('20 products');
  await expect(page.getByTestId('product-card')).toHaveCount(20);
});

test('TC-CAT-005: category card shows only that category', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('category-card').filter({ hasText: 'Kitchen' }).click();

  await expect(page).toHaveURL(/category=kitchen/);
  await expect(page.getByRole('heading', { name: 'Kitchen' })).toBeVisible();
  await expect(page.getByTestId('product-card')).toHaveCount(5);

  // Every product shown must belong to the Kitchen category
  const categories = await page.getByTestId('product-card').locator('.product-category').allTextContents();
  expect(categories.every((text) => text === 'Kitchen')).toBe(true);
});

test('TC-CAT-018: product card opens the product details page', async ({ page }) => {
  await page.goto('/products.html');
  await page.getByTestId('product-card').filter({ hasText: 'Stoneware Coffee Mug' }).click();

  await expect(page).toHaveURL(/product\.html\?id=6$/);
  await expect(page.getByTestId('product-name')).toHaveText('Stoneware Coffee Mug');
  await expect(page.getByTestId('product-price')).toHaveText('$14.99');
  await expect(page.getByTestId('product-description')).toHaveText('Speckled stoneware mug that holds 350 ml. Dishwasher safe.');
  await expect(page.getByTestId('stock-status')).toHaveText('In stock');
  await expect(page).toHaveTitle("Stoneware Coffee Mug · Gracie's Shop");
});

test('TC-CAT-019: product pages show the correct stock label', async ({ page }) => {
  // [product id, expected label] from the seeded stock levels (40, 5, 1, 0)
  const cases = [
    [6, 'In stock'],
    [4, 'Only 5 left'],
    [20, 'Only 1 left'],
    [5, 'Out of stock'],
  ];
  for (const [id, label] of cases) {
    await page.goto(`/product.html?id=${id}`);
    await expect(page.getByTestId('stock-status'), `product ${id}`).toHaveText(label);
  }
});
