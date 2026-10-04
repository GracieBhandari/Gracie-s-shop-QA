// Shared helpers for the end-to-end tests.

const { expect } = require('@playwright/test');

// The seeded demo account (see qa/test-data/test-data.md)
const DEMO_USER = { email: 'shopper@example.com', password: 'Password123' };

const VALID_CHECKOUT = {
  fullName: 'Test Shopper',
  address: '1 Main St',
  city: 'Springfield',
  zipCode: '12345',
  cardNumber: '4242 4242 4242 4242',
  expiry: '12/30',
  cvc: '123',
};

// Creates a brand-new account through the API and logs the browser in as that user.
// Every test gets its own user, so each starts with an empty cart and tests can't affect each other.
async function registerNewUser(page) {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const user = { name: 'E2E Tester', email: `e2e-${unique}@example.com`, password: 'Password123' };
  // page.request shares cookies with the browser page, so the page is logged in afterwards
  const response = await page.request.post('/api/auth/register', { data: user });
  expect(response.status()).toBe(201);
  return user;
}

// Adds a product to the logged-in user's cart through the API (faster than clicking, for test setup)
async function addToCartViaApi(page, productId, quantity = 1) {
  const response = await page.request.post('/api/cart/items', { data: { productId, quantity } });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

// Fills in the checkout form. Pass overrides to change individual fields, e.g. { zipCode: '1234' }.
async function fillCheckoutForm(page, overrides = {}) {
  const details = { ...VALID_CHECKOUT, ...overrides };
  await page.getByTestId('full-name-input').fill(details.fullName);
  await page.getByTestId('address-input').fill(details.address);
  await page.getByTestId('city-input').fill(details.city);
  await page.getByTestId('zip-input').fill(details.zipCode);
  await page.getByTestId('card-number-input').fill(details.cardNumber);
  await page.getByTestId('expiry-input').fill(details.expiry);
  await page.getByTestId('cvc-input').fill(details.cvc);
}

module.exports = { DEMO_USER, VALID_CHECKOUT, registerNewUser, addToCartViaApi, fillCheckoutForm };
