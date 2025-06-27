-- Add trigger_set_timestamp function if not exists
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create schedule table
CREATE TABLE IF NOT EXISTS schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    profile_lesson_class_id UUID NOT NULL REFERENCES profile_lesson_class (id) ON DELETE CASCADE,
    week_id UUID NOT NULL REFERENCES week (id) ON DELETE CASCADE,
    schedule_time INTEGER NOT NULL, -- Store time slot as integer (1-48 for each timeline in a week)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add unique constraint to prevent duplicate schedules
CREATE UNIQUE INDEX schedule_unique_idx ON schedule (
    profile_lesson_class_id,
    week_id
);

-- Add index for faster lookups
CREATE INDEX schedule_week_idx ON schedule (week_id);

CREATE INDEX schedule_profile_lesson_class_idx ON schedule (profile_lesson_class_id);

-- Create trigger for updating timestamp
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON schedule
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();