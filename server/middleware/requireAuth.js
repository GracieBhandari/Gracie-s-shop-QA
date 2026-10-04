// Put this in front of any route that needs a logged-in user.
// Visitors get 401 Unauthorized; logged-in users continue to the route.

const db = require('../db/database');

function requireAuth(req, res, next) {
  const userId = req.session.userId;

  // The session can point to an account that no longer exists (for example after
  // the database is reset). Treat that the same as not being logged in. (BUG-001)
  if (!userId || !db.prepare('SELECT 1 FROM users WHERE id = ?').get(userId)) {
    return res.status(401).json({ error: 'Please log in to continue.' });
  }
  next();
}

module.exports = requireAuth;
