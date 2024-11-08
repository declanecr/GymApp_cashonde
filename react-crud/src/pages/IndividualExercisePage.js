import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddToWorkoutButton from '../components/AddToWorkoutButton';
import ViewSetsButton from '../components/ViewSetsButton';
import ExerciseDataService from '../services/ExerciseDataService';

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
          <Typography variant="h4" gutterBottom>{exercise.name}</Typography>
          <Typography variant="body1" paragraph><strong>Description:</strong> {exercise.description}</Typography>
          <Typography variant="body1" paragraph><strong>Type:</strong> {exercise.type}</Typography>
          <Typography variant="body1" paragraph><strong>Main Muscle:</strong> {exercise.main_muscle}</Typography>
          <Typography variant="body1" paragraph><strong>Equipment:</strong> {exercise.equipment}</Typography>
          <Typography variant="body1" paragraph><strong>Level:</strong> {exercise.level}</Typography>
          <Typography variant="body1" paragraph><strong>Rating:</strong> {exercise.rating}/10</Typography>
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