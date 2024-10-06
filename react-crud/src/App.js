import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";

import AddExercise from "./components/AddExercise";
import CurrentWorkout from "./components/CurrentWorkout";
import Exercise from "./components/Exercise";
import ExercisesList from "./components/ExercisesList";

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/exercises" className="navbar-brand">
          GYM APP
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/exercises"} className="nav-link">
              Exercises
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              Add
            </Link>
          </li>

          
          <li className="nav-item"> 
              <Link to={"/current-workout"} className="nav-link">
                Current Workout
              </Link>
            </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<ExercisesList/>} />
          <Route path="/exercises" element={<ExercisesList/>} />
          <Route path="/add" element={<AddExercise/>} />
          <Route path="/exercises/:id" element={<Exercise/>} />
          <Route path="/current-workout" element={<CurrentWorkout />}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;