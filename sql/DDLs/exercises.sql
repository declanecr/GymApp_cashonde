CREATE TABLE `exercises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text,
  `description` text,
  `type` text,
  `main_muscle` text,
  `equipment` text,
  `level` text,
  `rating` text,
  `workout_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3313 DEFAULT CHARSET=utf8mb3