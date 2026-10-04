// Flows 6 and 7: checkout validation, and a successful order.

const { test, expect } = require('@playwright/test');
const { registerNewUser, addToCartViaApi, fillCheckoutForm } = require('./helpers');

// "MM/YY" for the month before the current one, e.g. "09/26" in October 2026
function previousMonthExpiry() {
  const now = new Date();
  const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const month = String(previous.getMonth() + 1).padStart(2, '0');
  const year = String(previous.getFullYear()).slice(-2);
  return `${month}/${year}`;
}

test('TC-CHK-013: submitting an empty checkout form shows every field error', async ({ page }) => {
  await registerNewUser(page);
  await addToCartViaApi(page, 6, 1);
  await page.goto('/checkout.html');
  await page.getByTestId('place-order-button').click();

  await expect(page.getByTestId('form-error')).toHaveText('Please fix the highlighted fields.');
  await expect(page.getByTestId('full-name-error')).toHaveText('Please enter your full name.');
  await expect(page.getByTestId('address-error')).toHaveText('Please enter your street address.');
  await expect(page.getByTestId('city-error')).toHaveText('Please enter your city.');
  await expect(page.getByTestId('zip-error')).toHaveText('Please enter a 5-digit ZIP code.');
  await expect(page.getByTestId('card-number-error')).toHaveText('Please enter a valid card number.');
  await expect(page.getByTestId('expiry-error')).toHaveText('Please enter the expiry date as MM/YY.');
  await expect(page.getByTestId('cvc-error')).toHaveText('Please enter the 3 or 4 digit security code.');

  // No order was placed: still on checkout, cart unchanged
  await expect(page).toHaveURL(/checkout\.html$/);
  const cart = await (await page.request.get('/api/cart')).json();
  expect(cart.item_count).toBe(1);
});

test('TC-CHK-016/021: invalid card number and expired card are rejected', async ({ page }) => {
  await registerNewUser(page);
  await addToCartViaApi(page, 6, 1);
  await page.goto('/checkout.html');

  await fillCheckoutForm(page, {
    cardNumber: '4242 4242 4242 4241', // fails the Luhn check
    expiry: previousMonthExpiry(),
  });
  await page.getByTestId('place-order-button').click();

  await expect(page.getByTestId('card-number-error')).toHaveText('Please enter a valid card number.');
  await expect(page.getByTestId('expiry-error')).toHaveText('This card has expired or the month is not valid.');
  // Fields that were valid have no error and keep what was typed
  await expect(page.getByTestId('zip-error')).toHaveText('');
  await expect(page.getByTestId('full-name-input')).toHaveValue('Test Shopper');
  await expect(page).toHaveURL(/checkout\.html$/);
});

test('TC-CHK-005/006/007: successful checkout shows the confirmation, empties the cart, and reduces stock', async ({ page }) => {
  await registerNewUser(page);
  const stockBefore = (await (await page.request.get('/api/products/6')).json()).stock;
  await addToCartViaApi(page, 6, 2); // Stoneware Coffee Mug × 2 = $29.98

  // Cart → checkout
  await page.goto('/cart.html');
  await page.getByTestId('checkout-button').click();
  await expect(page).toHaveURL(/checkout\.html$/);
  await expect(page.getByTestId('checkout-total')).toHaveText('$29.98');

  await fillCheckoutForm(page);
  await page.getByTestId('place-order-button').click();

  // Confirmation page
  await expect(page).toHaveURL(/order-confirmation\.html\?id=\d+$/);
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  await expect(page.getByTestId('order-number')).toHaveText(/^GS-\d{6}$/);
  await expect(page.getByTestId('order-item')).toHaveCount(1);
  await expect(page.getByTestId('order-item')).toContainText('Stoneware Coffee Mug × 2');
  await expect(page.getByTestId('order-total')).toHaveText('$29.98');
  await expect(page.getByTestId('shipping-address')).toContainText('Test Shopper');
  await expect(page.getByTestId('shipping-address')).toContainText('Springfield, 12345');
  await expect(page.getByTestId('payment-summary')).toHaveText('Card ending in 4242');
  // The full card number must not appear anywhere on the page
  await expect(page.locator('body')).not.toContainText('4242 4242 4242 4242');

  // Cart is now empty and the header badge is gone
  await expect(page.getByTestId('cart-count')).toBeHidden();
  const cart = await (await page.request.get('/api/cart')).json();
  expect(cart.item_count).toBe(0);

  // Stock went down by exactly the quantity ordered
  const stockAfter = (await (await page.request.get('/api/products/6')).json()).stock;
  expect(stockAfter).toBe(stockBefore - 2);
});
