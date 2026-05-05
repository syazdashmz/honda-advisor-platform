const { database } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/api-response');

async function getAdminDashboardSummary(req, res) {
  try {
    const [[totalInquiries]] = await database.query(`
      SELECT COUNT(*) AS count
      FROM inquiries
    `);

    const [[newLeadsToday]] = await database.query(`
      SELECT COUNT(*) AS count
      FROM inquiries
      WHERE DATE(created_at) = CURDATE()
    `);

    const [[appointmentsThisWeek]] = await database.query(`
      SELECT COUNT(*) AS count
      FROM appointments
      WHERE YEARWEEK(preferred_date, 1) = YEARWEEK(CURDATE(), 1)
    `);

    const [[loanCalculationsUsed]] = await database.query(`
      SELECT COUNT(*) AS count
      FROM loan_calculations
    `);

    const [[galleryStories]] = await database.query(`
      SELECT COUNT(*) AS count
      FROM customer_gallery
    `);

    const [[mostRequestedModel]] = await database.query(`
      SELECT
        cm.name AS model_name,
        COUNT(i.id) AS inquiry_count
      FROM inquiries i
      LEFT JOIN car_models cm ON i.car_model_id = cm.id
      WHERE i.car_model_id IS NOT NULL
      GROUP BY cm.id, cm.name
      ORDER BY inquiry_count DESC
      LIMIT 1
    `);

    const [leadStatusBreakdown] = await database.query(`
      SELECT
        status,
        COUNT(*) AS count
      FROM inquiries
      GROUP BY status
      ORDER BY count DESC
    `);

    const [recentInquiries] = await database.query(`
      SELECT
        i.id,
        i.full_name,
        i.phone_number,
        i.status,
        i.lead_source,
        i.created_at,
        cm.name AS car_model_name
      FROM inquiries i
      LEFT JOIN car_models cm ON i.car_model_id = cm.id
      ORDER BY i.created_at DESC
      LIMIT 5
    `);

    const [upcomingAppointments] = await database.query(`
      SELECT
        a.id,
        a.full_name,
        a.phone_number,
        a.appointment_type,
        a.preferred_date,
        a.preferred_time,
        a.status,
        cm.name AS car_model_name
      FROM appointments a
      LEFT JOIN car_models cm ON a.car_model_id = cm.id
      WHERE a.preferred_date >= CURDATE()
      ORDER BY a.preferred_date ASC, a.preferred_time ASC
      LIMIT 5
    `);

    return successResponse(res, 'Admin dashboard summary fetched successfully', {
      metrics: {
        total_inquiries: totalInquiries.count,
        new_leads_today: newLeadsToday.count,
        appointments_this_week: appointmentsThisWeek.count,
        loan_calculations_used: loanCalculationsUsed.count,
        gallery_stories: galleryStories.count,
        most_requested_model: mostRequestedModel?.model_name || 'No data yet',
        most_requested_model_count: mostRequestedModel?.inquiry_count || 0,
      },
      lead_status_breakdown: leadStatusBreakdown,
      recent_inquiries: recentInquiries,
      upcoming_appointments: upcomingAppointments,
    });
  } catch (error) {
    console.error('getAdminDashboardSummary error:', error);
    return errorResponse(res, 'Failed to fetch admin dashboard summary');
  }
}

module.exports = {
  getAdminDashboardSummary,
};