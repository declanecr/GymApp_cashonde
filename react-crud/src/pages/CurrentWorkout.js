/**
 * CurrentWorkout Component
 * 
 * This component manages and displays the current workout session.
 * It allows users to view their selected exercises and remove them if needed.
 */
import React from 'react';

const CurrentWorkout = ({ workout }) => {
  return (
    <div>
      <h1>Current Workout</h1>
      {workout.length === 0 ? (
        <p>No exercises added to the workout yet.</p>
      ) : (
        <ul>
          {workout.map((exercise, index) => (
            <li key={index}>{exercise.name} - {exercise.main_muscle}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CurrentWorkout;