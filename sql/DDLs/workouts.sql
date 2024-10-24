CREATE TABLE `workouts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
  KEY 'user_id' ('user_id'),
  CONSTRAINT 'workouts_ibfk_1' FOREIGN KEY ('workout_id') REFERENCES  'users' ('id')
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4