const bcrypt = require('bcrypt');

const { database } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/api-response');

async function updateAdminProfile(req, res) {
  try {
    const userId = req.user?.id;
    const { full_name, email, phone_number } = req.body;

    if (!full_name || !email) {
      return errorResponse(res, 'Full name and email are required', 400);
    }

    await database.query(
      `
      UPDATE users
      SET
        full_name = ?,
        email = ?,
        phone_number = ?
      WHERE id = ?
      `,
      [
        full_name,
        email,
        phone_number || null,
        userId
      ]
    );

    const [users] = await database.query(
      `
      SELECT
        u.id,
        u.role_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.status,
        r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      LIMIT 1
      `,
      [userId]
    );

    return successResponse(res, 'Admin profile updated successfully', {
      user: users[0]
    });
  } catch (error) {
    console.error('updateAdminProfile error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return errorResponse(res, 'Email already exists. Please use another email.', 409);
    }

    return errorResponse(res, 'Failed to update admin profile');
  }
}

async function changeAdminPassword(req, res) {
  try {
    const userId = req.user?.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return errorResponse(res, 'Current password and new password are required', 400);
    }

    if (new_password.length < 8) {
      return errorResponse(res, 'New password must be at least 8 characters', 400);
    }

    const [users] = await database.query(
      `
      SELECT id, password_hash
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (users.length === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    const isMatch = await bcrypt.compare(current_password, users[0].password_hash);

    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);

    await database.query(
      `
      UPDATE users
      SET password_hash = ?
      WHERE id = ?
      `,
      [hashedPassword, userId]
    );

    return successResponse(res, 'Password updated successfully', {
      updated: true
    });
  } catch (error) {
    console.error('changeAdminPassword error:', error);
    return errorResponse(res, 'Failed to change password');
  }
}

async function createAdminAccount(req, res) {
  try {
    const currentUserRole = req.user?.role_name;
    const {
      full_name,
      email,
      phone_number,
      password,
      role_name
    } = req.body;

    if (!full_name || !email || !password) {
      return errorResponse(res, 'Full name, email, and password are required', 400);
    }

    if (password.length < 8) {
      return errorResponse(res, 'Password must be at least 8 characters', 400);
    }

    const targetRole = role_name || 'admin';

    if (!['admin', 'super_admin'].includes(targetRole)) {
      return errorResponse(res, 'Invalid admin role', 400);
    }

    if (targetRole === 'super_admin' && currentUserRole !== 'super_admin') {
      return errorResponse(res, 'Only super admin can create another super admin', 403);
    }

    const [roles] = await database.query(
      `
      SELECT id, role_name
      FROM roles
      WHERE role_name = ?
      LIMIT 1
      `,
      [targetRole]
    );

    if (roles.length === 0) {
      return errorResponse(res, 'Selected role does not exist in roles table', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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
        hashedPassword,
        'active'
      ]
    );

    const [createdUsers] = await database.query(
      `
      SELECT
        u.id,
        u.role_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.status,
        r.role_name,
        u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      LIMIT 1
      `,
      [result.insertId]
    );

    return successResponse(
      res,
      'Admin account created successfully',
      createdUsers[0],
      201
    );
  } catch (error) {
    console.error('createAdminAccount error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return errorResponse(res, 'Email already exists. Please use another email.', 409);
    }

    return errorResponse(res, 'Failed to create admin account');
  }
}

module.exports = {
  updateAdminProfile,
  changeAdminPassword,
  createAdminAccount
};