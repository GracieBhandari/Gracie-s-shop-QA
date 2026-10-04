// All cart routes need a logged-in user. Every route returns the whole updated cart.
//
// GET    /api/cart                      - see the cart
// POST   /api/cart/items                - add a product ({ productId, quantity })
// PUT    /api/cart/items/:productId     - change a product's quantity ({ quantity })
// DELETE /api/cart/items/:productId     - remove a product

const express = require('express');
const db = require('../db/database');
const requireAuth = require('../middleware/requireAuth');
const { MAX_QUANTITY_PER_PRODUCT } = require('../config');

const router = express.Router();
router.use(requireAuth);

// The cart with prices from the products table, so totals always use current prices
function getCart(userId) {
  const items = db.prepare(`
    SELECT p.id AS product_id, p.name, p.emoji, p.price_cents, p.stock,
           MIN(p.stock, ?) AS max_quantity,
           ci.quantity,
           p.price_cents * ci.quantity AS line_total_cents
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = ?
    ORDER BY ci.id
  `).all(MAX_QUANTITY_PER_PRODUCT, userId);

  return {
    items,
    item_count: items.reduce((sum, item) => sum + item.quantity, 0),
    total_cents: items.reduce((sum, item) => sum + item.line_total_cents, 0),
  };
}

function isPositiveWholeNumber(value) {
  return Number.isInteger(value) && value >= 1;
}

router.get('/', (req, res) => {
  res.json(getCart(req.session.userId));
});

router.post('/items', (req, res) => {
  const userId = req.session.userId;
  const { productId, quantity = 1 } = req.body || {};

  if (!isPositiveWholeNumber(productId)) {
    return res.status(400).json({ error: 'productId must be a positive whole number.' });
  }
  if (!isPositiveWholeNumber(quantity)) {
    return res.status(400).json({ error: 'Quantity must be a whole number of at least 1.' });
  }

  const product = db.prepare('SELECT id, stock FROM products WHERE id = ?').get(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  if (product.stock === 0) {
    return res.status(409).json({ error: 'Sorry, this product is out of stock.' });
  }

  const existing = db.prepare('SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?').get(userId, productId);
  const alreadyInCart = existing ? existing.quantity : 0;
  const limit = Math.min(product.stock, MAX_QUANTITY_PER_PRODUCT);

  if (alreadyInCart + quantity > limit) {
    const canAdd = limit - alreadyInCart;
    const error = canAdd > 0
      ? `You can add only ${canAdd} more of this item.`
      : `You already have the maximum quantity (${limit}) of this item in your cart.`;
    return res.status(409).json({ error });
  }

  // Insert a new row, or add to the quantity if the product is already in the cart
  db.prepare(`
    INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
    ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = quantity + excluded.quantity
  `).run(userId, productId, quantity);

  res.json(getCart(userId));
});

router.put('/items/:productId', (req, res) => {
  const userId = req.session.userId;
  const { quantity } = req.body || {};

  if (!/^\d+$/.test(req.params.productId)) {
    return res.status(400).json({ error: 'Product id must be a whole number.' });
  }
  if (!isPositiveWholeNumber(quantity)) {
    return res.status(400).json({ error: 'Quantity must be a whole number of at least 1.' });
  }

  const productId = Number(req.params.productId);
  const item = db.prepare(`
    SELECT p.stock FROM cart_items ci JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = ? AND ci.product_id = ?
  `).get(userId, productId);

  if (!item) {
    return res.status(404).json({ error: 'This item is not in your cart.' });
  }

  const limit = Math.min(item.stock, MAX_QUANTITY_PER_PRODUCT);
  if (quantity > limit) {
    return res.status(409).json({ error: `You can have at most ${limit} of this item.` });
  }

  db.prepare('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?').run(quantity, userId, productId);
  res.json(getCart(userId));
});

router.delete('/items/:productId', (req, res) => {
  const userId = req.session.userId;

  if (!/^\d+$/.test(req.params.productId)) {
    return res.status(400).json({ error: 'Product id must be a whole number.' });
  }

  const result = db
    .prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?')
    .run(userId, Number(req.params.productId));

  if (result.changes === 0) {
    return res.status(404).json({ error: 'This item is not in your cart.' });
  }
  res.json(getCart(userId));
});

module.exports = router;
