/**
 * CurrentWorkout Component
 * 
 * This component manages and displays the current workout session.
 * It allows users to view their selected exercises, remove them if needed, and add sets.
 */
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Checkbox, Container, FormControlLabel, FormGroup, IconButton, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import RemoveExerciseButton from '../components/RemoveExerciseButton';
import SaveWorkoutButton from '../components/SaveWorkoutButton';
import ExerciseDataService from '../services/ExerciseDataService';

const CurrentWorkout = ({ currentWorkout, removeFromWorkout, deleteWorkout }) => {
  const [sets, setSets] = useState({});
  const [selectedDays, setSelectedDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  });

  const handleAddSet = (exerciseId) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: [...(prevSets[exerciseId] || []), { weight: '', reps: '', isCompleted: false }]
    }));
  };

  const handleRemoveSet = (exerciseId, index) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId].filter((_, i) => i !== index)
    }));
  };

  const handleSetChange = (exerciseId, setIndex, field, value) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId].map((set, i) =>
        i === setIndex ? { ...set, [field]: value } : set
      )
    }));
  };

  const handleSetCompletion = (exerciseId, index, isCompleted) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId].map((set, i) =>
        i === index ? { ...set, isCompleted } : set
      )
    }));
  }; 

  const handleDayChange = (day) => {
    setSelectedDays(prevDays => ({
      ...prevDays,
      [day]: !prevDays[day]
    }));
  };

  const onSWBclick = async () => {
    console.log("onSWBclick");
    const allSets = Object.values(sets).flat();
    const completedSets = allSets.filter(set => set.isCompleted);
    if (completedSets.length === 0) {
      console.log("no sets");
      return [];
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const workoutData = {
      name: `Workout ${currentDate}`,
      date: currentDate
    };
    console.log("workoutData: ", workoutData);

    try {
      const response = await ExerciseDataService.createWorkout(workoutData);
      console.log("Created workout:", response);
      const workoutId = response.id;
      console.log("Workout ID:", workoutId);

      const updatedSets = completedSets.map(set => ({
        ...set,
        workoutId: workoutId
      }));

      console.log("Updated sets with workoutId:", updatedSets);
      return updatedSets;
    } catch (error) {
      console.error('Error creating workout:', error);
      return [];
    }
  };

  const handleGenerateWorkout = () => {
    // Add logic for generating 
    // TODO 
    // get number of weekday checkboxes checked
    // call DataService method for generating workouts
    // use addToWorkout from App.js

    console.log("Generating workout...");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Current Workout
        </Typography>
        
        <FormGroup row>
          {Object.keys(selectedDays).map((day) => (
            <FormControlLabel
              key={day}
              control={<Checkbox checked={selectedDays[day]} onChange={() => handleDayChange(day)} />}
              label={day}
            />
          ))}
        </FormGroup>

        {currentWorkout.length > 0 ? (
          <SaveWorkoutButton 
            onClick={onSWBclick} 
            currentWorkout={Object.entries(sets).flatMap(([exerciseId, setList]) => 
              setList.map(set => ({ ...set, exerciseId: parseInt(exerciseId) }))
            )} //TODO currentWorkout is not passing exerciseID here
            removeFromWorkout={removeFromWorkout} 
            deleteWorkout={deleteWorkout}
          />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateWorkout}
          >
            Generate Workout
          </Button>
        )}
        {currentWorkout.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No exercises added to the workout yet.
          </Typography>
        ) : (
          <List>
            {currentWorkout.map((exercise) => (
              <ListItem key={exercise.id} divider>
                <ListItemText
                  primary={exercise.name}
                  secondary={`Main Muscle: ${exercise.main_muscle}`}
                />
                <Box>
                  <Button onClick={() => handleAddSet(exercise.id)} variant="contained" color="primary">
                    Add Set
                  </Button>
                  <List>
                  {(sets[exercise.id] || []).map((set, setIndex) => (
                      <ListItem 
                        key={`${exercise.id}-${setIndex}`}
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
                          onChange={(e) => handleSetChange(exercise.id, setIndex, 'weight', e.target.value)}
                          sx={{ mr: 2 }}
                        />
                        <TextField
                          label="Reps"
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleSetChange(exercise.id, setIndex, 'reps', e.target.value)}
                          sx={{ mr: 2 }}
                        />
                        <Checkbox
                          checked={set.isCompleted}
                          onChange={(e) => handleSetCompletion(exercise.id, setIndex, e.target.checked)}
                          sx={{
                            '&.Mui-checked': {
              color: 'green',
            },
          }}
        />
        <IconButton onClick={() => handleRemoveSet(exercise.id, setIndex)} aria-label="delete">
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