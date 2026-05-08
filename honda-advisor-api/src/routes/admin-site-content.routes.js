const express = require('express');

const {
  getAdminHomeContent,
  updateHomeContent,
} = require('../controllers/site-content.controller');

const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);
router.use(allowRoles('admin', 'super_admin'));

router.get('/home', getAdminHomeContent);
router.put('/home', updateHomeContent);

module.exports = router;    