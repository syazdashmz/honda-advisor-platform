USE honda_advisor_db;

-- Migration: 2026-05-08-current-implementation-fixes
-- Purpose: Bring an existing database in line with the current Angular/Express app.
-- Run this only for an existing database. Fresh installs should use schema.sql, then seed.sql.

CREATE TABLE IF NOT EXISTS site_home_content (
  id INT PRIMARY KEY AUTO_INCREMENT,

  hero_badge VARCHAR(120) NOT NULL DEFAULT 'Trusted Honda Advisor',
  hero_title VARCHAR(255) NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_image_url VARCHAR(500) NULL,

  primary_cta_label VARCHAR(80) NOT NULL DEFAULT 'View Honda Models',
  primary_cta_link VARCHAR(255) NOT NULL DEFAULT '/cars',
  secondary_cta_label VARCHAR(80) NOT NULL DEFAULT 'Calculate Loan',
  secondary_cta_link VARCHAR(255) NOT NULL DEFAULT '/loan-calculator',

  advisor_title VARCHAR(255) NOT NULL,
  advisor_text TEXT NOT NULL,
  advisor_image_url VARCHAR(500) NULL,

  announcement_text VARCHAR(255) NULL,

  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by INT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_site_home_content_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

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
  is_active
)
SELECT
  'Trusted Honda Advisor',
  'Meet your personal Honda sales advisor',
  'Serving Honda customers since 2002 at Tenaga Setia Resources Sdn. Bhd. with personal guidance from inquiry to delivery.',
  '/images/home/home-showroom-01.webp',
  'View Honda Models',
  '/cars',
  'Calculate Loan',
  '/loan-calculator',
  'Serving Honda customers since 2002',
  'This platform is designed as a personal online showroom for a Honda sales advisor based at Tenaga Setia Resources Sdn. Bhd. It helps customers explore models, estimate monthly payment, submit inquiries, and arrange appointments.',
  '/images/advisor/advisor-profile.webp',
  'Sample homepage content. Admin can update this from the admin panel.',
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM site_home_content LIMIT 1
);

ALTER TABLE appointments
  MODIFY status ENUM('pending', 'confirmed', 'declined', 'cancelled', 'completed', 'rescheduled')
  NOT NULL DEFAULT 'pending';

SET @confirmed_slot_key_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'appointments'
    AND COLUMN_NAME = 'confirmed_slot_key'
);

SET @sql := IF(
  @confirmed_slot_key_exists = 0,
  "ALTER TABLE appointments ADD COLUMN confirmed_slot_key VARCHAR(64) GENERATED ALWAYS AS (CASE WHEN status = 'confirmed' THEN CONCAT(preferred_date, ' ', preferred_time) ELSE NULL END) STORED",
  "SELECT 'confirmed_slot_key already exists' AS info"
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @slot_index_exists := (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'appointments'
    AND INDEX_NAME = 'idx_appointments_date_time_status'
);

SET @sql := IF(
  @slot_index_exists = 0,
  'CREATE INDEX idx_appointments_date_time_status ON appointments (preferred_date, preferred_time, status)',
  "SELECT 'idx_appointments_date_time_status already exists' AS info"
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @duplicate_confirmed_slots := (
  SELECT COUNT(*)
  FROM (
    SELECT preferred_date, preferred_time
    FROM appointments
    WHERE status = 'confirmed'
    GROUP BY preferred_date, preferred_time
    HAVING COUNT(*) > 1
  ) duplicate_slots
);

SET @confirmed_unique_index_exists := (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'appointments'
    AND COLUMN_NAME = 'confirmed_slot_key'
    AND NON_UNIQUE = 0
);

SET @sql := IF(
  @confirmed_unique_index_exists = 0 AND @duplicate_confirmed_slots = 0,
  'CREATE UNIQUE INDEX unique_appointments_confirmed_slot ON appointments (confirmed_slot_key)',
  "SELECT 'Skipped unique confirmed-slot index because it already exists or duplicate confirmed slots must be resolved first' AS info"
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT preferred_date, preferred_time, COUNT(*) AS confirmed_count
FROM appointments
WHERE status = 'confirmed'
GROUP BY preferred_date, preferred_time
HAVING COUNT(*) > 1;
