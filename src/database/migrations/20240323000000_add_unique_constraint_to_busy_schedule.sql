-- Add unique constraint for profile_id and week_id combination
ALTER TABLE busy_schedule
ADD CONSTRAINT unique_profile_week UNIQUE (profile_id, week_id);