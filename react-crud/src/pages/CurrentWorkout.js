/**
 * CurrentWorkout Component
 * 
 * This component manages and displays the current workout session.
 * It allows users to view their selected exercises and remove them if needed.
 */
import { Box, Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveExerciseButton from '../components/RemoveExerciseButton';
import SaveWorkoutButton from '../components/SaveWorkoutButton';

const CurrentWorkout = ({ currentWorkout, removeFromWorkout, deleteWorkout }) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Current Workout
        </Typography>
        <SaveWorkoutButton currentWorkout={currentWorkout} removeFromWorkout={removeFromWorkout} deleteWorkout={deleteWorkout}/>
        {' SAVE EXERCISE BUTTON GOES HERE '}
        {currentWorkout.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No exercises added to the workout yet.
          </Typography>
        ) : (
          <List>
            {currentWorkout.map((exercise, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={exercise.name}
                  secondary={`Main Muscle: ${exercise.main_muscle}`}
                />
                <RemoveExerciseButton exercise={exercise} removeFromWorkout={removeFromWorkout}/>
                
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      
    </Container>
  );
};

CurrentWorkout.propTypes = {
  currentWorkout: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      main_muscle: PropTypes.string.isRequired
    })
  ).isRequired,
  removeFromWorkout:PropTypes.func.isRequired,
  deleteWorkout: PropTypes.func.isRequired
};

export default CurrentWorkout;
