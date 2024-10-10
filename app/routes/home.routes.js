/**
 * This file defines the routes for the Home API.
 * It sets up the endpoint for the homepage.
 */

import { Router } from "express";
const router = Router();

export default function(app) {
  
    // Retrieve the homepage
    router.get("/", (req, res) => {
        res.json({ message: "Welcome to the Gym App homepage." });
    });

    // Mount the router on the app
    app.use('/api/home', router);
};