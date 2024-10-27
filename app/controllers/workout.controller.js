/**
 * Workout Controller
 *
 * This file contains controller functions for handling workout-related operations.
 * It manages the communication between the client requests and the Workout model,
 * processing data and sending appropriate responses.
 */

import Workout from "../models/workout.model.js";

/**
 * Create and Save a new Workout
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Workout
  const workout = new Workout({
    name: req.body.name,
    date: req.body.date,
  });

  // Save Workout in the database
  Workout.create(workout, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Workout."
      });
    else res.send(data);
  });
};

/**
 * Retrieve all Workouts from the database.
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const findAll = (req, res) => {
  Workout.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving workouts."
      });
    else res.send(data);
  });
};

/**
 * Find a single Workout with a workoutId
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const findOne = (req, res) => {
  Workout.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Workout with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Workout with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

/**
 * Update a Workout identified by the workoutId in the request
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Workout.updateById(
    req.params.id,
    new Workout(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Workout with id ${req.params.workoutId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Workout with id " + req.params.workoutId
          });
        }
      } else res.send(data);
    }
  );
};

/**
 * Delete a Workout with the specified workoutId in the request
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const remove = (req, res) => {
  Workout.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Workout with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Workout with id " + req.params.id
        });
      }
    } else res.send({ message: `Workout was deleted successfully!` });
  });
};

// Get all sets for a specific workout
export const getWorkoutSets = (req, res) => {
  const workoutId = req.params.id;

  Workout.getSets(workoutId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No sets found for workout with id ${workoutId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving sets for workout with id " + workoutId
        });
      }
    } else {
      res.send(data);
    }
  });
};

