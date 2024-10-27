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

/**generates workouts
 * creates workout based on number of days
 * calls workout generate methods, which create workouts
 * then they call Exercise.workout generate methods to
 * create list of exercises and sets for each
 * 
 * should be called in CurrentWorkout.js
  numDays -- the number of days selected to generate workouts for
  TODO -- filters -- the filters for what machines, equipment, 
  etc are available to the user
*/

Workout.generateWorkout = (numDays, result )=>{
  //TODO ADD createworkout and workout id
  //switch statement determining how many days are being generated for
  console.log('generating Workout');
  const exercises = [];

    switch (numDays) {
        case 1:
            Workout.generateFullBodyWorkout(exercises);
            break;

        case 2:
            Workout.generateUpperBodyWorkout(exercises);
            Workout.generateLowerBodyWorkout(exercises);
            break;

        case 3:
            Workout.generatePushWorkout(exercises);
            Workout.generatePullWorkout(exercises);
            Workout.generateLegWorkout(exercises);
            break;

        case 4:
            Workout.generateUpperBodyWorkout(exercises);
            Workout.generateLowerBodyWorkout(exercises);
            Workout.generateUpperBodyWorkout(exercises);
            Workout.generateLowerBodyWorkout(exercises);
            break;

        case 5:
            Workout.generatePushWorkout(exercises);
            Workout.generatePullWorkout(exercises);
            Workout.generateLegWorkout(exercises);
            Workout.generateUpperBodyWorkout(exercises);
            Workout.generateLowerBodyWorkout(exercises);
            break;

        case 6:
            Workout.generatePushWorkout(exercises);
            Workout.generatePullWorkout(exercises);
            Workout.generateLegWorkout(exercises);
            Workout.generatePushWorkout(exercises);
            Workout.generatePullWorkout(exercises);
            Workout.generateLegWorkout(exercises);
            break;

        default:
            // Handle unexpected cases
            break;
    }
    return exercises;
};


//generates full body workout
Workout.generateFullBodyWorkout = (exercises) => {
  // Create a new workout with current date and time as name
  const workoutName = new `Full Body - ${Date().toLocaleString()}`;
  const newWorkout = {
    name: workoutName,
    date: new Date()
  };

  // Create the workout and get its ID
  Workout.create(newWorkout, (err, createdWorkout) => {
    if (err) {
      console.log("Error creating workout: ", err);
      return;
    }

    const workoutId = createdWorkout.id;

    // Generate full body workout exercises
    Exercise.generateFullBodyWorkout(exercises, workoutId);

    console.log(`Full body workout created with ID: ${workoutId}`);
  });
};

//generates upper body workout
Workout.generateUpperBodyWorkout = (exercises) => {
  const workoutName = `Upper Body - ${new Date().toLocaleString()}`;
  const newWorkout = {
    name: workoutName,
    date: new Date()
  };

  Workout.create(newWorkout, (err, createdWorkout) => {
    if (err) {
      console.log("Error creating upper body workout: ", err);
      return;
    }

    const workoutId = createdWorkout.id;
    Exercise.generateUpperBodyWorkout(exercises, workoutId);
    console.log(`Upper body workout created with ID: ${workoutId}`);
  });
};

//generates lower body workout
Workout.generateLowerBodyWorkout = (exercises) => {
  const workoutName = `Lower Body - ${new Date().toLocaleString()}`;
  const newWorkout = {
    name: workoutName,
    date: new Date()
  };

  Workout.create(newWorkout, (err, createdWorkout) => {
    if (err) {
      console.log("Error creating lower body workout: ", err);
      return;
    }

    const workoutId = createdWorkout.id;
    Exercise.generateLowerBodyWorkout(exercises, workoutId);
    console.log(`Lower body workout created with ID: ${workoutId}`);
  });
};

//generates push workout
Workout.generatePushWorkout = (exercises) => {
  const workoutName = `Push - ${new Date().toLocaleString()}`;
  const newWorkout = {
    name: workoutName,
    date: new Date()
  };

  Workout.create(newWorkout, (err, createdWorkout) => {
    if (err) {
      console.log("Error creating push workout: ", err);
      return;
    }

    const workoutId = createdWorkout.id;
    Exercise.generatePushWorkout(exercises, workoutId);
    console.log(`Push workout created with ID: ${workoutId}`);
  });
};

//generates pull workout
Workout.generatePullWorkout = (exercises) => {
  const workoutName = `Pull - ${new Date().toLocaleString()}`;
  const newWorkout = {
    name: workoutName,
    date: new Date()
  };

  Workout.create(newWorkout, (err, createdWorkout) => {
    if (err) {
      console.log("Error creating pull workout: ", err);
      return;
    }

    const workoutId = createdWorkout.id;
    Exercise.generatePullWorkout(exercises, workoutId);
    console.log(`Pull workout created with ID: ${workoutId}`);
  });
};

//generates leg workout
Workout.generateLegWorkout = (exercises) => {
  const workoutName = `Leg - ${new Date().toLocaleString()}`;
  const newWorkout = {
    name: workoutName,
    date: new Date()
  };

  Workout.create(newWorkout, (err, createdWorkout) => {
    if (err) {
      console.log("Error creating leg workout: ", err);
      return;
    }

    const workoutId = createdWorkout.id;
    Exercise.generateLegWorkout(exercises, workoutId);
    console.log(`Leg workout created with ID: ${workoutId}`);
  });
};


export default Workout;