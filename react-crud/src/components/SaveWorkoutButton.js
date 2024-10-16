import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const SaveWorkoutButton = ({ deleteWorkout }) => {
    return (
        <Button
            onClick={() => deleteWorkout()}
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
    deleteWorkout: PropTypes.func.isRequired
};

export default SaveWorkoutButton;