-- Create Configs Table
CREATE TABLE IF NOT EXISTS configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Index on key for faster lookups
CREATE INDEX idx_configs_key ON configs (key);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON configs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();