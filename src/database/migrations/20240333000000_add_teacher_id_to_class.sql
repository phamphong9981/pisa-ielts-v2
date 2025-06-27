-- Add teacher_id column to class table
ALTER TABLE class
ADD COLUMN teacher_id UUID,
ADD CONSTRAINT fk_teacher FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE SET NULL;

-- Create Index on teacher_id for faster lookups
CREATE INDEX idx_class_teacher ON class (teacher_id);