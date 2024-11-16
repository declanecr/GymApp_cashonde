import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddToWorkoutButton from '../components/AddToWorkoutButton';
import ViewSetsButton from '../components/ViewSetsButton';
import ExerciseDataService from '../services/ExerciseDataService';

import CurrentExerciseCard from '../components/CurrentExerciseCard';
const IndividualExercisePage = ({addToWorkout}) => {
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await ExerciseDataService.get(id);
        console.log(response.data);
        setExercise(response.data[0]);
        //setExercise(exercise[0]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch exercise data');
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);
  
  

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!exercise) {
    return <Typography>No exercise found</Typography>;
  }

  return (
    <Box 
      sx={{ 
        width: 'fit-content',
        margin: 'auto',
        mt: { 
          xs: 2,
          sm: 4
        }
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CardContent
          sx={{
            padding: {
              xs: 2,
              sm: 3
            },
            '&:last-child': {
              paddingBottom: {
                xs: 2,
                sm: 3
              }
            }
          }}
        >
          <CurrentExerciseCard 
            exercise={exercise}
          />
          
          <Box 
            sx={{ 
              mt: 2,
              display: 'flex',
              gap: { 
                xs: 1,
                sm: 2
              },
              flexDirection: {
                xs: 'column',
                sm: 'row'
              },
              alignItems: 'stretch'
            }}
          >
            <ViewSetsButton 
              exercise={exercise}
              sx={{
                flexGrow: 1,
                minHeight: 48
              }}
            />
            <AddToWorkoutButton 
              exercise={exercise}
              onAddToWorkout={addToWorkout}
              sx={{
                flexGrow: 1,
                minHeight: 48
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

IndividualExercisePage.propTypes={
    addToWorkout: PropTypes.func.isRequired
}

export default IndividualExercisePage;