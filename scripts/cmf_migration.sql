-- CMF Studio Migration
-- Run this against your live Neon Postgres database

-- Add CMF Studio persistent metrics to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS sample_video_trials INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS active_monthly_packages INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked_clients INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS portfolio_value DECIMAL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS portfolio_health INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_contribution DECIMAL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_investment_goal DECIMAL DEFAULT 1000;

-- Add CMF Studio daily counters to daily_logs
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS sample_videos_delivered INTEGER DEFAULT 0;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS interview_sessions INTEGER DEFAULT 0;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS diet_calories INTEGER DEFAULT 0;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS diet_protein INTEGER DEFAULT 0;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS diet_carbs INTEGER DEFAULT 0;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS diet_fat INTEGER DEFAULT 0;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS diet_meals_complete INTEGER DEFAULT 0;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS water BOOLEAN DEFAULT false;
