const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'cat_fleetbrain_super_secret_jwt_key_2026'
      );
      req.user = decoded; // decoded contains { id, role, email, name }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  // Check if gateway forwarded user headers
  if (req.headers['x-user-id']) {
    req.user = {
      id: req.headers['x-user-id'],
      role: req.headers['x-user-role'] || 'Customer',
      email: req.headers['x-user-email'],
    };
    return next();
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
