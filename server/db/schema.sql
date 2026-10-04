-- Gracie's Shop database schema
-- Prices are stored in cents (whole numbers) to avoid decimal rounding errors.

CREATE TABLE IF NOT EXISTS categories (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL UNIQUE,
  slug  TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  name        TEXT    NOT NULL,
  description TEXT    NOT NULL,
  emoji       TEXT    NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  stock       INTEGER NOT NULL CHECK (stock >= 0)
);

-- Passwords are never stored. Only a bcrypt hash of the password is saved.
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- One row per product in a user's cart. UNIQUE stops the same product appearing twice.
CREATE TABLE IF NOT EXISTS cart_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  UNIQUE (user_id, product_id)
);

-- Only the last 4 card digits are stored, never the full card number or security code.
CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  full_name   TEXT    NOT NULL,
  address     TEXT    NOT NULL,
  city        TEXT    NOT NULL,
  zip_code    TEXT    NOT NULL,
  card_last4  TEXT    NOT NULL,
  total_cents INTEGER NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Name and price are copied at purchase time, so later product changes don't alter past orders.
CREATE TABLE IF NOT EXISTS order_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id     INTEGER NOT NULL REFERENCES orders(id),
  product_id   INTEGER NOT NULL REFERENCES products(id),
  product_name TEXT    NOT NULL,
  emoji        TEXT    NOT NULL,
  price_cents  INTEGER NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0)
);
