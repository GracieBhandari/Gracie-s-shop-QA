// API tests: the shopping cart and its rules.

const { test, expect } = require('@playwright/test');
const { registerNewUser } = require('./helpers');

test('API-18: every cart endpoint requires login (401)', async ({ request }) => {
  const responses = [
    await request.get('/api/cart'),
    await request.post('/api/cart/items', { data: { productId: 6 } }),
    await request.put('/api/cart/items/6', { data: { quantity: 2 } }),
    await request.delete('/api/cart/items/6'),
  ];
  for (const response of responses) {
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: 'Please log in to continue.' });
  }
});

test('API-19: adding the same product twice combines into one line with correct totals', async ({ request }) => {
  await registerNewUser(request);
  await request.post('/api/cart/items', { data: { productId: 6, quantity: 2 } });
  const response = await request.post('/api/cart/items', { data: { productId: 6 } }); // quantity defaults to 1
  expect(response.status()).toBe(200);
  const cart = await response.json();

  expect(cart.items).toHaveLength(1);
  expect(cart.items[0]).toMatchObject({ product_id: 6, quantity: 3, price_cents: 1499, line_total_cents: 4497 });
  expect(cart.item_count).toBe(3);
  expect(cart.total_cents).toBe(4497);
});

test('API-20: the client cannot set the price; totals use the database price', async ({ request }) => {
  await registerNewUser(request);
  const cart = await (await request.post('/api/cart/items', {
    data: { productId: 11, quantity: 2, price_cents: 1, total_cents: 1 },
  })).json();
  expect(cart.total_cents).toBe(2598); // Dotted Notebook $12.99 × 2
});

test('API-21: invalid productId and quantity are rejected with 400', async ({ request }) => {
  await registerNewUser(request);
  const add = (data) => request.post('/api/cart/items', { data });

  const badProduct = await add({ productId: '6' });
  expect(badProduct.status()).toBe(400);
  expect((await badProduct.json()).error).toBe('productId must be a positive whole number.');

  for (const quantity of [0, -1, 1.5, '2']) {
    const response = await add({ productId: 6, quantity });
    expect(response.status(), `quantity ${JSON.stringify(quantity)}`).toBe(400);
    expect((await response.json()).error).toBe('Quantity must be a whole number of at least 1.');
  }
});

test('API-22: missing, out-of-stock, and stock-limited products', async ({ request }) => {
  await registerNewUser(request);
  const add = (productId) => request.post('/api/cart/items', { data: { productId } });

  const missing = await add(999);
  expect(missing.status()).toBe(404);
  expect((await missing.json()).error).toBe('Product not found.');

  const outOfStock = await add(5); // Linen Cushion Cover, stock 0
  expect(outOfStock.status()).toBe(409);
  expect((await outOfStock.json()).error).toBe('Sorry, this product is out of stock.');

  expect((await add(20)).status()).toBe(200); // Sunglasses Case, stock 1
  const overStock = await add(20);
  expect(overStock.status()).toBe(409);
  expect((await overStock.json()).error).toBe('You already have the maximum quantity (1) of this item in your cart.');
});

test('API-23: the 10-per-product limit', async ({ request }) => {
  await registerNewUser(request);
  const add = (quantity) => request.post('/api/cart/items', { data: { productId: 6, quantity } });

  expect((await add(8)).status()).toBe(200);
  const tooMany = await add(3);
  expect(tooMany.status()).toBe(409);
  expect((await tooMany.json()).error).toBe('You can add only 2 more of this item.');

  expect((await add(2)).status()).toBe(200); // now exactly 10
  const atLimit = await add(1);
  expect(atLimit.status()).toBe(409);
  expect((await atLimit.json()).error).toBe('You already have the maximum quantity (10) of this item in your cart.');
});

test('API-24: PUT changes a quantity within the rules', async ({ request }) => {
  await registerNewUser(request);
  await request.post('/api/cart/items', { data: { productId: 6, quantity: 1 } });
  const put = (id, quantity) => request.put(`/api/cart/items/${id}`, { data: { quantity } });

  const ok = await put(6, 4);
  expect(ok.status()).toBe(200);
  expect((await ok.json()).total_cents).toBe(5996);

  expect((await put(6, 11)).status()).toBe(409);
  expect((await put(6, 0)).status()).toBe(400);
  expect((await put(7, 2)).status()).toBe(404);   // not in this user's cart
  expect((await put('abc', 2)).status()).toBe(400);
});

test('API-25: DELETE removes an item; removing it again returns 404', async ({ request }) => {
  await registerNewUser(request);
  await request.post('/api/cart/items', { data: { productId: 6, quantity: 1 } });
  await request.post('/api/cart/items', { data: { productId: 11, quantity: 1 } });

  const removed = await request.delete('/api/cart/items/6');
  expect(removed.status()).toBe(200);
  const cart = await removed.json();
  expect(cart.items.map((i) => i.product_id)).toEqual([11]);
  expect(cart.total_cents).toBe(1299);

  const again = await request.delete('/api/cart/items/6');
  expect(again.status()).toBe(404);
  expect((await again.json()).error).toBe('This item is not in your cart.');
});

test('API-26: each user has their own cart', async ({ request, playwright, baseURL }) => {
  await registerNewUser(request, 'User A');
  await request.post('/api/cart/items', { data: { productId: 6, quantity: 2 } });

  const userB = await playwright.request.newContext({ baseURL });
  await registerNewUser(userB, 'User B');
  const cartB = await (await userB.get('/api/cart')).json();
  expect(cartB.items).toEqual([]);
  await userB.dispose();
});
