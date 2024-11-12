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
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <CurrentExerciseCard exercise={exercise} />
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <ViewSetsButton exercise={exercise} />
                <AddToWorkoutButton exercise={exercise}  onAddToWorkout={addToWorkout}/>
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