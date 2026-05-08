const { database } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/api-response');

const allowedAppointmentTypes = [
  'showroom_visit',
  'test_drive',
  'loan_consultation',
  'trade_in_valuation',
  'model_comparison',
  'delivery_discussion',
];

const allowedStatuses = [
  'pending',
  'confirmed',
  'declined',
  'cancelled',
  'completed',
  'rescheduled',
];

function normalizeStatus(status) {
  if (status === 'accepted') {
    return 'confirmed';
  }

  return status;
}

async function hasConfirmedSlot(preferredDate, preferredTime, excludeAppointmentId = null) {
  const params = [preferredDate, preferredTime];

  let query = `
    SELECT id
    FROM appointments
    WHERE preferred_date = ?
    AND preferred_time = ?
    AND status = 'confirmed'
  `;

  if (excludeAppointmentId) {
    query += ` AND id <> ?`;
    params.push(excludeAppointmentId);
  }

  query += ` LIMIT 1`;

  const [rows] = await database.query(query, params);

  return rows.length > 0;
}

async function getAppointmentAvailability(req, res) {
  try {
    const { date } = req.query;

    if (!date) {
      return errorResponse(res, 'Date is required', 400);
    }

    const [bookedSlots] = await database.query(
      `
      SELECT preferred_time
      FROM appointments
      WHERE preferred_date = ?
      AND status = 'confirmed'
      ORDER BY preferred_time ASC
      `,
      [date]
    );

    return successResponse(res, 'Appointment availability fetched successfully', {
      date,
      unavailable_slots: bookedSlots.map((slot) => slot.preferred_time),
    });
  } catch (error) {
    console.error('getAppointmentAvailability error:', error);
    return errorResponse(res, 'Failed to fetch appointment availability');
  }
}

async function createAppointment(req, res) {
  try {
    const userId = req.user?.id || null;

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

    if (!userId) {
      return errorResponse(res, 'Please login before booking an appointment', 401);
    }

    if (!full_name || !phone_number || !appointment_type || !preferred_date || !preferred_time) {
      return errorResponse(
        res,
        'Full name, phone number, appointment type, preferred date, and preferred time are required',
        400
      );
    }

    if (!allowedAppointmentTypes.includes(appointment_type)) {
      return errorResponse(res, 'Invalid appointment type', 400, {
        allowedAppointmentTypes,
      });
    }

    const selectedDate = new Date(`${preferred_date}T00:00:00`);
const today = new Date();
today.setHours(0, 0, 0, 0);

const maxDate = new Date(today);
maxDate.setMonth(maxDate.getMonth() + 1);

if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
  return errorResponse(res, 'Preferred date cannot be in the past', 400);
}

if (selectedDate > maxDate) {
  return errorResponse(
    res,
    'Appointments can only be requested within 1 month from today',
    400
  );
}

  const currentDateString = today.toISOString().split('T')[0];
  const currentTimeString = new Date().toTimeString().slice(0, 8);

  if (preferred_date === currentDateString && preferred_time <= currentTimeString) {
    return errorResponse(
      res,
      'This appointment time has already passed for today. Please choose another time.',
      400
    );
}

    const slotAlreadyConfirmed = await hasConfirmedSlot(preferred_date, preferred_time);

    if (slotAlreadyConfirmed) {
      return errorResponse(
        res,
        'This appointment slot is already confirmed. Please choose another date or time.',
        409
      );
    }

    const [result] = await database.query(
      `
      INSERT INTO appointments (
        user_id,
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
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

    if (error.code === 'ER_DUP_ENTRY') {
      return errorResponse(
        res,
        'This appointment slot has already been confirmed. Please choose another slot.',
        409
      );
    }

    return errorResponse(res, 'Failed to submit appointment request');
  }
}

async function getMyAppointments(req, res) {
  try {
    const userId = req.user?.id;

    const [appointments] = await database.query(
      `
      SELECT
        a.id,
        a.user_id,
        a.inquiry_id,
        a.car_model_id,
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
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
      `,
      [userId]
    );

    return successResponse(res, 'Customer appointments fetched successfully', appointments);
  } catch (error) {
    console.error('getMyAppointments error:', error);
    return errorResponse(res, 'Failed to fetch customer appointments');
  }
}

async function getAllAppointments(req, res) {
  try {
    const [appointments] = await database.query(`
      SELECT
        a.id,
        a.user_id,
        a.inquiry_id,
        a.car_model_id,
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
        cm.slug AS car_model_slug,
        u.full_name AS customer_name,
        u.email AS customer_email
      FROM appointments a
      LEFT JOIN car_models cm ON a.car_model_id = cm.id
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY
        CASE
          WHEN a.status = 'pending' THEN 1
          WHEN a.status = 'confirmed' THEN 2
          ELSE 3
        END,
        a.preferred_date ASC,
        a.preferred_time ASC
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
    const requestedStatus = normalizeStatus(req.body.status);

    if (!allowedStatuses.includes(requestedStatus)) {
      return errorResponse(res, 'Invalid appointment status', 400, {
        allowedStatuses,
      });
    }

    const [appointments] = await database.query(
      `
      SELECT id, preferred_date, preferred_time, status
      FROM appointments
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (appointments.length === 0) {
      return errorResponse(res, 'Appointment not found', 404);
    }

    const appointment = appointments[0];

    if (requestedStatus === 'confirmed') {
      const slotAlreadyConfirmed = await hasConfirmedSlot(
        appointment.preferred_date,
        appointment.preferred_time,
        appointment.id
      );

      if (slotAlreadyConfirmed) {
        return errorResponse(
          res,
          'Cannot confirm this appointment because another appointment is already confirmed for the same date and time.',
          409
        );
      }
    }

    await database.query(
      `
      UPDATE appointments
      SET status = ?
      WHERE id = ?
      `,
      [requestedStatus, id]
    );

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
      `Appointment ${requestedStatus} successfully`,
      updatedAppointment[0]
    );
  } catch (error) {
    console.error('updateAppointmentStatus error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return errorResponse(
        res,
        'Cannot confirm this appointment because this date and time is already confirmed.',
        409
      );
    }

    return errorResponse(res, 'Failed to update appointment status');
  }
}

module.exports = {
  createAppointment,
  getAppointmentAvailability,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
};