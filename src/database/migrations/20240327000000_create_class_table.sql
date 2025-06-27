-- Create trigger function for updating timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create class_type enum
CREATE TYPE class_type AS ENUM ('FT_reading', 'FT_writing', 'FT_listening', 'FT_speaking', 'N_reading', 'N_writing', 'N_listening', 'N_speaking');

-- Create class table
CREATE TABLE IF NOT EXISTS class (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    total_student INTEGER NOT NULL DEFAULT 0,
    total_lesson_per_week INTEGER NOT NULL DEFAULT 0,
    class_type class_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name for faster lookups
CREATE INDEX idx_class_name ON class (name);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON class
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();