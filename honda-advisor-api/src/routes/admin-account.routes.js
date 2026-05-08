const express = require('express');

const {
  updateAdminProfile,
  changeAdminPassword,
  createAdminAccount
} = require('../controllers/admin-account.controller');

const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);
router.use(allowRoles('admin', 'super_admin'));

router.put('/profile', updateAdminProfile);
router.put('/password', changeAdminPassword);
router.post('/admins', createAdminAccount);

module.exports = router;