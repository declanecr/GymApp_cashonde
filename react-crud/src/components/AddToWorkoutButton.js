import PropTypes from 'prop-types';
import React from 'react';

const AddToWorkoutButton = ({ exercise, onAddToWorkout }) => {
  const handleClick = () => {
    if (exercise) {
      onAddToWorkout(exercise);
    }
  };

  return (
    <button onClick={handleClick} disabled={!exercise}>
      Add to Workout
    </button>
  );
};

AddToWorkoutButton.propTypes = {
  exercise: PropTypes.object,
  onAddToWorkout: PropTypes.func.isRequired
};

export default AddToWorkoutButton;