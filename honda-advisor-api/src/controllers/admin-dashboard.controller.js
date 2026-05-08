const { database } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/api-response');

async function getAdminDashboard(req, res) {
  try {
    const [[inquiryCount]] = await database.query(`
      SELECT COUNT(*) AS total FROM inquiries
    `);

    const [[appointmentCount]] = await database.query(`
      SELECT COUNT(*) AS total FROM appointments
    `);

    const [[pendingAppointmentCount]] = await database.query(`
      SELECT COUNT(*) AS total FROM appointments WHERE status = 'pending'
    `);

    const [[carModelCount]] = await database.query(`
      SELECT COUNT(*) AS total FROM car_models WHERE is_active = TRUE
    `);

    const [[loanCalculationCount]] = await database.query(`
      SELECT COUNT(*) AS total FROM loan_calculations
    `);

    const [recentInquiries] = await database.query(`
      SELECT
        i.id,
        i.full_name,
        i.phone_number,
        i.email,
        i.budget_range,
        i.monthly_budget,
        i.buying_timeline,
        i.preferred_contact_method,
        i.status,
        i.created_at,
        cm.name AS car_model_name
      FROM inquiries i
      LEFT JOIN car_models cm ON i.car_model_id = cm.id
      ORDER BY i.created_at DESC
      LIMIT 6
    `);

    const [recentAppointments] = await database.query(`
      SELECT
        a.id,
        a.full_name,
        a.phone_number,
        a.email,
        a.appointment_type,
        a.preferred_date,
        a.preferred_time,
        a.status,
        a.created_at,
        cm.name AS car_model_name
      FROM appointments a
      LEFT JOIN car_models cm ON a.car_model_id = cm.id
      ORDER BY a.created_at DESC
      LIMIT 6
    `);

    return successResponse(res, 'Admin dashboard fetched successfully', {
      summary: {
        total_inquiries: Number(inquiryCount.total || 0),
        total_appointments: Number(appointmentCount.total || 0),
        pending_appointments: Number(pendingAppointmentCount.total || 0),
        active_car_models: Number(carModelCount.total || 0),
        total_loan_calculations: Number(loanCalculationCount.total || 0)
      },
      recent_inquiries: recentInquiries,
      recent_appointments: recentAppointments
    });
  } catch (error) {
    console.error('getAdminDashboard error:', error);
    return errorResponse(res, 'Failed to fetch admin dashboard');
  }
}

module.exports = {
  getAdminDashboard
};