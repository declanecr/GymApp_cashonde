import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Checkbox, IconButton, List, ListItem, TextField } from '@mui/material';
import React, { useState } from 'react';

const AddSetButton = () => {
  const [sets, setSets] = useState([]);

  const handleAddSet = () => {
    setSets([...sets, { weight: '', reps: '', isCompleted: false }]);
  };

  const handleRemoveSet = (index) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const handleSetChange = (index, field, value) => {
    setSets(sets.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    ));
  };

  const handleSetCompletion = (index, isCompleted) => {
    setSets(sets.map((set, i) => 
      i === index ? { ...set, isCompleted } : set
    ));
  };

  return (
    <Box>
      <Button onClick={handleAddSet} variant="contained" color="primary">
        Add Set
      </Button>
      <List>
        {sets.map((set, index) => (
          <ListItem 
            key={index} 
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
            <Checkbox
              checked={set.isCompleted}
              onChange={(e) => handleSetCompletion(index, e.target.checked)}
              sx={{
                '&.Mui-checked': {
                  color: 'green',
                },
              }}
            />
            <IconButton onClick={() => handleRemoveSet(index)} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AddSetButton;