const bcrypt = require('bcrypt');
const { database } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/api-response');
const { generateToken } = require('../utils/generate-token');

function sanitizeUser(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone_number: user.phone_number,
    status: user.status,
    role_name: user.role_name,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

async function register(req, res) {
  try {
    const {
      full_name,
      email,
      phone_number,
      password,
    } = req.body;

    if (!full_name || !email || !password) {
      return errorResponse(res, 'Full name, email, and password are required', 400);
    }

    if (password.length < 8) {
      return errorResponse(res, 'Password must be at least 8 characters long', 400);
    }

    const [existingUsers] = await database.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (existingUsers.length > 0) {
      return errorResponse(res, 'Email is already registered', 409);
    }

    const [roles] = await database.query(
      `
      SELECT id
      FROM roles
      WHERE name = 'customer'
      LIMIT 1
      `
    );

    if (roles.length === 0) {
      return errorResponse(res, 'Customer role is missing in database', 500);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await database.query(
      `
      INSERT INTO users (
        role_id,
        full_name,
        email,
        phone_number,
        password_hash,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        roles[0].id,
        full_name,
        email,
        phone_number || null,
        passwordHash,
        'active',
      ]
    );

    const [createdUsers] = await database.query(
      `
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.phone_number,
        u.status,
        u.created_at,
        u.updated_at,
        r.name AS role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      LIMIT 1
      `,
      [result.insertId]
    );

    const user = createdUsers[0];
    const token = generateToken(user);

    return successResponse(
      res,
      'Customer account registered successfully',
      {
        user: sanitizeUser(user),
        token,
      },
      201
    );
  } catch (error) {
    console.error('register error:', error);
    return errorResponse(res, 'Failed to register account');
  }
}

async function login(req, res) {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const [users] = await database.query(
      `
      SELECT
        u.id,
        u.role_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.password_hash,
        u.status,
        u.created_at,
        u.updated_at,
        r.name AS role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
      LIMIT 1
      `,
      [email]
    );

    if (users.length === 0) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const user = users[0];

    if (user.status !== 'active') {
      return errorResponse(res, 'User account is not active', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    await database.query(
      `
      UPDATE users
      SET last_login_at = NOW()
      WHERE id = ?
      `,
      [user.id]
    );

    const token = generateToken(user);

    return successResponse(res, 'Login successful', {
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.error('login error:', error);
    return errorResponse(res, 'Failed to login');
  }
}

async function getProfile(req, res) {
  try {
    return successResponse(res, 'Profile fetched successfully', {
      user: req.user,
    });
  } catch (error) {
    console.error('getProfile error:', error);
    return errorResponse(res, 'Failed to fetch profile');
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    const { full_name, phone_number } = req.body;

    if (!full_name || full_name.trim().length < 2) {
      return errorResponse(res, 'Full name must be at least 2 characters', 400);
    }

    await database.query(
      `
      UPDATE users
      SET full_name = ?, phone_number = ?
      WHERE id = ?
      `,
      [full_name.trim(), phone_number?.trim() || null, userId]
    );

    const [updatedUsers] = await database.query(
      `
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.phone_number,
        u.status,
        u.created_at,
        u.updated_at,
        r.name AS role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      LIMIT 1
      `,
      [userId]
    );

    return successResponse(res, 'Profile updated successfully', {
      user: sanitizeUser(updatedUsers[0]),
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    return errorResponse(res, 'Failed to update profile');
  }
}

/**
 * Development-only admin creator.
 * Use only locally so you can create your first admin account.
 * Disable/remove before production deployment.
 */
async function createDevAdmin(req, res) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return errorResponse(res, 'This route is disabled in production', 403);
    }

    const {
      full_name,
      email,
      phone_number,
      password,
    } = req.body;

    if (!full_name || !email || !password) {
      return errorResponse(res, 'Full name, email, and password are required', 400);
    }

    if (password.length < 8) {
      return errorResponse(res, 'Password must be at least 8 characters long', 400);
    }

    const [existingUsers] = await database.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (existingUsers.length > 0) {
      return errorResponse(res, 'Email is already registered', 409);
    }

    const [roles] = await database.query(
      `
      SELECT id
      FROM roles
      WHERE name = 'admin'
      LIMIT 1
      `
    );

    if (roles.length === 0) {
      return errorResponse(res, 'Admin role is missing in database', 500);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await database.query(
      `
      INSERT INTO users (
        role_id,
        full_name,
        email,
        phone_number,
        password_hash,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        roles[0].id,
        full_name,
        email,
        phone_number || null,
        passwordHash,
        'active',
      ]
    );

    const [createdUsers] = await database.query(
      `
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.phone_number,
        u.status,
        u.created_at,
        u.updated_at,
        r.name AS role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      LIMIT 1
      `,
      [result.insertId]
    );

    const user = createdUsers[0];
    const token = generateToken(user);

    return successResponse(
      res,
      'Development admin account created successfully',
      {
        user: sanitizeUser(user),
        token,
      },
      201
    );
  } catch (error) {
    console.error('createDevAdmin error:', error);
    return errorResponse(res, 'Failed to create development admin account');
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  createDevAdmin,
};