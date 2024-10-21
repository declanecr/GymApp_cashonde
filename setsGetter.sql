/**
gets the sets from a specific workout
*/

SELECT * FROM heroku_28b8dc682c0181a.workouts;

SELECT s.* FROM sets s
INNER JOIN workout_exercises we ON s.exercise_id = we.exercise_id
WHERE we.workout_id = 1