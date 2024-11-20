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
import {
  STORAGE_KEYS,
  getFromLocalStorage,
  getGeneratedWorkouts,
  getSelectedDays,
  saveGeneratedWorkouts,
  saveSelectedDays
} from '../services/localStorageService';

const WorkoutGenPage = ({  
  removeFromWorkout, 
  deleteWorkout, 
  addToWorkout 
}) => {
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





  useEffect(() => {
    // Load generated workouts from localStorage
    const savedWorkouts = getGeneratedWorkouts();
    if (savedWorkouts) {
      setGeneratedWorkout(savedWorkouts);
    }

    // Load selected days from localStorage
    const savedDays = getSelectedDays();
    if (savedDays) {
      setSelectedDays(savedDays);
    }
  }, []);

  const handleDayChange = (day) => {
    const newSelectedDays = {
      ...selectedDays,
      [day]: !selectedDays[day]
    };
    setSelectedDays(newSelectedDays);
    saveSelectedDays(newSelectedDays);
  };
  
  
 
  
  
  const setAsWorkout = (workout) => {
    if (!workout) return;
    console.log('WGP workout: ', workout);
    deleteWorkout();
    workout.forEach(exercise => addToWorkout(exercise));
  };

  const handleGenerateWorkout = async () => {
    const selectedDayCount = Object.values(selectedDays).filter(Boolean).length;
    const currentWorkout = getFromLocalStorage(STORAGE_KEYS.WORKOUT_STATE)?.workout || [];
    
    if (selectedDayCount === 0) {
      console.log("No days selected");
      return;
    }

    try {
      const newGeneratedWorkout = await WorkoutDataService.generateWorkout(selectedDayCount);
      if (currentWorkout.length > 0 || newGeneratedWorkout.length > 0) {
        deleteWorkout();
      }
      setGeneratedWorkout(newGeneratedWorkout);
      saveGeneratedWorkouts(newGeneratedWorkout);
    } catch (error) {
      console.error('Error generating workout:', error);
    }
  };

   

  return (
    <Container maxWidth={false} >
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
          <Grid container spacing={3} item xs={12} sx ={{minHeight: '100vh'}}>
            {/* GENERATED WORKOUT SECTION */}
              <Grid item xs={12} md={8} sx={{
                '@media (min-width: 900px)': {
                  width: '45%',
                  flexBasis: '45%',
                  maxWidth: '45%'
                }}}>
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
                  {/* INDIVIDUAL WORKOUTS DISPLAY 
                  // TODO - each workout should an even width of its container
                  */} 
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

              {/* CURRENT WORKOUT SECTION */}
              <Grid item xs={12} md={8} sx={{
                '@media (min-width: 900px)': {
                  width: '45%',
                  flexBasis: '45%',
                  maxWidth: '45%'
                }
              }}>
                <Grid item xs={12} md ={8}>

                      <CurrentWorkoutDisplay
                        deleteWorkout={deleteWorkout}
                        removeFromWorkout={removeFromWorkout}
                        setSelectedExercise={setSelectedExercise}
                        //addToWorkout={addToWorkout}
                      />
                </Grid>
              </Grid>
                
              <Grid item xs={12} md={4} sx={{ 
                '@media (min-width: 900px)': {
                  width: '25%',
                  flexBasis: '25%',
                  maxWidth: '25%'
                }
              }}>
                <CurrentExerciseCard exercise={selectedExercise} 
                onClose={() => setSelectedExercise(null)}
                addToWorkout={addToWorkout}
                />
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