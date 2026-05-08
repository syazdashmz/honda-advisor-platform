    const express = require('express');

const {
  getAdminCars,
  getAdminCarById,
  updateCarModel,
  updateCarVariant,
} = require('../controllers/admin-cars.controller');

const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.use(protect);
router.use(allowRoles('admin', 'super_admin'));

router.get('/', getAdminCars);
router.get('/:id', getAdminCarById);
router.put('/:id', updateCarModel);
router.put('/:carId/variants/:variantId', updateCarVariant);

module.exports = router;