USE honda_advisor_db;

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
  '',
  'View Honda Models',
  '/cars',
  'Calculate Loan',
  '/loan-calculator',
  'Serving Honda customers since 2002',
  'This platform is designed as a personal online showroom for a Honda sales advisor based at Tenaga Setia Resources Sdn. Bhd. It helps customers explore models, estimate monthly payment, submit inquiries, and arrange appointments.',
  '',
  'Sample homepage content. Admin can update this from the admin panel.',
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM site_home_content LIMIT 1
);