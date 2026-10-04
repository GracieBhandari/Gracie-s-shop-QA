// POST /api/auth/register  - create an account and log in
// POST /api/auth/login     - log in
// POST /api/auth/logout    - log out
// GET  /api/auth/me        - who is logged in? ({ user: null } if nobody)

const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');

const router = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns an object like { email: 'Please enter a valid email address.' }, empty if all is well
function validateRegistration({ name, email, password }) {
  const errors = {};

  if (typeof name !== 'string' || !name.trim()) {
    errors.name = 'Please enter your name.';
  } else if (name.trim().length > 50) {
    errors.name = 'Name must be 50 characters or fewer.';
  }

  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim()) || email.trim().length > 254) {
    errors.email = 'Please enter a valid email address.';
  }

  if (typeof password !== 'string' || password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  } else if (Buffer.byteLength(password) > 72) {
    // bcrypt ignores anything after 72 bytes, so longer passwords are rejected
    errors.password = 'Password is too long.';
  } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.password = 'Password must include at least one letter and one number.';
  }

  return errors;
}

// Starts a fresh session for the user. Using a new session id on login
// prevents "session fixation" (an attacker planting a known session id).
function logIn(req, userId) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) return reject(error);
      req.session.userId = userId;
      resolve();
    });
  });
}

router.post('/register', async (req, res) => {
  const body = req.body || {};
  const errors = validateRegistration(body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fields: errors });
  }

  const name = body.name.trim();
  const email = body.email.trim().toLowerCase();

  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
    const message = 'An account with this email already exists.';
    return res.status(409).json({ error: message, fields: { email: message } });
  }

  const passwordHash = await bcrypt.hash(body.password, 10);
  const result = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run(name, email, passwordHash);
  const user = { id: Number(result.lastInsertRowid), name, email };

  await logIn(req, user.id);
  res.status(201).json({ user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return res.status(400).json({ error: 'Please enter your email and password.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
  const passwordMatches = user && (await bcrypt.compare(password, user.password_hash));

  // Same message whether the email or the password is wrong, so attackers
  // can't use this form to find out which emails have accounts
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  await logIn(req, user.id);
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie('sid');
    res.status(204).end();
  });
});

router.get('/me', (req, res) => {
  const user = req.session.userId
    ? db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.session.userId)
    : null;
  res.json({ user: user || null });
});

module.exports = router;
