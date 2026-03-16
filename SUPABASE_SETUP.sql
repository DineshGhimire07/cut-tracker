-- Run this in the Supabase SQL Editor to create the correct tables for the dashboard

CREATE TABLE app_state (
  id text PRIMARY KEY,
  data jsonb NOT NULL
);

CREATE TABLE daily_logs (
  id text PRIMARY KEY,
  data jsonb NOT NULL
);

-- Enable RLS but allow anon read/write (since this is a single user personal dashboard)
ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all on app_state" ON app_state FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on daily_logs" ON daily_logs FOR ALL USING (true) WITH CHECK (true);
