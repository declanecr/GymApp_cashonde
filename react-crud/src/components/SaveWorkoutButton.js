import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import ExerciseDataService from '../services/ExerciseDataService';

const SaveWorkoutButton = ({ currentWorkout, deleteWorkout}) => {
    console.log("currentWorkout: ",currentWorkout);
    const saveWorkout = () => {
        if (currentWorkout && currentWorkout.length > 0) {
            currentWorkout.forEach(exercise => {
                console.log('exerciseID: ',exercise.exerciseId);
                console.log('workoutID: ',exercise.workoutId);
                console.log('reps: ',exercise.reps);
                console.log('weight: ', exercise.weight);
                ExerciseDataService.createSet( exercise.workoutId, exercise.exerciseId,{
                    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
                    reps: exercise.reps || 0, // Default to 0 if not provided
                    weight: exercise.weight || 0 // Default to 0 if not provided
                })
                .then(response => {
                    console.log('Set saved:', response.data);
                })
                .catch(error => {
                    console.error('Error saving set:', error);
                });
            });
        }
        deleteWorkout();
    };
    
    return (
        <Button
            onClick={saveWorkout}
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
            Save Workout
        </Button>
    );
};

SaveWorkoutButton.propTypes = {
    deleteWorkout: PropTypes.func.isRequired,
    currentWorkout: PropTypes.array.isRequired

};

export default SaveWorkoutButton;