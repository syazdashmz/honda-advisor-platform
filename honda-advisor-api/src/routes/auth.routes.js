const express = require('express');

const {
  register,
  login,
  getProfile,
  updateProfile,
  createDevAdmin,
} = require('../controllers/auth.controller');

const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);

// Local development only
router.post('/dev-create-admin', createDevAdmin);

module.exports = router;