const { errorResponse } = require('../utils/api-response');

function allowRoles(...allowedRoles) {
  return function roleMiddleware(req, res, next) {
    if (!req.user) {
      return errorResponse(res, 'Authenticated user is required', 401);
    }

    if (!allowedRoles.includes(req.user.role_name)) {
      return errorResponse(res, 'You do not have permission to access this resource', 403);
    }

    next();
  };
}

module.exports = {
  allowRoles,
};