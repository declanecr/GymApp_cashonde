/**
 * Workout Model
 * 
 * This file defines the Workout model and its associated methods for interacting with the database.
 * It provides functionality for creating, reading, updating, and deleting workout records.
 */

import sql from "./db.js";
import Exercise from "./exercise.model.js";

// Constructor
const Workout = function(workout) {
  this.userId = workout.user_id;
  this.name = workout.name;
  this.date = workout.date;
};

// Create a new Workout
Workout.create = (newWorkout, result) => {
  sql.query("INSERT INTO workouts SET ?", newWorkout, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    
    console.log("created workout: ", { id: res.insertId, ...newWorkout });
    result(null, { id: res.insertId, ...newWorkout });
  });
};

// Find a Workout by ID
Workout.findById = (id, result) => {
  sql.query(`SELECT * FROM workouts WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    
    if (res.length) {
      console.log("found workout: ", res[0]);
      result(null, res[0]);
      return;
    }
    
    result({ kind: "not_found" }, null);
  });
};

Workout.findByUserId = (userId, result) => {
  sql.query(`SELECT * FROM workouts WHERE user_id = ?`, [userId], (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }

    if(res.length) {
      console.log("Success: ", res);
      result(null, res);
      return;
    }

    result({kind: "not_found"}, null);
  })
}

Workout.findSpecificWorkout = (id, userId, result) => {
  sql.query(`SELECT * FROM workouts WHERE user_id = ? AND id = ?`, [userId, id], (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("Success: ", res);
      result(null, res);
      return;
    }

    result({kind: "not_found"}, null);
  })
}

// Get all Workouts
Workout.getAll = (result) => {
  sql.query("SELECT * FROM workouts", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    
    console.log("workouts: ", res);
    result(null, res);
  });
};

// Update a Workout by ID
Workout.updateById = (id, workout, result) => {
  sql.query(
    "UPDATE workouts SET name = ?, date = ?, exercises = ? WHERE id = ?",
    [workout.name, workout.date, JSON.stringify(workout.exercises), id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      
      console.log("updated workout: ", { id: id, ...workout });
      result(null, { id: id, ...workout });
    }
  );
};

// Delete a Workout
Workout.remove = (id, result) => {
  sql.query("DELETE FROM workouts WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    
    console.log("deleted workout with id: ", id);
    result(null, res);
  });
};

Workout.removeByUser = (userId, result) => {
  sql.query(`DELETE FROM workouts WHERE user_id = ?`, userId, (err, res) => {
    if(err) {
      console.log("Error: ", err);
      result(null, err);
      returnl
    }

    if(res.affectedRows == 0) {
      result({kind: "not_found"}, null);
      return;
    }

    console.log("Deleted workouts with userid: ", userId);
    result(null, res);
  });
}

// Fetch sets from a workout
Workout.getSets = (userId, id, result) => {
  sql.query(
    `
    SELECT s.* FROM sets s
    JOIN workout_exercises we ON s.exercise_id = we.exercise_id
    WHERE we.workout_id = ? AND  we.user_id = ?
    `, 
    [id, userId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found sets: ", res);
        result(null, res);
        return;
      }

      // If no sets found
      result({ kind: "not_found" }, null);
    });
};

/**
 * Generates workouts based on the number of days
 * Creates workout based on number of days
 * Calls workout generate methods, which create workouts
 * Then they call Exercise.workout generate methods to
 * create list of exercises and sets for each
 * 
 * Should be called in CurrentWorkout.js
 * @param {number} numDays - The number of days selected to generate workouts for
 * @param {Function} result - Callback function
 * @returns {Array} Array of exercises to be added to the current workout
 */
Workout.generateWorkout = (numDays, result) => {
  const workouts = [];
  const generateWorkoutForDay = async (type) => {
    const workout = {
      name: `${type} - ${new Date().toLocaleString()}`,
      date: new Date(),
      exercises: [],
    };
  
    try {
      

      let exerciseGenerator;
  
      switch (type) {
        case 'Full Body':
          exerciseGenerator = Exercise.generateFullBodyWorkout;
          break;
        case 'Upper Body':
          exerciseGenerator = Exercise.generateUpperBodyWorkout;
          break;
        case 'Lower Body':
          exerciseGenerator = Exercise.generateLowerBodyWorkout;
          break;
        case 'Push':
          exerciseGenerator = Exercise.generatePushWorkout;
          break;
        case 'Pull':
          exerciseGenerator = Exercise.generatePullWorkout;
          break;
        case 'Leg':
          exerciseGenerator = Exercise.generateLowerBodyWorkout;
          break;
      }
  
      await exerciseGenerator(workout.exercises);
      workouts.push(workout.exercises);
      
      //console.log('workouts flatmap: \n', workouts.flatMap(w => w.exercises));
      
      console.log('workouts.length: ', workouts.length);
      

      if (workouts.length === parseInt(numDays)) {
        console.log('RETURNING EXERCISES');
        result(null, workouts);
      }
    } catch (err) {
      console.log(`Error creating ${type} workout: `, err);
      result(err, null);
    }
  };
  
  console.log('switch case numDays: ', numDays);
  switch (parseInt(numDays)) {
    case 1:
      generateWorkoutForDay('Full Body');
      break;
    case 2:
      generateWorkoutForDay('Upper Body');
      generateWorkoutForDay('Lower Body');
      console.log('reached case 2');
      break;
    case 3:
      generateWorkoutForDay('Push');
      generateWorkoutForDay('Pull');
      generateWorkoutForDay('Leg');
      break;
    case 4:
      generateWorkoutForDay('Upper Body');
      generateWorkoutForDay('Lower Body');
      generateWorkoutForDay('Upper Body');
      generateWorkoutForDay('Lower Body');
      break;
    case 5:
      generateWorkoutForDay('Push');
      generateWorkoutForDay('Pull');
      generateWorkoutForDay('Leg');
      generateWorkoutForDay('Upper Body');
      generateWorkoutForDay('Lower Body');
      break;
    case 6:
      generateWorkoutForDay('Push');
      generateWorkoutForDay('Pull');
      generateWorkoutForDay('Leg');
      generateWorkoutForDay('Push');
      generateWorkoutForDay('Pull');
      generateWorkoutForDay('Leg');
      break;
    default:
      result({ kind: "invalid_input" }, null);
      break;
  }
};

export default Workout;