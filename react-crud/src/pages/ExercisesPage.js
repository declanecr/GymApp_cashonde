/**
 * ExercisePage Component
 * 
 * This component serves as the main exercise page for the Gym App.
 * It displays the navigation bar and the exercise data grid.
 */

import PropTypes from 'prop-types';
import React from 'react';
import ExerciseGrid from '../components/ExerciseGrid';

const ExercisePage = ({ addToWorkout }) => {
    return (
      <div>
        <h1>Exercises</h1>
        <ExerciseGrid addToWorkout={addToWorkout} />
      </div>
    );
};

ExercisePage.propTypes = {
    addToWorkout: PropTypes.func.isRequired
};

export default ExercisePage;