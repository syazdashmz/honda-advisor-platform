const { database } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/api-response');

const allowedInquiryStatuses = [
  'new',
  'contacted',
  'interested',
  'appointment_booked',
  'loan_processing',
  'won',
  'lost',
];

const allowedContactMethods = [
  'whatsapp',
  'phone_call',
  'email',
];

async function createInquiry(req, res) {
  try {
    const {
      car_model_id,
      full_name,
      phone_number,
      email,
      budget_range,
      monthly_budget,
      buying_timeline,
      needs_loan,
      has_trade_in,
      preferred_contact_method,
      message,
      privacy_consent,
      lead_source,
    } = req.body;

    if (!full_name || !phone_number || !preferred_contact_method) {
      return errorResponse(
        res,
        'Full name, phone number, and preferred contact method are required',
        400
      );
    }

    if (!privacy_consent) {
      return errorResponse(
        res,
        'Privacy consent is required before submitting inquiry',
        400
      );
    }

    if (!allowedContactMethods.includes(preferred_contact_method)) {
      return errorResponse(res, 'Invalid preferred contact method', 400, {
        allowedContactMethods,
      });
    }

    const [result] = await database.query(
      `
      INSERT INTO inquiries (
        car_model_id,
        full_name,
        phone_number,
        email,
        budget_range,
        monthly_budget,
        buying_timeline,
        needs_loan,
        has_trade_in,
        preferred_contact_method,
        message,
        privacy_consent,
        lead_source,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        car_model_id || null,
        full_name,
        phone_number,
        email || null,
        budget_range || null,
        monthly_budget || null,
        buying_timeline || null,
        Boolean(needs_loan),
        Boolean(has_trade_in),
        preferred_contact_method,
        message || null,
        Boolean(privacy_consent),
        lead_source || 'website_inquiry_page',
        'new',
      ]
    );

    const [createdInquiry] = await database.query(
      `
      SELECT
        i.*,
        cm.name AS car_model_name,
        cm.slug AS car_model_slug
      FROM inquiries i
      LEFT JOIN car_models cm ON i.car_model_id = cm.id
      WHERE i.id = ?
      LIMIT 1
      `,
      [result.insertId]
    );

    return successResponse(
      res,
      'Inquiry submitted successfully',
      createdInquiry[0],
      201
    );
  } catch (error) {
    console.error('createInquiry error:', error);
    return errorResponse(res, 'Failed to submit inquiry');
  }
}

async function getAllInquiries(req, res) {
  try {
    const [inquiries] = await database.query(`
      SELECT
        i.id,
        i.car_model_id,
        i.full_name,
        i.phone_number,
        i.email,
        i.budget_range,
        i.monthly_budget,
        i.buying_timeline,
        i.needs_loan,
        i.has_trade_in,
        i.preferred_contact_method,
        i.message,
        i.privacy_consent,
        i.lead_source,
        i.status,
        i.created_at,
        i.updated_at,
        cm.name AS car_model_name,
        cm.slug AS car_model_slug
      FROM inquiries i
      LEFT JOIN car_models cm ON i.car_model_id = cm.id
      ORDER BY
        CASE
          WHEN i.status = 'new' THEN 1
          WHEN i.status = 'contacted' THEN 2
          WHEN i.status = 'interested' THEN 3
          WHEN i.status = 'appointment_booked' THEN 4
          WHEN i.status = 'loan_processing' THEN 5
          WHEN i.status = 'won' THEN 6
          ELSE 7
        END,
        i.created_at DESC
    `);

    return successResponse(res, 'Inquiries fetched successfully', inquiries);
  } catch (error) {
    console.error('getAllInquiries error:', error);
    return errorResponse(res, 'Failed to fetch inquiries');
  }
}

async function getInquiryById(req, res) {
  try {
    const { id } = req.params;

    const [inquiries] = await database.query(
      `
      SELECT
        i.*,
        cm.name AS car_model_name,
        cm.slug AS car_model_slug
      FROM inquiries i
      LEFT JOIN car_models cm ON i.car_model_id = cm.id
      WHERE i.id = ?
      LIMIT 1
      `,
      [id]
    );

    if (inquiries.length === 0) {
      return errorResponse(res, 'Inquiry not found', 404);
    }

    return successResponse(
      res,
      'Inquiry details fetched successfully',
      inquiries[0]
    );
  } catch (error) {
    console.error('getInquiryById error:', error);
    return errorResponse(res, 'Failed to fetch inquiry details');
  }
}

async function updateInquiryStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!allowedInquiryStatuses.includes(status)) {
      return errorResponse(res, 'Invalid inquiry status', 400, {
        allowedInquiryStatuses,
      });
    }

    const [result] = await database.query(
      `
      UPDATE inquiries
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Inquiry not found', 404);
    }

    const [updatedInquiry] = await database.query(
      `
      SELECT
        i.*,
        cm.name AS car_model_name,
        cm.slug AS car_model_slug
      FROM inquiries i
      LEFT JOIN car_models cm ON i.car_model_id = cm.id
      WHERE i.id = ?
      LIMIT 1
      `,
      [id]
    );

    return successResponse(
      res,
      'Inquiry status updated successfully',
      updatedInquiry[0]
    );
  } catch (error) {
    console.error('updateInquiryStatus error:', error);
    return errorResponse(res, 'Failed to update inquiry status');
  }
}

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
};