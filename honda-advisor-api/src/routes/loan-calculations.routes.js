const express = require('express');

const {
  calculateLoan,
  saveLoanCalculation,
  getAllLoanCalculations,
} = require('../controllers/loan-calculations.controller');

const router = express.Router();

router.post('/calculate', calculateLoan);
router.post('/', saveLoanCalculation);
router.get('/', getAllLoanCalculations);

module.exports = router;