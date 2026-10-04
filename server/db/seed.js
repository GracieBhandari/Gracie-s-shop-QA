// Resets the database to a known starting state.
// Run with: npm run seed
// Testers rely on this: every test run can start from the same data.

const db = require('./database');

const categories = [
  { name: 'Home Decor', slug: 'home-decor' },
  { name: 'Kitchen', slug: 'kitchen' },
  { name: 'Stationery', slug: 'stationery' },
  { name: 'Accessories', slug: 'accessories' },
];

const products = [
  // Home Decor
  { category: 'home-decor', name: 'Ceramic Flower Vase', description: 'A hand-glazed ceramic vase in soft blush pink. 25 cm tall.', price_cents: 3499, stock: 12 },
  { category: 'home-decor', name: 'Soy Wax Candle', description: 'Vanilla and sandalwood scented candle with a 40-hour burn time.', price_cents: 1899, stock: 30 },
  { category: 'home-decor', name: 'Woven Throw Blanket', description: 'Soft cotton throw blanket with tassel edges. 130 x 170 cm.', price_cents: 4999, stock: 8 },
  { category: 'home-decor', name: 'Round Wall Mirror', description: 'Minimal round mirror with a thin gold metal frame. 50 cm diameter.', price_cents: 6999, stock: 5 },
  { category: 'home-decor', name: 'Linen Cushion Cover', description: 'Washable linen cushion cover in sage green. 45 x 45 cm.', price_cents: 2299, stock: 0 },

  // Kitchen
  { category: 'kitchen', name: 'Stoneware Coffee Mug', description: 'Speckled stoneware mug that holds 350 ml. Dishwasher safe.', price_cents: 1499, stock: 40 },
  { category: 'kitchen', name: 'Bamboo Cutting Board', description: 'Sturdy bamboo board with a juice groove. 35 x 25 cm.', price_cents: 2499, stock: 20 },
  { category: 'kitchen', name: 'Glass Storage Jars (Set of 3)', description: 'Airtight glass jars with bamboo lids for pantry storage.', price_cents: 2999, stock: 15 },
  { category: 'kitchen', name: 'Linen Apron', description: 'Adjustable linen apron with a front pocket.', price_cents: 2799, stock: 10 },
  { category: 'kitchen', name: 'Enamel Teapot', description: 'Classic enamel teapot with a removable steel infuser. 1 litre.', price_cents: 3999, stock: 6 },

  // Stationery
  { category: 'stationery', name: 'Dotted Notebook', description: 'A5 hardcover notebook with 160 dotted pages.', price_cents: 1299, stock: 50 },
  { category: 'stationery', name: 'Gel Pen Set', description: 'Set of 10 smooth gel pens in pastel colours.', price_cents: 999, stock: 35 },
  { category: 'stationery', name: 'Weekly Planner', description: 'Undated weekly planner with goal and habit trackers.', price_cents: 1799, stock: 25 },
  { category: 'stationery', name: 'Washi Tape Pack', description: 'Pack of 8 decorative washi tapes for journaling.', price_cents: 799, stock: 60 },
  { category: 'stationery', name: 'Brass Bookmark', description: 'Engraved brass bookmark with a silk tassel.', price_cents: 899, stock: 18 },

  // Accessories
  { category: 'accessories', name: 'Canvas Tote Bag', description: 'Heavy cotton canvas tote with an inside zip pocket.', price_cents: 2199, stock: 22 },
  { category: 'accessories', name: 'Silk Hair Scrunchies (Set of 3)', description: 'Gentle mulberry silk scrunchies in neutral tones.', price_cents: 1599, stock: 45 },
  { category: 'accessories', name: 'Leather Card Holder', description: 'Slim leather card holder with four card slots.', price_cents: 2599, stock: 14 },
  { category: 'accessories', name: 'Knit Beanie', description: 'Warm ribbed knit beanie in oatmeal. One size.', price_cents: 1999, stock: 9 },
  { category: 'accessories', name: 'Sunglasses Case', description: 'Hard-shell sunglasses case with a soft lining.', price_cents: 1199, stock: 1 },
];

db.exec('BEGIN');
try {
  db.exec('DELETE FROM products');
  db.exec('DELETE FROM categories');
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('products', 'categories')");

  const insertCategory = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)');
  const categoryIds = {};
  for (const category of categories) {
    const result = insertCategory.run(category.name, category.slug);
    categoryIds[category.slug] = result.lastInsertRowid;
  }

  const insertProduct = db.prepare(
    'INSERT INTO products (category_id, name, description, price_cents, stock) VALUES (?, ?, ?, ?, ?)'
  );
  for (const product of products) {
    insertProduct.run(categoryIds[product.category], product.name, product.description, product.price_cents, product.stock);
  }

  db.exec('COMMIT');
  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
} catch (error) {
  db.exec('ROLLBACK');
  throw error;
}
