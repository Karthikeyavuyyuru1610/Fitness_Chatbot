import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { runQuery, getQuery } from '../config/db.js';
import { generateToken } from '../utils/jwtUtils.js';

/**
 * POST /api/auth/register
 * Registers a new user.
 */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: { message: 'Name is required' } });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: { message: 'Email is required' } });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, error: { message: 'Invalid email address' } });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      error: { message: 'Password must be at least 6 characters long' },
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = getQuery('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: { message: 'An account with this email already exists' },
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userId = uuidv4();

  // Save to database
  runQuery(
    'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
    [userId, name.trim(), normalizedEmail, hashedPassword]
  );

  const user = {
    id: userId,
    name: name.trim(),
    email: normalizedEmail,
    created_at: new Date().toISOString(),
  };

  const token = generateToken({ id: user.id, email: user.email });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token,
    },
  });
};

/**
 * POST /api/auth/login
 * Logs in an existing user.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: { message: 'Please provide email and password' },
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find user by email
  const user = getQuery('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid email or password' },
    });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid email or password' },
    });
  }

  const userPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };

  const token = generateToken({ id: user.id, email: user.email });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userPayload,
      token,
    },
  });
};

/**
 * GET /api/auth/profile
 * Gets current logged-in user profile.
 */
export const getProfile = async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
};

/**
 * PUT /api/auth/profile
 * Updates user profile (name, email).
 */
export const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: { message: 'Name is required' } });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: { message: 'Email is required' } });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check email uniqueness if email changed
  if (normalizedEmail !== req.user.email) {
    const existing = getQuery('SELECT id FROM users WHERE email = ? AND id != ?', [normalizedEmail, userId]);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email is already in use by another account' },
      });
    }
  }

  runQuery('UPDATE users SET name = ?, email = ? WHERE id = ?', [name.trim(), normalizedEmail, userId]);

  const updatedUser = getQuery('SELECT id, name, email, created_at FROM users WHERE id = ?', [userId]);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser,
    },
  });
};

/**
 * PUT /api/auth/change-password
 * Changes logged-in user's password.
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: { message: 'Please provide current and new password' },
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: { message: 'New password must be at least 6 characters long' },
    });
  }

  // Get full user with password
  const user = getQuery('SELECT * FROM users WHERE id = ?', [userId]);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      error: { message: 'Current password is incorrect' },
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  runQuery('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
};
