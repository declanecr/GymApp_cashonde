/**
 * Set Controller
 *
 * This file contains controller functions for handling set-related operations.
 * It manages the communication between the client requests and the Set model,
 * processing data and sending appropriate responses.
 */

import Set from "../models/set.model.js";

/**
 * Create and Save a new Set
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Create a new set for a specific exercise
 * @input Exercise ID from request parameters, set details from request body
 * @output JSON response with created set data or error message
 * @sends New set data to the client
 */
export const create = (req, res) => {
  console.log("Request params", req.params);
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);

  const exerciseId = parseInt(req.params.id, 10);

  // Validate request
  if (!req.body || Object.keys(req.body).length === 0) {
    //console.log("Empty request body");
    return res.status(400).send({ message: "Content can not be empty!" });
  }

  if (!req.body.workout_id || !req.body.date || !req.body.reps || !req.body.weight) {
    return res.status(400).send({ message: "Missing required fields in request body." });
  }

  // Create a Set
  const set = new Set({
    exercise_id: exerciseId,
    workout_id: req.body.workout_id,
    date: req.body.date,
    reps: req.body.reps,
    weight: req.body.weight
  });

  console.log("Set object created:", set);

  // Save Set in the database
  Set.create(set, (err, data) => {
    if (err) {
      console.error("Error creating set:", err);
      res.status(500).send({
        message: err.message || "An error occurred while creating the Set.",
        error: err
      });
    } else {
      console.log("Set created successfully:", data);
      res.status(201).send({...data, exercise_id: exerciseId, workout_id:req.body.workout_id});
    }
  });
};

/**
 * Retrieve all Sets for a specific exercise from the database
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Fetch all sets for a given exercise
 * @input Exercise ID from request parameters
 * @output JSON response with array of sets or error message
 * @sends Array of sets to the client
 */
export const findAll = (req, res) => {
  const exerciseId = req.params.id;
  Set.findByExerciseId(exerciseId, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving sets."
      });
    else res.send(data.map(set => ({...set, workout_id: set.workout_id})));
  });
};

/**
 * Find a single Set with a setId for a specific exercise
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Retrieve a specific set for a given exercise
 * @input Exercise ID and Set ID from request parameters
 * @output JSON response with set data or error message
 * @sends Set data to the client
 */
export const findOne = (req, res) => {
  Set.findById(req.params.id, req.params.setId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Set with id ${req.params.setId} for Exercise ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Set with id " + req.params.setId
        });
      }
    } else res.send(data);
  });
};

/**
 * Update a Set identified by the setId in the request
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Update an existing set for a specific exercise
 * @input Exercise ID and Set ID from request parameters, updated set details from request body
 * @output JSON response with updated set data or error message
 * @sends Updated set data to the client
 */
export const update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  Set.updateById(
    req.params.id,
    req.params.setId,
    new Set({
      ...req.body,
      workout_id: req.body.workout_id // Ensure workout_id is included
    }),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Set with id ${req.params.setId} for Exercise ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Set with id " + req.params.setId
          });
        }
      } else res.send(data);
    }
  );
};

/**
 * Delete a Set with the specified setId in the request
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Delete a specific set for a given exercise
 * @input Exercise ID and Set ID from request parameters
 * @output JSON response with success message or error message
 * @sends Deletion confirmation message to the client
 */
export const deleteSet = (req, res) => {
  Set.remove(req.params.id, req.params.setId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Set with id ${req.params.setId} for Exercise ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Set with id " + req.params.setId
        });
      }
    } else res.send({ message: `Set was deleted successfully!` });
  });
};

/**
 * Delete all Sets for a specific exercise from the database
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @purpose Remove all sets for a given exercise
 * @input Exercise ID from request parameters
 * @output JSON response with success message or error message
 * @sends Deletion confirmation message to the client
 */
export const deleteAll = (req, res) => {
  const exerciseId = req.params.id;
  Set.removeAllForExercise(exerciseId, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all sets for this exercise."
      });
    else res.send({ message: `All Sets for Exercise ${exerciseId} were deleted successfully!` });
  });
};