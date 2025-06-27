-- Create Exercise Types Enum
CREATE TYPE question_type AS ENUM ('reading', 'writing', 'listening');

CREATE TYPE answer_type AS ENUM ('multiple_choice', 'single_choice', 'text', 'fill_in_the_blank');

-- Create Exercises Table
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    question TEXT NOT NULL,
    answer TEXT [] NOT NULL,
    question_type question_type NOT NULL,
    answer_type answer_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_exercises_question_type ON exercises (question_type);

CREATE INDEX idx_exercises_answer_type ON exercises (answer_type);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON exercises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();