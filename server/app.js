// Builds the Express app: serves the frontend and connects the API routes.
// Kept separate from server.js so tests can load the app without starting a server.

const path = require('node:path');
const express = require('express');
const session = require('express-session');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');

const app = express();

// Frontend: files in /public are served as-is (e.g. /css/styles.css)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Read JSON request bodies into req.body
app.use(express.json());

// Remember who is logged in. The browser keeps a cookie ("sid") with a random
// session id; the login details stay on the server.
// Note: sessions are kept in memory, so restarting the server logs everyone out.
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'dev-only-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,               // page JavaScript can't read the cookie
    sameSite: 'lax',              // not sent on requests from other websites
    maxAge: 24 * 60 * 60 * 1000,  // 1 day
  },
}));

// API
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);

// Unknown API URL
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Errors
app.use((err, req, res, next) => {
  // The request body wasn't valid JSON: that's the client's mistake, not a server error
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body must be valid JSON' });
  }

  // Unexpected errors: log the details, but don't show them to users
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;
