-- Create Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    profile_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    total_point INTEGER NOT NULL DEFAULT 0,
    correct_answers UUID [] NOT NULL DEFAULT '{}',
    wrong_answers UUID [] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Index on profile_id for faster lookups
CREATE INDEX idx_submissions_profile ON submissions (profile_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();