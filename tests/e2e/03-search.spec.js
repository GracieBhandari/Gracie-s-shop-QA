// Flow 3: searching for products.

const { test, expect } = require('@playwright/test');

test('TC-CAT-008: search ignores upper and lower case', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('search-input').fill('MUG');
  await page.getByTestId('search-button').click();

  await expect(page).toHaveURL(/products\.html\?search=MUG/);
  await expect(page.getByTestId('results-summary')).toHaveText('1 product found for “MUG”');
  await expect(page.getByTestId('product-card')).toHaveCount(1);
  await expect(page.getByTestId('product-card')).toContainText('Stoneware Coffee Mug');
  // The search box keeps the search text
  await expect(page.getByTestId('search-input')).toHaveValue('MUG');
});

test('TC-CAT-012: search with no results shows a helpful message', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('search-input').fill('xyz123');
  await page.getByTestId('search-button').click();

  await expect(page.getByTestId('results-summary')).toHaveText('0 products found for “xyz123”');
  await expect(page.getByTestId('product-card')).toHaveCount(0);
  await expect(page.getByTestId('message')).toHaveText(
    'No products match your search. Try a different word or browse all products.'
  );
});

test('TC-CAT-014: "%" is searched as plain text, not as a wildcard', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('search-input').fill('%');
  await page.getByTestId('search-button').click();

  // If % were treated as a SQL wildcard, all 20 products would be returned
  await expect(page.getByTestId('results-summary')).toHaveText('0 products found for “%”');
  await expect(page.getByTestId('product-card')).toHaveCount(0);
});
