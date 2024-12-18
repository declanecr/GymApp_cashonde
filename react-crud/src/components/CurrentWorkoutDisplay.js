/*
in WorkoutGenPage:
<CurrentWorkoutDisplay
    currentWorkout={currentWorkout}
    deleteWorkout={deleteWorkout}
    removeFromWorkout={removeFromWorkout}
    setSelectedExercise={setSelectedExercise}
    addToWorkout={addToWorkout}
  />

  in CurrentWorkoutDrawer:
      <CurrentWorkoutDisplay 
        currentWorkout={getCurrentWorkout()}
        deleteWorkout={handleDeleteWorkout}
        removeFromWorkout={handleRemoveExercise}
        addToWorkout={addToWorkout}
        setSelectedExercise={setSelectedExercise}
      />}
*/

// src/components/CurrentWorkoutSection.js
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  STORAGE_KEYS,
  clearWorkoutState,
  getFromLocalStorage,
  updateWorkoutState
} from '../services/localStorageService';
import RemoveExerciseButton from './RemoveExerciseButton';
import SaveWorkoutButton from './SaveWorkoutButton';

const CurrentWorkoutDisplay = ({
    deleteWorkout,
    removeFromWorkout,
    setSelectedExercise, //TODO create modal that pops up for exercises instead of separate page for them
    //addToWorkout
  }) => {
    const [isWorkoutStarted, setIsWorkoutStarted]=useState(false);
    const [sets, setSets] = useState({});
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [currentWorkout, setCurrentWorkout] = useState([]);
    //const currentWorkout = getFromLocalStorage(STORAGE_KEYS.WORKOUT_STATE)?.workout || [];


     // Load workout state from localStorage on component mount
    useEffect(() => {
      const workoutState = getFromLocalStorage(STORAGE_KEYS.WORKOUT_STATE);
      if (workoutState) {
        setSets(workoutState.sets || {});
        setStartTime(workoutState.startTime ? new Date(workoutState.startTime) : null);
        setIsWorkoutStarted(workoutState.isStarted || false);
      }
    }, []);
    
    // Timer effect
    useEffect(() => {
      let intervalId;
      if (isWorkoutStarted && startTime) {
        intervalId = setInterval(() => {
          const currentTime = Date.now();
          setElapsedTime(currentTime - startTime.getTime());
        }, 1000);
      }
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [isWorkoutStarted, startTime]);

    //listens for workout changes and updates to the component
    useEffect(() => {
      console.log('heard workoutStateChanged');
      const handleWorkoutChange = () => {
        const savedState = getFromLocalStorage(STORAGE_KEYS.WORKOUT_STATE);
        if (savedState) {
          // Update all relevant states
          setSets(savedState.sets || {});
          setStartTime(savedState.startTime ? new Date(savedState.startTime) : null);
          setIsWorkoutStarted(savedState.isStarted || false);
          if (savedState.workout) {
            setCurrentWorkout(savedState.workout);
          }
        }
      };
    
      const unsubscribe = subscribeToWorkoutChanges(handleWorkoutChange);
      
      // Initial load of saved state
      handleWorkoutChange();
      
      return () => unsubscribe();
    }, []);
    

    const subscribeToWorkoutChanges = (callback) => {
      window.addEventListener('workoutStateChanged', callback);
      return () => window.removeEventListener('workoutStateChanged', callback);
    };

    // eslint-disable-next-line        
    const handleExternalWorkoutUpdate = (updatedWorkout) => {
      if (updatedWorkout) {
        setCurrentWorkout(updatedWorkout);
        // Reset sets for new exercises if needed
        setSets(prevSets => {
          const newSets = { ...prevSets };
          updatedWorkout.forEach(exercise => {
            if (!newSets[exercise.id]) {
              newSets[exercise.id] = [];
            }
          });
          return newSets;
        });
        updateWorkoutState(updatedWorkout, sets, startTime, isWorkoutStarted);
        window.dispatchEvent(new Event('workoutStateChanged'));
      }
    };
    
    

    
    
  
    const handleWorkoutComplete = () => {
      setIsWorkoutStarted(false);
      setStartTime(null);
      setSets({});
      setElapsedTime(0);
    };

    // Function to format elapsed time
    const formatElapsedTime = (totalMilliseconds) => {
      const totalSeconds = Math.floor(totalMilliseconds / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      
      return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    };

    const handleExerciseSelection = (exercise) => {
      setSelectedExercise({
        ...exercise,
        rating: Number(exercise.rating)
      });
    };

    const handleAddSet = (exerciseId) => {
      setSets(prevSets => {
        const newSets = {
          ...prevSets,
          [exerciseId]: [...(prevSets[exerciseId] || []), { weight: '', reps: '', isCompleted: false }]
        };
        updateWorkoutState(currentWorkout, newSets, startTime, isWorkoutStarted);
        window.dispatchEvent(new Event('workoutStateChanged'));
        return newSets;
      });
    };
    
    const handleRemoveSet = (exerciseId, index) => {
      setSets(prevSets => {
        const newSets = {
          ...prevSets,
          [exerciseId]: prevSets[exerciseId].filter((_, i) => i !== index)
        };
        updateWorkoutState(currentWorkout, newSets, startTime, isWorkoutStarted);
        window.dispatchEvent(new Event('workoutStateChanged'));
        return newSets;
      });
    };
    
    const handleSetChange = (exerciseId, index, field, value) => {
      setSets(prevSets => {
        const newSets = {
          ...prevSets,
          [exerciseId]: prevSets[exerciseId].map((set, i) =>
            i === index ? { ...set, [field]: value } : set
          )
        };
        updateWorkoutState(currentWorkout, newSets, startTime, isWorkoutStarted);
        window.dispatchEvent(new Event('workoutStateChanged'));
        return newSets;
      });
    };
    
    const handleSetCompletion = (exerciseId, index, isCompleted) => {
      setSets(prevSets => {
        const newSets = {
          ...prevSets,
          [exerciseId]: prevSets[exerciseId].map((set, i) =>
            i === index ? { ...set, isCompleted } : set
          )
        };
        updateWorkoutState(currentWorkout, newSets, startTime, isWorkoutStarted);
        window.dispatchEvent(new Event('workoutStateChanged'));
        return newSets;
      });
    };
    
    const handleWorkoutCancel = () => {
      // Clear the local storage
      clearWorkoutState();
      deleteWorkout();
      
      // Reset all relevant state
      setSets({});
      setStartTime(null);
      setIsWorkoutStarted(false);
      setElapsedTime(0);
      setSelectedExercise(null);
      
      // Notify other components
      window.dispatchEvent(new Event('workoutStateChanged'));
    };
    
    const handleStartWorkout = () => {
      const newStartTime = new Date();
      setStartTime(newStartTime);
      setIsWorkoutStarted(true);
      updateWorkoutState(currentWorkout, sets, newStartTime, true);
      window.dispatchEvent(new Event('workoutStateChanged'));
    };
    
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Current Workout
      </Typography>


        {currentWorkout && currentWorkout.length > 0 ? (
          <Grid2 container spacing={2}>
            <Grid2 item xs={12}>
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
                  clearLocalStorage={clearWorkoutState}
                  onSaveComplete={handleWorkoutComplete}
                  startTime={startTime}
                  endTime={new Date()}
                />
                
              )}
            </Grid2>
            {isWorkoutStarted && (
              <Grid2 item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Start Time: {startTime.toLocaleTimeString()}</Typography>
                  <Typography>Duration: {formatElapsedTime(elapsedTime)}</Typography>
                  <Button
                  variant="contained"
                  color="error"
                  onClick={handleWorkoutCancel}
                  sx={{ mb: 2 }}
                >
                  Cancel Workout
                </Button>
                </Box>
                
              </Grid2>
            )}

            <Grid2 item xs={12}>
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
                                  <RemoveExerciseButton exercise={exercise} removeFromWorkout={removeFromWorkout}  />
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
            </Grid2>
          </Grid2>
        ) : (
          <Typography variant="body1">No exercises added to your workout yet.</Typography>
        )}
    </Card>
  );
};

CurrentWorkoutDisplay.propTypes = {
  currentWorkout: PropTypes.array.isRequired,
    deleteWorkout: PropTypes.func.isRequired,
    removeFromWorkout: PropTypes.func.isRequired,
    //addToWorkout: PropTypes.func.isRequired,
    setSelectedExercise: PropTypes.func.isRequired
};

export default CurrentWorkoutDisplay;
