const express = require('express');

const {
  calculateLoan,
  saveLoanCalculation,
  getMyLoanCalculations,
  getAllLoanCalculations,
} = require('../controllers/loan-calculations.controller');

const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/calculate', calculateLoan);
router.post('/', protect, saveLoanCalculation);
router.get('/my', protect, getMyLoanCalculations);
router.get(
  '/',
  protect,
  allowRoles('admin', 'super_admin'),
  getAllLoanCalculations
);

module.exports = router;
