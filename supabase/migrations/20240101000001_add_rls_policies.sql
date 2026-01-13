-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE set_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- For MVP: Allow public access (no auth required)
-- Users table
CREATE POLICY "Allow public read for users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert for users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for users" ON users FOR UPDATE USING (true);

-- Workout types table (read-only reference data)
CREATE POLICY "Allow public read for workout_types" ON workout_types FOR SELECT USING (true);
CREATE POLICY "Allow public insert for workout_types" ON workout_types FOR INSERT WITH CHECK (true);

-- Exercises table (read-only reference data)
CREATE POLICY "Allow public read for exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Allow public insert for exercises" ON exercises FOR INSERT WITH CHECK (true);

-- Workout logs table
CREATE POLICY "Allow public read for workout_logs" ON workout_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert for workout_logs" ON workout_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for workout_logs" ON workout_logs FOR UPDATE USING (true);

-- Set logs table
CREATE POLICY "Allow public read for set_logs" ON set_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert for set_logs" ON set_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for set_logs" ON set_logs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for set_logs" ON set_logs FOR DELETE USING (true);

-- Personal records table
CREATE POLICY "Allow public read for personal_records" ON personal_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert for personal_records" ON personal_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for personal_records" ON personal_records FOR UPDATE USING (true);

-- Schedule state table
CREATE POLICY "Allow public read for schedule_state" ON schedule_state FOR SELECT USING (true);
CREATE POLICY "Allow public insert for schedule_state" ON schedule_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for schedule_state" ON schedule_state FOR UPDATE USING (true);

-- Weight comparisons table (read-only reference data)
CREATE POLICY "Allow public read for weight_comparisons" ON weight_comparisons FOR SELECT USING (true);
CREATE POLICY "Allow public insert for weight_comparisons" ON weight_comparisons FOR INSERT WITH CHECK (true);

-- Goals table
CREATE POLICY "Allow public read for goals" ON goals FOR SELECT USING (true);
CREATE POLICY "Allow public insert for goals" ON goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for goals" ON goals FOR UPDATE USING (true);
