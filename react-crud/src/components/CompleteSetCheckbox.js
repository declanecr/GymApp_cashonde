/**CompleteSetCheckbox.js
appears in the new line after AddSetButton is clicked
when clicked, mark line background as green
*/

import { Checkbox, FormControlLabel } from '@mui/material';
import React, { useState } from 'react';

const CompleteSetCheckbox = ({ onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleChange = (event) => {
    setIsCompleted(event.target.checked);
    if (onComplete) {
      onComplete(event.target.checked);
    }
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={isCompleted}
          onChange={handleChange}
          sx={{
            '&.Mui-checked': {
              color: 'green',
            },
          }}
        />
      }
      label="Completed"
      sx={{
        backgroundColor: isCompleted ? '#e8f5e9' : 'transparent',
        padding: '5px',
        borderRadius: '4px',
      }}
    />
  );
};

export default CompleteSetCheckbox;