-- View all workouts
SELECT * FROM workouts;

-- View all sets
SELECT * FROM sets;

-- View all workout-exercise relationships
SELECT * FROM workout_exercises;

-- View workouts with their associated exercises
SELECT w.id AS workout_id, w.name AS workout_name, e.id AS exercise_id, e.name AS exercise_name
FROM workouts w
JOIN workout_exercises we ON w.id = we.workout_id
JOIN exercises e ON we.exercise_id = e.id;

-- View sets with workout and exercise details
SELECT s.id AS set_id, w.name AS workout_name, e.name AS exercise_name, s.reps, s.weight
FROM sets s
JOIN workouts w ON s.workout_id = w.id
JOIN exercises e ON s.exercise_id = e.id;