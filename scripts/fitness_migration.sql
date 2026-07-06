-- Fitness Workout Columns Migration
-- Run this against your live Neon Postgres database

ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS pullups INTEGER DEFAULT 0;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS jump_squats INTEGER DEFAULT 0;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS swim_laps INTEGER DEFAULT 0;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS football_mins INTEGER DEFAULT 0;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS jump_rope_mins INTEGER DEFAULT 0;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS running_mins INTEGER DEFAULT 0;
