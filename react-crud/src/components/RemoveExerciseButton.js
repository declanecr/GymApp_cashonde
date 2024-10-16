import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const RemoveExerciseButton = ({ exercise, removeFromWorkout }) => {
  return (
    <Button
      onClick={() => removeFromWorkout(exercise)}
      variant="contained"
      color="secondary"
      sx={{
        padding: '5px 10px',
        borderRadius: '5px',
        textTransform: 'none',
        backgroundColor: '#d32f2f',
        '&:hover': {
          backgroundColor: '#b71c1c',
        },
      }}
    >
      Remove
    </Button>
  );
};

RemoveExerciseButton.propTypes = {
  exercise: PropTypes.object.isRequired,
  removeFromWorkout: PropTypes.func.isRequired
};

export default RemoveExerciseButton;