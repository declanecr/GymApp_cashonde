/**
 * CurrentWorkout Component
 * 
 * This component manages and displays the current workout session.
 * It allows users to view their selected exercises, remove them if needed, add sets,
 * and generate workouts based on selected days.
 */
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Card, CardActions, CardContent, Checkbox, Container, FormControlLabel, FormGroup, IconButton, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CurrentExerciseCard from '../components/CurrentExerciseCard';
import RemoveExerciseButton from '../components/RemoveExerciseButton';
import SaveWorkoutButton from '../components/SaveWorkoutButton';
import WorkoutDataService from '../services/WorkoutDataService';

const CurrentWorkout = ({ currentWorkout, removeFromWorkout, deleteWorkout, addToWorkout }) => {
  const [sets, setSets] = useState({});
  const [generatedWorkout, setGeneratedWorkout] = useState([]);
  const [selectedDays, setSelectedDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  });
  const [selectedExercise, setSelectedExercise]=useState(null);
  
  const handleExerciseSelection = (exercise) => {
    const updatedExercise = {
      ...exercise,
      rating: Number(exercise.rating)
    };
    setSelectedExercise(updatedExercise);
  };

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
      const response = await WorkoutDataService.createWorkout(workoutData);
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

  const handleDayChange = (day) => {
    setSelectedDays(prevDays => ({
      ...prevDays,
      [day]: !prevDays[day]
    }));
  };

  const handleGenerateWorkout = async () => {
    const selectedDayCount = Object.values(selectedDays).filter(Boolean).length;
    
    if (selectedDayCount === 0) {
      console.log("No days selected");
      return;
    }
  
    try {
      const generatedWorkout = await WorkoutDataService.generateWorkout(selectedDayCount);
      console.log('generatedWorkout: ', generatedWorkout);
      if (currentWorkout.length > 0 || generatedWorkout.length > 0) {
        deleteWorkout();
        setSets({});
      }
      setGeneratedWorkout(generatedWorkout);
    } catch (error) {
      console.error('Error generating workout:', error);
    }
  };

  const setAsWorkout = (workout) => {
    deleteWorkout();
    setSets({});
    workout.forEach(exercise => addToWorkout(exercise));
  };

  return (
    <Container maxWidth={false} >
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
          <Grid container spacing={3} item xs={12} sx ={{minHeight: '100vh'}}>
              <Grid item xs={12} md={8} sx={{maxWidth: 1100, alignItems: 'left'}}>
                <Card>
                <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                  Choose which days to generate workouts for
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateWorkout}
                  disabled={Object.values(selectedDays).filter(Boolean).length === 0}
                >
                  Generate Workout
                </Button>

                <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                  Generated Workout
                </Typography>
                <Grid container spacing={2}>
                  {generatedWorkout.map((dayWorkout, dayIndex) => (
                    <Grid item xs={12} sm={6} md={6} key={dayIndex}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {Object.keys(selectedDays).filter(day => selectedDays[day])[dayIndex]}
                          </Typography>
                          <List>
                            {dayWorkout.map((exercise) => (
                              <ListItem key={exercise.id}>
                                <ListItemText
                                  primary={exercise.name}
                                  secondary={`Main Muscle: ${exercise.main_muscle}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                        <CardActions>
                          <Button 
                            onClick={() => setAsWorkout(dayWorkout)} 
                            variant="contained" 
                            color="primary"
                            fullWidth
                          >
                            Set as Workout
                          </Button>
                        </CardActions>  
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card>
                  <Typography variant="h4" gutterBottom>
                    Current Workout
                  </Typography>
                  
                  <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                    Your Workout
                  </Typography>
                  {currentWorkout.length > 0 ? (
                    <SaveWorkoutButton 
                      onClick={onSWBclick} 
                      currentWorkout={Object.entries(sets).flatMap(([exerciseId, setList]) => 
                        setList.map(set => ({ ...set, exerciseId: parseInt(exerciseId) }))
                      )}
                      removeFromWorkout={removeFromWorkout} 
                      deleteWorkout={deleteWorkout}
                    />
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No exercises added to the workout yet.
                    </Typography>
                  )}
                  {currentWorkout.length > 0 && (
                    <List>
                      {currentWorkout.map((exercise) => (
                        <ListItem key={exercise.id} divider onClick ={() => handleExerciseSelection(exercise)}>
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
                  </Card>
              </Grid>
                
              <Grid item xs={12} md={4}>
                <CurrentExerciseCard exercise={selectedExercise} />
              </Grid>
          </Grid>
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
  deleteWorkout: PropTypes.func.isRequired,
  addToWorkout: PropTypes.func.isRequired
};

export default CurrentWorkout;