import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@mui/material';

const AddToWorkoutButton = ({ exercise, onAddToWorkout }) => {
  const handleClick = () => {
    if (exercise) {
      onAddToWorkout(exercise);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!exercise}
      variant="contained"          
      color="primary"              
      sx={{
        padding: '10px 20px 10px',   
        borderRadius: '10px',      
        textTransform: 'none',    
        backgroundColor: '#1976d2',
        '&:hover': {
          backgroundColor: '#1565c0',
        },
        '&:disabled': {
          backgroundColor: '#cfcfcf',
        }
      }}
    >
      Add to Workout
    </Button>
  );
};

AddToWorkoutButton.propTypes = {
  exercise: PropTypes.object,
  onAddToWorkout: PropTypes.func.isRequired
};

export default AddToWorkoutButton;
