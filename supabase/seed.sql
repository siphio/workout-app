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
