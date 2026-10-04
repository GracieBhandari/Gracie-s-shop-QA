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
