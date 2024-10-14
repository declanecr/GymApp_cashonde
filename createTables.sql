SELECT * FROM heroku_28b8dc682c0181a.exercises;


CREATE TABLE workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE
);

CREATE TABLE sets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT,
    workout_id INT,
    date DATE,
    reps INT,
    weight DECIMAL(5,2),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id),
    FOREIGN KEY (workout_id) REFERENCES workouts(id)
);

CREATE TABLE workout_exercises (
    workout_id INT,
    exercise_id INT,
    PRIMARY KEY (workout_id, exercise_id),
    FOREIGN KEY (workout_id) REFERENCES workouts(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);