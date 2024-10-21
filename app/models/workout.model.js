/**
 * Workout Model
 * 
 * This file defines the Workout model and its associated methods for interacting with the database.
 * It provides functionality for creating, reading, updating, and deleting workout records.
 */

import sql from "./db.js";

// Constructor
const Workout = function(workout) {
  this.name = workout.name;
  this.date = workout.date;
  this.exercises = workout.exercises;
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

// Fetch sets from a workout
Workout.getSets = (id, result) => {
  sql.query(
    `
    SELECT s.* FROM sets s
    JOIN workout_exercises we ON s.exercise_id = we.exercise_id
    WHERE we.workout_id = ?
    `, 
    [id],
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

export default Workout;