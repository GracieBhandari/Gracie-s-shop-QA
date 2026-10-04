// GET /api/products          - list products (optional ?category=slug and ?search=text)
// GET /api/products/:id      - get one product

const express = require('express');
const db = require('../db/database');

const router = express.Router();

const PRODUCT_COLUMNS = `
  p.id, p.name, p.description, p.emoji, p.price_cents, p.stock,
  c.slug AS category, c.name AS category_name
`;

// In SQL LIKE, % and _ are wildcards. Escape them so a search for "50%"
// matches the text "50%" instead of acting as a wildcard.
function escapeLike(text) {
  return text.replace(/[\\%_]/g, '\\$&');
}

router.get('/', (req, res) => {
  const { category, search } = req.query;

  // ?search=a&search=b arrives as an array, not a string
  if ((category !== undefined && typeof category !== 'string') ||
      (search !== undefined && typeof search !== 'string')) {
    return res.status(400).json({ error: 'category and search must each be given once' });
  }

  let sql = `SELECT ${PRODUCT_COLUMNS} FROM products p JOIN categories c ON c.id = p.category_id WHERE 1 = 1`;
  const params = [];

  if (category) {
    sql += ' AND c.slug = ?';
    params.push(category);
  }

  const searchText = search ? search.trim() : '';
  if (searchText) {
    sql += " AND (p.name LIKE ? ESCAPE '\\' OR p.description LIKE ? ESCAPE '\\')";
    const pattern = `%${escapeLike(searchText)}%`;
    params.push(pattern, pattern);
  }

  sql += ' ORDER BY p.id';
  res.json(db.prepare(sql).all(...params));
});

router.get('/:id', (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ error: 'Product id must be a whole number' });
  }

  const product = db
    .prepare(`SELECT ${PRODUCT_COLUMNS} FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?`)
    .get(Number(req.params.id));

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

module.exports = router;
