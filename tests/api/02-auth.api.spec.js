// API tests: register, login, logout, and "who am I?".

const { test, expect } = require('@playwright/test');
const { registerNewUser } = require('./helpers');

const uniqueEmail = () => `api-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;

test('API-09: GET /api/auth/me returns user null for a visitor', async ({ request }) => {
  const response = await request.get('/api/auth/me');
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ user: null });
});

test('API-10: register creates an account, logs in, and never returns the password', async ({ request }) => {
  const email = uniqueEmail();
  const response = await request.post('/api/auth/register', {
    data: { name: '  API User  ', email: `  ${email.toUpperCase()} `, password: 'Password123' },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();

  // Name is trimmed, email is trimmed and lower-cased
  expect(body.user).toMatchObject({ name: 'API User', email });
  expect(JSON.stringify(body)).not.toContain('Password123');
  expect(JSON.stringify(body)).not.toContain('password');

  const me = await (await request.get('/api/auth/me')).json();
  expect(me.user.email).toBe(email);
});

test('API-11: register rejects missing and wrongly typed fields', async ({ request }) => {
  const empty = await request.post('/api/auth/register', { data: {} });
  expect(empty.status()).toBe(400);
  expect(await empty.json()).toEqual({
    error: 'Please fix the highlighted fields.',
    fields: {
      name: 'Please enter your name.',
      email: 'Please enter a valid email address.',
      password: 'Password must be at least 8 characters.',
    },
  });

  const wrongTypes = await request.post('/api/auth/register', { data: { name: 123, email: ['x'], password: null } });
  expect(wrongTypes.status()).toBe(400);
  expect(Object.keys((await wrongTypes.json()).fields).sort()).toEqual(['email', 'name', 'password']);
});

test('API-12: password rules at their boundaries', async ({ request }) => {
  const passwordError = async (password) => {
    const response = await request.post('/api/auth/register', {
      data: { name: 'Boundary', email: uniqueEmail(), password },
    });
    return response.status() === 201 ? 'accepted' : (await response.json()).fields.password;
  };

  expect(await passwordError('Pass123')).toBe('Password must be at least 8 characters.'); // 7
  expect(await passwordError('Password')).toBe('Password must include at least one letter and one number.');
  expect(await passwordError('12345678')).toBe('Password must include at least one letter and one number.');
  expect(await passwordError(`Password1${'x'.repeat(64)}`)).toBe('Password is too long.'); // 73
  expect(await passwordError(`Password1${'x'.repeat(63)}`)).toBe('accepted'); // 72
  expect(await passwordError('Pass1234')).toBe('accepted'); // 8
});

test('API-13: duplicate email is rejected even with different capitals', async ({ request }) => {
  const response = await request.post('/api/auth/register', {
    data: { name: 'Dup', email: 'SHOPPER@Example.com', password: 'Password123' },
  });
  expect(response.status()).toBe(409);
  expect((await response.json()).error).toBe('An account with this email already exists.');
});

test('API-14: login with wrong password and unknown email give the same 401 message', async ({ request }) => {
  const wrongPassword = await request.post('/api/auth/login', {
    data: { email: 'shopper@example.com', password: 'WrongPass1' },
  });
  const unknownEmail = await request.post('/api/auth/login', {
    data: { email: 'nobody@example.com', password: 'Password123' },
  });

  expect(wrongPassword.status()).toBe(401);
  expect(unknownEmail.status()).toBe(401);
  // Same response, so the API doesn't reveal which emails have accounts
  expect(await wrongPassword.json()).toEqual({ error: 'Incorrect email or password.' });
  expect(await unknownEmail.json()).toEqual({ error: 'Incorrect email or password.' });
});

test('API-15: login with empty fields returns 400; email is not case-sensitive', async ({ request }) => {
  const empty = await request.post('/api/auth/login', { data: {} });
  expect(empty.status()).toBe(400);
  expect(await empty.json()).toEqual({ error: 'Please enter your email and password.' });

  const mixedCase = await request.post('/api/auth/login', {
    data: { email: 'SHOPPER@Example.com', password: 'Password123' },
  });
  expect(mixedCase.status()).toBe(200);
  expect((await mixedCase.json()).user.email).toBe('shopper@example.com');
});

test('API-16: logout returns 204 and ends the session', async ({ request }) => {
  await registerNewUser(request);
  expect((await (await request.get('/api/auth/me')).json()).user).not.toBeNull();

  const logout = await request.post('/api/auth/logout');
  expect(logout.status()).toBe(204);
  expect(await (await request.get('/api/auth/me')).json()).toEqual({ user: null });
});

test('API-17: a body that is not valid JSON returns 400, not a server error', async ({ request }) => {
  const response = await request.post('/api/auth/login', {
    headers: { 'Content-Type': 'application/json' },
    data: '{bad json',
  });
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ error: 'Request body must be valid JSON' });
});
