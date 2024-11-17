// src/components/CurrentWorkoutDisplay.js
import {
    Box,
    Button,
    Card,
    Grid,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveExerciseButton from './RemoveExerciseButton';
import SaveWorkoutButton from './SaveWorkoutButton';

const CurrentWorkoutDisplay = ({
  currentWorkout,
  isWorkoutStarted,
  handleStartWorkout,
  sets,
  deleteWorkout,
  clearCurrentWorkoutState,
  handleWorkoutComplete,
  startTime,
  elapsedTime,
  handleExerciseSelection,
  handleAddSet,
  removeFromWorkout,
  setSelectedExercise,
  formatElapsedTime
}) => {

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
      const handleRemoveSet = (exerciseId, index) => {
        setSets(prevSets => ({
          ...prevSets,
          [exerciseId]: prevSets[exerciseId].filter((_, i) => i !== index)
        }));
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
                                  />
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
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        main_muscle: PropTypes.string.isRequired,
        images_url: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string)
        ])
      })
    ).isRequired,
    isWorkoutStarted: PropTypes.bool.isRequired,
    handleStartWorkout: PropTypes.func.isRequired,
    sets: PropTypes.objectOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          isCompleted: PropTypes.bool,
          weight: PropTypes.number,
          reps: PropTypes.number
        })
      )
    ).isRequired,
    deleteWorkout: PropTypes.func.isRequired,
    clearCurrentWorkoutState: PropTypes.func.isRequired,
    handleWorkoutComplete: PropTypes.func.isRequired,
    startTime: PropTypes.instanceOf(Date).isRequired,
    elapsedTime: PropTypes.number.isRequired,
    handleExerciseSelection: PropTypes.func.isRequired,
    handleAddSet: PropTypes.func.isRequired,
    removeFromWorkout: PropTypes.func.isRequired,
    setSelectedExercise: PropTypes.func.isRequired,
    formatElapsedTime: PropTypes.func.isRequired
  };
  
  export default CurrentWorkoutDisplay;
