import Exercise from "../models/exercise.model.js";

// Create and Save a new Exercise
export const create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create an Exercise
  const exercise = new Exercise({
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    main_muscle: req.body.main_muscle,
    equipment: req.body.equipment,
    level: req.body.level,
    rating: req.body.rating || 0
  });

  // Save Exercise in the database
  Exercise.create(exercise, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Exercise."
      });
    else res.send(data);
  });
};

// Retrieve all Exercises from the database (with condition).
export const findAll = (req, res) => {
  const name = req.query.name;

  Exercise.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving exercises."
      });
    else res.send(data);
  });
};

// Find a single Exercise with a id
export const findOne = (req, res) => {
  console.log("findOne called with id:", req.params.id);
  Exercise.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        console.log("Exercise not found with id:", req.params.id);
        res.status(404).send({
          message: `Not found Exercise with id ${req.params.id}.`
        });
      } else {
        console.log("Error retrieving Exercise with id:", req.params.id, "Error:", err);
        res.status(500).send({
          message: "Error retrieving Exercise with id " + req.params.id
        });
      }
    } else {
      console.log("Exercise found:", data);
      res.send(data);
    }
  });
};


// Update an Exercise identified by the id in the request
export const update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Exercise.updateById(
    req.params.id,
    new Exercise(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Exercise with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Exercise with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete an Exercise with the specified id in the request
export const deleteExercise = (req, res) => {
  Exercise.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Exercise with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Exercise with id " + req.params.id
        });
      }
    } else res.send({ message: `Exercise was deleted successfully!` });
  });
};

// Delete all Exercises from the database.
export const deleteAll = (req, res) => {
  Exercise.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all exercises."
      });
    else res.send({ message: `All Exercises were deleted successfully!` });
  });
};

// Get unique muscle groups
export const getMuscleGroups = (req, res) => {
  console.log ("export")
  Exercise.getUniqueMuscleGroups((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving muscle groups."
      });
    else 
      console.log("Unique muscle groups:", data);
      res.send(data);
  });
};

// Get unique equipment
export const getEquipment = (req, res) => {
  Exercise.getUniqueEquipment((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving equipment."
      });
    else res.send(data);
  });
};

// Get unique levels
export const getLevels = (req, res) => {
  Exercise.getUniqueLevels((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving levels."
      });
    else res.send(data);
  });
};