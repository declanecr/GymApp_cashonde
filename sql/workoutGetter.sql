/*
gets all the workouts that used the an exercise
*/

SELECT * FROM heroku_28b8dc682c0181a.exercises;

SELECT w.* FROM workouts w
JOIN workout_exercises we ON w.id = we.workout_id
WHERE we.exercise_id = 1 /* [exercise_id] 1 is an example */