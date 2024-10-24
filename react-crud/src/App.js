/**
 * App.js
 * 
 * This is the main component of the Gym App. It sets up the routing structure
 * and manages the global state for the current workout.
 */

import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import AddExercise from './pages/AddExercisePage';
import CurrentWorkout from './pages/CurrentWorkout';
import ExercisesList from './pages/ExercisesPage';
import Home from './pages/Home';
import SetsHistory from './pages/SetsHistory';

const App = () => {
  const [currentWorkout, setCurrentWorkout] = useState([]);

  /**
   * Adds an exercise to the current workout
   * @param {Object} exercise - The exercise to be added
   */
  const addToWorkout = (exercise) => {
    setCurrentWorkout(prevWorkout => [...prevWorkout, exercise]);
  };

  const removeFromWorkout = (exerciseToRemove) => {
    console.log('App.removeFromWorkout: removing: ',exerciseToRemove.name);
    setCurrentWorkout(currentWorkout.filter(exercise => exercise.id !== exerciseToRemove.id));
  };

  const deleteWorkout =() => {
    setCurrentWorkout([]);
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercises" element={<ExercisesList addToWorkout={addToWorkout} />} />
        <Route path="/add" element={<AddExercise />} />
        <Route path="/current-workout" element={<CurrentWorkout currentWorkout={currentWorkout} removeFromWorkout={removeFromWorkout} deleteWorkout={deleteWorkout}/>} />
        <Route path="/exercises/:id/sets" element={<SetsHistory/>} />
      </Routes>
    </>
  );
};

export default App;