/**
 * WorkoutGenerator Component
 * 
 * This component handles the generation of workouts based on selected days.
 */
import { Button, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import WorkoutDataService from '../services/WorkoutDataService';

const WorkoutGenerator = ({ onGenerateWorkout }) => {
  const [selectedDays, setSelectedDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  });

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
      onGenerateWorkout(generatedWorkout, selectedDays);
    } catch (error) {
      console.error('Error generating workout:', error);
    }
  };

  

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Select Days for Workout
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
    </>
  );
};

WorkoutGenerator.propTypes = {
  onGenerateWorkout: PropTypes.func.isRequired
};

export default WorkoutGenerator;