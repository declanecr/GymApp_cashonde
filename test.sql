-- Insert test data into workouts table
INSERT INTO workouts (name, date) VALUES
('Morning Cardio', '2024-10-15'),
('Leg Day', '2024-10-16'),
('Upper Body Strength', '2024-10-17');

-- Insert test data into sets table
-- Note: Make sure the exercise_id values exist in your exercises table
INSERT INTO sets (exercise_id, workout_id, date, reps, weight) VALUES
(1, 1, '2024-10-15', 15, 0),
(4, 3, '2024-10-16', 12, 100),
(7, 3, '2024-10-16', 10, 150),
(10, 5, '2024-10-17', 8, 50),
(13, 5, '2024-10-17', 12, 30);

-- Insert test data into workout_exercises junction table
INSERT INTO workout_exercises (workout_id, exercise_id) VALUES
(1, 1),
(3, 4),
(3, 7),
(5, 10),
(5, 13);