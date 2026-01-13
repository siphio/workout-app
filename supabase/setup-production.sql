-- ============================================================================
-- CLEAN GAINS - PRODUCTION DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- https://supabase.com/dashboard/project/vtiwvumlpkqahwstluff/sql
-- ============================================================================

-- STEP 1: SCHEMA
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (single user for MVP)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Marley',
  email TEXT,
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
  default_rest_seconds INTEGER DEFAULT 90,
  timer_sound_enabled BOOLEAN DEFAULT true,
  vibration_enabled BOOLEAN DEFAULT true,
  workout_reminders_enabled BOOLEAN DEFAULT true,
  rest_day_alerts_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout types (Push, Pull, Legs, Rest)
CREATE TABLE IF NOT EXISTS workout_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises linked to workout types
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_type_id UUID REFERENCES workout_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  default_sets INTEGER NOT NULL DEFAULT 3,
  target_reps_min INTEGER NOT NULL DEFAULT 8,
  target_reps_max INTEGER NOT NULL DEFAULT 12,
  rest_seconds INTEGER NOT NULL DEFAULT 90,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout logs (individual workout sessions)
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workout_type_id UUID REFERENCES workout_types(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  total_volume DECIMAL(10,2),
  duration_seconds INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set logs (individual sets within workouts)
CREATE TABLE IF NOT EXISTS set_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_log_id UUID REFERENCES workout_logs(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  set_number INTEGER NOT NULL,
  weight DECIMAL(6,2) NOT NULL,
  reps INTEGER NOT NULL,
  is_pr BOOLEAN DEFAULT false,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal records tracking
CREATE TABLE IF NOT EXISTS personal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  pr_type TEXT NOT NULL CHECK (pr_type IN ('max_weight', 'weight_at_reps', 'max_volume')),
  value DECIMAL(10,2) NOT NULL,
  reps INTEGER,
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  workout_log_id UUID REFERENCES workout_logs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exercise_id, pr_type)
);

-- Schedule state for PPL rotation
CREATE TABLE IF NOT EXISTS schedule_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  cycle_position INTEGER DEFAULT 0 CHECK (cycle_position BETWEEN 0 AND 3),
  last_completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weight comparisons for gamification
CREATE TABLE IF NOT EXISTS weight_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  min_weight DECIMAL(10,2) NOT NULL,
  max_weight DECIMAL(10,2) NOT NULL,
  comparison_name TEXT NOT NULL,
  image_filename TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals for progress tracking
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  target_weight DECIMAL(6,2) NOT NULL,
  target_date DATE,
  current_weight DECIMAL(6,2),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_started_at ON workout_logs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_set_logs_workout_log_id ON set_logs(workout_log_id);
CREATE INDEX IF NOT EXISTS idx_set_logs_exercise_id ON set_logs(exercise_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_user_exercise ON personal_records(user_id, exercise_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers (drop first if exists to avoid errors)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_schedule_state_updated_at ON schedule_state;
CREATE TRIGGER update_schedule_state_updated_at
  BEFORE UPDATE ON schedule_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- STEP 2: ROW LEVEL SECURITY
-- ============================================================================

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
DROP POLICY IF EXISTS "Allow public read for users" ON users;
DROP POLICY IF EXISTS "Allow public insert for users" ON users;
DROP POLICY IF EXISTS "Allow public update for users" ON users;
CREATE POLICY "Allow public read for users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert for users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for users" ON users FOR UPDATE USING (true);

-- Workout types table
DROP POLICY IF EXISTS "Allow public read for workout_types" ON workout_types;
DROP POLICY IF EXISTS "Allow public insert for workout_types" ON workout_types;
CREATE POLICY "Allow public read for workout_types" ON workout_types FOR SELECT USING (true);
CREATE POLICY "Allow public insert for workout_types" ON workout_types FOR INSERT WITH CHECK (true);

-- Exercises table
DROP POLICY IF EXISTS "Allow public read for exercises" ON exercises;
DROP POLICY IF EXISTS "Allow public insert for exercises" ON exercises;
CREATE POLICY "Allow public read for exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Allow public insert for exercises" ON exercises FOR INSERT WITH CHECK (true);

-- Workout logs table
DROP POLICY IF EXISTS "Allow public read for workout_logs" ON workout_logs;
DROP POLICY IF EXISTS "Allow public insert for workout_logs" ON workout_logs;
DROP POLICY IF EXISTS "Allow public update for workout_logs" ON workout_logs;
CREATE POLICY "Allow public read for workout_logs" ON workout_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert for workout_logs" ON workout_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for workout_logs" ON workout_logs FOR UPDATE USING (true);

-- Set logs table
DROP POLICY IF EXISTS "Allow public read for set_logs" ON set_logs;
DROP POLICY IF EXISTS "Allow public insert for set_logs" ON set_logs;
DROP POLICY IF EXISTS "Allow public update for set_logs" ON set_logs;
DROP POLICY IF EXISTS "Allow public delete for set_logs" ON set_logs;
CREATE POLICY "Allow public read for set_logs" ON set_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert for set_logs" ON set_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for set_logs" ON set_logs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete for set_logs" ON set_logs FOR DELETE USING (true);

-- Personal records table
DROP POLICY IF EXISTS "Allow public read for personal_records" ON personal_records;
DROP POLICY IF EXISTS "Allow public insert for personal_records" ON personal_records;
DROP POLICY IF EXISTS "Allow public update for personal_records" ON personal_records;
CREATE POLICY "Allow public read for personal_records" ON personal_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert for personal_records" ON personal_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for personal_records" ON personal_records FOR UPDATE USING (true);

-- Schedule state table
DROP POLICY IF EXISTS "Allow public read for schedule_state" ON schedule_state;
DROP POLICY IF EXISTS "Allow public insert for schedule_state" ON schedule_state;
DROP POLICY IF EXISTS "Allow public update for schedule_state" ON schedule_state;
CREATE POLICY "Allow public read for schedule_state" ON schedule_state FOR SELECT USING (true);
CREATE POLICY "Allow public insert for schedule_state" ON schedule_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for schedule_state" ON schedule_state FOR UPDATE USING (true);

-- Weight comparisons table
DROP POLICY IF EXISTS "Allow public read for weight_comparisons" ON weight_comparisons;
DROP POLICY IF EXISTS "Allow public insert for weight_comparisons" ON weight_comparisons;
CREATE POLICY "Allow public read for weight_comparisons" ON weight_comparisons FOR SELECT USING (true);
CREATE POLICY "Allow public insert for weight_comparisons" ON weight_comparisons FOR INSERT WITH CHECK (true);

-- Goals table
DROP POLICY IF EXISTS "Allow public read for goals" ON goals;
DROP POLICY IF EXISTS "Allow public insert for goals" ON goals;
DROP POLICY IF EXISTS "Allow public update for goals" ON goals;
CREATE POLICY "Allow public read for goals" ON goals FOR SELECT USING (true);
CREATE POLICY "Allow public insert for goals" ON goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for goals" ON goals FOR UPDATE USING (true);

-- STEP 3: SEED DATA
-- ============================================================================

-- Insert default user (only if not exists)
INSERT INTO users (id, name, email, weight_unit, default_rest_seconds)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Marley',
  'marley@email.com',
  'kg',
  90
)
ON CONFLICT (id) DO NOTHING;

-- Insert workout types
INSERT INTO workout_types (id, name, display_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Push', 0),
  ('10000000-0000-0000-0000-000000000002', 'Pull', 1),
  ('10000000-0000-0000-0000-000000000003', 'Legs', 2),
  ('10000000-0000-0000-0000-000000000004', 'Rest', 3)
ON CONFLICT (name) DO NOTHING;

-- Insert Push Day exercises
INSERT INTO exercises (workout_type_id, name, display_order, default_sets, target_reps_min, target_reps_max, rest_seconds, notes) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Barbell Bench Press', 1, 4, 6, 8, 180, 'Compound strength focus. Retract shoulder blades, arch upper back slightly.'),
  ('10000000-0000-0000-0000-000000000001', 'Seated Dumbbell Shoulder Press', 2, 3, 8, 10, 120, 'Strict form, no leg drive. Keep core tight.'),
  ('10000000-0000-0000-0000-000000000001', 'Incline Dumbbell Press', 3, 3, 8, 12, 90, '30-45° angle. Press in slight arc.'),
  ('10000000-0000-0000-0000-000000000001', 'Cable Lateral Raises', 4, 3, 12, 15, 60, 'Control the negative. Lead with elbow.'),
  ('10000000-0000-0000-0000-000000000001', 'Tricep Pushdowns (Rope)', 5, 3, 10, 12, 60, 'Keep elbows pinned to sides. Spread rope at bottom.'),
  ('10000000-0000-0000-0000-000000000001', 'Overhead Tricep Extension', 6, 3, 10, 12, 60, 'Keep elbows pointed forward. Full stretch at bottom.')
ON CONFLICT DO NOTHING;

-- Insert Pull Day exercises
INSERT INTO exercises (workout_type_id, name, display_order, default_sets, target_reps_min, target_reps_max, rest_seconds, notes) VALUES
  ('10000000-0000-0000-0000-000000000002', 'Barbell Deadlift', 1, 4, 5, 6, 210, 'Strength focus, reset each rep. Push floor away.'),
  ('10000000-0000-0000-0000-000000000002', 'Weighted Pull-Ups', 2, 4, 6, 10, 150, 'Full dead hang at bottom. Pull elbows to hips.'),
  ('10000000-0000-0000-0000-000000000002', 'Barbell Bent Over Row', 3, 3, 8, 10, 120, 'Overhand grip, 45° torso. Pull to lower chest.'),
  ('10000000-0000-0000-0000-000000000002', 'Face Pulls', 4, 3, 15, 20, 60, 'External rotation at top. Pull to ears.'),
  ('10000000-0000-0000-0000-000000000002', 'Barbell Curls', 5, 3, 8, 10, 60, 'No swinging. Keep elbows pinned.'),
  ('10000000-0000-0000-0000-000000000002', 'Hammer Curls', 6, 3, 10, 12, 60, 'Neutral grip throughout. Alternating or together.')
ON CONFLICT DO NOTHING;

-- Insert Legs Day exercises
INSERT INTO exercises (workout_type_id, name, display_order, default_sets, target_reps_min, target_reps_max, rest_seconds, notes) VALUES
  ('10000000-0000-0000-0000-000000000003', 'Barbell Back Squat', 1, 4, 6, 8, 180, 'High bar, full depth. Drive through whole foot.'),
  ('10000000-0000-0000-0000-000000000003', 'Romanian Deadlift', 2, 3, 8, 10, 120, 'Feel hamstring stretch. Bar stays close to legs.'),
  ('10000000-0000-0000-0000-000000000003', 'Leg Press', 3, 3, 10, 12, 120, 'Feet shoulder width. Don''t lock knees at top.'),
  ('10000000-0000-0000-0000-000000000003', 'Leg Curl', 4, 3, 10, 12, 90, 'Squeeze at contraction. Slow negative.'),
  ('10000000-0000-0000-0000-000000000003', 'Leg Extension', 5, 3, 12, 15, 60, 'Pause at top. Control the descent.'),
  ('10000000-0000-0000-0000-000000000003', 'Standing Calf Raises', 6, 4, 12, 15, 60, 'Full ROM, pause at top. Rise onto big toe.')
ON CONFLICT DO NOTHING;

-- Insert weight comparisons
INSERT INTO weight_comparisons (min_weight, max_weight, comparison_name, image_filename) VALUES
  (500, 1500, 'Baby Elephant', 'baby-elephant.png'),
  (1500, 3000, 'Grand Piano', 'grand-piano.png'),
  (3000, 5000, 'Small Car', 'small-car.png'),
  (5000, 8000, 'Helicopter', 'helicopter.png'),
  (8000, 12000, 'T-Rex', 'trex.png'),
  (12000, 18000, 'African Elephant', 'african-elephant.png'),
  (18000, 30000, 'School Bus', 'school-bus.png'),
  (30000, 999999, 'Blue Whale', 'blue-whale.png')
ON CONFLICT DO NOTHING;

-- Initialize schedule state for user (only if not exists)
INSERT INTO schedule_state (user_id, cycle_position, last_completed_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  0,
  NULL
)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- SETUP COMPLETE!
-- Your app should now work. Go to https://workout-app-three-steel.vercel.app
-- ============================================================================
