import express from 'express';
import * as userController from '../controllers/users.controller.js';

const router = express.Router();

export default function(app) {
    // Create a new User
    router.post("/", userController.create);

    // Retrieve all Users
    router.get("/", userController.findAll);

    // Retrieve a single User with userId
    router.get("/:userId", userController.findOne);

    // Update a User with userId
    router.put("/:userId", userController.update);

    // Delete a User with userId
    router.delete("/:userId", userController.remove);

    // Delete all Users
    router.delete("/", userController.removeAll);

    // Mount the router on the app
    app.use('/api/users', router);
};