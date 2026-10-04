// GET /api/categories - list all product categories

const express = require('express');
const db = require('../db/database');

const router = express.Router();

router.get('/', (req, res) => {
  const categories = db.prepare('SELECT id, name, slug, emoji FROM categories ORDER BY name').all();
  res.json(categories);
});

module.exports = router;
