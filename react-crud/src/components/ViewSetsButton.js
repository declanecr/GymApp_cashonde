import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ViewSetsButton = ({ exercise }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (exercise && exercise.id) {
      navigate(`/exercises/${exercise.id}/sets`);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!exercise}
      variant="contained"
      color="secondary"
      sx={{
        padding: '10px 20px 10px',
        borderRadius: '10px',
        textTransform: 'none',
        backgroundColor: '#9c27b0',
        '&:hover': {
          backgroundColor: '#7b1fa2',
        },
        '&:disabled': {
          backgroundColor: '#e1bee7',
        }
      }}
    >
      View Sets
    </Button>
  );
};

ViewSetsButton.propTypes = {
  exercise: PropTypes.object
};

export default ViewSetsButton;