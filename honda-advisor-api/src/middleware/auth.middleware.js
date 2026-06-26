const jwt = require('jsonwebtoken');
const { database } = require('../config/db');
const { errorResponse } = require('../utils/api-response');

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token is required', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await database.query(
      `
      SELECT
        u.id,
        u.role_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.status,
        r.name AS role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      LIMIT 1
      `,
      [decoded.id]
    );

    if (users.length === 0) {
      return errorResponse(res, 'User not found', 401);
    }

    if (users[0].status !== 'active') {
      return errorResponse(res, 'User account is not active', 403);
    }

    req.user = users[0];

    next();
  } catch (error) {
    console.error('protect middleware error:', error.message);
    return errorResponse(res, 'Invalid or expired authentication token', 401);
  }
}

async function optionalProtect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await database.query(
      `
      SELECT
        u.id,
        u.role_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.status,
        r.name AS role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      LIMIT 1
      `,
      [decoded.id]
    );

    if (users.length > 0 && users[0].status === 'active') {
      req.user = users[0];
    }

    next();
  } catch {
    next();
  }
}

module.exports = {
  protect,
  optionalProtect,
};