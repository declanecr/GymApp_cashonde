import express from 'express';
import authController from "../controllers/auth.controller.js";
import { verifySignUp } from "../middleware/index.js";

const router = express.Router();

export default function(app) {
   

    // Signup
    router.post(
        "/signup",
        [verifySignUp],
        authController.signup
    );

    // Signin
    router.post("/signin", authController.signin);

    // Mount the router on the app
    app.use('/api/auth', router);
};