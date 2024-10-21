/**
 * CurrentWorkout Component
 * 
 * This component manages and displays the current workout session.
 * It allows users to view their selected exercises, remove them if needed, and add sets.
 */
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Checkbox, Container, IconButton, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import RemoveExerciseButton from '../components/RemoveExerciseButton';
import SaveWorkoutButton from '../components/SaveWorkoutButton';
import ExerciseDataService from '../services/ExerciseDataService';

const CurrentWorkout = ({ currentWorkout, removeFromWorkout, deleteWorkout }) => {
  const [sets, setSets] = useState([]);

  const handleAddSet = (exerciseId) => {
    setSets([...sets, { exerciseId, weight: '', reps: '', isCompleted: false }]);
  };

  const handleRemoveSet = (index) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const handleSetChange = (index, field, value) => {
    setSets(sets.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    ));
  };

  const handleSetCompletion = (index, isCompleted) => {
    setSets(sets.map((set, i) => 
      i === index ? { ...set, isCompleted } : set
    ));
  };

  
  const onSWBclick = async () => {
    const completedSets = sets.filter(set => set.isCompleted);
    if (completedSets.length === 0) {
      console.log("no sets");
      return [];
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const workoutData = {
      name: `Workout ${currentDate}`,
      date: currentDate
    };
    console.log(workoutData);
    try {

      const response =await ExerciseDataService.createWorkout(workoutData);
      console.log(response.data.id);
    }catch(error){
      console.error('Error creating workout:', error);
      return[];
    }

    return sets.filter(set => set.isCompleted).map(set => ({
      ...set,
      exerciseId: set.exerciseId
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Current Workout
        </Typography>
        
        <SaveWorkoutButton currentWorkout={onSWBclick()} removeFromWorkout={removeFromWorkout} deleteWorkout={deleteWorkout}/>
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
                <Box>
                  <Button onClick={() => handleAddSet(exercise.id)} variant="contained" color="primary">
                    Add Set
                  </Button>
                  <List>
                    {sets.filter(set => set.exerciseId === exercise.id).map((set, setIndex) => (
                      <ListItem 
                        key={setIndex} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mt: 2,
                          backgroundColor: set.isCompleted ? '#e8f5e9' : 'transparent',
                          padding: '5px',
                          borderRadius: '4px',
                        }}
                      >
                        <TextField
                          label="Weight"
                          type="number"
                          value={set.weight}
                          onChange={(e) => handleSetChange(setIndex, 'weight', e.target.value)}
                          sx={{ mr: 2 }}
                        />
                        <TextField
                          label="Reps"
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleSetChange(setIndex, 'reps', e.target.value)}
                          sx={{ mr: 2 }}
                        />
                        <Checkbox
                          checked={set.isCompleted}
                          onChange={(e) => handleSetCompletion(setIndex, e.target.checked)}
                          sx={{
                            '&.Mui-checked': {
              color: 'green',
            },
          }}
        />
        <IconButton onClick={() => handleRemoveSet(setIndex)} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </ListItem>
    ))}
  </List>
</Box>
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
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      main_muscle: PropTypes.string.isRequired
    })
  ).isRequired,
  removeFromWorkout: PropTypes.func.isRequired,
  deleteWorkout: PropTypes.func.isRequired
};

export default CurrentWorkout;