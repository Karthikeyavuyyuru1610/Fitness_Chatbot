import jwt from 'jsonwebtoken';

const getJwtSecret = () => process.env.JWT_SECRET || 'fitness_bot_default_secret_key_2026';
const getExpiresIn = () => process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generates a signed JWT token for a user.
 *
 * @param {Object} payload - Data to embed in token (e.g. { id, email })
 * @returns {string} Signed JWT token string
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: getExpiresIn(),
  });
};

/**
 * Verifies a JWT token and returns decoded payload.
 *
 * @param {string} token - JWT token string
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};
