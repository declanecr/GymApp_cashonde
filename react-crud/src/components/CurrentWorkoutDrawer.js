import { Global } from '@emotion/react';
import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import {
  STORAGE_KEYS,
  getFromLocalStorage,
  updateWorkoutState
} from '../services/localStorageService';
import CurrentWorkoutDisplay from './CurrentWorkoutDisplay';

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.background.default,
  }),
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[800],
  }),
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[900],
  }),
}));

// These props are used in the commented out CurrentWorkoutDisplay component
const CurrentWorkoutDrawer = (  {  
    deleteWorkout, 
    removeFromWorkout,
    
    //addToWorkout 
  }) => {
  const [open, setOpen] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const  [selectedExercise, setSelectedExercise]=useState(null);
  const [workoutState, setWorkoutState] =useState(null);

  useEffect(() => {
    // Load workout state from localStorage
    const savedState = getFromLocalStorage(STORAGE_KEYS.WORKOUT_STATE);
    console.log("savedState", savedState);
    if (savedState) {
      setWorkoutState(savedState);
    }
  },[]); 

  useEffect(() => {
    const handleWorkoutChange = () => {
      const savedState = getFromLocalStorage(STORAGE_KEYS.WORKOUT_STATE);
      if (savedState) {
        updateDrawerContent(savedState);
      }
    };
  
    const unsubscribe = subscribeToWorkoutChanges(handleWorkoutChange);
    return () => unsubscribe();
  }, []);
  


  const subscribeToWorkoutChanges = (callback) => {
    window.addEventListener('workoutStateChanged', callback);
    return () => window.removeEventListener('workoutStateChanged', callback);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };


  const updateDrawerContent = (newWorkoutState) => {
    setWorkoutState(newWorkoutState);
    // If you want the drawer to open automatically when workout changes
    setOpen(true);
  };
  



  const handleWorkoutUpdate = (updatedWorkout, updatedSets) => {
    const currentState = getFromLocalStorage(STORAGE_KEYS.WORKOUT_STATE) || {};
    const newState = {
      workout: updatedWorkout,
      sets: updatedSets,
      startTime: currentState.startTime || new Date(),
      isStarted: true
    };
    
    updateWorkoutState(
      newState.workout,
      newState.sets,
      newState.startTime,
      newState.isStarted
    );
    updateDrawerContent(newState);
  };

  const handleDeleteWorkout = () => {
    deleteWorkout();
    setWorkoutState(null);
    setOpen(false);
  };

  const handleRemoveExercise = (exercise) => {
    removeFromWorkout(exercise);
    if (workoutState) {
      const updatedSets = { ...workoutState.sets };
      delete updatedSets[exercise.id];
      
      const updatedWorkout = workoutState.workout.filter(ex => ex.id !== exercise.id);
      handleWorkoutUpdate(updatedWorkout, updatedSets);
    }
  };

  const getCurrentWorkout = () => {
    return workoutState?.workout || [];
  };

  
  




  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      <Box sx={{ textAlign: 'center', pt: 1 }}>
        <Button onClick={toggleDrawer(true)}>Open</Button>
      </Box>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
            <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary' }}>
            {workoutState?.workout?.length || 0} Exercises
          </Typography>
        </StyledBox>
        <StyledBox sx={{ px: 2, pb: 2, height: '100%', overflow: 'auto' }}>
            <CurrentWorkoutDisplay 
              currentWorkout={getCurrentWorkout()}
              deleteWorkout={handleDeleteWorkout}
              removeFromWorkout={handleRemoveExercise}
              //addToWorkout={addToWorkout}
              setSelectedExercise={setSelectedExercise}
            />
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

CurrentWorkoutDrawer.propTypes = {
  currentWorkout: PropTypes.array.isRequired,
  deleteWorkout: PropTypes.func.isRequired,
  removeFromWorkout: PropTypes.func.isRequired,
  //addToWorkout: PropTypes.func.isRequired,
};

CurrentWorkoutDrawer.defaultProps = {
  currentWorkout: []
};


export default CurrentWorkoutDrawer;
