-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  budget NUMERIC NOT NULL CHECK (budget >= 100),
  cpa_target NUMERIC NOT NULL CHECK (cpa_target >= 0.5),
  sector TEXT NOT NULL CHECK (sector IN ('ecommerce', 'infoproduct', 'lead_gen_b2c')),
  duration_days INTEGER NOT NULL CHECK (duration_days BETWEEN 1 AND 90),
  forecast_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_created_at ON scenarios(created_at DESC);

-- Row Level Security
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read anonymous scenarios (user_id IS NULL)
CREATE POLICY "Anonymous scenarios are readable by everyone"
  ON scenarios
  FOR SELECT
  USING (user_id IS NULL);

-- Policy: Users can read their own scenarios
CREATE POLICY "Users can read own scenarios"
  ON scenarios
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own scenarios or anonymous ones
CREATE POLICY "Users can insert own scenarios"
  ON scenarios
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can delete their own scenarios
CREATE POLICY "Users can delete own scenarios"
  ON scenarios
  FOR DELETE
  USING (auth.uid() = user_id);
