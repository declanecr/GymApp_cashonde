import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import SetDataService from '../services/SetDataService';
import WorkoutDataService from '../services/WorkoutDataService';

const SaveWorkoutButton = ({ currentWorkout, deleteWorkout}) => {
    
    console.log("currentWorkout: ",currentWorkout);
    const saveWorkout = async () => {
        console.log("saveWorkout function called");
        //good here
        if (currentWorkout && currentWorkout.length > 0) {
            try {
                const workoutData = {
                    name: `Workout ${new Date().toISOString().split('T')[0]}`,
                    date: new Date().toISOString().split('T')[0],
                    user_id: sessionStorage.getItem('user_id')
                };
                const workoutResponse = await WorkoutDataService.createWorkout(workoutData);
                const workoutId = workoutResponse.id;
                console.log("Created workout with ID:", workoutId);

                for (const exercise of currentWorkout) {
                    console.log('exerciseID: ', exercise.exerciseId);
                    console.log('reps: ', exercise.reps);
                    console.log('weight: ', exercise.weight);
                    console.log('workoutID: ', workoutId);
                    
                    await SetDataService.createSet(exercise.exerciseId, {
                        workout_id: workoutId,
                        date: new Date().toISOString().split('T')[0],
                        reps: exercise.reps || 0,
                        weight: exercise.weight || 0,
                        user_id: sessionStorage.getItem('user_id')
                        

                    });
                    console.log('Set saved for exercise:', exercise.exerciseId);
                }
                console.log('All sets saved successfully');
                deleteWorkout();
            } catch (error) {
                console.error('Error saving workout:', error);
            }
        } else {
            console.log('No exercises to save');
        }
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