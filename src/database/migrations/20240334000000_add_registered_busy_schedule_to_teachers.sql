-- Add registered_busy_schedule column to teachers table
ALTER TABLE teachers
ADD COLUMN registered_busy_schedule INTEGER[] DEFAULT '{}';