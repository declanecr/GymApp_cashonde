CREATE TABLE `sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exercise_id` int DEFAULT NULL,
  `workout_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `date` date DEFAULT NULL,
  `reps` int DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exercise_id` (`exercise_id`),
  KEY `workout_id` (`workout_id`),
  CONSTRAINT `sets_ibfk_1` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`),
  CONSTRAINT `sets_ibfk_2` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4