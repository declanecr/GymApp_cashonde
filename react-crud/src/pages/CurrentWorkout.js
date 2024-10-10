/**
 * CurrentWorkout Component
 * 
 * This component manages and displays the current workout session.
 * It allows users to view their selected exercises and remove them if needed.
 */
import PropTypes from 'prop-types';
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

CurrentWorkout.propTypes = {
  workout: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      main_muscle: PropTypes.string.isRequired
    })
  ).isRequired
};


export default CurrentWorkout;