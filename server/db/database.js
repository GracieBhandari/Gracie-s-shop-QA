// Opens the SQLite database and makes sure the tables exist.
// Every file that needs the database imports this one shared connection.

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

// DB_PATH lets tests use a separate database file, so they never touch your data
const db = new DatabaseSync(process.env.DB_PATH || path.join(__dirname, 'shop.db'));

db.exec('PRAGMA foreign_keys = ON');
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

module.exports = db;
