-- Drop existing submissions table
DROP TABLE IF EXISTS submissions;

-- Create modified submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    profile_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises (id) ON DELETE CASCADE,
    selected_answers TEXT [] NOT NULL,
    is_correct BOOLEAN NOT NULL,
    point INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX idx_submissions_profile ON submissions (profile_id);

CREATE INDEX idx_submissions_exercise ON submissions (exercise_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();