USE honda_advisor_db;

-- =========================================================
-- ROLES
-- =========================================================
INSERT INTO roles (name, description) VALUES
('customer', 'Registered customer who can save cars, loan calculations, inquiries, and appointments'),
('admin', 'Sales advisor or admin who can manage leads, appointments, cars, and website content'),
('super_admin', 'System owner with full access to all modules');

-- =========================================================
-- ADVISOR PROFILE
-- =========================================================
INSERT INTO advisor_profiles (
  user_id,
  advisor_name,
  title,
  experience_start_year,
  experience_summary,
  profile_photo_url,
  whatsapp_number,
  email,
  working_hours,
  data_mode,
  is_mock_data,
  data_status
) VALUES (
  NULL,
  '[Advisor Name]',
  'Honda Sales Advisor',
  2002,
  'Serving Honda customers since 2002 at Tenaga Setia Resources Sdn. Bhd. with trusted guidance for model selection, loan explanation, appointment support, and customer follow-up.',
  '/assets/advisor/profile-placeholder.jpg',
  '60120000000',
  'advisor@example.com',
  'Monday to Saturday, appointment-based consultation',
  'mock',
  TRUE,
  'Sample advisor profile — replace with verified advisor information later'
);

-- =========================================================
-- DEALERSHIP PROFILE
-- =========================================================
INSERT INTO dealership_profiles (
  name,
  company_no,
  branch_type,
  address_line_1,
  address_line_2,
  city,
  state,
  postcode,
  country,
  showroom_phone,
  service_phone,
  body_paint_phone,
  showroom_hours,
  service_hours,
  body_paint_hours,
  historical_note,
  disclaimer,
  data_mode,
  is_mock_data,
  data_status
) VALUES (
  'Tenaga Setia Resources Sdn. Bhd.',
  '0580570-U',
  'Honda 3S Centre / dealership branch',
  '10, Jalan 51/217',
  'Seksyen 51',
  'Petaling Jaya',
  'Selangor',
  '46050',
  'Malaysia',
  '03-7784 8211',
  '03-7784 8311',
  '03-7784 8311',
  'Monday to Saturday 8:30 AM - 8:00 PM, Sunday 10:00 AM - 5:00 PM, Public Holiday Closed',
  'Monday to Friday 8:30 AM - 5:30 PM, Saturday/Sunday 8:30 AM - 5:00 PM, Public Holiday Closed',
  'Monday to Friday 8:30 AM - 5:30 PM, Saturday 8:30 AM - 5:00 PM, Sunday/Public Holiday Closed',
  'Tenaga Setia Resources Sdn. Bhd. is used as the dealership branch context for this personal Honda sales advisor website. Details must be verified before production publishing.',
  'This is a personal Honda sales advisor platform. Dealership details, pricing, promotions, stock, and operating hours should be confirmed with the dealership or Honda Malaysia.',
  'mock',
  TRUE,
  'Sample dealership profile — verify latest official details before final production use'
);

-- =========================================================
-- CAR MODELS
-- =========================================================
INSERT INTO car_models (
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
  data_status
) VALUES
('Honda City', 'honda-city', 'sedan', 'petrol', 84900.00, 'A practical sedan with strong value for daily driving.', 'First-time buyers, city driving, value seekers', '/assets/mock-cars/honda-city.jpg', NULL, TRUE, TRUE, 'mock', TRUE, 'Estimated sample data — verify latest Honda Malaysia pricing later'),
('Honda City Hatchback', 'honda-city-hatchback', 'hatchback', 'petrol', 85900.00, 'A compact hatchback with sporty styling and flexible space.', 'Young drivers, compact lifestyle, sporty look', '/assets/mock-cars/honda-city-hatchback.jpg', NULL, TRUE, TRUE, 'mock', TRUE, 'Estimated sample data — verify latest Honda Malaysia pricing later'),
('Honda WR-V', 'honda-wrv', 'suv', 'petrol', 89900.00, 'A compact SUV with higher driving position and practical size.', 'Small families, city SUV buyers, weekend use', '/assets/mock-cars/honda-wrv.jpg', NULL, TRUE, TRUE, 'mock', TRUE, 'Estimated sample data — verify latest Honda Malaysia pricing later'),
('Honda HR-V', 'honda-hrv', 'suv', 'petrol', 115900.00, 'A stylish compact SUV with family practicality and premium feel.', 'Family use, premium compact SUV buyers', '/assets/mock-cars/honda-hrv.jpg', NULL, TRUE, TRUE, 'mock', TRUE, 'Estimated sample data — verify latest Honda Malaysia pricing later'),
('Honda Civic', 'honda-civic', 'sedan', 'petrol', 133900.00, 'An executive sedan with strong performance feel and premium comfort.', 'Executives, sedan lovers, performance feel', '/assets/mock-cars/honda-civic.jpg', NULL, TRUE, TRUE, 'mock', TRUE, 'Estimated sample data — verify latest Honda Malaysia pricing later'),
('Honda e:N1', 'honda-en1', 'ev', 'ev', 150060.00, 'A modern electric SUV for EV-focused drivers.', 'EV buyers, modern tech users, clean mobility', '/assets/mock-cars/honda-en1.jpg', NULL, FALSE, TRUE, 'mock', TRUE, 'Estimated sample data — verify latest Honda Malaysia pricing later'),
('Honda CR-V', 'honda-crv', 'suv', 'petrol', 178200.00, 'A larger SUV with premium comfort and family-friendly practicality.', 'Larger families, premium SUV buyers, long-distance comfort', '/assets/mock-cars/honda-crv.jpg', NULL, TRUE, TRUE, 'mock', TRUE, 'Estimated sample data — verify latest Honda Malaysia pricing later'),
('Honda Type R', 'honda-type-r', 'performance', 'petrol', 399900.00, 'A performance flagship for Honda enthusiasts.', 'Performance enthusiasts, collectors, motorsport fans', '/assets/mock-cars/honda-type-r.jpg', NULL, FALSE, TRUE, 'mock', TRUE, 'Estimated sample data — verify latest Honda Malaysia pricing later');

-- =========================================================
-- CAR VARIANTS
-- =========================================================
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
) VALUES
(1, 'City S', 84900.00, '1.5L Petrol', 'CVT', 'petrol', 'Entry variant with essential Honda comfort and safety.', 'Budget-conscious first-time buyers', 1, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),
(1, 'City V', 94900.00, '1.5L Petrol', 'CVT', 'petrol', 'Balanced comfort, features, and value.', 'Customers who want comfort and value', 2, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),
(1, 'City RS', 109900.00, '1.5L Petrol / Hybrid option placeholder', 'CVT', 'petrol', 'Sportier styling and premium features.', 'Customers who want premium look and features', 3, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),

(2, 'City Hatchback S', 85900.00, '1.5L Petrol', 'CVT', 'petrol', 'Compact and practical hatchback entry option.', 'Young drivers and city users', 1, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),
(2, 'City Hatchback RS', 109900.00, '1.5L Petrol / Hybrid option placeholder', 'CVT', 'petrol', 'Sporty design with higher specification.', 'Drivers who want sporty compact styling', 2, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),

(3, 'WR-V S', 89900.00, '1.5L Petrol', 'CVT', 'petrol', 'Compact SUV essentials for practical everyday driving.', 'Small families and city SUV buyers', 1, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),
(3, 'WR-V RS', 107900.00, '1.5L Petrol', 'CVT', 'petrol', 'Sportier styling and more premium features.', 'Small SUV buyers who want stronger design appeal', 2, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),

(4, 'HR-V S', 115900.00, '1.5L Petrol', 'CVT', 'petrol', 'Compact SUV essentials with practical daily usability.', 'Small families and first SUV buyers', 1, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),
(4, 'HR-V V', 130900.00, '1.5L Petrol', 'CVT', 'petrol', 'More features and comfort for family use.', 'Family buyers who want better comfort', 2, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),
(4, 'HR-V RS', 145900.00, '1.5L Petrol / Hybrid option placeholder', 'CVT', 'petrol', 'Premium styling and advanced features.', 'Premium compact SUV buyers', 3, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),

(5, 'Civic E', 133900.00, '1.5L Turbo Petrol', 'CVT', 'petrol', 'Executive sedan essentials with turbo performance.', 'Executive sedan buyers', 1, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),
(5, 'Civic V', 145900.00, '1.5L Turbo Petrol', 'CVT', 'petrol', 'More comfort and technology features.', 'Customers who want balanced premium features', 2, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),
(5, 'Civic RS', 165900.00, '1.5L Turbo Petrol', 'CVT', 'petrol', 'Sportier design and higher specification.', 'Customers who want sporty executive sedan feel', 3, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),

(6, 'e:N1', 150060.00, 'Electric Motor', 'Single-speed EV transmission', 'ev', 'Electric SUV with modern EV-focused technology.', 'EV buyers and modern city drivers', 1, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),

(7, 'CR-V S', 178200.00, '1.5L Turbo Petrol', 'CVT', 'petrol', 'Large SUV comfort and family practicality.', 'Larger families', 1, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),
(7, 'CR-V RS', 198200.00, '1.5L Turbo Petrol / Hybrid option placeholder', 'CVT', 'petrol', 'Premium SUV features and stronger road presence.', 'Premium family SUV buyers', 2, 'mock', TRUE, 'Sample variant data — verify latest variant details later'),

(8, 'Civic Type R', 399900.00, '2.0L VTEC Turbo', 'Manual', 'petrol', 'Honda performance flagship built for driving enthusiasts.', 'Performance enthusiasts', 1, 'mock', TRUE, 'Sample variant data — verify latest variant details later');

-- =========================================================
-- SAMPLE CAR FEATURES
-- =========================================================
INSERT INTO car_features (
  car_model_id,
  feature_title,
  feature_description,
  feature_category,
  sort_order
) VALUES
(1, 'Practical sedan design', 'Balanced size, comfort, and practicality for daily Malaysian driving.', 'utility', 1),
(1, 'Value-focused ownership', 'A suitable option for first-time buyers and budget-conscious customers.', 'comfort', 2),
(4, 'Compact SUV practicality', 'Higher driving position with flexible cabin space for family use.', 'utility', 1),
(5, 'Executive sedan feel', 'Sporty design and turbo performance for drivers who want a premium sedan experience.', 'performance', 1),
(7, 'Family SUV comfort', 'Larger cabin and premium comfort for long-distance family use.', 'comfort', 1);

-- =========================================================
-- SAMPLE CAR COLORS
-- =========================================================
INSERT INTO car_colors (
  car_model_id,
  color_name,
  color_hex,
  image_url,
  sort_order
) VALUES
(1, 'Platinum White Pearl', '#F5F5F5', '/assets/mock-cars/colors/platinum-white.jpg', 1),
(1, 'Crystal Black Pearl', '#111111', '/assets/mock-cars/colors/crystal-black.jpg', 2),
(4, 'Meteoroid Gray Metallic', '#555555', '/assets/mock-cars/colors/meteoroid-gray.jpg', 1),
(5, 'Rallye Red', '#C8102E', '/assets/mock-cars/colors/rallye-red.jpg', 1),
(7, 'Lunar Silver Metallic', '#C0C0C0', '/assets/mock-cars/colors/lunar-silver.jpg', 1);

-- =========================================================
-- SAMPLE CAR IMAGES
-- =========================================================
INSERT INTO car_images (
  car_model_id,
  image_url,
  alt_text,
  image_type,
  sort_order
) VALUES
(1, '/assets/mock-cars/honda-city.jpg', 'Honda City sample exterior image', 'hero', 1),
(2, '/assets/mock-cars/honda-city-hatchback.jpg', 'Honda City Hatchback sample exterior image', 'hero', 1),
(3, '/assets/mock-cars/honda-wrv.jpg', 'Honda WR-V sample exterior image', 'hero', 1),
(4, '/assets/mock-cars/honda-hrv.jpg', 'Honda HR-V sample exterior image', 'hero', 1),
(5, '/assets/mock-cars/honda-civic.jpg', 'Honda Civic sample exterior image', 'hero', 1),
(6, '/assets/mock-cars/honda-en1.jpg', 'Honda e:N1 sample exterior image', 'hero', 1),
(7, '/assets/mock-cars/honda-crv.jpg', 'Honda CR-V sample exterior image', 'hero', 1),
(8, '/assets/mock-cars/honda-type-r.jpg', 'Honda Type R sample exterior image', 'hero', 1);

-- =========================================================
-- SAMPLE INQUIRIES
-- =========================================================
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
) VALUES
(1, 'Sample Customer A', '60123456789', 'sample.a@example.com', 'RM 80k - RM 100k', 'RM 800 - RM 1,200', 'Within 1 month', TRUE, FALSE, 'whatsapp', 'Interested in Honda City monthly payment estimate.', TRUE, 'loan_calculator', 'new'),
(4, 'Sample Customer B', '60129876543', 'sample.b@example.com', 'RM 120k - RM 150k', 'RM 1,200 - RM 1,600', 'Within 3 months', TRUE, TRUE, 'whatsapp', 'Interested in HR-V and trade-in support.', TRUE, 'car_detail_page', 'appointment_booked'),
(5, 'Sample Customer C', '60125556666', 'sample.c@example.com', 'RM 130k - RM 170k', 'RM 1,300 - RM 1,700', 'Just surveying', TRUE, FALSE, 'email', 'Need comparison between Civic variants.', TRUE, 'comparison_page', 'contacted');

-- =========================================================
-- SAMPLE APPOINTMENTS
-- =========================================================
INSERT INTO appointments (
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
) VALUES
(2, 4, 'Sample Customer B', '60129876543', 'sample.b@example.com', 'test_drive', '2026-06-01', '10:00:00', 'Would like to test drive HR-V.', 'pending'),
(NULL, 1, 'Sample Customer D', '60127778888', 'sample.d@example.com', 'loan_consultation', '2026-06-03', '14:00:00', 'Need loan explanation for Honda City.', 'confirmed');

-- =========================================================
-- SAMPLE LOAN CALCULATIONS
-- =========================================================
INSERT INTO loan_calculations (
  car_model_id,
  car_price,
  down_payment,
  interest_rate,
  loan_years,
  trade_in_value,
  loan_amount,
  total_interest,
  estimated_monthly_payment,
  advisor_note
) VALUES
(1, 84900.00, 8490.00, 2.35, 9, 0.00, 76410.00, 16162.72, 857.16, 'Estimated monthly installment only. Increase down payment to reduce monthly commitment.'),
(4, 115900.00, 11590.00, 2.35, 9, 0.00, 104310.00, 22065.08, 1169.21, 'Estimated monthly installment only. Suitable for customers comparing compact SUV options.'),
(7, 178200.00, 17820.00, 2.35, 9, 0.00, 160380.00, 33927.39, 1799.14, 'Estimated monthly installment only. Consider higher down payment for lower monthly cost.');

-- =========================================================
-- SAMPLE TESTIMONIALS
-- =========================================================
INSERT INTO testimonials (
  customer_name,
  car_model_id,
  rating,
  review,
  is_approved,
  is_featured,
  data_mode,
  is_mock_data,
  data_status
) VALUES
('Sample Customer A', 1, 5, 'The advisor explained the loan process clearly and helped compare the right variant for my budget.', TRUE, TRUE, 'mock', TRUE, 'Sample testimonial — replace with verified customer review later'),
('Sample Customer B', 4, 5, 'Very helpful guidance from inquiry to appointment. The car recommendation matched my family needs.', TRUE, TRUE, 'mock', TRUE, 'Sample testimonial — replace with verified customer review later'),
('Sample Customer C', 5, 5, 'Professional, fast response, and easy to understand explanation about variants and monthly estimate.', TRUE, FALSE, 'mock', TRUE, 'Sample testimonial — replace with verified customer review later');

-- =========================================================
-- SAMPLE CUSTOMER GALLERY
-- =========================================================
INSERT INTO customer_gallery (
  car_model_id,
  title,
  story,
  image_url,
  delivery_year,
  badge,
  has_customer_consent,
  is_published,
  data_mode,
  is_mock_data,
  data_status
) VALUES
(1, 'Sample Honda City Delivery', 'Sample customer story for a reliable daily sedan choice. Real customer photo and story will be added later with permission.', '/assets/gallery/sample-city-delivery.jpg', 2026, 'Sample Customer Story', FALSE, TRUE, 'mock', TRUE, 'Sample story — real delivery gallery coming soon'),
(4, 'Sample HR-V Family Upgrade', 'Sample story for a family upgrading to a compact SUV. Real customer photo and story will be added later with permission.', '/assets/gallery/sample-hrv-delivery.jpg', 2026, 'Sample Customer Story', FALSE, TRUE, 'mock', TRUE, 'Sample story — real delivery gallery coming soon'),
(5, 'Sample Civic Handover', 'Sample story for a customer choosing an executive sedan. Real customer photo and story will be added later with permission.', '/assets/gallery/sample-civic-delivery.jpg', 2026, 'Sample Customer Story', FALSE, TRUE, 'mock', TRUE, 'Sample story — real delivery gallery coming soon');

-- =========================================================
-- SAMPLE PROMOTIONS
-- =========================================================
INSERT INTO promotions (
  car_model_id,
  title,
  description,
  status,
  disclaimer,
  data_mode,
  is_mock_data,
  data_status
) VALUES
(NULL, 'New Honda Inquiry Support', 'Get personal guidance for Honda model selection, monthly estimate, and appointment planning.', 'active', 'Promotion subject to latest dealership/Honda Malaysia campaign confirmation.', 'mock', TRUE, 'Sample promotion — confirm latest dealership/Honda Malaysia campaign before publishing'),
(NULL, 'Loan Consultation Assistance', 'Request assistance to understand estimated monthly installments and required documents.', 'active', 'Final loan approval depends on bank requirements and customer profile.', 'mock', TRUE, 'Sample promotion — confirm latest dealership/Honda Malaysia campaign before publishing'),
(NULL, 'Trade-In Value Check', 'Submit your current car information for an indicative trade-in value estimate.', 'active', 'Final valuation requires physical inspection and market verification.', 'mock', TRUE, 'Sample promotion — confirm latest dealership/Honda Malaysia campaign before publishing');

-- =========================================================
-- SAMPLE FAQ
-- =========================================================
INSERT INTO faq_items (
  category,
  question,
  answer,
  sort_order,
  is_active,
  data_mode,
  is_mock_data,
  data_status
) VALUES
('loan', 'What documents are needed for car loan application?', 'Common documents may include IC, driving license, salary slips, bank statements, EPF statement, and employment confirmation. Final requirements depend on bank approval process.', 1, TRUE, 'mock', TRUE, 'Sample FAQ — verify final answer before publishing'),
('booking', 'Can I book a test drive?', 'Yes, customers can submit an appointment request and the advisor will confirm availability based on preferred date and model.', 2, TRUE, 'mock', TRUE, 'Sample FAQ — verify final answer before publishing'),
('trade_in', 'Can I trade in my old car?', 'Yes, an indicative estimate can be provided first. Final value depends on vehicle condition, mileage, accident history, and physical inspection.', 3, TRUE, 'mock', TRUE, 'Sample FAQ — verify final answer before publishing'),
('promotion', 'Are prices and promotions fixed?', 'No. Prices, promotions, stock, and monthly payment estimates must be confirmed with the advisor, dealership, or Honda Malaysia.', 4, TRUE, 'mock', TRUE, 'Sample FAQ — verify final answer before publishing');

-- =========================================================
-- SAMPLE BLOG POSTS
-- =========================================================
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  status,
  published_at,
  data_mode,
  is_mock_data,
  data_status
) VALUES
('Honda City vs Honda Civic: Which One Should You Choose?', 'honda-city-vs-honda-civic', 'A simple guide to help customers compare daily value and executive sedan feel.', 'Sample article content. This guide will explain budget, comfort, driving feel, and monthly estimate comparison between Honda City and Honda Civic.', 'published', NOW(), 'mock', TRUE, 'Sample buying guide content — review before publishing'),
('Best Honda Car for Small Family', 'best-honda-car-for-small-family', 'A beginner-friendly guide to Honda models suitable for family use.', 'Sample article content. This guide will compare City, WR-V, HR-V, and CR-V for family needs.', 'published', NOW(), 'mock', TRUE, 'Sample buying guide content — review before publishing');