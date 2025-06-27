-- Create Week Table
CREATE TABLE IF NOT EXISTS week (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    start_date DATE NOT NULL UNIQUE,
    schedule_status VARCHAR(50) NOT NULL DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_schedule_status CHECK (
        schedule_status IN ('open', 'closed', 'pending')
    )
);

-- Create Index on start_date
CREATE INDEX idx_week_start_date ON week (start_date);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_week_updated_at
    BEFORE UPDATE ON week
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Modify busy_schedule table
ALTER TABLE busy_schedule
DROP COLUMN start_week,
ADD COLUMN week_id UUID NOT NULL,
ADD CONSTRAINT fk_week FOREIGN KEY (week_id) REFERENCES week (id) ON DELETE CASCADE;

-- Create Index on week_id
CREATE INDEX idx_busy_schedule_week_id ON busy_schedule (week_id);