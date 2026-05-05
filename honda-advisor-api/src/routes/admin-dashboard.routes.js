const express = require('express');

const {
  getAdminDashboardSummary,
} = require('../controllers/admin-dashboard.controller');

const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.get(
  '/',
  protect,
  allowRoles('admin', 'super_admin'),
  getAdminDashboardSummary
);

module.exports = router;