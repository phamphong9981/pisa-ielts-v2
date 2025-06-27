-- Add correct_answer and point columns to exercises table
ALTER TABLE exercises
ADD COLUMN correct_answer TEXT [] NOT NULL DEFAULT '{}',
ADD COLUMN point INTEGER NOT NULL DEFAULT 1;