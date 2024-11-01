import express from 'express';
import * as userController from '../controllers/users.controller.js';

const router = express.Router();

export default function(app) {
    // Create a new User
    router.post("/", (req,res)=>{
        console.log('posting new user: ',req.body.username);
        userController.create(req,res);
    });

    // Login route
    router.post('/login', (req,res) => {
        console.log ('logging in: ', req.body.username);
        userController.login(req,res);
    });

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