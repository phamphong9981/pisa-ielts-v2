-- Create Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    skills TEXT [] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Index on name for faster lookups
CREATE INDEX idx_teachers_name ON teachers (name);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON teachers
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();