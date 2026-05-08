const express = require('express');

const {
  createAppointment,
  getAppointmentAvailability,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
} = require('../controllers/appointments.controller');

const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/availability', getAppointmentAvailability);

router.post('/', protect, createAppointment);

router.get('/my', protect, getMyAppointments);

router.get(
  '/',
  protect,
  allowRoles('admin', 'super_admin'),
  getAllAppointments
);

router.get(
  '/:id',
  protect,
  getAppointmentById
);

router.put(
  '/:id/status',
  protect,
  allowRoles('admin', 'super_admin'),
  updateAppointmentStatus
);

module.exports = router;