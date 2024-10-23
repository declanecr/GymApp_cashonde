import express from 'express';
import * as setController from '../controllers/set.controller.js';

export default function(app) {
    const router = express.Router();
    
    // Create a new Set
    router.post("/:id/sets", setController.create);

    // Retrieve all Sets
    router.get("/:id/sets", setController.findAll);

    // Retrieve a single Set with setId
    router.get("/:id/sets/:setId", setController.findOne);

    // Update a Set with setId
    router.put("/:id/sets/:setId", setController.update);

    // Delete a Set with setId
    router.delete("/:id/sets/:setId", setController.deleteSet);

    // Delete all Sets
    router.delete("/:id/sets", setController.deleteAll);

    //Mount the router on the app
    app.use('/api/exercises', router);
}