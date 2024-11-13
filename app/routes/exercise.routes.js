/**
 * This file defines the routes for the Exercise API.
 * It sets up endpoints for CRUD operations and data retrieval.
 */

import { Router } from "express";
import * as exercises from "../controllers/exercise.controller.js";
const router = Router();

export default function(app) {
  
    // Create a new Exercise
    router.post("/", exercises.create);
  
    // Retrieve all Exercises (with optional name filter)
    router.get("/", exercises.findAll);

    // Retrieve filtered data
    console.log ("getting routes");
    router.get("/main_muscle", exercises.getMuscleGroups);
    router.get("/equipment", exercises.getEquipment);
    router.get("/level", exercises.getLevels);
    router.get("/types", exercises.getTypes);

    // Retrieve a single Exercise by id
    router.get("/:id", exercises.findOne);
  
    // Update an Exercise by id
    router.put("/:id", exercises.update);
  
    // Delete an Exercise by id
    router.delete("/:id", exercises.deleteExercise);
  
    // Delete all Exercises
    router.delete("/", exercises.deleteAll);

    // Add a new set to an exercise
    //router.post("/:id/sets", exercises.addSet);

    // Get all sets for an exercise
    //router.get("/:id/sets", setController.findAll);

    // Fetch workouts for a specific exercise
    router.get("/:id/workouts", exercises.getWorkouts)

    // Mount the router on the app
    app.use('/api/exercises', router);
};