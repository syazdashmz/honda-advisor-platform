USE honda_advisor_db;

-- Update this email before running the script.
SET @admin_email = 'admin@example.com';

UPDATE users u
JOIN roles r ON r.name = 'admin'
SET u.role_id = r.id
WHERE u.email = @admin_email;

SELECT
  u.id,
  u.full_name,
  u.email,
  r.name AS role_name,
  u.status
FROM users u
JOIN roles r ON r.id = u.role_id
WHERE u.email = @admin_email;
