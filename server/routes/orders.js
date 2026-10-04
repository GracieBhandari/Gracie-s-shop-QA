// All order routes need a logged-in user.
//
// POST /api/orders       - place an order from the current cart
// GET  /api/orders/:id   - get one of your own orders

const express = require('express');
const db = require('../db/database');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
router.use(requireAuth);

// "GS-000042": a friendlier order number to show customers
function orderNumber(id) {
  return `GS-${String(id).padStart(6, '0')}`;
}

// The Luhn check catches most typos in card numbers (one wrong or swapped digit)
function passesLuhnCheck(digits) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

// "MM/YY". A card is valid until the end of its expiry month.
function isExpiryValid(expiry, now = new Date()) {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const currentMonth = now.getFullYear() * 12 + now.getMonth() + 1;
  return year * 12 + month >= currentMonth;
}

function isFilledIn(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

// Returns { fieldName: 'message' } for every field with a problem
function validateCheckout(body) {
  const errors = {};
  const asText = (value) => (typeof value === 'string' ? value.trim() : '');

  if (!isFilledIn(body.fullName, 100)) errors.fullName = 'Please enter your full name.';
  if (!isFilledIn(body.address, 200)) errors.address = 'Please enter your street address.';
  if (!isFilledIn(body.city, 100)) errors.city = 'Please enter your city.';
  if (!/^\d{5}(-\d{4})?$/.test(asText(body.zipCode))) errors.zipCode = 'Please enter a 5-digit ZIP code.';

  const cardDigits = asText(body.cardNumber).replace(/[\s-]/g, '');
  if (!/^\d{13,19}$/.test(cardDigits) || !passesLuhnCheck(cardDigits)) {
    errors.cardNumber = 'Please enter a valid card number.';
  }
  if (!/^\d{2}\/\d{2}$/.test(asText(body.expiry))) {
    errors.expiry = 'Please enter the expiry date as MM/YY.';
  } else if (!isExpiryValid(asText(body.expiry))) {
    errors.expiry = 'This card has expired or the month is not valid.';
  }
  if (!/^\d{3,4}$/.test(asText(body.cvc))) errors.cvc = 'Please enter the 3 or 4 digit security code.';

  return { errors, cardDigits };
}

function getOrder(orderId, userId) {
  const order = db.prepare(`
    SELECT id, full_name, address, city, zip_code, card_last4, total_cents, created_at
    FROM orders WHERE id = ? AND user_id = ?
  `).get(orderId, userId);
  if (!order) return null;

  const items = db.prepare(`
    SELECT product_id, product_name AS name, emoji, price_cents, quantity,
           price_cents * quantity AS line_total_cents
    FROM order_items WHERE order_id = ? ORDER BY id
  `).all(orderId);

  return {
    ...order,
    order_number: orderNumber(order.id),
    items,
    item_count: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

router.post('/', (req, res) => {
  const userId = req.session.userId;
  const body = req.body || {};

  const { errors, cardDigits } = validateCheckout(body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fields: errors });
  }

  const cartItems = db.prepare(`
    SELECT ci.product_id, ci.quantity, p.name, p.emoji, p.price_cents, p.stock
    FROM cart_items ci JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = ? ORDER BY ci.id
  `).all(userId);

  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty.' });
  }

  // Stock may have changed since the items were added to the cart
  const shortItem = cartItems.find((item) => item.quantity > item.stock);
  if (shortItem) {
    const error = shortItem.stock === 0
      ? `Sorry, ${shortItem.name} is now out of stock. Please remove it from your cart.`
      : `Sorry, only ${shortItem.stock} of ${shortItem.name} left. Please update your cart.`;
    return res.status(409).json({ error });
  }

  const totalCents = cartItems.reduce((sum, item) => sum + item.price_cents * item.quantity, 0);

  // A transaction: either every step below is saved, or (if anything fails) none of them is
  db.exec('BEGIN');
  let orderId;
  try {
    const result = db.prepare(`
      INSERT INTO orders (user_id, full_name, address, city, zip_code, card_last4, total_cents)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, body.fullName.trim(), body.address.trim(), body.city.trim(), body.zipCode.trim(),
      cardDigits.slice(-4), totalCents);
    orderId = Number(result.lastInsertRowid);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, emoji, price_cents, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const reduceStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    for (const item of cartItems) {
      insertItem.run(orderId, item.product_id, item.name, item.emoji, item.price_cents, item.quantity);
      reduceStock.run(item.quantity, item.product_id);
    }

    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }

  res.status(201).json(getOrder(orderId, userId));
});

router.get('/:id', (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ error: 'Order id must be a whole number.' });
  }

  // Someone else's order gets the same 404 as a missing one, so order ids can't be probed
  const order = getOrder(Number(req.params.id), req.session.userId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  res.json(order);
});

module.exports = router;
