CREATE TABLE `workout_exercises` (
  `workout_id` int NOT NULL,
  `exercise_id` int NOT NULL,
  `user_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`workout_id`,`exercise_id`),
  KEY `exercise_id` (`exercise_id`),
  KEY `workout_exercises_ibfk_3` (`user_id`),
  CONSTRAINT `workout_exercises_ibfk_1` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`),
  CONSTRAINT `workout_exercises_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`),
  CONSTRAINT `workout_exercises_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci