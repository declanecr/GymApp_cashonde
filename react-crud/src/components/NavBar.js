/**
 * NavBar Component
 * 
 * This component renders the navigation bar for the application.
 * It provides links to various pages and features of the app.
 */

import React from "react";
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, Route, Routes } from "react-router-dom";
import AddExercise from "./AddExercise";
import CurrentWorkout from "./CurrentWorkout";
import Exercise from "./Exercise";
import ExercisesList from "./ExercisesList";

const NavBar = () => {
  return (
    
    <div>
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
};

export default NavBar;