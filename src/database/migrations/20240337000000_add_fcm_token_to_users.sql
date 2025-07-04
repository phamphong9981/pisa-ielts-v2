-- Add fcm_token column to users table
ALTER TABLE users ADD COLUMN fcm_token VARCHAR(255);

-- Create index for fcm_token
CREATE INDEX idx_users_fcm_token ON users (fcm_token);