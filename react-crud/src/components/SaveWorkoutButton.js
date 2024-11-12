import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import SetDataService from '../services/SetDataService';
import WorkoutDataService from '../services/WorkoutDataService';
import authService from '../services/auth.service';

const SaveWorkoutButton = ({ currentWorkout, deleteWorkout, startTime, endTime, clearLocalStorage}) => {
    const user =authService.getCurrentUser();
    //console.log('user: ', user);
    //console.log("currentWorkout: ",currentWorkout);
    const saveWorkout = async () => {
        console.log("saveWorkout function called");
        //good here
        if (currentWorkout && currentWorkout.length > 0) {
            try {
                // Format the dates to match MySQL datetime format
                const formatDateTime = (date) => {
                    return date.toISOString().slice(0, 19).replace('T', ' ');
                };
                const workoutData = {
                    name: `Workout ${new Date().toISOString().split('T')[0]}`,
                    date: new Date().toISOString().split('T')[0],
                    user_id: user.id,
                    start_time: formatDateTime(startTime),    // Format: 'YYYY-MM-DD HH:MM:SS'
                    end_time: formatDateTime(endTime || new Date())
                };
                const workoutResponse = await WorkoutDataService.createWorkout(workoutData);
                const workoutId = workoutResponse.id;
                console.log("Created workout with ID:", workoutId);

                for (const exercise of currentWorkout) {
                    await SetDataService.createSet(exercise.exerciseId, {
                        workout_id: workoutId,
                        date: new Date().toISOString().split('T')[0],
                        reps: exercise.reps || 0,
                        weight: exercise.weight || 0,
                        user_id: user.id
                        

                    });
                    console.log('Set saved for exercise:', exercise.exerciseId);
                }
                console.log('All sets saved successfully');
                deleteWorkout();
                clearLocalStorage();
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
    clearLocalStorage: PropTypes.func.isRequired,
    currentWorkout: PropTypes.array.isRequired,
    startTime: PropTypes.instanceOf(Date),
    endTime: PropTypes.instanceOf(Date)
};

export default SaveWorkoutButton;