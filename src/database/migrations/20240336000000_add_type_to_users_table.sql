-- Add type column to users table
CREATE TYPE user_type_enum AS ENUM ('admin', 'user', 'teacher');

ALTER TABLE users
ADD COLUMN type user_type_enum DEFAULT 'user' NOT NULL;