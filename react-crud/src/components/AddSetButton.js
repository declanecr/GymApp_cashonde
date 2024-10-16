/** AddSetButton.js
will appear before the remove button on CurrentWorkout.js
onClick -> will add new set to the list of sets
*/

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, List, ListItem, TextField } from '@mui/material';
import React, { useState } from 'react';
import CompleteSetCheckbox from './CompleteSetCheckbox';

const AddSetButton = () => {
  const [sets, setSets] = useState([]);

  const handleAddSet = () => {
    setSets([...sets, { weight: '', reps: '', isCompleted: false }]);
  };

  const handleRemoveSet = (index) => {
    const newSets = [...sets];
    newSets.splice(index, 1);
    setSets(newSets);
  };

  const handleSetChange = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  return (
    <Box>
      <Button onClick={handleAddSet} variant="contained" color="primary">
        Add Set
      </Button>
      <List>
        {sets.map((set, index) => (
          <ListItem key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              label="Weight"
              type="number"
              value={set.weight}
              onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
              sx={{ mr: 2 }}
            />
            <TextField
              label="Reps"
              type="number"
              value={set.reps}
              onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
              sx={{ mr: 2 }}
            />
            <IconButton onClick={() => handleRemoveSet(index)} aria-label="delete">
              <DeleteIcon />
            </IconButton>
            <CompleteSetCheckbox 
              isCompleted={set.isCompleted}
              onComplete={(value) => handleSetChange(index, 'isCompleted', value)}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AddSetButton;