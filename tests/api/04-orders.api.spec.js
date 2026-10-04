// API tests: placing orders and viewing them.

const { test, expect } = require('@playwright/test');
const { VALID_CHECKOUT, registerNewUser, newUserContext, expiryForMonthOffset, getStock } = require('./helpers');

test('API-27: orders require login (401)', async ({ request }) => {
  expect((await request.post('/api/orders', { data: VALID_CHECKOUT })).status()).toBe(401);
  expect((await request.get('/api/orders/1')).status()).toBe(401);
});

test('API-28: an empty cart cannot be ordered', async ({ request }) => {
  await registerNewUser(request);
  const response = await request.post('/api/orders', { data: VALID_CHECKOUT });
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ error: 'Your cart is empty.' });
});

test('API-29: checkout validation returns an error for every invalid field', async ({ request }) => {
  await registerNewUser(request);
  await request.post('/api/cart/items', { data: { productId: 15, quantity: 1 } });

  const empty = await request.post('/api/orders', { data: {} });
  expect(empty.status()).toBe(400);
  expect(Object.keys((await empty.json()).fields).sort()).toEqual(
    ['address', 'cardNumber', 'city', 'cvc', 'expiry', 'fullName', 'zipCode']
  );

  const fieldError = async (overrides) => {
    const response = await request.post('/api/orders', { data: { ...VALID_CHECKOUT, ...overrides } });
    expect(response.status()).toBe(400);
    return (await response.json()).fields;
  };
  expect(await fieldError({ zipCode: '1234' })).toEqual({ zipCode: 'Please enter a 5-digit ZIP code.' });
  expect(await fieldError({ cardNumber: '4242 4242 4242 4241' })).toEqual({ cardNumber: 'Please enter a valid card number.' });
  expect(await fieldError({ expiry: '13/30' })).toEqual({ expiry: 'This card has expired or the month is not valid.' });
  expect(await fieldError({ expiry: expiryForMonthOffset(-1) })).toEqual({ expiry: 'This card has expired or the month is not valid.' });
  expect(await fieldError({ expiry: '1/30' })).toEqual({ expiry: 'Please enter the expiry date as MM/YY.' });
  expect(await fieldError({ cvc: '12' })).toEqual({ cvc: 'Please enter the 3 or 4 digit security code.' });
  expect(await fieldError({ fullName: '   ' })).toEqual({ fullName: 'Please enter your full name.' });

  // Nothing was ordered: the cart still has its item
  expect((await (await request.get('/api/cart')).json()).item_count).toBe(1);
});

test('API-30: a successful order returns 201, stores only the last 4 card digits, empties the cart, and reduces stock', async ({ request }) => {
  await registerNewUser(request);
  const stockBefore = await getStock(request, 15); // Brass Bookmark, $8.99
  await request.post('/api/cart/items', { data: { productId: 15, quantity: 3 } });

  // Current month is the boundary: a card is valid until the end of its expiry month
  const response = await request.post('/api/orders', {
    data: { ...VALID_CHECKOUT, cardNumber: '5555-5555-5555-4444', expiry: expiryForMonthOffset(0), zipCode: '12345-6789' },
  });
  expect(response.status()).toBe(201);
  const order = await response.json();

  expect(order.order_number).toMatch(/^GS-\d{6}$/);
  expect(order.total_cents).toBe(2697);
  expect(order.item_count).toBe(3);
  expect(order.items).toEqual([
    expect.objectContaining({ product_id: 15, name: 'Brass Bookmark', price_cents: 899, quantity: 3, line_total_cents: 2697 }),
  ]);
  expect(order.card_last4).toBe('4444');
  expect(JSON.stringify(order)).not.toContain('5555-5555-5555-4444');
  expect(Object.keys(order)).not.toContain('cvc'); // the security code is never stored or returned

  expect((await (await request.get('/api/cart')).json()).items).toEqual([]);
  expect(await getStock(request, 15)).toBe(stockBefore - 3);

  // The order can be read back by its owner
  const readBack = await request.get(`/api/orders/${order.id}`);
  expect(readBack.status()).toBe(200);
  expect((await readBack.json()).order_number).toBe(order.order_number);
});

test('API-31: users cannot see other users\' orders; bad ids are handled', async ({ request, playwright, baseURL }) => {
  await registerNewUser(request, 'Owner');
  await request.post('/api/cart/items', { data: { productId: 15, quantity: 1 } });
  const order = await (await request.post('/api/orders', { data: VALID_CHECKOUT })).json();

  const otherUser = await newUserContext(playwright, baseURL, 'Other');
  const peek = await otherUser.get(`/api/orders/${order.id}`);
  expect(peek.status()).toBe(404); // same as a missing order, so ids can't be probed
  expect(await peek.json()).toEqual({ error: 'Order not found.' });
  await otherUser.dispose();

  expect((await request.get('/api/orders/999999')).status()).toBe(404);
  expect((await request.get('/api/orders/abc')).status()).toBe(400);
});

test('API-32: stock is checked again at checkout (sold out / reduced by another user)', async ({ playwright, baseURL }) => {
  // Enamel Teapot (stock 6) and Knit Scarf (stock 9) are not used by any other automated test
  const userA = await newUserContext(playwright, baseURL, 'User A');
  const userB = await newUserContext(playwright, baseURL, 'User B');

  // Sold out: A and B both have all 6 teapots in their cart; B orders first
  await userA.post('/api/cart/items', { data: { productId: 10, quantity: 6 } });
  await userB.post('/api/cart/items', { data: { productId: 10, quantity: 6 } });
  expect((await userB.post('/api/orders', { data: VALID_CHECKOUT })).status()).toBe(201);

  const soldOut = await userA.post('/api/orders', { data: VALID_CHECKOUT });
  expect(soldOut.status()).toBe(409);
  expect(await soldOut.json()).toEqual({
    error: 'Sorry, Enamel Teapot is now out of stock. Please remove it from your cart.',
  });
  // A's cart was left unchanged
  expect((await (await userA.get('/api/cart')).json()).item_count).toBe(6);

  // Reduced: A wants 9 scarves; B buys 5 first, leaving 4
  await userA.delete('/api/cart/items/10');
  await userA.post('/api/cart/items', { data: { productId: 19, quantity: 9 } });
  await userB.post('/api/cart/items', { data: { productId: 19, quantity: 5 } });
  expect((await userB.post('/api/orders', { data: VALID_CHECKOUT })).status()).toBe(201);

  const reduced = await userA.post('/api/orders', { data: VALID_CHECKOUT });
  expect(reduced.status()).toBe(409);
  expect(await reduced.json()).toEqual({ error: 'Sorry, only 4 of Knit Scarf left. Please update your cart.' });

  await userA.dispose();
  await userB.dispose();
});
