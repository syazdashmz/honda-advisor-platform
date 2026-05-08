const express = require('express');

const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
} = require('../controllers/inquiries.controller');

const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/', createInquiry);

router.get(
  '/',
  protect,
  allowRoles('admin', 'super_admin'),
  getAllInquiries
);

router.get(
  '/:id',
  protect,
  allowRoles('admin', 'super_admin'),
  getInquiryById
);

router.put(
  '/:id/status',
  protect,
  allowRoles('admin', 'super_admin'),
  updateInquiryStatus
);

module.exports = router;