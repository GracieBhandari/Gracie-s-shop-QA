// Flows 4 and 5: adding products to the cart, and cart quantity behavior.

const { test, expect } = require('@playwright/test');
const { DEMO_USER, registerNewUser, addToCartViaApi } = require('./helpers');

test('TC-CART-003: visitor is sent to log in, then returned to the product to add it', async ({ page }) => {
  await page.goto('/product.html?id=6');
  await page.getByTestId('add-to-cart-button').click();

  // Visitors are redirected to the login page, which remembers where they came from
  await expect(page).toHaveURL(/login\.html\?next=/);
  await page.getByTestId('email-input').fill(DEMO_USER.email);
  await page.getByTestId('password-input').fill(DEMO_USER.password);
  await page.getByTestId('login-button').click();

  await expect(page).toHaveURL(/product\.html\?id=6$/);
  await expect(page.getByTestId('greeting')).toHaveText('Hi, Test Shopper');

  await page.getByTestId('add-to-cart-button').click();
  await expect(page.getByTestId('cart-message')).toContainText('Added 1 to your cart.');
  await expect(page.getByTestId('cart-count')).toHaveText('1');
});

test('TC-CART-002: add several of a product using the quantity picker', async ({ page }) => {
  await registerNewUser(page);
  await page.goto('/product.html?id=6');

  await expect(page.getByTestId('decrease-quantity')).toBeDisabled(); // can't go below 1
  await page.getByTestId('increase-quantity').click();
  await page.getByTestId('increase-quantity').click();
  await expect(page.getByTestId('quantity-value')).toHaveText('3');

  await page.getByTestId('add-to-cart-button').click();

  await expect(page.getByTestId('cart-message')).toContainText('Added 3 to your cart.');
  await expect(page.getByTestId('cart-count')).toHaveText('3');
  await expect(page.getByTestId('quantity-value')).toHaveText('1'); // picker resets after adding
});

test('TC-CART-007: out-of-stock product cannot be added', async ({ page }) => {
  await registerNewUser(page);
  await page.goto('/product.html?id=5'); // Linen Cushion Cover, stock 0

  await expect(page.getByTestId('add-to-cart-button')).toHaveText('Out of stock');
  await expect(page.getByTestId('add-to-cart-button')).toBeDisabled();
  await expect(page.getByTestId('quantity-value')).toHaveCount(0);
});

test('Cart: cannot add more than 10 of one product', async ({ page }) => {
  await registerNewUser(page);
  await addToCartViaApi(page, 6, 10);
  await page.goto('/product.html?id=6');
  await page.getByTestId('add-to-cart-button').click();

  await expect(page.getByTestId('cart-message')).toHaveText(
    'You already have the maximum quantity (10) of this item in your cart.'
  );
  // The cart still has exactly 10
  const cart = await (await page.request.get('/api/cart')).json();
  expect(cart.item_count).toBe(10);
});

test('TC-CART-013: cart shows correct line totals and grand total', async ({ page }) => {
  await registerNewUser(page);
  await addToCartViaApi(page, 6, 3);   // Stoneware Coffee Mug, $14.99 × 3
  await addToCartViaApi(page, 11, 2);  // Dotted Notebook, $12.99 × 2
  await addToCartViaApi(page, 14, 1);  // Washi Tape Pack, $7.99 × 1
  await page.goto('/cart.html');

  const line = (name) => page.getByTestId('cart-item').filter({ hasText: name });
  await expect(line('Stoneware Coffee Mug').getByTestId('cart-item-total')).toHaveText('$44.97');
  await expect(line('Dotted Notebook').getByTestId('cart-item-total')).toHaveText('$25.98');
  await expect(line('Washi Tape Pack').getByTestId('cart-item-total')).toHaveText('$7.99');
  await expect(page.getByTestId('cart-item-count')).toHaveText('6');
  await expect(page.getByTestId('cart-total')).toHaveText('$78.94');
  await expect(page.getByTestId('cart-count')).toHaveText('6');
});

test('TC-CART-015/016/018/019: change quantity and remove items in the cart', async ({ page }) => {
  await registerNewUser(page);
  await addToCartViaApi(page, 6, 3);   // Mug × 3
  await addToCartViaApi(page, 11, 1);  // Notebook × 1
  await page.goto('/cart.html');

  const mug = page.getByTestId('cart-item').filter({ hasText: 'Stoneware Coffee Mug' });

  // Increase: 3 → 4
  await mug.getByTestId('increase-quantity').click();
  await expect(mug.getByTestId('quantity-value')).toHaveText('4');
  await expect(mug.getByTestId('cart-item-total')).toHaveText('$59.96');
  await expect(page.getByTestId('cart-total')).toHaveText('$72.95'); // 59.96 + 12.99
  await expect(page.getByTestId('cart-count')).toHaveText('5');

  // Decrease: 4 → 3
  await mug.getByTestId('decrease-quantity').click();
  await expect(mug.getByTestId('quantity-value')).toHaveText('3');
  await expect(page.getByTestId('cart-total')).toHaveText('$57.96'); // 44.97 + 12.99

  // Remove the mug
  await mug.getByTestId('remove-item').click();
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
  await expect(page.getByTestId('cart-total')).toHaveText('$12.99');
  await expect(page.getByTestId('cart-count')).toHaveText('1');

  // Remove the last item: the cart is empty and the header badge disappears
  await page.getByTestId('remove-item').click();
  await expect(page.getByTestId('message')).toHaveText('Your cart is empty.');
  await expect(page.getByTestId('cart-count')).toBeHidden();
});
