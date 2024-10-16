/** RemoveSetButton.js
appears in line that appears when 'AddSetButton' is clicked
when clicked, turns light red
when clicked AGAIN, line is deleted
*/
import { Button } from '@mui/material';
import React, { useState } from 'react';
import ExerciseDataService from '../services/ExerciseDataService';

const RemoveSetButton = ({ setId, exerciseId, removeSet }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async () => {
    if (isClicked) {
      try {
        await ExerciseDataService.deleteSet(exerciseId, setId);
        removeSet(setId);
      } catch (error) {
        console.error('Error deleting set:', error);
      }
    } else {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 3000); // Reset after 3 seconds
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="contained"
      sx={{
        backgroundColor: isClicked ? '#ffcccb' : '#f44336',
        '&:hover': {
          backgroundColor: isClicked ? '#ff9999' : '#d32f2f',
        },
      }}
    >
      {isClicked ? 'Click again to remove' : 'Remove Set'}
    </Button>
  );
};

export default RemoveSetButton;