import { Box, Container, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import AddToWorkoutButton from '../components/AddToWorkoutButton';
import CurrentExerciseCard from '../components/CurrentExerciseCard';
import ExerciseGrid from '../components/ExerciseGrid';
import ViewSetsButton from '../components/ViewSetsButton';

const ExercisePage = ({ addToWorkout }) => {
    const [currentExercise, setCurrentExercise] = useState(null);

    const handleRowClick = (params) => {
        const updatedRow = {
            ...params.row,
            rating: Number(params.row.rating),
        };
        setCurrentExercise(updatedRow);
    };

    return (
        <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom>
            Exercises
        </Typography>
        
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <ExerciseGrid 
                    addToWorkout={addToWorkout} 
                    currentExercise={currentExercise}
                    handleRowClick={handleRowClick}
            />
        </Grid>
            <Grid item xs={12} md={4}>
                <Box mb={3}>
                    <CurrentExerciseCard exercise={currentExercise} />
                    <AddToWorkoutButton exercise={currentExercise} onAddToWorkout={addToWorkout} />
                    <ViewSetsButton exercise={currentExercise}/>
                </Box>
            </Grid>
            
        </Grid>
    </Container>
    );
};

ExercisePage.propTypes = {
    addToWorkout: PropTypes.func.isRequired
};

export default ExercisePage;