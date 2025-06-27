-- Create Busy Schedule Table
CREATE TABLE IF NOT EXISTS busy_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    profile_id UUID NOT NULL,
    busy_schedule_arr INTEGER[] NOT NULL,
    start_week DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
);

-- Create Index on profile_id and start_week
CREATE INDEX idx_busy_schedule_profile ON busy_schedule (profile_id);

CREATE INDEX idx_busy_schedule_week ON busy_schedule (start_week);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_busy_schedule_updated_at
    BEFORE UPDATE ON busy_schedule
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();