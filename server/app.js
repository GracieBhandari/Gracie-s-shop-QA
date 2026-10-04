// Builds the Express app: serves the frontend and connects the API routes.
// Kept separate from server.js so tests can load the app without starting a server.

const path = require('node:path');
const express = require('express');
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');

const app = express();

// Frontend: files in /public are served as-is (e.g. /css/styles.css)
app.use(express.static(path.join(__dirname, '..', 'public')));

// API
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);

// Unknown API URL
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Unexpected errors: log the details, but don't show them to users
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;
