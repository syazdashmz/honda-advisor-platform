const { database } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/api-response');

async function createAppointment(req, res) {
  try {
    const {
      inquiry_id,
      car_model_id,
      full_name,
      phone_number,
      email,
      appointment_type,
      preferred_date,
      preferred_time,
      message,
    } = req.body;

    if (!full_name || !phone_number || !appointment_type || !preferred_date || !preferred_time) {
      return errorResponse(
        res,
        'Full name, phone number, appointment type, preferred date, and preferred time are required',
        400
      );
    }

    const allowedTypes = [
      'showroom_visit',
      'test_drive',
      'loan_consultation',
      'trade_in_valuation',
      'model_comparison',
      'delivery_discussion',
    ];

    if (!allowedTypes.includes(appointment_type)) {
      return errorResponse(res, 'Invalid appointment type', 400, {
        allowedTypes,
      });
    }

    const [result] = await database.query(
      `
      INSERT INTO appointments (
        inquiry_id,
        car_model_id,
        full_name,
        phone_number,
        email,
        appointment_type,
        preferred_date,
        preferred_time,
        message,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        inquiry_id || null,
        car_model_id || null,
        full_name,
        phone_number,
        email || null,
        appointment_type,
        preferred_date,
        preferred_time,
        message || null,
        'pending',
      ]
    );

    const [createdAppointment] = await database.query(
      `
      SELECT
        a.*,
        cm.name AS car_model_name,
        cm.slug AS car_model_slug
      FROM appointments a
      LEFT JOIN car_models cm ON a.car_model_id = cm.id
      WHERE a.id = ?
      `,
      [result.insertId]
    );

    return successResponse(
      res,
      'Appointment request submitted successfully',
      createdAppointment[0],
      201
    );
  } catch (error) {
    console.error('createAppointment error:', error);
    return errorResponse(res, 'Failed to submit appointment request');
  }
}

async function getAllAppointments(req, res) {
  try {
    const [appointments] = await database.query(`
      SELECT
        a.id,
        a.full_name,
        a.phone_number,
        a.email,
        a.appointment_type,
        a.preferred_date,
        a.preferred_time,
        a.message,
        a.status,
        a.created_at,
        a.updated_at,
        cm.name AS car_model_name,
        cm.slug AS car_model_slug
      FROM appointments a
      LEFT JOIN car_models cm ON a.car_model_id = cm.id
      ORDER BY a.preferred_date ASC, a.preferred_time ASC
    `);

    return successResponse(res, 'Appointments fetched successfully', appointments);
  } catch (error) {
    console.error('getAllAppointments error:', error);
    return errorResponse(res, 'Failed to fetch appointments');
  }
}

async function getAppointmentById(req, res) {
  try {
    const { id } = req.params;

    const [appointments] = await database.query(
      `
      SELECT
        a.*,
        cm.name AS car_model_name,
        cm.slug AS car_model_slug
      FROM appointments a
      LEFT JOIN car_models cm ON a.car_model_id = cm.id
      WHERE a.id = ?
      LIMIT 1
      `,
      [id]
    );

    if (appointments.length === 0) {
      return errorResponse(res, 'Appointment not found', 404);
    }

    return successResponse(
      res,
      'Appointment details fetched successfully',
      appointments[0]
    );
  } catch (error) {
    console.error('getAppointmentById error:', error);
    return errorResponse(res, 'Failed to fetch appointment details');
  }
}

async function updateAppointmentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'pending',
      'confirmed',
      'completed',
      'cancelled',
      'rescheduled',
    ];

    if (!allowedStatuses.includes(status)) {
      return errorResponse(res, 'Invalid appointment status', 400, {
        allowedStatuses,
      });
    }

    const [result] = await database.query(
      `
      UPDATE appointments
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Appointment not found', 404);
    }

    const [updatedAppointment] = await database.query(
      `
      SELECT
        a.*,
        cm.name AS car_model_name,
        cm.slug AS car_model_slug
      FROM appointments a
      LEFT JOIN car_models cm ON a.car_model_id = cm.id
      WHERE a.id = ?
      `,
      [id]
    );

    return successResponse(
      res,
      'Appointment status updated successfully',
      updatedAppointment[0]
    );
  } catch (error) {
    console.error('updateAppointmentStatus error:', error);
    return errorResponse(res, 'Failed to update appointment status');
  }
}

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
};