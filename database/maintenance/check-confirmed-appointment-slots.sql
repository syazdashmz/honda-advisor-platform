USE honda_advisor_db;

-- Returns rows only when confirmed appointments share the same date/time slot.
SELECT
  preferred_date,
  preferred_time,
  COUNT(*) AS confirmed_count,
  GROUP_CONCAT(id ORDER BY id) AS appointment_ids
FROM appointments
WHERE status = 'confirmed'
GROUP BY preferred_date, preferred_time
HAVING COUNT(*) > 1;

-- Confirms the appointment slot helper indexes are present.
SELECT
  INDEX_NAME,
  NON_UNIQUE,
  COLUMN_NAME,
  SEQ_IN_INDEX
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'appointments'
  AND INDEX_NAME IN (
    'idx_appointments_date_time_status',
    'unique_appointments_confirmed_slot'
  )
ORDER BY INDEX_NAME, SEQ_IN_INDEX;
