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

    if (res.length) {
      const exercise = res[0];
      // Fetch sets for this exercise
      Set.findByExerciseId(id, (err, sets) => {
        if (err) {
          result(err, null);
          return;
        }
        exercise.sets = sets;
        console.log("found exercise: ", exercise);
        result(null, exercise);
      });
    } else {
      result({ kind: "not_found" }, null);
    }
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
    "UPDATE exercises SET name = ?, description = ?, type = ?, main_muscle = ?, equipment = ?, level = ?, rating = ? WHERE id = ?",
    [exercise.name, exercise.description, exercise.type, exercise.main_muscle, exercise.equipment, exercise.level, exercise.rating, id],
    (err, res) => {
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
    console.log("muscle groups: ", res);
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
    console.log("equipment found: ", res.map(row => row.equipment));
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
    console.log("levels found: ", res.map(row => row.level));
    result(null, res.map(row => row.level));
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

export default Exercise;