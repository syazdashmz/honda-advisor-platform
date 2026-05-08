const { database } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/api-response');

const fallbackHomeContent = {
  id: null,
  hero_badge: 'Trusted Honda Advisor',
  hero_title: 'Meet your personal Honda sales advisor',
  hero_subtitle:
    'Serving Honda customers since 2002 at Tenaga Setia Resources Sdn. Bhd. with personal guidance from inquiry to delivery.',
  hero_image_url: '',
  primary_cta_label: 'View Honda Models',
  primary_cta_link: '/cars',
  secondary_cta_label: 'Calculate Loan',
  secondary_cta_link: '/loan-calculator',
  advisor_title: 'Serving Honda customers since 2002',
  advisor_text:
    'This platform helps customers explore models, estimate monthly payment, submit inquiries, and arrange appointments.',
  advisor_image_url: '',
  announcement_text: 'Sample homepage content. Admin can update this from the admin panel.',
  is_active: true,
};

async function getPublicHomeContent(req, res) {
  try {
    const [rows] = await database.query(`
      SELECT
        id,
        hero_badge,
        hero_title,
        hero_subtitle,
        hero_image_url,
        primary_cta_label,
        primary_cta_link,
        secondary_cta_label,
        secondary_cta_link,
        advisor_title,
        advisor_text,
        advisor_image_url,
        announcement_text,
        is_active,
        created_at,
        updated_at
      FROM site_home_content
      WHERE is_active = TRUE
      ORDER BY id DESC
      LIMIT 1
    `);

    return successResponse(
      res,
      'Homepage content fetched successfully',
      rows[0] || fallbackHomeContent
    );
  } catch (error) {
    console.error('getPublicHomeContent error:', error);
    return errorResponse(res, 'Failed to fetch homepage content');
  }
}

async function getAdminHomeContent(req, res) {
  try {
    const [rows] = await database.query(`
      SELECT
        id,
        hero_badge,
        hero_title,
        hero_subtitle,
        hero_image_url,
        primary_cta_label,
        primary_cta_link,
        secondary_cta_label,
        secondary_cta_link,
        advisor_title,
        advisor_text,
        advisor_image_url,
        announcement_text,
        is_active,
        updated_by,
        created_at,
        updated_at
      FROM site_home_content
      ORDER BY id DESC
      LIMIT 1
    `);

    return successResponse(
      res,
      'Admin homepage content fetched successfully',
      rows[0] || fallbackHomeContent
    );
  } catch (error) {
    console.error('getAdminHomeContent error:', error);
    return errorResponse(res, 'Failed to fetch admin homepage content');
  }
}

async function updateHomeContent(req, res) {
  try {
    const userId = req.user?.id || null;

    const {
      hero_badge,
      hero_title,
      hero_subtitle,
      hero_image_url,
      primary_cta_label,
      primary_cta_link,
      secondary_cta_label,
      secondary_cta_link,
      advisor_title,
      advisor_text,
      advisor_image_url,
      announcement_text,
      is_active,
    } = req.body;

    if (!hero_title || !hero_subtitle || !advisor_title || !advisor_text) {
      return errorResponse(
        res,
        'Hero title, hero subtitle, advisor title, and advisor text are required',
        400
      );
    }

    const [existingRows] = await database.query(`
      SELECT id
      FROM site_home_content
      ORDER BY id DESC
      LIMIT 1
    `);

    if (existingRows.length === 0) {
      const [result] = await database.query(
        `
        INSERT INTO site_home_content (
          hero_badge,
          hero_title,
          hero_subtitle,
          hero_image_url,
          primary_cta_label,
          primary_cta_link,
          secondary_cta_label,
          secondary_cta_link,
          advisor_title,
          advisor_text,
          advisor_image_url,
          announcement_text,
          is_active,
          updated_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          hero_badge || 'Trusted Honda Advisor',
          hero_title,
          hero_subtitle,
          hero_image_url || '',
          primary_cta_label || 'View Honda Models',
          primary_cta_link || '/cars',
          secondary_cta_label || 'Calculate Loan',
          secondary_cta_link || '/loan-calculator',
          advisor_title,
          advisor_text,
          advisor_image_url || '',
          announcement_text || '',
          Boolean(is_active),
          userId,
        ]
      );

      const [createdRows] = await database.query(
        `
        SELECT *
        FROM site_home_content
        WHERE id = ?
        LIMIT 1
        `,
        [result.insertId]
      );

      return successResponse(
        res,
        'Homepage content created successfully',
        createdRows[0],
        201
      );
    }

    const contentId = existingRows[0].id;

    await database.query(
      `
      UPDATE site_home_content
      SET
        hero_badge = ?,
        hero_title = ?,
        hero_subtitle = ?,
        hero_image_url = ?,
        primary_cta_label = ?,
        primary_cta_link = ?,
        secondary_cta_label = ?,
        secondary_cta_link = ?,
        advisor_title = ?,
        advisor_text = ?,
        advisor_image_url = ?,
        announcement_text = ?,
        is_active = ?,
        updated_by = ?
      WHERE id = ?
      `,
      [
        hero_badge || 'Trusted Honda Advisor',
        hero_title,
        hero_subtitle,
        hero_image_url || '',
        primary_cta_label || 'View Honda Models',
        primary_cta_link || '/cars',
        secondary_cta_label || 'Calculate Loan',
        secondary_cta_link || '/loan-calculator',
        advisor_title,
        advisor_text,
        advisor_image_url || '',
        announcement_text || '',
        Boolean(is_active),
        userId,
        contentId,
      ]
    );

    const [updatedRows] = await database.query(
      `
      SELECT *
      FROM site_home_content
      WHERE id = ?
      LIMIT 1
      `,
      [contentId]
    );

    return successResponse(
      res,
      'Homepage content updated successfully',
      updatedRows[0]
    );
  } catch (error) {
    console.error('updateHomeContent error:', error);
    return errorResponse(res, 'Failed to update homepage content');
  }
}

module.exports = {
  getPublicHomeContent,
  getAdminHomeContent,
  updateHomeContent,
};