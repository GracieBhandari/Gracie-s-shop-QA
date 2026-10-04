// Put this in front of any route that needs a logged-in user.
// Visitors get 401 Unauthorized; logged-in users continue to the route.

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Please log in to continue.' });
  }
  next();
}

module.exports = requireAuth;
