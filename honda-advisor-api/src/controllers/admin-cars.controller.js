const { database } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/api-response');

async function getAdminCars(req, res) {
  try {
    const [cars] = await database.query(`
      SELECT
        cm.id,
        cm.name,
        cm.slug,
        cm.category,
        cm.fuel_type,
        cm.estimated_price_from,
        cm.short_description,
        cm.best_for,
        cm.hero_image_url,
        cm.brochure_url,
        cm.is_featured,
        cm.is_active,
        cm.data_mode,
        cm.is_mock_data,
        cm.data_status,
        cm.created_at,
        cm.updated_at,
        COUNT(cv.id) AS variant_count
      FROM car_models cm
      LEFT JOIN car_variants cv ON cm.id = cv.car_model_id
      GROUP BY cm.id
      ORDER BY cm.estimated_price_from ASC
    `);

    return successResponse(res, 'Admin cars fetched successfully', cars);
  } catch (error) {
    console.error('getAdminCars error:', error);
    return errorResponse(res, 'Failed to fetch admin cars');
  }
}

async function getAdminCarById(req, res) {
  try {
    const { id } = req.params;

    const [cars] = await database.query(
      `
      SELECT *
      FROM car_models
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (cars.length === 0) {
      return errorResponse(res, 'Car model not found', 404);
    }

    const [variants] = await database.query(
      `
      SELECT *
      FROM car_variants
      WHERE car_model_id = ?
      ORDER BY sort_order ASC
      `,
      [id]
    );

    return successResponse(res, 'Admin car details fetched successfully', {
      ...cars[0],
      variants
    });
  } catch (error) {
    console.error('getAdminCarById error:', error);
    return errorResponse(res, 'Failed to fetch admin car details');
  }
}

async function updateCarModel(req, res) {
  try {
    const { id } = req.params;

    const {
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
    } = req.body;

    if (!name || !slug || !category || !fuel_type || !estimated_price_from) {
      return errorResponse(
        res,
        'Name, slug, category, fuel type, and estimated price are required',
        400
      );
    }

    const allowedCategories = ['sedan', 'hatchback', 'suv', 'ev', 'performance'];
    const allowedFuelTypes = ['petrol', 'hybrid', 'ev'];
    const allowedDataModes = ['mock', 'verified', 'archived'];

    if (!allowedCategories.includes(category)) {
      return errorResponse(res, 'Invalid car category', 400, { allowedCategories });
    }

    if (!allowedFuelTypes.includes(fuel_type)) {
      return errorResponse(res, 'Invalid fuel type', 400, { allowedFuelTypes });
    }

    if (data_mode && !allowedDataModes.includes(data_mode)) {
      return errorResponse(res, 'Invalid data mode', 400, { allowedDataModes });
    }

    if (Number(estimated_price_from) <= 0) {
      return errorResponse(res, 'Estimated price must be greater than zero', 400);
    }

    const [result] = await database.query(
      `
      UPDATE car_models
      SET
        name = ?,
        slug = ?,
        category = ?,
        fuel_type = ?,
        estimated_price_from = ?,
        short_description = ?,
        best_for = ?,
        hero_image_url = ?,
        brochure_url = ?,
        is_featured = ?,
        is_active = ?,
        data_mode = ?,
        is_mock_data = ?,
        data_status = ?
      WHERE id = ?
      `,
      [
        name,
        slug,
        category,
        fuel_type,
        Number(estimated_price_from),
        short_description || null,
        best_for || null,
        hero_image_url || null,
        brochure_url || null,
        Boolean(is_featured),
        Boolean(is_active),
        data_mode || 'mock',
        Boolean(is_mock_data),
        data_status || 'Updated by admin',
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Car model not found', 404);
    }

    const [updatedCars] = await database.query(
      `
      SELECT *
      FROM car_models
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    return successResponse(
      res,
      'Car model updated successfully',
      updatedCars[0]
    );
  } catch (error) {
    console.error('updateCarModel error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return errorResponse(res, 'Slug already exists. Please use a unique slug.', 409);
    }

    return errorResponse(res, 'Failed to update car model');
  }
}

async function updateCarVariant(req, res) {
  try {
    const { carId, variantId } = req.params;

    const {
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
      data_status,
    } = req.body;

    if (!variant_name || !estimated_price) {
      return errorResponse(res, 'Variant name and estimated price are required', 400);
    }

    if (Number(estimated_price) <= 0) {
      return errorResponse(res, 'Variant price must be greater than zero', 400);
    }

    const allowedFuelTypes = ['petrol', 'hybrid', 'ev'];
    const allowedDataModes = ['mock', 'verified', 'archived'];

    if (fuel_type && !allowedFuelTypes.includes(fuel_type)) {
      return errorResponse(res, 'Invalid fuel type', 400, { allowedFuelTypes });
    }

    if (data_mode && !allowedDataModes.includes(data_mode)) {
      return errorResponse(res, 'Invalid data mode', 400, { allowedDataModes });
    }

    const [result] = await database.query(
      `
      UPDATE car_variants
      SET
        variant_name = ?,
        estimated_price = ?,
        engine = ?,
        transmission = ?,
        fuel_type = ?,
        key_highlights = ?,
        recommended_for = ?,
        sort_order = ?,
        is_active = ?,
        data_mode = ?,
        is_mock_data = ?,
        data_status = ?
      WHERE id = ?
      AND car_model_id = ?
      `,
      [
        variant_name,
        Number(estimated_price),
        engine || null,
        transmission || null,
        fuel_type || 'petrol',
        key_highlights || null,
        recommended_for || null,
        Number(sort_order || 0),
        Boolean(is_active),
        data_mode || 'mock',
        Boolean(is_mock_data),
        data_status || 'Updated by admin',
        variantId,
        carId,
      ]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Car variant not found', 404);
    }

    const [updatedVariants] = await database.query(
      `
      SELECT *
      FROM car_variants
      WHERE id = ?
      LIMIT 1
      `,
      [variantId]
    );

    return successResponse(
      res,
      'Car variant updated successfully',
      updatedVariants[0]
    );
  } catch (error) {
    console.error('updateCarVariant error:', error);
    return errorResponse(res, 'Failed to update car variant');
  }
}

module.exports = {
  getAdminCars,
  getAdminCarById,
  updateCarModel,
  updateCarVariant,
};