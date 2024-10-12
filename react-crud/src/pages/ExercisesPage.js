/**
 * ExercisePage Component
 * 
 * This component serves as the main exercise page for the Gym App.
 * It displays the navigation bar and the exercise data grid.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Container, Typography } from '@mui/material'; // Import necessary MUI components
import ExerciseGrid from '../components/ExerciseGrid';

const ExercisePage = ({ addToWorkout }) => {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 2 }}> {/* Center alignment with margin on top */}
        <Typography variant="h3" component="h1" gutterBottom>
          Exercises
        </Typography>
        <ExerciseGrid addToWorkout={addToWorkout} />
      </Container>
    );
};

ExercisePage.propTypes = {
    addToWorkout: PropTypes.func.isRequired
};

export default ExercisePage;
