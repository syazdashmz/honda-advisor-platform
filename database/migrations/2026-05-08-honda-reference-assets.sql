USE honda_advisor_db;

-- Migration: 2026-05-08-honda-reference-assets
-- Purpose: Update an existing database with local WebP image paths and Honda Malaysia Civic reference data.
-- Run this after 2026-05-08-current-implementation-fixes.sql.

UPDATE site_home_content
SET hero_image_url = '/images/home/home-showroom-01.webp'
WHERE hero_image_url IS NULL OR hero_image_url = '';

UPDATE site_home_content
SET advisor_image_url = '/images/advisor/advisor-profile.webp'
WHERE advisor_image_url IS NULL OR advisor_image_url = '';

UPDATE car_models
SET
  estimated_price_from = 84900.00,
  short_description = 'A practical Honda sedan with strong value for daily Malaysian driving.',
  best_for = 'First-time buyers, city driving, value seekers',
  hero_image_url = '/images/cars/city/hero.webp',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Honda Malaysia reference price captured 2026-05-08. Final OTR price, stock, and promotions must be confirmed before quotation.'
WHERE slug = 'honda-city';

UPDATE car_models
SET
  estimated_price_from = 85900.00,
  short_description = 'A compact hatchback with sporty styling and flexible cabin space.',
  best_for = 'Young drivers, compact lifestyle, sporty look',
  hero_image_url = '/images/cars/city-hatchback/hero.webp',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Honda Malaysia reference price captured 2026-05-08. Final OTR price, stock, and promotions must be confirmed before quotation.'
WHERE slug = 'honda-city-hatchback';

UPDATE car_models
SET
  estimated_price_from = 89900.00,
  short_description = 'A compact SUV with a higher driving position and practical city-friendly size.',
  best_for = 'Small families, city SUV buyers, weekend use',
  hero_image_url = '/images/cars/wr-v/hero.webp',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Honda Malaysia reference price captured 2026-05-08. Final OTR price, stock, and promotions must be confirmed before quotation.'
WHERE slug = 'honda-wrv';

UPDATE car_models
SET
  estimated_price_from = 115900.00,
  short_description = 'A stylish compact SUV with family practicality and a more premium feel.',
  best_for = 'Family use, premium compact SUV buyers',
  hero_image_url = '/images/cars/hr-v/hero.webp',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Honda Malaysia reference price captured 2026-05-08. Final OTR price, stock, and promotions must be confirmed before quotation.'
WHERE slug = 'honda-hrv';

UPDATE car_models
SET
  estimated_price_from = 133900.00,
  short_description = 'An executive sedan with VTEC Turbo performance, e:HEV option, Honda SENSING, and Honda CONNECT availability.',
  best_for = 'Executives, sedan lovers, tech-focused drivers, performance feel',
  hero_image_url = '/images/cars/civic/hero.webp',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Honda Malaysia Civic reference captured 2026-05-08. Final OTR price, stock, and promotions must be confirmed before quotation.'
WHERE slug = 'honda-civic';

UPDATE car_models
SET
  estimated_price_from = 150060.00,
  short_description = 'A modern electric SUV for EV-focused drivers and clean mobility ownership.',
  best_for = 'EV buyers, modern tech users, clean mobility',
  hero_image_url = '/images/cars/en1/hero.webp',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Honda Malaysia reference price captured 2026-05-08. Final OTR price, stock, and promotions must be confirmed before quotation.'
WHERE slug = 'honda-en1';

UPDATE car_models
SET
  estimated_price_from = 178200.00,
  short_description = 'A larger SUV with premium comfort and family-friendly practicality.',
  best_for = 'Larger families, premium SUV buyers, long-distance comfort',
  hero_image_url = '/images/cars/cr-v/hero.webp',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Honda Malaysia reference price captured 2026-05-08. Final OTR price, stock, and promotions must be confirmed before quotation.'
WHERE slug = 'honda-crv';

UPDATE car_models
SET
  estimated_price_from = 399900.00,
  short_description = 'Honda performance flagship built for drivers who want a focused manual driving experience.',
  best_for = 'Performance enthusiasts, collectors, motorsport fans',
  hero_image_url = '/images/cars/type-r/hero.webp',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Honda Malaysia reference price captured 2026-05-08. Final OTR price, stock, and promotions must be confirmed before quotation.'
WHERE slug = 'honda-type-r';

SET @civic_id := (
  SELECT id
  FROM car_models
  WHERE slug = 'honda-civic'
  LIMIT 1
);

UPDATE car_variants
SET
  variant_name = 'Civic 1.5L E',
  estimated_price = 133900.00,
  engine = '1.5L VTEC Turbo Petrol',
  transmission = 'CVT',
  fuel_type = 'petrol',
  key_highlights = '182PS / 240Nm, Honda SENSING, Honda CONNECT, 7-inch TFT meter, and 16-inch alloy wheels.',
  recommended_for = 'Executive sedan buyers who want Civic turbo performance at the entry price point',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Honda Malaysia Civic variant reference captured 2026-05-08. Final OTR price must be confirmed before quotation.'
WHERE car_model_id = @civic_id AND sort_order = 1;

UPDATE car_variants
SET
  variant_name = 'Civic 1.5L V',
  estimated_price = 144900.00,
  engine = '1.5L VTEC Turbo Petrol',
  transmission = 'CVT',
  fuel_type = 'petrol',
  key_highlights = '182PS / 240Nm, Honda LaneWatch, 8 speakers, 17-inch alloy wheels, and Honda SENSING.',
  recommended_for = 'Customers who want the balanced Civic petrol variant with more convenience features',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Honda Malaysia Civic variant reference captured 2026-05-08. Final OTR price must be confirmed before quotation.'
WHERE car_model_id = @civic_id AND sort_order = 2;

UPDATE car_variants
SET
  variant_name = 'Civic 1.5L RS',
  estimated_price = 149900.00,
  engine = '1.5L VTEC Turbo Petrol',
  transmission = 'CVT',
  fuel_type = 'petrol',
  key_highlights = '182PS / 240Nm with RS exterior styling, 18-inch alloy wheels, wireless charger, and Honda SENSING.',
  recommended_for = 'Customers who want the sportier Civic petrol RS look and higher specification',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Honda Malaysia Civic variant reference captured 2026-05-08. Final OTR price must be confirmed before quotation.'
WHERE car_model_id = @civic_id AND sort_order = 3;

INSERT INTO car_variants (
  car_model_id,
  variant_name,
  estimated_price,
  engine,
  transmission,
  fuel_type,
  key_highlights,
  recommended_for,
  sort_order,
  data_mode,
  is_mock_data,
  data_status
)
SELECT
  @civic_id,
  variant_name,
  estimated_price,
  engine,
  transmission,
  fuel_type,
  key_highlights,
  recommended_for,
  sort_order,
  'verified',
  FALSE,
  'Honda Malaysia Civic variant reference captured 2026-05-08. Final OTR price must be confirmed before quotation.'
FROM (
  SELECT 'Civic 1.5L E' AS variant_name, 133900.00 AS estimated_price, '1.5L VTEC Turbo Petrol' AS engine, 'CVT' AS transmission, 'petrol' AS fuel_type, '182PS / 240Nm, Honda SENSING, Honda CONNECT, 7-inch TFT meter, and 16-inch alloy wheels.' AS key_highlights, 'Executive sedan buyers who want Civic turbo performance at the entry price point' AS recommended_for, 1 AS sort_order
  UNION ALL
  SELECT 'Civic 1.5L V', 144900.00, '1.5L VTEC Turbo Petrol', 'CVT', 'petrol', '182PS / 240Nm, Honda LaneWatch, 8 speakers, 17-inch alloy wheels, and Honda SENSING.', 'Customers who want the balanced Civic petrol variant with more convenience features', 2
  UNION ALL
  SELECT 'Civic 1.5L RS', 149900.00, '1.5L VTEC Turbo Petrol', 'CVT', 'petrol', '182PS / 240Nm with RS exterior styling, 18-inch alloy wheels, wireless charger, and Honda SENSING.', 'Customers who want the sportier Civic petrol RS look and higher specification', 3
) civic_petrol_variants
WHERE @civic_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM car_variants cv
    WHERE cv.car_model_id = @civic_id
      AND cv.variant_name = civic_petrol_variants.variant_name
  );

INSERT INTO car_variants (
  car_model_id,
  variant_name,
  estimated_price,
  engine,
  transmission,
  fuel_type,
  key_highlights,
  recommended_for,
  sort_order,
  data_mode,
  is_mock_data,
  data_status
)
SELECT
  @civic_id,
  'Civic 2.0L e:HEV RS',
  167900.00,
  '2.0L e:HEV Hybrid',
  'e-CVT',
  'hybrid',
  'Electric motor output of 184PS / 315Nm, 4.0L/100km fuel consumption reference, 10.2-inch TFT meter, and RS hybrid features.',
  'Drivers who want the strongest Civic acceleration feel with hybrid efficiency',
  4,
  'verified',
  FALSE,
  'Honda Malaysia Civic e:HEV variant reference captured 2026-05-08. Final OTR price must be confirmed before quotation.'
WHERE @civic_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM car_variants
    WHERE car_model_id = @civic_id
      AND variant_name = 'Civic 2.0L e:HEV RS'
  );

UPDATE car_features
SET
  feature_title = 'VTEC Turbo and e:HEV choices',
  feature_description = 'Civic is offered with 1.5L VTEC Turbo petrol variants and a 2.0L e:HEV RS hybrid variant for stronger efficiency-focused performance.',
  feature_category = 'performance',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Honda Malaysia Civic reference captured 2026-05-08.'
WHERE car_model_id = @civic_id
  AND feature_title IN ('Executive sedan feel', 'VTEC Turbo and e:HEV choices');

INSERT INTO car_features (
  car_model_id,
  feature_title,
  feature_description,
  feature_category,
  sort_order,
  data_mode,
  is_mock_data,
  data_status
)
SELECT
  @civic_id,
  feature_title,
  feature_description,
  feature_category,
  sort_order,
  'verified',
  FALSE,
  'Honda Malaysia Civic reference captured 2026-05-08.'
FROM (
  SELECT 'VTEC Turbo and e:HEV choices' AS feature_title, 'Civic is offered with 1.5L VTEC Turbo petrol variants and a 2.0L e:HEV RS hybrid variant for stronger efficiency-focused performance.' AS feature_description, 'performance' AS feature_category, 1 AS sort_order
  UNION ALL
  SELECT 'Honda SENSING', 'Honda Malaysia lists Honda SENSING with nine advanced driver-assistive technologies for Civic.', 'safety', 2
  UNION ALL
  SELECT 'Honda CONNECT', 'Honda CONNECT is listed for Civic with safety, security, and convenience support through connected vehicle features.', 'technology', 3
  UNION ALL
  SELECT 'RS styling details', 'Civic RS highlights include sportier exterior treatment, 18-inch alloy wheels, and RS-focused visual upgrades.', 'design', 4
  UNION ALL
  SELECT 'Hybrid efficiency reference', 'The Civic 2.0L e:HEV RS listing references 4.0L/100km fuel consumption and 7.9 seconds for 0-100km/h.', 'performance', 5
) civic_features
WHERE @civic_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM car_features cf
    WHERE cf.car_model_id = @civic_id
      AND cf.feature_title = civic_features.feature_title
  );

UPDATE car_images ci
JOIN car_models cm ON cm.id = ci.car_model_id
SET
  ci.image_url = CASE cm.slug
    WHEN 'honda-city' THEN '/images/cars/city/hero.webp'
    WHEN 'honda-city-hatchback' THEN '/images/cars/city-hatchback/hero.webp'
    WHEN 'honda-wrv' THEN '/images/cars/wr-v/hero.webp'
    WHEN 'honda-hrv' THEN '/images/cars/hr-v/hero.webp'
    WHEN 'honda-civic' THEN '/images/cars/civic/hero.webp'
    WHEN 'honda-en1' THEN '/images/cars/en1/hero.webp'
    WHEN 'honda-crv' THEN '/images/cars/cr-v/hero.webp'
    WHEN 'honda-type-r' THEN '/images/cars/type-r/hero.webp'
    ELSE ci.image_url
  END,
  ci.alt_text = CONCAT(cm.name, ' reference exterior image'),
  ci.image_type = 'hero',
  ci.data_mode = 'verified',
  ci.is_mock_data = FALSE,
  ci.data_status = 'Local WebP reference asset prepared from Honda Malaysia source imagery on 2026-05-08.'
WHERE cm.slug IN (
  'honda-city',
  'honda-city-hatchback',
  'honda-wrv',
  'honda-hrv',
  'honda-civic',
  'honda-en1',
  'honda-crv',
  'honda-type-r'
)
AND ci.image_type = 'hero';

INSERT INTO car_images (
  car_model_id,
  image_url,
  alt_text,
  image_type,
  sort_order,
  data_mode,
  is_mock_data,
  data_status
)
SELECT
  cm.id,
  CASE cm.slug
    WHEN 'honda-city' THEN '/images/cars/city/hero.webp'
    WHEN 'honda-city-hatchback' THEN '/images/cars/city-hatchback/hero.webp'
    WHEN 'honda-wrv' THEN '/images/cars/wr-v/hero.webp'
    WHEN 'honda-hrv' THEN '/images/cars/hr-v/hero.webp'
    WHEN 'honda-civic' THEN '/images/cars/civic/hero.webp'
    WHEN 'honda-en1' THEN '/images/cars/en1/hero.webp'
    WHEN 'honda-crv' THEN '/images/cars/cr-v/hero.webp'
    WHEN 'honda-type-r' THEN '/images/cars/type-r/hero.webp'
  END,
  CONCAT(cm.name, ' reference exterior image'),
  'hero',
  1,
  'verified',
  FALSE,
  'Local WebP reference asset prepared from Honda Malaysia source imagery on 2026-05-08.'
FROM car_models cm
WHERE cm.slug IN (
  'honda-city',
  'honda-city-hatchback',
  'honda-wrv',
  'honda-hrv',
  'honda-civic',
  'honda-en1',
  'honda-crv',
  'honda-type-r'
)
AND NOT EXISTS (
  SELECT 1
  FROM car_images ci
  WHERE ci.car_model_id = cm.id
    AND ci.image_type = 'hero'
);

SELECT
  name,
  estimated_price_from,
  hero_image_url,
  data_mode,
  is_mock_data
FROM car_models
ORDER BY estimated_price_from ASC;
