// Resets the database to a known starting state.
// Run with: npm run seed
// Testers rely on this: every test run can start from the same data.

const fs = require('node:fs');
const path = require('node:path');
const bcrypt = require('bcryptjs');
const db = require('./database');

// A ready-made account for testers and automated tests
const demoUser = { name: 'Test Shopper', email: 'shopper@example.com', password: 'Password123' };

const categories = [
  { name: 'Home Decor', slug: 'home-decor', emoji: '🪴' },
  { name: 'Kitchen', slug: 'kitchen', emoji: '🍳' },
  { name: 'Stationery', slug: 'stationery', emoji: '✏️' },
  { name: 'Accessories', slug: 'accessories', emoji: '👜' },
];

const products = [
  // Home Decor
  { category: 'home-decor', emoji: '🏺', name: 'Ceramic Flower Vase', description: 'A hand-glazed ceramic vase in soft blush pink. 25 cm tall.', price_cents: 3499, stock: 12 },
  { category: 'home-decor', emoji: '🕯️', name: 'Soy Wax Candle', description: 'Vanilla and sandalwood scented candle with a 40-hour burn time.', price_cents: 1899, stock: 30 },
  { category: 'home-decor', emoji: '🧶', name: 'Woven Throw Blanket', description: 'Soft cotton throw blanket with tassel edges. 130 x 170 cm.', price_cents: 4999, stock: 8 },
  { category: 'home-decor', emoji: '🪞', name: 'Round Wall Mirror', description: 'Minimal round mirror with a thin gold metal frame. 50 cm diameter.', price_cents: 6999, stock: 5 },
  { category: 'home-decor', emoji: '🛋️', name: 'Linen Cushion Cover', description: 'Washable linen cushion cover in sage green. 45 x 45 cm.', price_cents: 2299, stock: 0 },

  // Kitchen
  { category: 'kitchen', emoji: '☕', name: 'Stoneware Coffee Mug', description: 'Speckled stoneware mug that holds 350 ml. Dishwasher safe.', price_cents: 1499, stock: 40 },
  { category: 'kitchen', emoji: '🥖', name: 'Bamboo Cutting Board', description: 'Sturdy bamboo board with a juice groove. 35 x 25 cm.', price_cents: 2499, stock: 20 },
  { category: 'kitchen', emoji: '🫙', name: 'Glass Storage Jars (Set of 3)', description: 'Airtight glass jars with bamboo lids for pantry storage.', price_cents: 2999, stock: 15 },
  { category: 'kitchen', emoji: '🧑‍🍳', name: 'Linen Apron', description: 'Adjustable linen apron with a front pocket.', price_cents: 2799, stock: 10 },
  { category: 'kitchen', emoji: '🫖', name: 'Enamel Teapot', description: 'Classic enamel teapot with a removable steel infuser. 1 litre.', price_cents: 3999, stock: 6 },

  // Stationery
  { category: 'stationery', emoji: '📓', name: 'Dotted Notebook', description: 'A5 hardcover notebook with 160 dotted pages.', price_cents: 1299, stock: 50 },
  { category: 'stationery', emoji: '🖊️', name: 'Gel Pen Set', description: 'Set of 10 smooth gel pens in pastel colors.', price_cents: 999, stock: 35 },
  { category: 'stationery', emoji: '📅', name: 'Weekly Planner', description: 'Undated weekly planner with goal and habit trackers.', price_cents: 1799, stock: 25 },
  { category: 'stationery', emoji: '🎀', name: 'Washi Tape Pack', description: 'Pack of 8 decorative washi tapes for journaling.', price_cents: 799, stock: 60 },
  { category: 'stationery', emoji: '🔖', name: 'Brass Bookmark', description: 'Engraved brass bookmark with a silk tassel.', price_cents: 899, stock: 18 },

  // Accessories
  { category: 'accessories', emoji: '🛍️', name: 'Canvas Tote Bag', description: 'Heavy cotton canvas tote with an inside zip pocket.', price_cents: 2199, stock: 22 },
  { category: 'accessories', emoji: '🌸', name: 'Silk Hair Scrunchies (Set of 3)', description: 'Gentle mulberry silk scrunchies in neutral tones.', price_cents: 1599, stock: 45 },
  { category: 'accessories', emoji: '💳', name: 'Leather Card Holder', description: 'Slim leather card holder with four card slots.', price_cents: 2599, stock: 14 },
  { category: 'accessories', emoji: '🧣', name: 'Knit Scarf', description: 'Warm ribbed knit scarf in oatmeal. 180 cm long.', price_cents: 1999, stock: 9 },
  { category: 'accessories', emoji: '🕶️', name: 'Sunglasses Case', description: 'Hard-shell sunglasses case with a soft lining.', price_cents: 1199, stock: 1 },
];

db.exec('BEGIN');
try {
  // Drop and recreate the tables so schema changes are picked up too
  db.exec('DROP TABLE IF EXISTS cart_items');
  db.exec('DROP TABLE IF EXISTS users');
  db.exec('DROP TABLE IF EXISTS products');
  db.exec('DROP TABLE IF EXISTS categories');
  db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

  const insertCategory = db.prepare('INSERT INTO categories (name, slug, emoji) VALUES (?, ?, ?)');
  const categoryIds = {};
  for (const category of categories) {
    const result = insertCategory.run(category.name, category.slug, category.emoji);
    categoryIds[category.slug] = result.lastInsertRowid;
  }

  const insertProduct = db.prepare(
    'INSERT INTO products (category_id, name, description, emoji, price_cents, stock) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const product of products) {
    insertProduct.run(
      categoryIds[product.category], product.name, product.description, product.emoji, product.price_cents, product.stock
    );
  }

  db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(
    demoUser.name, demoUser.email, bcrypt.hashSync(demoUser.password, 10)
  );

  db.exec('COMMIT');
  console.log(`Seeded ${categories.length} categories, ${products.length} products, and 1 demo user (${demoUser.email}).`);
} catch (error) {
  db.exec('ROLLBACK');
  throw error;
}
