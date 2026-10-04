// API tests: health check, categories, and products.

const { test, expect } = require('@playwright/test');

test('API-01: GET /api/health returns ok', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: 'ok' });
});

test('API-02: GET /api/categories returns the 4 categories sorted by name', async ({ request }) => {
  const response = await request.get('/api/categories');
  expect(response.status()).toBe(200);
  const categories = await response.json();

  expect(categories.map((c) => c.name)).toEqual(['Accessories', 'Home Decor', 'Kitchen', 'Stationery']);
  for (const category of categories) {
    expect(Object.keys(category).sort()).toEqual(['emoji', 'id', 'name', 'slug']);
  }
});

test('API-03: GET /api/products returns 20 products with valid fields', async ({ request }) => {
  const response = await request.get('/api/products');
  expect(response.status()).toBe(200);
  const products = await response.json();

  expect(products).toHaveLength(20);
  for (const p of products) {
    expect(Number.isInteger(p.price_cents) && p.price_cents > 0, `${p.name} price`).toBe(true);
    expect(Number.isInteger(p.stock) && p.stock >= 0, `${p.name} stock`).toBe(true);
    // Rule: the most you can put in your cart is the lower of the stock and 10
    expect(p.max_quantity, `${p.name} max_quantity`).toBe(Math.min(p.stock, 10));
    expect(typeof p.name).toBe('string');
    expect(typeof p.category).toBe('string');
  }
});

test('API-04: category filter returns only that category; unknown category returns none', async ({ request }) => {
  const kitchen = await (await request.get('/api/products?category=kitchen')).json();
  expect(kitchen).toHaveLength(5);
  expect(kitchen.every((p) => p.category === 'kitchen')).toBe(true);

  const unknown = await request.get('/api/products?category=toys');
  expect(unknown.status()).toBe(200);
  expect(await unknown.json()).toEqual([]);
});

test('API-05: search is case-insensitive, combines with category, and treats % as text', async ({ request }) => {
  const names = async (query) => (await (await request.get(`/api/products?${query}`)).json()).map((p) => p.name);

  expect(await names('search=MUG')).toEqual(['Stoneware Coffee Mug']);
  expect(await names('search=dishwasher')).toEqual(['Stoneware Coffee Mug']); // description match
  expect(await names('search=linen')).toEqual(['Linen Cushion Cover', 'Linen Apron']);
  expect(await names('category=kitchen&search=linen')).toEqual(['Linen Apron']);
  expect(await names('search=%25')).toEqual([]); // "%" must not act as a wildcard
  expect(await names('search=_')).toEqual([]);
});

test('API-06: search given twice is rejected with 400', async ({ request }) => {
  const response = await request.get('/api/products?search=a&search=b');
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ error: 'category and search must each be given once' });
});

test('API-07: GET /api/products/:id returns one product, 404 if missing, 400 if the id is invalid', async ({ request }) => {
  const mug = await request.get('/api/products/6');
  expect(mug.status()).toBe(200);
  expect(await mug.json()).toMatchObject({ id: 6, name: 'Stoneware Coffee Mug', price_cents: 1499, category: 'kitchen' });

  const missing = await request.get('/api/products/999');
  expect(missing.status()).toBe(404);
  expect(await missing.json()).toEqual({ error: 'Product not found' });

  for (const badId of ['abc', '-1', '1.5']) {
    const response = await request.get(`/api/products/${badId}`);
    expect(response.status(), `id ${badId}`).toBe(400);
  }
});

test('API-08: unknown API address returns 404 JSON', async ({ request }) => {
  const response = await request.get('/api/does-not-exist');
  expect(response.status()).toBe(404);
  expect(await response.json()).toEqual({ error: 'Not found' });
});
