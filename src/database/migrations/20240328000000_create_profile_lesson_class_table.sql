-- Create profile_lesson_class table
CREATE TABLE IF NOT EXISTS profile_lesson_class (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    profile_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES class (id) ON DELETE CASCADE,
    lesson INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Add unique constraint to prevent duplicate lessons for same profile and class
    UNIQUE (profile_id, class_id, lesson)
);

-- Create indexes for faster lookups and joins
CREATE INDEX idx_profile_lesson_class_profile ON profile_lesson_class (profile_id);

CREATE INDEX idx_profile_lesson_class_class ON profile_lesson_class (class_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON profile_lesson_class
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();