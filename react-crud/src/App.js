import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";

// Import react-bootstrap
import { Container, Nav, Navbar } from 'react-bootstrap';
import 'react-bootstrap/dist/react-bootstrap.min.js';

import AddExercise from "./components/AddExercise.js";
import CurrentWorkout from "./components/CurrentWorkout.js";
import Exercise from "./components/Exercise.js";
import ExercisesList from "./components/ExercisesList.js";

function App() {
  return (
    <div>
      <div>
        <h1>My Gym App</h1>
      </div>

      
      
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/exercises">GYM APP</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/exercises">Exercises</Nav.Link>
              <Nav.Link as={Link} to="/add">Add</Nav.Link>
              <Nav.Link as={Link} to="/current-workout">Current Workout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-3">
        <Routes>
          <Route path="/" element={<ExercisesList/>} />
          <Route path="/exercises" element={<ExercisesList/>} />
          <Route path="/add" element={<AddExercise/>} />
          <Route path="/exercises/:id" element={<Exercise/>} />
          <Route path="/current-workout" element={<CurrentWorkout />}/>
        </Routes>
      </Container>
    </div>
  );
}

export default App;