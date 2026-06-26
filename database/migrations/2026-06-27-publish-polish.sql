USE honda_advisor_db;

-- Migration: 2026-06-27-publish-polish
-- Purpose: Remove visible placeholder homepage copy from existing databases.

UPDATE site_home_content
SET announcement_text = 'Recognized for long-service excellence and trusted by loyal Honda customers across many years.'
WHERE announcement_text IS NULL
   OR announcement_text = ''
   OR announcement_text LIKE '%Sample homepage content%'
   OR announcement_text = 'Get guided model selection, monthly estimate support, and appointment planning from inquiry to delivery.';

UPDATE site_home_content
SET
  hero_image_url = COALESCE(NULLIF(hero_image_url, ''), '/images/home/home-showroom-01.webp'),
  advisor_image_url = COALESCE(NULLIF(advisor_image_url, ''), '/images/advisor/advisor-profile.webp')
WHERE id IS NOT NULL;

UPDATE site_home_content
SET
  hero_badge = 'Trusted Honda Sales Advisor',
  hero_title = 'Meet Pn. Fauziah, your personal Honda advisor',
  hero_subtitle = 'A warm, experienced Honda sales advisor at Tenaga Setia Resources Sdn. Bhd. who guides customers clearly from model discovery to delivery day.',
  primary_cta_label = 'Compare Models',
  primary_cta_link = '/compare',
  secondary_cta_label = 'View Honda Models',
  secondary_cta_link = '/cars'
WHERE hero_title IN (
  'Meet your personal Honda sales advisor',
  'Find your next Honda with confidence'
);

UPDATE site_home_content
SET
  advisor_title = 'Tenaga Setia Resources Honda showroom support',
  advisor_text = 'Visit the showroom for model viewing, test-drive arrangement, loan discussion, and delivery coordination. Final stock, promotions, quotation, and color availability are confirmed personally during advisor follow-up.'
WHERE advisor_title IN (
  'Serving Honda customers since 2002',
  'Personal Honda advisor support'
);

UPDATE car_variants
SET
  engine = '1.5L Petrol',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Advisor reference data for customer comparison. Final variant details must be confirmed before quotation.'
WHERE engine LIKE '%Hybrid option placeholder%'
  AND variant_name IN ('City RS', 'City Hatchback RS');

UPDATE car_variants
SET
  engine = '1.5L e:HEV / Turbo variant reference',
  transmission = 'CVT / e-CVT reference',
  fuel_type = 'hybrid',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Advisor reference data for customer comparison. Final variant details must be confirmed before quotation.'
WHERE engine LIKE '%Hybrid option placeholder%'
  AND variant_name = 'HR-V RS';

UPDATE car_variants
SET
  engine = '2.0L e:HEV / 1.5L Turbo variant reference',
  transmission = 'e-CVT / CVT reference',
  fuel_type = 'hybrid',
  data_mode = 'verified',
  is_mock_data = FALSE,
  data_status = 'Advisor reference data for customer comparison. Final variant details must be confirmed before quotation.'
WHERE engine LIKE '%Hybrid option placeholder%'
  AND variant_name = 'CR-V RS';
