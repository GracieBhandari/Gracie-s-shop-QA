// Shared helpers for the API tests.

const { expect } = require('@playwright/test');
const { VALID_CHECKOUT } = require('../e2e/helpers');

// Registers a brand-new user. The request context keeps the login cookie,
// so later requests made with the same context are logged in as this user.
async function registerNewUser(request, name = 'API Tester') {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const user = { name, email: `api-${unique}@example.com`, password: 'Password123' };
  const response = await request.post('/api/auth/register', { data: user });
  expect(response.status()).toBe(201);
  return user;
}

// A second, separate "browser" (cookie jar), for tests that need two users at once
async function newUserContext(playwright, baseURL, name) {
  const context = await playwright.request.newContext({ baseURL });
  await registerNewUser(context, name);
  return context;
}

// Expiry dates relative to today, e.g. "10/26" and "09/26" in October 2026
function expiryForMonthOffset(offset) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
}

async function getStock(request, productId) {
  return (await (await request.get(`/api/products/${productId}`)).json()).stock;
}

module.exports = { VALID_CHECKOUT, registerNewUser, newUserContext, expiryForMonthOffset, getStock };
