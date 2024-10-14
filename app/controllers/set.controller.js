import Set from "../models/set.model.js";

// Create and Save a new Set
export const create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Set
  const set = new Set({
    exercise_id: req.body.exercise_id,
    date: req.body.date,
    reps: req.body.reps,
    weight: req.body.weight
  });

  // Save Set in the database
  Set.create(set, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Set."
      });
    else res.send(data);
  });
};

// Retrieve all Sets from the database.
export const findAll = (req, res) => {
  Set.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sets."
      });
    else res.send(data);
  });
};

// Find a single Set with a setId
export const findOne = (req, res) => {
  Set.findById(req.params.setId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Set with id ${req.params.setId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Set with id " + req.params.setId
        });
      }
    } else res.send(data);
  });
};

// Update a Set identified by the setId in the request
export const update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Set.updateById(
    req.params.setId,
    new Set(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Set with id ${req.params.setId}.`
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

// Delete a Set with the specified setId in the request
export const deleteSet = (req, res) => {
  Set.remove(req.params.setId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Set with id ${req.params.setId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Set with id " + req.params.setId
        });
      }
    } else res.send({ message: `Set was deleted successfully!` });
  });
};

// Delete all Sets from the database.
export const deleteAll = (req, res) => {
  Set.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all sets."
      });
    else res.send({ message: `All Sets were deleted successfully!` });
  });
};