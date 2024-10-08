/**
 * App.js
 * 
 * This is the main component of the Gym App. It sets up the routing and
 * navigation structure for the entire application.
 */

import React from "react";
import "./App.css";

// Import react-bootstrap for UI components

import 'react-bootstrap/dist/react-bootstrap.min.js';


// Import custom components
import TestExerciseList from "./components/testExerciseList.js";
import NavBar from "./components/testNavBar.js";


/**
 * App Component
 * 
 * Purpose: Renders the main structure of the application, including navigation and routing
 * Inputs: None
 * Outputs: Rendered React component
 * Routing: Sets up routes for different pages of the application
 */
function App() {
  return (
    <div>
      <h1>Gym App</h1>
      <NavBar />
      <TestExerciseList />

      
      
    </div>
  );
}

export default App;