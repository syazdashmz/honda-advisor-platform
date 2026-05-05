const express = require('express');

const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
} = require('../controllers/appointments.controller');

const router = express.Router();

router.post('/', createAppointment);
router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/status', updateAppointmentStatus);

module.exports = router;