import express from 'express';
import * as userController from '../controllers/users.controller.js';
import { authJwt } from '../middleware/index.js';

const router = express.Router();

export default function(app) {

    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Public access
    router.get("/test/all", userController.allAccess);

    // Authenticated user access
    router.get(
        "/test/user",
        [authJwt.verifyToken],
        userController.userBoard
    );

    // Moderator access
    router.get(
        "/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        userController.moderatorBoard
    );

    // Admin access
    router.get(
        "/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        userController.adminBoard
    );
    // Create a new User
    router.post("/", (req,res)=>{
        console.log('posting new user: ',req.body.username);
        userController.create(req,res);
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