/**
 * Exercise Model
 * 
 * This file defines the Exercise model and its associated methods for interacting with the database.
 * It provides functionality for creating, reading, updating, and deleting exercise records,
 * as well as retrieving unique values for specific fields.
 * 
 * The Exercise model represents a workout exercise with properties such as name, description,
 * type, main muscle group, equipment, difficulty level, and rating.
 * 
 * Key features:
 * - CRUD operations for exercise records
 * - Filtering exercises by name
 * - Retrieving unique values for muscle groups, equipment, and difficulty levels
 * - Fetching workouts associated with an exercise
 * 
 * This model serves as an intermediary between the application logic and the database,
 * encapsulating the data access logic and providing a clean API for exercise-related operations.
 */

import sql from "./db.js";
import Set from "./set.model.js";

/**
 * Constructor for the Exercise object
 * @param {Object} exercise - The exercise object containing all properties
 * @purpose Create a new Exercise instance with given properties
 * @input Object with exercise properties
 * @output New Exercise instance
 */
const Exercise = function(exercise) {
  this.name = exercise.name;
  this.description = exercise.description;
  this.type = exercise.type;
  this.main_muscle = exercise.main_muscle;
  this.equipment = exercise.equipment;
  this.level = exercise.level;
  this.rating = exercise.rating;
  this.instructions = exercise.instructions;
  this.images_url = Array.isArray(exercise.images_url) ? exercise.images_url : JSON.parse(exercise.images_url || '[]');
  this.muscle_diagram_url= exercise.muscle_diagram_url;
};
/**
 * Create a new exercise in the database
 * @param {Object} newExercise - The exercise object to be created
 * @param {Function} result - Callback function
 * @purpose Insert a new exercise into the database
 * @input New exercise object and callback function
 * @output Created exercise object with ID or error
 * @sends SQL query to insert new exercise
 */
Exercise.create = (newExercise, result) => {
  // Execute SQL query to insert the new exercise
  sql.query("INSERT INTO exercises SET ?", newExercise, (err, res) => {
    if (err) {
      // Log and return error if insertion fails
      console.log("error: ", err);
      result(err, null);
      return;
    }

    // Log successful creation and return the new exercise with its ID
    console.log("created exercise: ", { id: res.insertId, ...newExercise });
    result(null, { id: res.insertId, ...newExercise });
  });
};

/**
 * Find an exercise by its ID
 * @param {number} id - The ID of the exercise to find
 * @param {Function} result - Callback function
 * @purpose Retrieve a specific exercise from the database by its ID
 * @input Exercise ID and callback function
 * @output Found exercise object or error
 * @sends SQL query to select exercise by ID
 */
Exercise.findById = (id, result) => {
  // Execute SQL query to find exercise by ID
  sql.query(`SELECT * FROM exercises WHERE id = ${id}`, (err, res) => {
    if (err) {
      // Log and return error if query fails
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null,res);

    
  });
};

/**
 * Get all exercises or exercises matching a name
 * @param {string} name - Optional name to filter exercises
 * @param {Function} result - Callback function
 * @purpose Retrieve all exercises or exercises matching a name from the database
 * @input Optional name parameter and callback function
 * @output Array of exercise objects or error
 * @sends SQL query to select all exercises or exercises matching a name
 */
Exercise.getAll = (name, result) => {
  let query = "SELECT * FROM exercises";

  // If name provided, add WHERE clause to filter by name
  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }

  // Execute SQL query
  sql.query(query, (err, res) => {
    if (err) {
      // Log and return error if query fails
      console.log("error: ", err);
      result(null, err);
      return;
    }

    // Return all exercises that match the query
    result(null, res);
  });
};

/**
 * Update an exercise by its ID
 * @param {number} id - The ID of the exercise to update
 * @param {Object} exercise - The updated exercise object
 * @param {Function} result - Callback function
 * @purpose Update an existing exercise in the database
 * @input Exercise ID, updated exercise object, and callback function
 * @output Updated exercise object or error
 * @sends SQL query to update exercise by ID
 */
Exercise.updateById = (id, exercise, result) => {
  // Execute SQL query to update exercise
  sql.query(
    "UPDATE exercises SET name = ?, description = ?, type = ?, main_muscle = ?, equipment = ?, level = ?, rating = ?, instructions = ?, images_url = ?, muscle_diagram_url = ? WHERE id = ?",
    [exercise.name, exercise.description, exercise.type, exercise.main_muscle, exercise.equipment, exercise.level, exercise.rating, exercise.instructions, exercise.images_url, exercise.muscle_diagram_url, id],    (err, res) => {
      if (err) {
        // Log and return error if update fails
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // If no rows affected, exercise not found
        result({ kind: "not_found" }, null);
        return;
      }

      // Log successful update and return updated exercise
      console.log("updated exercise: ", { id: id, ...exercise });
      result(null, { id: id, ...exercise });
    }
  );
};

/**
 * Remove an exercise by its ID
 * @param {number} id - The ID of the exercise to remove
 * @param {Function} result - Callback function
 * @purpose Delete a specific exercise from the database
 * @input Exercise ID and callback function
 * @output Success message or error
 * @sends SQL query to delete exercise by ID
 */
Exercise.remove = (id, result) => {
  // Execute SQL query to delete exercise
  sql.query("DELETE FROM exercises WHERE id = ?", id, (err, res) => {
    if (err) {
      // Log and return error if deletion fails
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // If no rows affected, exercise not found
      result({ kind: "not_found" }, null);
      return;
    }

    // Log successful deletion and return result
    console.log("deleted exercise with id: ", id);
    result(null, res);
  });
};

/**
 * Remove all exercises from the database
 * @param {Function} result - Callback function
 * @purpose Delete all exercises from the database
 * @input Callback function
 * @output Success message or error
 * @sends SQL query to delete all exercises
 */
Exercise.removeAll = result => {
  // Execute SQL query to delete all exercises
  sql.query("DELETE FROM exercises", (err, res) => {
    if (err) {
      // Log and return error if deletion fails
      console.log("error: ", err);
      result(null, err);
      return;
    }

    // Log number of deleted exercises and return result
    console.log(`deleted ${res.affectedRows} exercises`);
    result(null, res);
  });
};

/**
 * Get unique muscle groups
 * @param {Function} result - Callback function
 * @purpose Retrieve all unique main muscle groups from the exercises table
 * @input Callback function
 * @output Array of unique muscle groups or error
 * @sends SQL query to select distinct main muscle groups
 */
Exercise.getUniqueMuscleGroups = result => {
  // Execute SQL query to get distinct main muscle groups
  sql.query("SELECT DISTINCT main_muscle FROM exercises", (err, res) => {
    if (err) {
      // Log and return error if query fails
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // Log and return array of unique muscle groups
    //console.log("muscle groups: ", res);
    result(null, res.map(row => row.main_muscle));
  });
};

/**
 * Get unique equipment
 * @param {Function} result - Callback function
 * @purpose Retrieve all unique equipment from the exercises table
 * @input Callback function
 * @output Array of unique equipment or error
 * @sends SQL query to select distinct equipment
 */
Exercise.getUniqueEquipment = result => {
  // Execute SQL query to get distinct equipment
  sql.query("SELECT DISTINCT equipment FROM exercises", (err, res) => {
    if (err) {
      // Log and return error if query fails
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // Log and return array of unique equipment
    //console.log("equipment found: ", res.map(row => row.equipment));
    result(null, res.map(row => row.equipment));
  });
};

/**
 * Get unique levels
 * @param {Function} result - Callback function
 * @purpose Retrieve all unique difficulty levels from the exercises table
 * @input Callback function
 * @output Array of unique levels or error
 * @sends SQL query to select distinct levels
 */
Exercise.getUniqueLevels = result => {
  // Execute SQL query to get distinct levels
  sql.query("SELECT DISTINCT level FROM exercises", (err, res) => {
    if (err) {
      // Log and return error if query fails
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // Log and return array of unique levels
    //console.log("levels found: ", res.map(row => row.level));
    result(null, res.map(row => row.level));
  });
};

/**
 * Get unitypes
 * @param {Function} result - Callback function
 * @purpose Retrieve all unique difficulty types from the exercises table
 * @input Callback function
 * @output Array of unique types or error
 * @sends SQL query to select distinct types
 */
Exercise.getUniqueTypes = result => {
  // Execute SQL query to get distinct types
  sql.query("SELECT DISTINCT type FROM exercises", (err, res) => {
    if (err) {
      // Log and return error if query fails
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // Log and return array of unique types
    //console.log("types found: ", res.map(row => row.type));
    result(null, res.map(row => row.type));
  });
};

/**
 * Get workouts associated with an exercise
 * @param {number} id - The ID of the exercise
 * @param {Function} result - Callback function
 * @purpose Retrieve all workouts that include a specific exercise
 * @input Exercise ID and callback function
 * @output Array of workout objects or error
 * @sends SQL query to select workouts associated with the exercise
 */
Exercise.getWorkouts = (id, result) => {
  sql.query(
    `
    SELECT w.* FROM workouts w
    JOIN workout_exercises we ON w.id = we.workout_id
    WHERE we.exercise_id = ?
    `,
    [id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("workouts for exercise: ", res);
      result(null, res);
    }
  );
};


const weightedRandomSelection = (exercises, count) => {
  const totalRating = exercises.reduce((sum, exercise) => {
      const rating = Number(exercise.rating);
      return sum + (isNaN(rating) ? 0 : rating);
    }, 0);  const selectedExercises = [];

  for (let i = 0; i < count; i++) {
    let randomValue = Math.random() * totalRating;
    let cumulativeRating = 0;

    for (const exercise of exercises) {
      cumulativeRating += Number(exercise.rating);
      if (randomValue <= cumulativeRating) {
        selectedExercises.push(exercise);
        break;
      }
    }
  }

  return selectedExercises;
};

const getExercises = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM exercises WHERE rating IS NOT NULL AND equipment IN ('cable', 'barbell', 'dumbbell', 'Machine', 'Body Only') AND type = 'strength' ORDER BY rating DESC", (err, exercises) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
        return;
      }
      resolve(exercises);
    });
  });
};

Exercise.generateFullBodyWorkout = (workoutExercises) => {
  console.log('generateFullBodyWorkout');
  return new Promise((resolve, reject) => {
    if (!Array.isArray(workoutExercises)) {
      workoutExercises = [];
    }

    getExercises()
      .then(exercises => {

      const workoutPlan = [];
      const muscleGroups = [
        { name: 'Chest', count: 1 },
        { name: 'Lower Back', count: 1 },
        { name: 'Middle Back', count: 1 },
        { name: 'Quadriceps', count: 1 },
        { name: 'Hamstrings', count: 1 },
        { name: 'Glutes', count: 1 },
        { name: 'Shoulders', count: 1 },
        { name: 'Biceps', count: 1 },
        { name: 'Triceps', count: 1 }
      ];

      muscleGroups.forEach(group => {
        let muscleExercises = exercises.filter(e => e.main_muscle === group.name);
        const selectedExercises = weightedRandomSelection(muscleExercises, group.count);

        workoutPlan.push(...selectedExercises);
      });

      console.log('Full Body Workout Exercises:', workoutPlan.map(exercise => exercise.name));
      workoutExercises.push(...workoutPlan.map(exercise => ({ ...exercise })));
      resolve(workoutExercises);
    })
    .catch(err=>reject(err));
  });
};

Exercise.generateUpperBodyWorkout = (workoutExercises) => {
  console.log('generateUpperBodyWorkout');
  return new Promise((resolve, reject) => {
    if (!Array.isArray(workoutExercises)) {
      workoutExercises = [];
    }

    getExercises()
      .then(exercises => {

      const workoutPlan = [];
      const muscleGroups = [
        { name: 'Middle Back', count: 1 },
        { name: 'Lats', count: 1 },
        { name: 'Biceps', count: 1 },
        { name: 'Chest', count: 2, includeIncline: true },
        { name: 'Shoulders', count: 1 }
      ];

      muscleGroups.forEach(group => {
        let muscleExercises = exercises.filter(e => e.main_muscle === group.name);
        
        if (group.name === 'Chest' && group.includeIncline) {
          const inclineExercises = muscleExercises.filter(e => e.name.toLowerCase().includes('incline'));
          if (inclineExercises.length > 0) {
            const selectedIncline = weightedRandomSelection(inclineExercises, 1)[0];
            workoutPlan.push(selectedIncline);
            muscleExercises = muscleExercises.filter(e => e.id !== selectedIncline.id);
            group.count--;
          }
        }

        const selectedExercises = weightedRandomSelection(muscleExercises, group.count);
        workoutPlan.push(...selectedExercises);
      });

      console.log('Upper Body Workout Exercises:', workoutPlan.map(exercise => exercise.name));
      workoutExercises.push(...workoutPlan.map(exercise => ({ ...exercise })));
      resolve(workoutExercises);
    })
    .catch(err=>reject(err));
  });
};

Exercise.generateLowerBodyWorkout = (workoutExercises) => {
  console.log('generateLowerBodyWorkout');
  return new Promise((resolve, reject) => {
    if (!Array.isArray(workoutExercises)) {
      workoutExercises = [];
    }

    getExercises()
      .then(exercises => {

      const workoutPlan = [];
      const muscleGroups = [
        { name: ['Glutes', 'Quadriceps', 'Hamstrings'], count: 1, includeSquat: true },
        { name: 'Glutes', count: 1 },
        { name: 'Quadriceps', count: 1 },
        { name: 'Hamstrings', count: 1 },
        { name: 'Abductors', count: 1 },
        { name: 'Adductors', count: 1 }
      ];

      muscleGroups.forEach(group => {
        let muscleExercises = exercises.filter(e => 
          Array.isArray(group.name) ? group.name.includes(e.main_muscle) : e.main_muscle === group.name
        );

        if (group.includeSquat) {
          const squatExercises = muscleExercises.filter(e => e.name.toLowerCase().includes('squat'));
          if (squatExercises.length > 0) {
            const selectedSquat = weightedRandomSelection(squatExercises, 1)[0];
            workoutPlan.push(selectedSquat);
            muscleExercises = muscleExercises.filter(e => e.id !== selectedSquat.id);
            group.count--;
          }
        }

        const selectedExercises = weightedRandomSelection(muscleExercises, group.count);
        workoutPlan.push(...selectedExercises);
      });

      console.log('Lower Body Workout Exercises:', workoutPlan.map(exercise => exercise.name));
      workoutExercises.push(...workoutPlan.map(exercise => ({ ...exercise })));
      resolve(workoutExercises);
    })
    .catch(err => reject(err));
  });
};


Exercise.generatePushWorkout = (workoutExercises) => {
  console.log('generatePushWorkout');
  return new Promise((resolve, reject) => {
    if (!Array.isArray(workoutExercises)) {
      workoutExercises = [];
    }

    getExercises()
      .then(exercises => {

      const workoutPlan = [];
      const muscleGroups = [
        { name: 'Chest', count: 3, includePress: true, includeIncline: true },
        { name: 'Shoulders', count: 2, excludeRear: true, includeFrontOrRaise: true },
        { name: 'Triceps', count: 1 }
      ];

      muscleGroups.forEach(group => {
        let muscleExercises = exercises.filter(e => e.main_muscle === group.name);
        
        if (group.name === 'Chest') {
          if (group.includePress) {
            const pressExercises = muscleExercises.filter(e => e.name.toLowerCase().includes('press'));
            if (pressExercises.length > 0) {
              const selectedPress = weightedRandomSelection(pressExercises, 1)[0];
              workoutPlan.push(selectedPress);
              muscleExercises = muscleExercises.filter(e => e.id !== selectedPress.id);
              group.count--;
            }
          }
          if (group.includeIncline) {
            const inclineExercises = muscleExercises.filter(e => e.name.toLowerCase().includes('incline'));
            if (inclineExercises.length > 0) {
              const selectedIncline = weightedRandomSelection(inclineExercises, 1)[0];
              workoutPlan.push(selectedIncline);
              muscleExercises = muscleExercises.filter(e => e.id !== selectedIncline.id);
              group.count--;
            }
          }
        }

        if (group.name === 'Shoulders') {
          muscleExercises = muscleExercises.filter(e => !e.name.toLowerCase().includes('rear'));
          if (group.includeFrontOrRaise) {
            muscleExercises = muscleExercises.filter(e => 
              e.name.toLowerCase().includes('front') || e.name.toLowerCase().includes('raise')
            );
          }
        }

        const selectedExercises = weightedRandomSelection(muscleExercises, group.count);
        workoutPlan.push(...selectedExercises);
      });

      console.log('Push Workout Exercises:', workoutPlan.map(exercise => exercise.name));
      workoutExercises.push(...workoutPlan.map(exercise => ({ ...exercise })));
      resolve(workoutExercises);
    })
    .catch(err => reject(err));
    });
};

Exercise.generatePullWorkout = (workoutExercises) => {
  console.log('generatePullWorkout');
  return new Promise((resolve, reject) => {
    if (!Array.isArray(workoutExercises)) {
      workoutExercises = [];
    }

    getExercises()
      .then(exercises => {

      const workoutPlan = [];
      const muscleGroups = [
        { name: 'Middle Back', count: 1 },
        { name: 'Lats', count: 1 },
        { name: 'Lower Back', count: 1 },
        { name: 'Biceps', count: 2 },
        { name: 'Shoulders', count: 1, includePullOrRear: true }
      ];

      muscleGroups.forEach(group => {
        let muscleExercises = exercises.filter(e => e.main_muscle === group.name);
        
        if (group.name === 'Shoulders' && group.includePullOrRear) {
          muscleExercises = muscleExercises.filter(e => 
            e.name.toLowerCase().includes('pull') || e.name.toLowerCase().includes('rear')
          );
        }

        const selectedExercises = weightedRandomSelection(muscleExercises, group.count);
        workoutPlan.push(...selectedExercises);
      });

      console.log('Pull Workout Exercises:', workoutPlan.map(exercise => exercise.name));
      workoutExercises.push(...workoutPlan.map(exercise => ({ ...exercise })));
      resolve(workoutExercises);
    })
    .catch(err => reject(err));
  });
};







// Helper functions (to be implemented)
const getUniqueMuscles = (exercises) => {
  // Implementation here
  // get unique muscles from passed exercises
  return [...new Set(exercises.map(exercise => exercise.main_muscle))];
};

/**
 * 
 Shuffles an array of exercises using the Fisher-Yates algorithm
 * @param {Array} exercises - The array of exercises to shuffle
 * @returns {Array} A new array with the exercises in a random order
 */
const shuffle = (exercises) => {
  const shuffled = [...exercises];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};


const generateWorkoutSets = (exercise, workoutId) => {
  // Implementation here
  // use Set.create

  // TODO implement this later when I worry about generating sets based on exercise history
  // also will need to have WorkoutID implemented
};

const filterUpperBodyExercises = (exercises) => {
  // Implementation here
  // list upperBodyMuscles = 'Abdominals' 'Shoulders' 'Biceps' 'Middle Back' 'Lower Back' 'Lats' 'Chest' 'Triceps' 'Traps' 'Forearms' 'Neck' 'Back'
  // return filtered list of exercises in which only ones whos 'main_muscle' is an upper body muscle
  const upperBodyMuscles = ['Abdominals', 'Shoulders', 'Biceps', 'Middle Back', 'Lower Back', 'Lats', 'Chest', 'Triceps', 'Traps', 'Forearms', 'Neck', 'Back'];
  return exercises.filter(exercise => upperBodyMuscles.includes(exercise.main_muscle));
};

const filterLowerBodyExercises = (exercises) => {
  // Implementation here
  //list lowerBodyMuscles = 'Quadriceps' 'Hamstrings' 'Adductors' 'Calves' 'Glutes'
  // return filtered list in which 'main_muscle' is in lowerBodyMuscles
  const lowerBodyMuscles = ['Quadriceps', 'Hamstrings', 'Adductors', 'Calves', 'Glutes'];
  return exercises.filter(exercise => lowerBodyMuscles.includes(exercise.main_muscle));
};

const filterPushExercises = (exercises) => {
  // Implementation here
  // list pushMuscles = 'Shoulders' 'Chest' 'Triceps'
  // return filtered list where main_muscle is in pushMuscles
  const pushMuscles = ['Shoulders', 'Chest', 'Triceps'];
  return exercises.filter(exercise => pushMuscles.includes(exercise.main_muscle));
};

const filterPullExercises = (exercises) => {
  // Implementation here
  //list pullMuscles = 'Biceps' 'Middle Back' 'Lower Back' 'Lats' 'Back' 'Forearms' 'Traps'
  //return filtered lists where main_muscle is in pullMuscles
  const pullMuscles = ['Biceps', 'Middle Back', 'Lower Back', 'Lats', 'Back', 'Forearms', 'Traps'];
  return exercises.filter(exercise => pullMuscles.includes(exercise.main_muscle));
};

export default Exercise;