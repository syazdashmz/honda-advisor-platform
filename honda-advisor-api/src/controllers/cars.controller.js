const { database } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/api-response');

async function getAllCars(req, res) {
  try {
    const [cars] = await database.query(`
      SELECT
        id,
        name,
        slug,
        category,
        fuel_type,
        estimated_price_from,
        short_description,
        best_for,
        hero_image_url,
        brochure_url,
        is_featured,
        is_active,
        data_mode,
        is_mock_data,
        data_status,
        created_at,
        updated_at
      FROM car_models
      WHERE is_active = TRUE
      ORDER BY estimated_price_from ASC
    `);

    return successResponse(res, 'Cars fetched successfully', cars);
  } catch (error) {
    console.error('getAllCars error:', error);
    return errorResponse(res, 'Failed to fetch cars');
  }
}

async function getCarBySlug(req, res) {
  try {
    const { slug } = req.params;

    const [cars] = await database.query(
      `
      SELECT
        id,
        name,
        slug,
        category,
        fuel_type,
        estimated_price_from,
        short_description,
        best_for,
        hero_image_url,
        brochure_url,
        is_featured,
        is_active,
        data_mode,
        is_mock_data,
        data_status,
        created_at,
        updated_at
      FROM car_models
      WHERE slug = ? AND is_active = TRUE
      LIMIT 1
      `,
      [slug]
    );

    if (cars.length === 0) {
      return errorResponse(res, 'Car model not found', 404);
    }

    const car = cars[0];

    const [variants] = await database.query(
      `
      SELECT
        id,
        car_model_id,
        variant_name,
        estimated_price,
        engine,
        transmission,
        fuel_type,
        key_highlights,
        recommended_for,
        sort_order,
        is_active,
        data_mode,
        is_mock_data,
        data_status
      FROM car_variants
      WHERE car_model_id = ? AND is_active = TRUE
      ORDER BY sort_order ASC
      `,
      [car.id]
    );

    const [images] = await database.query(
      `
      SELECT
        id,
        car_model_id,
        car_variant_id,
        image_url,
        alt_text,
        image_type,
        sort_order,
        data_mode,
        is_mock_data,
        data_status
      FROM car_images
      WHERE car_model_id = ?
      ORDER BY sort_order ASC
      `,
      [car.id]
    );

    const [features] = await database.query(
      `
      SELECT
        id,
        car_model_id,
        feature_title,
        feature_description,
        feature_category,
        sort_order,
        data_mode,
        is_mock_data,
        data_status
      FROM car_features
      WHERE car_model_id = ?
      ORDER BY sort_order ASC
      `,
      [car.id]
    );

    const [colors] = await database.query(
      `
      SELECT
        id,
        car_model_id,
        color_name,
        color_hex,
        image_url,
        sort_order,
        data_mode,
        is_mock_data,
        data_status
      FROM car_colors
      WHERE car_model_id = ?
      ORDER BY sort_order ASC
      `,
      [car.id]
    );

    return successResponse(res, 'Car details fetched successfully', {
      ...car,
      variants,
      images,
      features,
      colors,
    });
  } catch (error) {
    console.error('getCarBySlug error:', error);
    return errorResponse(res, 'Failed to fetch car details');
  }
}

module.exports = {
  getAllCars,
  getCarBySlug,
};