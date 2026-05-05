const express = require('express');

const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
} = require('../controllers/inquiries.controller');

const router = express.Router();

router.post('/', createInquiry);
router.get('/', getAllInquiries);
router.get('/:id', getInquiryById);
router.put('/:id/status', updateInquiryStatus);

module.exports = router;