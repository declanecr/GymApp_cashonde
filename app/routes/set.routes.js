import express from 'express';
import * as sets from "../controllers/set.controller.js";

const router = express.Router();

export default function(app){

    // Create a new Set
    router.post("/", sets.create);

    // Retrieve all Sets
    router.get("/", sets.findAll);

    // Retrieve a single Set with setId
    router.get("/:setId", sets.findOne);

    // Update a Set with setId
    router.put("/:setId", sets.update);

    // Delete a Set with setId
    router.delete("/:setId", sets.deleteSet);

    // Delete all Sets
    router.delete("/", sets.deleteAll);

    //Mount the router on the app
    app.use('/api/exercises/:id/sets', router);
}

