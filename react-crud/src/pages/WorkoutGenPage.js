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
import React, { useEffect, useState } from 'react';
import CurrentExerciseCard from '../components/CurrentExerciseCard';
import RemoveExerciseButton from '../components/RemoveExerciseButton';
import SaveWorkoutButton from '../components/SaveWorkoutButton';
import WorkoutDataService from '../services/WorkoutDataService';

const WorkoutGenPage = ({ currentWorkout, removeFromWorkout, deleteWorkout, addToWorkout }) => {
  const [isWorkoutStarted, setIsWorkoutStarted]=useState(false);
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



  // Add these new state variables
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);

  const STORAGE_KEYS = {
    GENERATED_WORKOUTS: 'generatedWorkouts',
    CURRENT_WORKOUT: 'currentWorkout',
    CURRENT_SETS: 'currentSets',
    SELECTED_DAYS: 'selectedDays'
  };
  
  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  

  const clearFromLocalStorage = (key) => {
    localStorage.removeItem(key);
  };
  
  const clearCurrentWorkoutState = () => {
    clearFromLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT);
    clearFromLocalStorage(STORAGE_KEYS.CURRENT_SETS);
    
  };
  
  const handleWorkoutComplete = async () => {
    try {
      // Save workout logic here
      
      // Reset timer and workout state
      resetTimer();
      clearCurrentWorkoutState();
      setSets({});
      deleteWorkout();
      
      // Clear the workout state from localStorage
      const workoutState = {
        workout: [],
        sets: {},
        startTime: null,
        isStarted: false
      };
      saveToLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT, workoutState);
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };
  

  const resetTimer = () => {
    if (timer) {
      clearInterval(timer);
    }
    setTimer(null);
    setStartTime(null);
    setElapsedTime(0);
    setIsWorkoutStarted(false);
  };

  useEffect(() => {
    // Load generated workouts
    const savedGeneratedWorkouts = JSON.parse(localStorage.getItem(STORAGE_KEYS.GENERATED_WORKOUTS));
    if (savedGeneratedWorkouts) {
      setGeneratedWorkout(savedGeneratedWorkouts);
    }
  
    // Load selected days
    const savedSelectedDays = JSON.parse(localStorage.getItem(STORAGE_KEYS.SELECTED_DAYS));
    if (savedSelectedDays) {
      setSelectedDays(savedSelectedDays);
    }
  
    // Load current workout state
    const savedWorkoutState = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT));
    console.log('savedWorkoutState: ',savedWorkoutState);
    
    if (savedWorkoutState) {
      setAsWorkout(savedWorkoutState.workout);
      setSets(savedWorkoutState.sets);
      setIsWorkoutStarted(savedWorkoutState.isStarted);
      if (savedWorkoutState.startTime) {
        const startTime = new Date(savedWorkoutState.startTime);
        setStartTime(startTime);
        // Calculate elapsed time
        const now = new Date();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsedSeconds);
        
        // Restart timer if workout was in progress
        if (savedWorkoutState.isStarted) {
          const timerInterval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
          }, 1000);
          setTimer(timerInterval);
        }
      }
    }
  
    // Cleanup timer when component unmounts
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);
  
  
  const handleDayChange = (day) => {
    const newSelectedDays = {
      ...selectedDays,
      [day]: !selectedDays[day]
    };
    setSelectedDays(newSelectedDays);
    saveToLocalStorage(STORAGE_KEYS.SELECTED_DAYS, newSelectedDays);
  };
  
  
  const handleStartWorkout = () => {
    setIsWorkoutStarted(true);
    const now = new Date(); // Get current date and time
    setStartTime(now);
    
    // Save the current workout state
    const workoutState = {
      workout: currentWorkout,
      sets: sets,
      startTime: now,
      isStarted: true
    };
    
    saveToLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT, workoutState);
    
    // Start the timer
    const timerInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    setTimer(timerInterval);
  };

  // Function to format elapsed time
  const formatElapsedTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const handleExerciseSelection = (exercise) => {
    const updatedExercise = {
      ...exercise,
      rating: Number(exercise.rating)
    };
    setSelectedExercise(updatedExercise);
  };

  const handleRemoveSet = (exerciseId, index) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId].filter((_, i) => i !== index)
    }));
  };

  const handleAddSet = (exerciseId) => {
    const newSets = {
      ...sets,
      [exerciseId]: [...(sets[exerciseId] || []), { weight: '', reps: '', isCompleted: false }]
    };
    setSets(newSets);
    saveToLocalStorage(STORAGE_KEYS.CURRENT_SETS, newSets);
  };
  
  const handleSetChange = (exerciseId, setIndex, field, value) => {
    const newSets = { ...sets };
    newSets[exerciseId][setIndex][field] = value;
    setSets(newSets);
    
    // Update the workout state in localStorage
    const workoutState = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT));
    if (workoutState) {
      workoutState.sets = newSets;
      saveToLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT, workoutState);
    }
  };
  
  const setAsWorkout = (workout) => {
    if (!workout) return;
    deleteWorkout();
    setSets({});
    workout.forEach(exercise => addToWorkout(exercise));
  };
  

  const handleSetCompletion = (exerciseId, index, isCompleted) => {
    setSets(prevSets => {
      const newSets = {
        ...prevSets,
        [exerciseId]: prevSets[exerciseId].map((set, i) =>
          i === index ? { ...set, isCompleted } : set
        )
      };
      
      // Update the workout state in localStorage
      const workoutState = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT));
      if (workoutState) {
        workoutState.sets = newSets;
        saveToLocalStorage(STORAGE_KEYS.CURRENT_WORKOUT, workoutState);
      }
      
      return newSets;
    });
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
      // Save both generated workouts and selected days
      saveToLocalStorage(STORAGE_KEYS.GENERATED_WORKOUTS, generatedWorkout);
      saveToLocalStorage(STORAGE_KEYS.SELECTED_DAYS, selectedDays);
    } catch (error) {
      console.error('Error generating workout:', error);
    }
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
                          <List sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            
                          }}>
                            {dayWorkout.map((exercise) => (
                              <Box key={exercise.id}
                                sx={{
                                  maxHeight: '60px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                  mb: 1,
                                  cursor: 'pointer'
                                }}
                                onClick={() => setSelectedExercise(exercise)}>
                                <Box sx={{ width:'100px', height:'60px'}}>
                                  {(() => {
                                    try {
                                      const images = Array.isArray(exercise.images_url) 
                                        ? exercise.images_url 
                                        : JSON.parse(exercise.images_url || '[]');
                                      
                                      if (images.length > 0) {
                                        return (
                                          <img 
                                            src={images[0]}
                                            alt="Exercise"
                                            style={{ 
                                              maxWidth: '100%',
                                              maxHeight: '100%',                         
                                              height: 'auto', 
                                              borderRadius: '8px'
                                            }}
                                          />
                                        );
                                      }
                                      return null;
                                    } catch (error) {
                                      console.error('Error parsing images_url:', error);
                                      return null;
                                    }
                                  })()}     
                                </Box>                           
                                  <ListItem key={exercise.id}>
                                    <ListItemText
                                      primary={exercise.name}
                                      secondary={exercise.main_muscle}
                                    />
                                  </ListItem>
                              </Box>
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
                <Grid item xs={12} md ={8}>
                  <Card sx={{ p: 3 }}>
  <Typography variant="h4" gutterBottom>
    Current Workout
  </Typography>
  
  <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
    Your Workout
  </Typography>
  {currentWorkout.length > 0 ? (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {!isWorkoutStarted ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartWorkout}
            sx={{ mb: 2 }}
            fullWidth
          >
            Start Workout
          </Button>
        ) : (
          <SaveWorkoutButton 
            currentWorkout={Object.entries(sets).flatMap(([exerciseId, setList]) => 
              setList.map(set => ({ ...set, exerciseId: parseInt(exerciseId) }))
            )}
            deleteWorkout={deleteWorkout}
            clearLocalStorage={clearCurrentWorkoutState}
            onSaveComplete={handleWorkoutComplete}
            startTime={startTime}
            endTime={new Date()}
          />
        )}
      </Grid>

      {isWorkoutStarted && (
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Start Time: {startTime.toLocaleTimeString()}</Typography>
            <Typography>Duration: {formatElapsedTime(elapsedTime)}</Typography>
          </Box>
        </Grid>
      )}

      <Grid item xs={12}>
        <List sx={{ width: '100%' }}>
          {currentWorkout.map((exercise) => (
            <Box 
              key={exercise.id}
              sx={{
                mb: 2,
                cursor: 'pointer'
              }}
              onClick={() => setSelectedExercise(exercise)}
            >
              <Card elevation={2}>
                <Box sx={{ display: 'flex', p: 2 }}>
                  <Box sx={{ width: '100px', height: '60px', mr: 2 }}>
                    {(() => {
                      try {
                        const images = Array.isArray(exercise.images_url) 
                          ? exercise.images_url 
                          : JSON.parse(exercise.images_url || '[]');
                        
                        if (images.length > 0) {
                          return (
                            <img 
                              src={images[0]}
                              alt="Exercise"
                              style={{ 
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                          );
                        }
                        return null;
                      } catch (error) {
                        console.error('Error parsing images_url:', error);
                        return null;
                      }
                    })()}     
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <ListItem divider={false} onClick={() => handleExerciseSelection(exercise)}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <ListItemText
                            primary={exercise.name}
                            secondary={`Main Muscle: ${exercise.main_muscle}`}
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddSet(exercise.id);
                              }} 
                              variant="contained" 
                              color="primary"
                              size="small"
                            >
                              Add Set
                            </Button>
                            <RemoveExerciseButton exercise={exercise} removeFromWorkout={removeFromWorkout} />
                          </Box>
                        </Box>

                        <List>
                          {(sets[exercise.id] || []).map((set, setIndex) => (
                            <ListItem 
                              key={`${exercise.id}-${setIndex}`}
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                backgroundColor: set.isCompleted ? '#e8f5e9' : 'transparent',
                                borderRadius: '4px',
                                mb: 1,
                                p: 1
                              }}
                            > 
                              <TextField
                                label="Weight"
                                type="number"
                                size="small"
                                value={set.weight}
                                onChange={(e) => handleSetChange(exercise.id, setIndex, 'weight', e.target.value)}
                                sx={{ mr: 2, width: '100px' }}
                              />
                              <TextField
                                label="Reps"
                                type="number"
                                size="small"
                                value={set.reps}
                                onChange={(e) => handleSetChange(exercise.id, setIndex, 'reps', e.target.value)}
                                sx={{ mr: 2, width: '100px' }}
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
                              <IconButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveSet(exercise.id, setIndex);
                                }} 
                                aria-label="delete"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </ListItem>
                  </Box>
                </Box>
              </Card>
            </Box>
          ))}
        </List>
      </Grid>
    </Grid>
  ) : null}
</Card>                  </Grid>
              </Grid>
                
              <Grid item xs={12} md={4}>
                <CurrentExerciseCard exercise={selectedExercise} />
              </Grid>
          </Grid>
      </Box>
      
    </Container>
  );
};

WorkoutGenPage.propTypes = {
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

export default WorkoutGenPage;