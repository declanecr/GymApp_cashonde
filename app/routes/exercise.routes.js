
import { Router } from "express";
import * as exercises from "../controllers/exercise.controller.js";
const router =Router();

export default function(app) {
  
    // Create a new Exercise
    router.post("/", exercises.create);
  
    // Retrieve all Exercises
    router.get("/", exercises.findAll);

  // New routes for filters
  //NOTE: MUST BE ABOVE THE .get("/:id")
  //statements below because it uses the page names as the id
  console.log("getting routes");
  router.get("/muscle_group", exercises.getMuscleGroups);
  router.get("/equipment", exercises.getEquipment);
  router.get("/level", exercises.getLevels);

  
    // Retrieve a single Exercise with id
    router.get("/:id", exercises.findOne);
  
    // Update an Exercise with id
    router.put("/:id", exercises.update);
  
    // Delete an Exercise with id
    router.delete("/:id", exercises.deleteExercise);
  
    // Delete all Exercises
    router.delete("/", exercises.deleteAll);

   
  
    app.use('/api/exercises', router);
  };