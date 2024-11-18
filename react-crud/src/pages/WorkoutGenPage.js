/**
 * CurrentWorkout Component
 * 
 * This component manages and displays the current workout session.
 * It allows users to view their selected exercises, remove them if needed, add sets,
 * and generate workouts based on selected days.
 */
import { Box, Button, Card, CardActions, CardContent, Checkbox, Container, FormControlLabel, FormGroup, List, ListItem, ListItemText, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import CurrentExerciseCard from '../components/CurrentExerciseCard';
import CurrentWorkoutDisplay from '../components/CurrentWorkoutDisplay';
import WorkoutDataService from '../services/WorkoutDataService';

const WorkoutGenPage = ({ currentWorkout, removeFromWorkout, deleteWorkout, addToWorkout }) => {
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





  const STORAGE_KEYS = {
    GENERATED_WORKOUTS: 'generatedWorkouts',
    CURRENT_WORKOUT: 'currentWorkout',
    CURRENT_SETS: 'currentSets',
    SELECTED_DAYS: 'selectedDays'
  };
  
  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
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
  
    
  }, []);
  
  
  const handleDayChange = (day) => {
    const newSelectedDays = {
      ...selectedDays,
      [day]: !selectedDays[day]
    };
    setSelectedDays(newSelectedDays);
    saveToLocalStorage(STORAGE_KEYS.SELECTED_DAYS, newSelectedDays);
  };
  
  
  const setAsWorkout = (workout) => {
    if (!workout) return;
    console.log('WGP workout: ', workout);
    deleteWorkout();
    workout.forEach(exercise => addToWorkout(exercise));
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
  

  <Grid item xs={12} md={8}>
  <CurrentWorkoutDisplay
    currentWorkout={currentWorkout}
    deleteWorkout={deleteWorkout}
    removeFromWorkout={removeFromWorkout}
    setSelectedExercise={setSelectedExercise}
    addToWorkout={addToWorkout}
  />
</Grid>
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