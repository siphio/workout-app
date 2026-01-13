-- Insert default user
INSERT INTO users (id, name, email, weight_unit, default_rest_seconds)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Marley',
  'marley@email.com',
  'kg',
  90
);

-- Insert workout types
INSERT INTO workout_types (id, name, display_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Push', 0),
  ('10000000-0000-0000-0000-000000000002', 'Pull', 1),
  ('10000000-0000-0000-0000-000000000003', 'Legs', 2),
  ('10000000-0000-0000-0000-000000000004', 'Rest', 3);

-- Insert Push Day exercises
INSERT INTO exercises (workout_type_id, name, display_order, default_sets, target_reps_min, target_reps_max, rest_seconds, notes) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Barbell Bench Press', 1, 4, 6, 8, 180, 'Compound strength focus. Retract shoulder blades, arch upper back slightly.'),
  ('10000000-0000-0000-0000-000000000001', 'Seated Dumbbell Shoulder Press', 2, 3, 8, 10, 120, 'Strict form, no leg drive. Keep core tight.'),
  ('10000000-0000-0000-0000-000000000001', 'Incline Dumbbell Press', 3, 3, 8, 12, 90, '30-45° angle. Press in slight arc.'),
  ('10000000-0000-0000-0000-000000000001', 'Cable Lateral Raises', 4, 3, 12, 15, 60, 'Control the negative. Lead with elbow.'),
  ('10000000-0000-0000-0000-000000000001', 'Tricep Pushdowns (Rope)', 5, 3, 10, 12, 60, 'Keep elbows pinned to sides. Spread rope at bottom.'),
  ('10000000-0000-0000-0000-000000000001', 'Overhead Tricep Extension', 6, 3, 10, 12, 60, 'Keep elbows pointed forward. Full stretch at bottom.');

-- Insert Pull Day exercises
INSERT INTO exercises (workout_type_id, name, display_order, default_sets, target_reps_min, target_reps_max, rest_seconds, notes) VALUES
  ('10000000-0000-0000-0000-000000000002', 'Barbell Deadlift', 1, 4, 5, 6, 210, 'Strength focus, reset each rep. Push floor away.'),
  ('10000000-0000-0000-0000-000000000002', 'Weighted Pull-Ups', 2, 4, 6, 10, 150, 'Full dead hang at bottom. Pull elbows to hips.'),
  ('10000000-0000-0000-0000-000000000002', 'Barbell Bent Over Row', 3, 3, 8, 10, 120, 'Overhand grip, 45° torso. Pull to lower chest.'),
  ('10000000-0000-0000-0000-000000000002', 'Face Pulls', 4, 3, 15, 20, 60, 'External rotation at top. Pull to ears.'),
  ('10000000-0000-0000-0000-000000000002', 'Barbell Curls', 5, 3, 8, 10, 60, 'No swinging. Keep elbows pinned.'),
  ('10000000-0000-0000-0000-000000000002', 'Hammer Curls', 6, 3, 10, 12, 60, 'Neutral grip throughout. Alternating or together.');

-- Insert Legs Day exercises
INSERT INTO exercises (workout_type_id, name, display_order, default_sets, target_reps_min, target_reps_max, rest_seconds, notes) VALUES
  ('10000000-0000-0000-0000-000000000003', 'Barbell Back Squat', 1, 4, 6, 8, 180, 'High bar, full depth. Drive through whole foot.'),
  ('10000000-0000-0000-0000-000000000003', 'Romanian Deadlift', 2, 3, 8, 10, 120, 'Feel hamstring stretch. Bar stays close to legs.'),
  ('10000000-0000-0000-0000-000000000003', 'Leg Press', 3, 3, 10, 12, 120, 'Feet shoulder width. Don''t lock knees at top.'),
  ('10000000-0000-0000-0000-000000000003', 'Leg Curl', 4, 3, 10, 12, 90, 'Squeeze at contraction. Slow negative.'),
  ('10000000-0000-0000-0000-000000000003', 'Leg Extension', 5, 3, 12, 15, 60, 'Pause at top. Control the descent.'),
  ('10000000-0000-0000-0000-000000000003', 'Standing Calf Raises', 6, 4, 12, 15, 60, 'Full ROM, pause at top. Rise onto big toe.');

-- Insert weight comparisons
INSERT INTO weight_comparisons (min_weight, max_weight, comparison_name, image_filename) VALUES
  (500, 1500, 'Baby Elephant', 'baby-elephant.png'),
  (1500, 3000, 'Grand Piano', 'grand-piano.png'),
  (3000, 5000, 'Small Car', 'small-car.png'),
  (5000, 8000, 'Helicopter', 'helicopter.png'),
  (8000, 12000, 'T-Rex', 'trex.png'),
  (12000, 18000, 'African Elephant', 'african-elephant.png'),
  (18000, 30000, 'School Bus', 'school-bus.png'),
  (30000, 999999, 'Blue Whale', 'blue-whale.png');

-- Initialize schedule state for user
INSERT INTO schedule_state (user_id, cycle_position, last_completed_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  0,
  NULL
);

-- Insert sample goals
INSERT INTO goals (user_id, exercise_id, target_weight, target_date, current_weight)
SELECT
  '00000000-0000-0000-0000-000000000001',
  e.id,
  100,
  '2025-03-01',
  85
FROM exercises e
WHERE e.name = 'Barbell Bench Press';

INSERT INTO goals (user_id, exercise_id, target_weight, target_date, current_weight)
SELECT
  '00000000-0000-0000-0000-000000000001',
  e.id,
  140,
  '2025-06-01',
  120
FROM exercises e
WHERE e.name = 'Barbell Back Squat';

-- =============================================================================
-- HISTORICAL WORKOUT DATA FOR PROGRESS DASHBOARD
-- Creates 12 months of workout history with progressive volume increases
-- Data spans from Feb 2025 to Jan 2026 (today is Jan 13, 2026)
-- =============================================================================

-- Historical Push workouts (every ~4-5 days pattern for PPL)
INSERT INTO workout_logs (id, user_id, workout_type_id, started_at, completed_at, total_volume, duration_seconds) VALUES
  -- February 2025 workouts (start of tracking)
  ('20000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2025-02-03 18:00:00', '2025-02-03 19:00:00', 7200.00, 3600),
  ('20000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2025-02-04 18:00:00', '2025-02-04 19:00:00', 8100.00, 3600),
  ('20000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2025-02-05 18:00:00', '2025-02-05 19:00:00', 9500.00, 3600),
  -- March 2025 workouts
  ('20000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2025-03-03 18:00:00', '2025-03-03 19:00:00', 7600.00, 3600),
  ('20000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2025-03-04 18:00:00', '2025-03-04 19:00:00', 8500.00, 3600),
  ('20000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2025-03-05 18:00:00', '2025-03-05 19:00:00', 9900.00, 3600),
  -- April 2025 workouts (dip - deload week)
  ('20000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2025-04-07 18:00:00', '2025-04-07 19:00:00', 6800.00, 3600),
  ('20000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2025-04-08 18:00:00', '2025-04-08 19:00:00', 7600.00, 3600),
  ('20000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2025-04-09 18:00:00', '2025-04-09 19:00:00', 8900.00, 3600),
  -- May 2025 workouts
  ('20000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2025-05-05 18:00:00', '2025-05-05 19:00:00', 8100.00, 3600),
  ('20000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2025-05-06 18:00:00', '2025-05-06 19:00:00', 9000.00, 3600),
  ('20000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2025-05-07 18:00:00', '2025-05-07 19:00:00', 10600.00, 3600),
  -- June 2025 workouts
  ('20000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2025-06-02 18:00:00', '2025-06-02 19:00:00', 8300.00, 3600),
  ('20000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2025-06-03 18:00:00', '2025-06-03 19:00:00', 9300.00, 3600),
  ('20000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2025-06-04 18:00:00', '2025-06-04 19:00:00', 10900.00, 3600),
  -- July 2025 workouts
  ('20000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2025-07-07 18:00:00', '2025-07-07 19:00:00', 8500.00, 3600),
  ('20000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2025-07-08 18:00:00', '2025-07-08 19:00:00', 9500.00, 3600),
  ('20000000-0000-0000-0000-000000000703', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2025-07-09 18:00:00', '2025-07-09 19:00:00', 11100.00, 3600),
  -- August 2025 workouts
  ('20000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2025-08-04 18:00:00', '2025-08-04 19:00:00', 8700.00, 3600),
  ('20000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2025-08-05 18:00:00', '2025-08-05 19:00:00', 9700.00, 3600),
  ('20000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2025-08-06 18:00:00', '2025-08-06 19:00:00', 11400.00, 3600),
  -- September 2025 workouts
  ('20000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2025-09-01 18:00:00', '2025-09-01 19:00:00', 8900.00, 3600),
  ('20000000-0000-0000-0000-000000000902', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2025-09-02 18:00:00', '2025-09-02 19:00:00', 9900.00, 3600),
  ('20000000-0000-0000-0000-000000000903', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2025-09-03 18:00:00', '2025-09-03 19:00:00', 11700.00, 3600),
  -- October 2025 workouts
  ('20000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2025-10-06 18:00:00', '2025-10-06 19:00:00', 9100.00, 3600),
  ('20000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2025-10-07 18:00:00', '2025-10-07 19:00:00', 10100.00, 3600),
  ('20000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2025-10-08 18:00:00', '2025-10-08 19:00:00', 12000.00, 3600),
  -- November 2025 workouts
  ('20000000-0000-0000-0000-000000001101', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2025-11-03 18:00:00', '2025-11-03 19:00:00', 9300.00, 3600),
  ('20000000-0000-0000-0000-000000001102', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2025-11-04 18:00:00', '2025-11-04 19:00:00', 10300.00, 3600),
  ('20000000-0000-0000-0000-000000001103', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2025-11-05 18:00:00', '2025-11-05 19:00:00', 12300.00, 3600),
  -- December 2025 workouts (peak performance)
  ('20000000-0000-0000-0000-000000001201', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2025-12-01 18:00:00', '2025-12-01 19:00:00', 9500.00, 3600),
  ('20000000-0000-0000-0000-000000001202', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2025-12-02 18:00:00', '2025-12-02 19:00:00', 10600.00, 3600),
  ('20000000-0000-0000-0000-000000001203', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2025-12-03 18:00:00', '2025-12-03 19:00:00', 12600.00, 3600),
  ('20000000-0000-0000-0000-000000001204', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2025-12-15 18:00:00', '2025-12-15 19:00:00', 9700.00, 3600),
  ('20000000-0000-0000-0000-000000001205', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2025-12-16 18:00:00', '2025-12-16 19:00:00', 10800.00, 3600),
  ('20000000-0000-0000-0000-000000001206', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2025-12-17 18:00:00', '2025-12-17 19:00:00', 12900.00, 3600),
  -- January 2026 workouts (current month - most recent data)
  ('20000000-0000-0000-0000-000000001301', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2026-01-06 18:00:00', '2026-01-06 19:00:00', 9900.00, 3600),
  ('20000000-0000-0000-0000-000000001302', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2026-01-07 18:00:00', '2026-01-07 19:00:00', 11000.00, 3600),
  ('20000000-0000-0000-0000-000000001303', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2026-01-08 18:00:00', '2026-01-08 19:00:00', 13200.00, 3600),
  ('20000000-0000-0000-0000-000000001304', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2026-01-10 18:00:00', '2026-01-10 19:00:00', 10100.00, 3600),
  ('20000000-0000-0000-0000-000000001305', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '2026-01-11 18:00:00', '2026-01-11 19:00:00', 11200.00, 3600),
  ('20000000-0000-0000-0000-000000001306', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '2026-01-12 18:00:00', '2026-01-12 19:00:00', 13400.00, 3600);

-- =============================================================================
-- HISTORICAL SET LOGS FOR PR DELTA CALCULATIONS
-- Previous weights before current PRs to show improvement
-- =============================================================================

-- Old Bench Press sets (90kg was the old PR in Feb 2025)
INSERT INTO set_logs (workout_log_id, exercise_id, set_number, weight, reps, is_pr, completed_at)
SELECT
  '20000000-0000-0000-0000-000000000201',
  e.id,
  s.set_num,
  90,
  8,
  false,
  '2025-02-03 18:30:00'::timestamp + (s.set_num * INTERVAL '3 minutes')
FROM exercises e
CROSS JOIN (SELECT generate_series(1, 4) AS set_num) s
WHERE e.name = 'Barbell Bench Press';

-- Old Deadlift sets (130kg was the old PR in Feb 2025)
INSERT INTO set_logs (workout_log_id, exercise_id, set_number, weight, reps, is_pr, completed_at)
SELECT
  '20000000-0000-0000-0000-000000000202',
  e.id,
  s.set_num,
  130,
  6,
  false,
  '2025-02-04 18:30:00'::timestamp + (s.set_num * INTERVAL '4 minutes')
FROM exercises e
CROSS JOIN (SELECT generate_series(1, 4) AS set_num) s
WHERE e.name = 'Barbell Deadlift';

-- Old Squat sets (120kg - same as current, no delta)
INSERT INTO set_logs (workout_log_id, exercise_id, set_number, weight, reps, is_pr, completed_at)
SELECT
  '20000000-0000-0000-0000-000000000203',
  e.id,
  s.set_num,
  120,
  8,
  false,
  '2025-02-05 18:30:00'::timestamp + (s.set_num * INTERVAL '3 minutes')
FROM exercises e
CROSS JOIN (SELECT generate_series(1, 4) AS set_num) s
WHERE e.name = 'Barbell Back Squat';

-- Current PR set logs (January 2026 - most recent workouts)
INSERT INTO set_logs (workout_log_id, exercise_id, set_number, weight, reps, is_pr, completed_at)
SELECT
  '20000000-0000-0000-0000-000000001304',
  e.id,
  s.set_num,
  95,
  8,
  CASE WHEN s.set_num = 1 THEN true ELSE false END,
  '2026-01-10 18:30:00'::timestamp + (s.set_num * INTERVAL '3 minutes')
FROM exercises e
CROSS JOIN (SELECT generate_series(1, 4) AS set_num) s
WHERE e.name = 'Barbell Bench Press';

INSERT INTO set_logs (workout_log_id, exercise_id, set_number, weight, reps, is_pr, completed_at)
SELECT
  '20000000-0000-0000-0000-000000001305',
  e.id,
  s.set_num,
  140,
  6,
  CASE WHEN s.set_num = 1 THEN true ELSE false END,
  '2026-01-11 18:30:00'::timestamp + (s.set_num * INTERVAL '4 minutes')
FROM exercises e
CROSS JOIN (SELECT generate_series(1, 4) AS set_num) s
WHERE e.name = 'Barbell Deadlift';

INSERT INTO set_logs (workout_log_id, exercise_id, set_number, weight, reps, is_pr, completed_at)
SELECT
  '20000000-0000-0000-0000-000000001306',
  e.id,
  s.set_num,
  120,
  8,
  false,
  '2026-01-12 18:30:00'::timestamp + (s.set_num * INTERVAL '3 minutes')
FROM exercises e
CROSS JOIN (SELECT generate_series(1, 4) AS set_num) s
WHERE e.name = 'Barbell Back Squat';

-- =============================================================================
-- PERSONAL RECORDS
-- Bench: 95kg (+5kg from 90kg), Squat: 120kg (no change), Deadlift: 140kg (+10kg from 130kg)
-- =============================================================================

-- Bench Press PR: 95kg (achieved January 10, 2026)
INSERT INTO personal_records (user_id, exercise_id, pr_type, value, reps, achieved_at, workout_log_id)
SELECT
  '00000000-0000-0000-0000-000000000001',
  e.id,
  'max_weight',
  95,
  8,
  '2026-01-10 18:33:00',
  '20000000-0000-0000-0000-000000001304'
FROM exercises e
WHERE e.name = 'Barbell Bench Press';

-- Squat PR: 120kg (achieved December 2025, no delta since same weight)
INSERT INTO personal_records (user_id, exercise_id, pr_type, value, reps, achieved_at, workout_log_id)
SELECT
  '00000000-0000-0000-0000-000000000001',
  e.id,
  'max_weight',
  120,
  8,
  '2025-12-17 18:33:00',
  '20000000-0000-0000-0000-000000001206'
FROM exercises e
WHERE e.name = 'Barbell Back Squat';

-- Deadlift PR: 140kg (achieved January 11, 2026)
INSERT INTO personal_records (user_id, exercise_id, pr_type, value, reps, achieved_at, workout_log_id)
SELECT
  '00000000-0000-0000-0000-000000000001',
  e.id,
  'max_weight',
  140,
  6,
  '2026-01-11 18:42:00',
  '20000000-0000-0000-0000-000000001305'
FROM exercises e
WHERE e.name = 'Barbell Deadlift';
