/**
 * Server Configuration File
 * 
 * This file sets up the Express server, configures middleware,
 * defines routes, and starts the server listening on a specified port.
 */

import cors from "cors";
import express from "express";
import exerciseRoutes from "./app/routes/exercise.routes.js";

const app = express();

// Configure CORS options
const corsOptions = {
  origin: "http://localhost:3001"
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Configure middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Root Route Handler
 * 
 * Purpose: Provide a simple welcome message for the root URL
 * Input: HTTP GET request to "/"
 * Output: JSON response with a welcome message
 */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Declan application." });
});

// Apply routes defined in exercise.routes.js
exerciseRoutes(app);

// Set up server to listen on specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});