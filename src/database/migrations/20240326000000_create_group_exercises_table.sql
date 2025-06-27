-- Create Group Exercises Table
CREATE TABLE IF NOT EXISTS group_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_group_exercises_updated_at
    BEFORE UPDATE ON group_exercises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add group_id to exercises table
ALTER TABLE exercises
ADD COLUMN group_id UUID,
ADD CONSTRAINT fk_group_exercises FOREIGN KEY (group_id) REFERENCES group_exercises (id) ON DELETE SET NULL;