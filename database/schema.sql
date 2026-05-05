CREATE DATABASE IF NOT EXISTS honda_advisor_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE honda_advisor_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS admin_activity_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS quotation_pdfs;
DROP TABLE IF EXISTS faq_items;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS customer_gallery;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS customer_notes;
DROP TABLE IF EXISTS saved_comparisons;
DROP TABLE IF EXISTS saved_cars;
DROP TABLE IF EXISTS trade_in_estimations;
DROP TABLE IF EXISTS loan_calculations;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS inquiries;
DROP TABLE IF EXISTS car_images;
DROP TABLE IF EXISTS car_colors;
DROP TABLE IF EXISTS car_features;
DROP TABLE IF EXISTS car_variants;
DROP TABLE IF EXISTS car_models;
DROP TABLE IF EXISTS dealership_profiles;
DROP TABLE IF EXISTS advisor_profiles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- 1. ROLES
-- =========================================================
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. USERS
-- =========================================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone_number VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  last_login_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_users_role_id
    FOREIGN KEY (role_id) REFERENCES roles(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- =========================================================
-- 3. ADVISOR PROFILES
-- =========================================================
CREATE TABLE advisor_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  advisor_name VARCHAR(150) NOT NULL,
  title VARCHAR(150) DEFAULT 'Honda Sales Advisor',
  experience_start_year YEAR NOT NULL DEFAULT 2002,
  experience_summary TEXT,
  profile_photo_url VARCHAR(500),
  whatsapp_number VARCHAR(30),
  email VARCHAR(150),
  working_hours VARCHAR(255),

  data_mode ENUM('mock', 'verified', 'archived') DEFAULT 'mock',
  is_mock_data BOOLEAN DEFAULT TRUE,
  data_status VARCHAR(255) DEFAULT 'Sample content — replace with verified advisor/dealership data later',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_advisor_profiles_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================================================
-- 4. DEALERSHIP PROFILES
-- =========================================================
CREATE TABLE dealership_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  company_no VARCHAR(50),
  branch_type VARCHAR(100),

  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postcode VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Malaysia',

  showroom_phone VARCHAR(30),
  service_phone VARCHAR(30),
  body_paint_phone VARCHAR(30),

  showroom_hours VARCHAR(255),
  service_hours VARCHAR(255),
  body_paint_hours VARCHAR(255),

  historical_note TEXT,
  disclaimer TEXT,

  data_mode ENUM('mock', 'verified', 'archived') DEFAULT 'mock',
  is_mock_data BOOLEAN DEFAULT TRUE,
  data_status VARCHAR(255) DEFAULT 'Sample content — replace with verified advisor/dealership data later',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- 5. CAR MODELS
-- =========================================================
CREATE TABLE car_models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  category ENUM('sedan', 'hatchback', 'suv', 'ev', 'performance') NOT NULL,
  fuel_type ENUM('petrol', 'hybrid', 'ev') DEFAULT 'petrol',
  estimated_price_from DECIMAL(12,2) NOT NULL,
  short_description VARCHAR(255),
  best_for VARCHAR(255),
  hero_image_url VARCHAR(500),
  brochure_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  data_mode ENUM('mock', 'verified', 'archived') DEFAULT 'mock',
  is_mock_data BOOLEAN DEFAULT TRUE,
  data_status VARCHAR(255) DEFAULT 'Sample content — replace with verified advisor/dealership data later',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- 6. CAR VARIANTS
-- =========================================================
CREATE TABLE car_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_model_id INT NOT NULL,
  variant_name VARCHAR(150) NOT NULL,
  estimated_price DECIMAL(12,2) NOT NULL,
  engine VARCHAR(150),
  transmission VARCHAR(150),
  fuel_type ENUM('petrol', 'hybrid', 'ev') DEFAULT 'petrol',
  key_highlights TEXT,
  recommended_for VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,

  data_mode ENUM('mock', 'verified', 'archived') DEFAULT 'mock',
  is_mock_data BOOLEAN DEFAULT TRUE,
  data_status VARCHAR(255) DEFAULT 'Sample content — replace with verified advisor/dealership data later',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_car_variants_car_model_id
    FOREIGN KEY (car_model_id) REFERENCES car_models(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =========================================================
-- 7. CAR FEATURES
-- =========================================================
CREATE TABLE car_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_model_id INT NOT NULL,
  feature_title VARCHAR(150) NOT NULL,
  feature_description TEXT,
  feature_category ENUM('performance', 'safety', 'comfort', 'technology', 'design', 'utility') DEFAULT 'technology',
  sort_order INT DEFAULT 0,

  data_mode ENUM('mock', 'verified', 'archived') DEFAULT 'mock',
  is_mock_data BOOLEAN DEFAULT TRUE,
  data_status VARCHAR(255) DEFAULT 'Sample content — replace with verified advisor/dealership data later',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_car_features_car_model_id
    FOREIGN KEY (car_model_id) REFERENCES car_models(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =========================================================
-- 8. CAR COLORS
-- =========================================================
CREATE TABLE car_colors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_model_id INT NOT NULL,
  color_name VARCHAR(100) NOT NULL,
  color_hex VARCHAR(20),
  image_url VARCHAR(500),
  sort_order INT DEFAULT 0,

  data_mode ENUM('mock', 'verified', 'archived') DEFAULT 'mock',
  is_mock_data BOOLEAN DEFAULT TRUE,
  data_status VARCHAR(255) DEFAULT 'Sample content — replace with verified advisor/dealership data later',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_car_colors_car_model_id
    FOREIGN KEY (car_model_id) REFERENCES car_models(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =========================================================
-- 9. CAR IMAGES
-- =========================================================
CREATE TABLE car_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_model_id INT NOT NULL,
  car_variant_id INT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  image_type ENUM('hero', 'gallery', 'interior', 'exterior', 'color') DEFAULT 'gallery',
  sort_order INT DEFAULT 0,

  data_mode ENUM('mock', 'verified', 'archived') DEFAULT 'mock',
  is_mock_data BOOLEAN DEFAULT TRUE,
  data_status VARCHAR(255) DEFAULT 'Sample content — replace with verified advisor/dealership data later',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_car_images_car_model_id
    FOREIGN KEY (car_model_id) REFERENCES car_models(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_car_images_car_variant_id
    FOREIGN KEY (car_variant_id) REFERENCES car_variants(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================================================
-- 10. INQUIRIES
-- =========================================================
CREATE TABLE inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  car_model_id INT NULL,

  full_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  email VARCHAR(150),

  budget_range VARCHAR(100),
  monthly_budget VARCHAR(100),
  buying_timeline VARCHAR(100),

  needs_loan BOOLEAN DEFAULT FALSE,
  has_trade_in BOOLEAN DEFAULT FALSE,

  preferred_contact_method ENUM('whatsapp', 'phone_call', 'email') DEFAULT 'whatsapp',
  message TEXT,
  privacy_consent BOOLEAN NOT NULL DEFAULT FALSE,

  lead_source VARCHAR(100) DEFAULT 'website',
  status ENUM('new', 'contacted', 'interested', 'appointment_booked', 'loan_processing', 'won', 'lost') DEFAULT 'new',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_inquiries_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_inquiries_car_model_id
    FOREIGN KEY (car_model_id) REFERENCES car_models(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================================================
-- 11. APPOINTMENTS
-- =========================================================
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  inquiry_id INT NULL,
  car_model_id INT NULL,

  full_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  email VARCHAR(150),

  appointment_type ENUM(
    'showroom_visit',
    'test_drive',
    'loan_consultation',
    'trade_in_valuation',
    'model_comparison',
    'delivery_discussion'
  ) NOT NULL,

  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  message TEXT,

  status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled') DEFAULT 'pending',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_appointments_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_appointments_inquiry_id
    FOREIGN KEY (inquiry_id) REFERENCES inquiries(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_appointments_car_model_id
    FOREIGN KEY (car_model_id) REFERENCES car_models(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================================================
-- 12. LOAN CALCULATIONS
-- =========================================================
CREATE TABLE loan_calculations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  car_model_id INT NULL,
  car_variant_id INT NULL,

  car_price DECIMAL(12,2) NOT NULL,
  down_payment DECIMAL(12,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  loan_years INT NOT NULL,
  trade_in_value DECIMAL(12,2) DEFAULT 0.00,

  loan_amount DECIMAL(12,2) NOT NULL,
  total_interest DECIMAL(12,2) NOT NULL,
  estimated_monthly_payment DECIMAL(12,2) NOT NULL,
  advisor_note TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_loan_calculations_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_loan_calculations_car_model_id
    FOREIGN KEY (car_model_id) REFERENCES car_models(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_loan_calculations_car_variant_id
    FOREIGN KEY (car_variant_id) REFERENCES car_variants(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================================================
-- 13. TRADE-IN ESTIMATIONS
-- =========================================================
CREATE TABLE trade_in_estimations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  interested_car_model_id INT NULL,

  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  car_year YEAR NOT NULL,
  mileage INT,
  condition_level ENUM('excellent', 'good', 'fair', 'poor') DEFAULT 'good',
  accident_history BOOLEAN DEFAULT FALSE,
  has_full_service_record BOOLEAN DEFAULT FALSE,
  current_loan_balance DECIMAL(12,2) DEFAULT 0.00,

  estimated_value_min DECIMAL(12,2),
  estimated_value_max DECIMAL(12,2),
  estimation_note TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_trade_in_estimations_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_trade_in_estimations_interested_car_model_id
    FOREIGN KEY (interested_car_model_id) REFERENCES car_models(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================================================
-- 14. SAVED CARS
-- =========================================================
CREATE TABLE saved_cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  car_model_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_saved_cars_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_saved_cars_car_model_id
    FOREIGN KEY (car_model_id) REFERENCES car_models(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT unique_saved_car UNIQUE (user_id, car_model_id)
);

-- =========================================================
-- 15. SAVED COMPARISONS
-- =========================================================
CREATE TABLE saved_comparisons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150),
  car_model_ids JSON NOT NULL,
  comparison_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_saved_comparisons_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =========================================================
-- 16. CUSTOMER NOTES
-- =========================================================
CREATE TABLE customer_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  admin_user_id INT NULL,
  note TEXT NOT NULL,
  note_type ENUM('general', 'follow_up', 'loan', 'appointment', 'trade_in') DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_customer_notes_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_customer_notes_admin_user_id
    FOREIGN KEY (admin_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================================================
-- 17. TESTIMONIALS
-- =========================================================
CREATE TABLE testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  car_model_id INT NULL,
  rating INT DEFAULT 5,
  review TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,

  data_mode ENUM('mock', 'verified', 'archived') DEFAULT 'mock',
  is_mock_data BOOLEAN DEFAULT TRUE,
  data_status VARCHAR(255) DEFAULT 'Sample testimonial — replace with verified customer review later',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_testimonials_car_model_id
    FOREIGN KEY (car_model_id) REFERENCES car_models(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================================================
-- 18. CUSTOMER GALLERY
-- =========================================================
CREATE TABLE customer_gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_model_id INT NULL,
  title VARCHAR(150) NOT NULL,
  story TEXT,
  image_url VARCHAR(500),
  delivery_year YEAR,
  badge VARCHAR(100),
  has_customer_consent BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,

  data_mode ENUM('mock', 'verified', 'archived') DEFAULT 'mock',
  is_mock_data BOOLEAN DEFAULT TRUE,
  data_status VARCHAR(255) DEFAULT 'Sample gallery story — replace with verified customer delivery photo later',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_customer_gallery_car_model_id
    FOREIGN KEY (car_model_id) REFERENCES car_models(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================================================
-- 19. PROMOTIONS
-- =========================================================
CREATE TABLE promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_model_id INT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  start_date DATE NULL,
  end_date DATE NULL,
  status ENUM('draft', 'active', 'expired', 'archived') DEFAULT 'draft',
  disclaimer TEXT,

  data_mode ENUM('mock', 'verified', 'archived') DEFAULT 'mock',
  is_mock_data BOOLEAN DEFAULT TRUE,
  data_status VARCHAR(255) DEFAULT 'Sample promotion — confirm latest dealership/Honda Malaysia campaign before publishing',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_promotions_car_model_id
    FOREIGN KEY (car_model_id) REFERENCES car_models(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================================================
-- 20. BLOG POSTS
-- =========================================================
CREATE TABLE blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_user_id INT NULL,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  excerpt VARCHAR(300),
  content LONGTEXT,
  cover_image_url VARCHAR(500),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  published_at DATETIME NULL,

  data_mode ENUM('mock', 'verified', 'archived') DEFAULT 'mock',
  is_mock_data BOOLEAN DEFAULT TRUE,
  data_status VARCHAR(255) DEFAULT 'Sample buying guide content — review before publishing',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_blog_posts_author_user_id
    FOREIGN KEY (author_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================================================
-- 21. FAQ ITEMS
-- =========================================================
CREATE TABLE faq_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category ENUM('loan', 'booking', 'trade_in', 'test_drive', 'promotion', 'after_sales', 'general') DEFAULT 'general',
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,

  data_mode ENUM('mock', 'verified', 'archived') DEFAULT 'mock',
  is_mock_data BOOLEAN DEFAULT TRUE,
  data_status VARCHAR(255) DEFAULT 'Sample FAQ — verify final answer before publishing',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- 22. QUOTATION PDFS
-- =========================================================
CREATE TABLE quotation_pdfs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  inquiry_id INT NULL,
  car_model_id INT NULL,
  car_variant_id INT NULL,

  quotation_number VARCHAR(100) UNIQUE,
  pdf_url VARCHAR(500),
  total_estimated_price DECIMAL(12,2),
  estimated_monthly_payment DECIMAL(12,2),
  status ENUM('draft', 'generated', 'sent', 'archived') DEFAULT 'draft',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_quotation_pdfs_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_quotation_pdfs_inquiry_id
    FOREIGN KEY (inquiry_id) REFERENCES inquiries(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_quotation_pdfs_car_model_id
    FOREIGN KEY (car_model_id) REFERENCES car_models(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_quotation_pdfs_car_variant_id
    FOREIGN KEY (car_variant_id) REFERENCES car_variants(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- =========================================================
-- 23. NOTIFICATIONS
-- =========================================================
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  notification_type ENUM('lead', 'appointment', 'system', 'quotation', 'reminder') DEFAULT 'system',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notifications_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =========================================================
-- 24. ADMIN ACTIVITY LOGS
-- =========================================================
CREATE TABLE admin_activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(150) NOT NULL,
  module_name VARCHAR(100) NOT NULL,
  description TEXT,
  ip_address VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_admin_activity_logs_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);