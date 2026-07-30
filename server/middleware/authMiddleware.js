import { verifyToken } from '../utils/jwtUtils.js';
import { getQuery } from '../config/db.js';

/**
 * Express middleware to protect routes requiring authentication.
 * Expects 'Authorization: Bearer <token>' header.
 */
export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Not authorized. Please log in.' },
    });
  }

  try {
    const decoded = verifyToken(token);

    // Verify user exists in database
    const user = getQuery('SELECT id, name, email, created_at FROM users WHERE id = ?', [decoded.id]);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'User belonging to this token no longer exists.' },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired authentication token.' },
    });
  }
};
