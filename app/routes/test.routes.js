import express from 'express';
import authController from '../controllers/auth.controller.js';
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
    router.get("/all", userController.allAccess);

    // Authenticated user access
    router.get(
        "/user",
        [authJwt.verifyToken],
        userController.userBoard
    );

    // Moderator access
    router.get(
        "/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        userController.moderatorBoard
    );

    // Admin access
    router.get(
        "/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        userController.adminBoard
    );
    // Create a new User
    router.post("/", (req,res)=>{
        console.log('posting new user: ',req.body.username);
        authController.signup(req,res);
    });

    app.use ('/api/test', router);
}