/**
 * Server Configuration File
 * 
 * This file sets up the Express server, configures middleware,
 * defines routes, and starts the server listening on a specified port.
 */

import cors from "cors";
import express from "express";
import path, { dirname } from 'path'; // Add this import at the top
import { fileURLToPath } from 'url';
import authRoutes from "./app/routes/auth.routes.js";
import exerciseRoutes from "./app/routes/exercise.routes.js";
import homeRoutes from "./app/routes/home.routes.js";
import setRoutes from "./app/routes/set.routes.js";
import testRoutes from "./app/routes/test.routes.js";
import usersRoutes from "./app/routes/users.routes.js";
import workoutRoutes from "./app/routes/workout.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

// Configure CORS options
const corsOptions = {
  origin: [
    "http://localhost:3001",
    "https://node-express-react-mysql-test-ca3b344e37df.herokuapp.com/"]
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Add CSP headers middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: http:; " +
    "font-src 'self' data: https:; " +
    "connect-src 'self'"
  );
  next();
});


// Configure middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, 'react-crud/build')));

// Handle React routing, return all requests to React app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'react-crud/build', 'index.html'));
});

// Apply routes defined in exercise.routes.js
exerciseRoutes(app);
setRoutes(app);
homeRoutes(app);
workoutRoutes(app);
usersRoutes(app);
authRoutes(app);
testRoutes(app);

// Set up server to listen on specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});