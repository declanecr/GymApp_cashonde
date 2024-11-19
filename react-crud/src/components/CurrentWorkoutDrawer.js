import { Global } from '@emotion/react';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
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
    addToWorkout }) => {
  const [open, setOpen] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const  [selectedExercise, setSelectedExercise]=useState(null);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const getCurrentWorkout = () => {
      const STORAGE_KEYS = {
          CURRENT_WORKOUT: 'currentWorkout'
      };
      console.log('Getting workout from storage');
      try {
          const savedWorkout = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT);
          if (!savedWorkout) return null;
  
          const parsedWorkout = JSON.parse(savedWorkout);
          console.log('parsedWorkout: ', parsedWorkout); //TODO WORKOUT STATE AND CURRENT WORKOUT DON'T ALIGN
          return {
              workout: parsedWorkout.workout || [],
              sets: parsedWorkout.sets || {},
              startTime: parsedWorkout.startTime ? new Date(parsedWorkout.startTime) : null,
              isStarted: parsedWorkout.isStarted || false
          };
      } catch (error) {
          console.error('Error getting workout from storage:', error);
          return null;
      }
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
          <Typography sx={{ p: 2, color: 'text.secondary' }}>51 results</Typography>
        </StyledBox>
        <StyledBox sx={{ px: 2, pb: 2, height: '100%', overflow: 'auto' }}>
            {// TODO add currentWorkoutDisplay 
            <CurrentWorkoutDisplay 
              currentWorkout={getCurrentWorkout()}
              deleteWorkout={deleteWorkout}
              removeFromWorkout={removeFromWorkout}
              addToWorkout={addToWorkout}
              setSelectedExercise={setSelectedExercise}
            />}
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

CurrentWorkoutDrawer.propTypes = {
  
  deleteWorkout: PropTypes.func.isRequired,
  removeFromWorkout: PropTypes.func.isRequired,
  addToWorkout: PropTypes.func.isRequired,
};


export default CurrentWorkoutDrawer;
