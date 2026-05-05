const express = require('express');
const {
  getAllCars,
  getCarBySlug,
} = require('../controllers/cars.controller');

const router = express.Router();

router.get('/', getAllCars);
router.get('/:slug', getCarBySlug);

module.exports = router;