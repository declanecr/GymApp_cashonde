/**
 * App.js
 * 
 * This is the main component of the Gym App. It sets up the routing and
 * navigation structure for the entire application.
 */

import React from "react";
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";

// Import react-bootstrap for UI components
import 'react-bootstrap/dist/react-bootstrap.min.js';

// Import custom components
import AddExercise from "./components/AddExercise";
import CurrentWorkout from "./components/CurrentWorkout";
import Exercise from "./components/Exercise";
import ExercisesList from "./components/ExercisesList";

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
      {/* Navigation bar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/exercises">GYM APP</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* Navigation links */}
              <Nav.Link as={Link} to="/exercises">Exercises</Nav.Link>
              <Nav.Link as={Link} to="/add">Add</Nav.Link>
              <Nav.Link as={Link} to="/current-workout">Current Workout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main content area */}
      <Container className="mt-3">
        {/* Route configuration */}
        <Routes>
          {/* Default route */}
          <Route path="/" element={<ExercisesList/>} />
          {/* Exercise list route */}
          <Route path="/exercises" element={<ExercisesList/>} />
          {/* Add new exercise route */}
          <Route path="/add" element={<AddExercise/>} />
          {/* Individual exercise details route */}
          <Route path="/exercises/:id" element={<Exercise/>} />
          {/* Current workout route */}
          <Route path="/current-workout" element={<CurrentWorkout />}/>
        </Routes>
      </Container>
    </div>
  );
}

export default App;