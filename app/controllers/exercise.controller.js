/**
 * Exercise Controller
 *
 * This file contains controller functions for handling exercise-related operations.
 * It manages the communication between the client requests and the Exercise model,
 * processing data and sending appropriate responses.
 */

import Exercise from "../models/exercise.model.js";
import Set from "../models/set.model.js";

export const addSet = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const set = new Set({
    exercise_id: req.params.id,
    date: req.body.date,
    reps: req.body.reps,
    weight: req.body.weight
  });

  Set.create(set, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Set."
      });
    else res.send(data);
  });
};

export const getSets = (req, res) => {
  Set.findByExerciseId(req.params.id, req.body.user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        console.log('no sets found');
        console.log(req.params);
        console.log(req.body);
        res.status(404).send({
          message: `No sets found for Exercise with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving sets for Exercise with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

/**
 * Create and Save a new Exercise
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Create a new exercise and save it to the database
 * @input Request body containing exercise details
 * @output JSON response with created exercise data or error message
 * @sends Created exercise data to the client
 */
export const create = (req, res) => {
  // Validate request to ensure the body is not empty
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create an Exercise object with request body data
  const exercise = new Exercise({
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    main_muscle: req.body.main_muscle,
    equipment: req.body.equipment,
    level: req.body.level,
    rating: req.body.rating || 0 , // Default rating to 0 if not provided
    instructions: req.body.instructions,
    image_url: req.body.image_url,
    muscle_diagram_url: req.body.muscle_diagram_url
  });

  // Save Exercise in the database
  Exercise.create(exercise, (err, data) => {
    if (err)
      // Send error response if creation fails
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Exercise."
      });
    else 
      // Send created exercise data if successful
      res.send(data);
  });
};

/**
 * Retrieve all Exercises from the database (with condition)
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Fetch all exercises or exercises matching a name query
 * @input Optional name query parameter
 * @output JSON response with array of exercises or error message
 * @sends Array of exercises to the client
 */
export const findAll = (req, res) => {
  // Log only necessary parts of the request object
  console.log('Request query:', req.query);
  console.log('Request params:', req.params);

  const name = req.query.name;

  // Retrieve exercises from the database
  Exercise.getAll(name, (err, data) => {
    if (err)
      // Send error response if retrieval fails
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving exercises."
      });
    else 
      // Send retrieved exercise data if successful
      res.send(data);
  });
};

/**
 * Find a single Exercise with an id
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Fetch a specific exercise by its ID
 * @input Exercise ID from request parameters
 * @output JSON response with exercise data or error message
 * @sends Single exercise data to the client
 */
export const findOne = (req, res) => {
  console.log("findOne called with id:", req.params.id);
  // Find exercise by ID in the database
  Exercise.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        // Send 404 if exercise not found
        console.log("Exercise not found with id:", req.params.id);
        res.status(404).send({
          message: `Not found Exercise with id ${req.params.id}.`
        });
      } else {
        // Send 500 for other errors
        console.log("Error retrieving Exercise with id:", req.params.id, "Error:", err);
        res.status(500).send({
          message: "Error retrieving Exercise with id " + req.params.id
        });
      }
    } else {
      // Send found exercise data if successful
      console.log("Exercise found:", data);
      res.send(data);
    }
  });
};

/**
 * Update an Exercise identified by the id in the request
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Update an existing exercise's details
 * @input Exercise ID from request parameters and updated exercise data in request body
 * @output JSON response with updated exercise data or error message
 * @sends Updated exercise data to the client
 */
export const update = (req, res) => {
  // Validate Request to ensure the body is not empty
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  // Update exercise in the database
  Exercise.updateById(
    req.params.id,
    new Exercise(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          // Send 404 if exercise not found
          res.status(404).send({
            message: `Not found Exercise with id ${req.params.id}.`
          });
        } else {
          // Send 500 for other errors
          res.status(500).send({
            message: "Error updating Exercise with id " + req.params.id
          });
        }
      } else 
        // Send updated exercise data if successful
        res.send(data);
    }
  );
};

/**
 * Delete an Exercise with the specified id in the request
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Delete a specific exercise from the database
 * @input Exercise ID from request parameters
 * @output JSON response with success message or error message
 * @sends Deletion confirmation message to the client
 */
export const deleteExercise = (req, res) => {
  // Remove exercise from the database
  Exercise.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        // Send 404 if exercise not found
        res.status(404).send({
          message: `Not found Exercise with id ${req.params.id}.`
        });
      } else {
        // Send 500 for other errors
        res.status(500).send({
          message: "Could not delete Exercise with id " + req.params.id
        });
      }
    } else 
      // Send success message if deletion successful
      res.send({ message: `Exercise was deleted successfully!` });
  });
};

/**
 * Delete all Exercises from the database
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Remove all exercises from the database
 * @input None
 * @output JSON response with success message or error message
 * @sends Deletion confirmation message to the client
 */
export const deleteAll = (req, res) => {
  // Remove all exercises from the database
  Exercise.removeAll((err, data) => {
    if (err)
      // Send error response if deletion fails
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all exercises."
      });
    else 
      // Send success message if deletion successful
      res.send({ message: `All Exercises were deleted successfully!` });
  });
};

/**
 * Get unique muscle groups
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Fetch all unique muscle groups from the exercises
 * @input None
 * @output JSON response with array of unique muscle groups or error message
 * @sends Array of unique muscle groups to the client
 */
export const getMuscleGroups = (req, res) => {
  console.log ("export")
  // Retrieve unique muscle groups from the database
  Exercise.getUniqueMuscleGroups((err, data) => {
    if (err)
      // Send error response if retrieval fails
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving muscle groups."
      });
    else {
      // Log and send retrieved muscle groups if successful
      console.log("Unique muscle groups:", data);
      res.send(data);
    }
  });
};

/**
 * Get unique equipment
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Fetch all unique equipment from the exercises
 * @input None
 * @output JSON response with array of unique equipment or error message
 * @sends Array of unique equipment to the client
 */
export const getEquipment = (req, res) => {
  // Retrieve unique equipment from the database
  Exercise.getUniqueEquipment((err, data) => {
    if (err)
      // Send error response if retrieval fails
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving equipment."
      });
    else 
      // Send retrieved equipment data if successful
      res.send(data);
  });
};

/**
 * Get unique levels
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Fetch all unique difficulty levels from the exercises
 * @input None
 * @output JSON response with array of unique levels or error message
 * @sends Array of unique levels to the client
 */
export const getLevels = (req, res) => {
  // Retrieve unique levels from the database
  Exercise.getUniqueLevels((err, data) => {
    if (err)
      // Send error response if retrieval fails
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving levels."
      });
    else 
      // Send retrieved levels data if successful
      res.send(data);
  });
};

/**
 * Get unique types
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Fetch all unique difficulty types from the exercises
 * @input None
 * @output JSON response with array of unique types or error message
 * @sends Array of unique types to the client
 */
export const getTypes = (req, res) => {
  // Retrieve unique types from the database
  Exercise.getUniqueTypes((err, data) => {
    if (err)
      // Send error response if retrieval fails
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving types."
      });
    else 
      // Send retrieved types data if successful
      res.send(data);
  });
};



export const getWorkouts = (req,res)=>{
  Exercise.getWorkouts(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving workouts."
      });
    } else {
      res.send(data);
    }
  });
}

/**
 * Generate a full body workout
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const generateFullBodyWorkout = ( req, res) => {
  Exercise.generateFullBodyWorkout((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while generating the full body workout."
      });
    } else {
      res.send(data);
    }
  });
};

/**
 * Generate an upper body workout
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const generateUpperBodyWorkout = (req, res) => {
  const workoutId = req.params.workoutId;
  Exercise.generateUpperBodyWorkout(workoutId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while generating the upper body workout."
      });
    } else {
      res.send(data);
    }
  });
};

/**
 * Generate a lower body workout
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const generateLowerBodyWorkout = (req, res) => {
  const workoutId = req.params.workoutId;
  Exercise.generateLowerBodyWorkout(workoutId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while generating the lower body workout."
      });
    } else {
      res.send(data);
    }
  });
};

/**
 * Generate a push workout
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const generatePushWorkout = (req, res) => {
  const workoutId = req.params.workoutId;
  Exercise.generatePushWorkout(workoutId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while generating the push workout."
      });
    } else {
      res.send(data);
    }
  });
};

/**
 * Generate a pull workout
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const generatePullWorkout = (req, res) => {
  const workoutId = req.params.workoutId;
  Exercise.generatePullWorkout(workoutId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while generating the pull workout."
      });
    } else {
      res.send(data);
    }
  });
};

/**
 * Generate a leg workout
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const generateLegWorkout = (req, res) => {
  const workoutId = req.params.workoutId;
  Exercise.generateLowerBodyWorkout(workoutId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while generating the leg workout."
      });
    } else {
      res.send(data);
    }
  });
};