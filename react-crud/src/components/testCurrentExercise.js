import PropTypes from 'prop-types';
import React from 'react';

const TestCurrentExercise = ({ exercise }) => {
  if (!exercise) {
    return <h3>Please select an Exercise...</h3>;
  }

  return (
    <div>
      <h3>Current Exercise</h3>
      <p><strong>Name:</strong> {exercise.name}</p>
      <p><strong>Description:</strong> {exercise.description}</p>
      <p><strong>Type:</strong> {exercise.type}</p>
      <p><strong>Main Muscle:</strong> {exercise.main_muscle}</p>
      <p><strong>Equipment:</strong> {exercise.equipment}</p>
      <p><strong>Level:</strong> {exercise.level}</p>
      <p><strong>Rating:</strong> {exercise.rating}</p>
    </div>
  );
};

TestCurrentExercise.propTypes = {
    exercise: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      type: PropTypes.string,
      main_muscle: PropTypes.string,
      equipment: PropTypes.string,
      level: PropTypes.string,
      rating: PropTypes.number
    })
  };

export default TestCurrentExercise;