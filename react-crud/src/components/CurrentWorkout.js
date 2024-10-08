/**
 * CurrentWorkout Component
 * 
 * This component manages and displays the current workout session.
 * It allows users to view their selected exercises and remove them if needed.
 */

import React, { useEffect, useState } from "react";

const CurrentWorkout = () => {
  const [currentWorkout, setCurrentWorkout] = useState([]);

  useEffect(() => {
    retrieveCurrentWorkout();
  }, []);

  /**
   * Retrieves the current workout from local storage
   * Purpose: Load saved workout data when the component mounts
   * Inputs: None
   * Outputs: None (updates component state)
   */
  const retrieveCurrentWorkout = () => {
    const storedWorkout = localStorage.getItem("currentWorkout");
    if (storedWorkout) {
      // Parse and set the stored workout data
      setCurrentWorkout(JSON.parse(storedWorkout));
    }
  };

  /**
   * Removes an exercise from the current workout
   * Purpose: Allow users to delete exercises from their workout
   * Inputs: index - The position of the exercise to remove
   * Outputs: None (updates component state and local storage)
   */
  const removeExercise = (index) => {
    // Filter out the exercise at the given index
    const updatedWorkout = currentWorkout.filter((_, i) => i !== index);
    // Update state and local storage
    setCurrentWorkout(updatedWorkout);
    localStorage.setItem("currentWorkout", JSON.stringify(updatedWorkout));
  };

  return (
    <div>
      <h2>Current Workout</h2>
      {currentWorkout.length === 0 ? (
        <p>No exercises added to the workout yet.</p>
      ) : (
        <ul>
          {currentWorkout.map((exercise, index) => (
            <li key={index}>
              {exercise.name} - {exercise.main_muscle}
              <button onClick={() => removeExercise(index)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CurrentWorkout;