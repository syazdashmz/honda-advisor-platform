const { database } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/api-response');

const fallbackHomeContent = {
  id: null,
  hero_badge: 'Trusted Honda Sales Advisor',
  hero_title: "Meet Pn. Fauziah, your personal Honda advisor",
  hero_subtitle:
    'A warm, experienced Honda sales advisor at Tenaga Setia Resources Sdn. Bhd. who guides customers clearly from model discovery to delivery day.',
  hero_image_url: '/images/home/home-showroom-01.webp',
  primary_cta_label: 'Compare Models',
  primary_cta_link: '/compare',
  secondary_cta_label: 'View Honda Models',
  secondary_cta_link: '/cars',
  advisor_title: 'Tenaga Setia Resources Honda showroom support',
  advisor_text:
    'Visit the showroom for model viewing, test-drive arrangement, loan discussion, and delivery coordination. Final stock, promotions, quotation, and color availability are confirmed personally during advisor follow-up.',
  advisor_image_url: '/images/advisor/advisor-profile.webp',
  announcement_text: 'Recognized for long-service excellence and trusted by loyal Honda customers across many years.',
  is_active: true,
};

function resolveHomeContent(content) {
  if (!content) {
    return fallbackHomeContent;
  }

  const isOldHero = content.hero_title === 'Meet your personal Honda sales advisor';
  const isOldAdvisor = content.advisor_title === 'Serving Honda customers since 2002';
  const isPlaceholderAnnouncement =
    !content.announcement_text ||
    content.announcement_text.includes('Sample homepage content') ||
    content.announcement_text.includes('Admin can update this from the admin panel');

  return {
    ...fallbackHomeContent,
    ...content,
    hero_badge: isOldHero
      ? fallbackHomeContent.hero_badge
      : content.hero_badge || fallbackHomeContent.hero_badge,
    hero_title: isOldHero
      ? fallbackHomeContent.hero_title
      : content.hero_title || fallbackHomeContent.hero_title,
    hero_subtitle: isOldHero
      ? fallbackHomeContent.hero_subtitle
      : content.hero_subtitle || fallbackHomeContent.hero_subtitle,
    primary_cta_label: isOldHero
      ? fallbackHomeContent.primary_cta_label
      : content.primary_cta_label || fallbackHomeContent.primary_cta_label,
    primary_cta_link: isOldHero
      ? fallbackHomeContent.primary_cta_link
      : content.primary_cta_link || fallbackHomeContent.primary_cta_link,
    secondary_cta_label: isOldHero
      ? fallbackHomeContent.secondary_cta_label
      : content.secondary_cta_label || fallbackHomeContent.secondary_cta_label,
    secondary_cta_link: isOldHero
      ? fallbackHomeContent.secondary_cta_link
      : content.secondary_cta_link || fallbackHomeContent.secondary_cta_link,
    advisor_title: isOldAdvisor
      ? fallbackHomeContent.advisor_title
      : content.advisor_title || fallbackHomeContent.advisor_title,
    advisor_text: isOldAdvisor
      ? fallbackHomeContent.advisor_text
      : content.advisor_text || fallbackHomeContent.advisor_text,
    announcement_text: isPlaceholderAnnouncement
      ? fallbackHomeContent.announcement_text
      : content.announcement_text,
    hero_image_url:
      content.hero_image_url || fallbackHomeContent.hero_image_url,
    advisor_image_url:
      content.advisor_image_url || fallbackHomeContent.advisor_image_url,
  };
}

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
      resolveHomeContent(rows[0])
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
      resolveHomeContent(rows[0])
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
          hero_badge || fallbackHomeContent.hero_badge,
          hero_title,
          hero_subtitle,
          hero_image_url || '',
          primary_cta_label || fallbackHomeContent.primary_cta_label,
          primary_cta_link || fallbackHomeContent.primary_cta_link,
          secondary_cta_label || fallbackHomeContent.secondary_cta_label,
          secondary_cta_link || fallbackHomeContent.secondary_cta_link,
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
        hero_badge || fallbackHomeContent.hero_badge,
        hero_title,
        hero_subtitle,
        hero_image_url || '',
        primary_cta_label || fallbackHomeContent.primary_cta_label,
        primary_cta_link || fallbackHomeContent.primary_cta_link,
        secondary_cta_label || fallbackHomeContent.secondary_cta_label,
        secondary_cta_link || fallbackHomeContent.secondary_cta_link,
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
