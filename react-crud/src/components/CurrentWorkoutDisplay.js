// src/components/CurrentWorkoutSection.js
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import RemoveExerciseButton from './RemoveExerciseButton';
import SaveWorkoutButton from './SaveWorkoutButton';


const CurrentWorkoutDisplay = ({
    currentWorkout,
    deleteWorkout,
    removeFromWorkout,
    setSelectedExercise,
    addToWorkout
    }) => {
    const [isWorkoutStarted, setIsWorkoutStarted]=useState(false);
    const [sets, setSets] = useState({});
    // TODO fix add set
    
    
    // Add these new state variables
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timer, setTimer] = useState(null);
    
    useEffect(()=>{
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
    })

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
      const setAsWorkout = (workout) => {
        if (!workout) return;
        deleteWorkout();
        setSets({});
        workout.forEach(exercise => addToWorkout(exercise));
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
    

  return (
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
      ) : (
        <Typography variant="body1">No exercises added to your workout yet.</Typography>
      )}
    </Card>
  );
};

CurrentWorkoutDisplay.propTypes = {
    currentWorkout: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            images_url: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.arrayOf(PropTypes.string)
            ]),
            // Add other specific properties your exercise objects have
        })
    ).isRequired,
    deleteWorkout: PropTypes.func.isRequired,
    removeFromWorkout: PropTypes.func.isRequired,
    addToWorkout: PropTypes.func.isRequired,
    setSelectedExercise: PropTypes.func.isRequired
};

export default CurrentWorkoutDisplay;
