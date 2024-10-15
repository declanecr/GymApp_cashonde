/**
 * CurrentWorkout Component
 * 
 * This component manages and displays the current workout session.
 * It allows users to view their selected exercises and remove them if needed.
 */
import PropTypes from 'prop-types';
import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

const CurrentWorkout = ({ workout }) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Current Workout
        </Typography>
        
        {workout.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No exercises added to the workout yet.
          </Typography>
        ) : (
          <List>
            {workout.map((exercise, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={exercise.name}
                  secondary={`Main Muscle: ${exercise.main_muscle}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

CurrentWorkout.propTypes = {
  workout: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      main_muscle: PropTypes.string.isRequired
    })
  ).isRequired
};

export default CurrentWorkout;
