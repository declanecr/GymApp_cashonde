
import { Router } from "express";
import exercises from "../controllers/exercise.controller.js";
const router =Router();
export default app => {
  
    // Create a new Exercise
    router.post("/", exercises.create);
  
    // Retrieve all Exercises
    router.get("/", exercises.findAll);
  
    // Retrieve a single Exercise with id
    router.get("/:id", exercises.findOne);
  
    // Update an Exercise with id
    router.put("/:id", exercises.update);
  
    // Delete an Exercise with id
    router.delete("/:id", exercises.delete);
  
    // Delete all Exercises
    router.delete("/", exercises.deleteAll);

    // New routes for filters
    console.log("getting routes");
    router.get("/muscle-groups", exercises.getMuscleGroups);
    router.get("/equipment", exercises.getEquipment);
    router.get("/levels", exercises.getLevels);
  
    app.use('/api/exercises', router);
  };