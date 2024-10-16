/** AddSetButton.js
will appear before the remove button on CurrentWorkout.js
onClick -> will add new line below which contains
-1 RemoveSetButton
-2 textboxes
	1 for weight
	1 for reps
-1 CompleteSetCheckbox taken from 'CompleteSetCheckbox.js'
	when checked, background of this new line turns green.
	this indicates a "completed set" which would be saved

Then when 'SaveWorkoutButton' is clicked, it only saves "completed" sets

*/

import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import ExerciseDataService from '../services/ExerciseDataService';
import CompleteSetCheckbox from './CompleteSetCheckbox';
import RemoveSetButton from './RemoveSetButton';

const AddSetButton = ({ exerciseId }) => {
  const [showSetInputs, setShowSetInputs] = useState(false);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
	const [isCompleted, setIsCompleted] = useState(false);

  const handleAddSet = () => {
    setShowSetInputs(true);
  };

  const handleSubmitSet = async () => {
    if (weight && reps) {
      try {
        await ExerciseDataService.createSet(exerciseId, {
          weight: parseFloat(weight),
          reps: parseInt(reps),
          completed: isCompleted,
          date: new Date().toISOString()
        });
        setWeight('');
        setReps('');
        setShowSetInputs(false);
      } catch (error) {
        console.error('Error creating set:', error);
      }
    }
  };

  return (
    <Box>
      <Button onClick={handleAddSet} variant="contained" color="primary">
        Add Set
      </Button>
      {showSetInputs && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <TextField
            label="Weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button onClick={handleSubmitSet} variant="contained" color="secondary">
            Submit Set
          </Button>
          <RemoveSetButton onRemove={() => setShowSetInputs(false)} />
          <CompleteSetCheckbox 
					  isCompleted={isCompleted}
					  onComplete={setIsCompleted}
					/>
        </Box>
      )}
    </Box>
  );
};

export default AddSetButton;