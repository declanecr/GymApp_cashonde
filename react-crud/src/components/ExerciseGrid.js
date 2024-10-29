import { Box, Container, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import ExerciseDataService from "../services/ExerciseDataService";
import AddToWorkoutButton from './AddToWorkoutButton';
import CurrentExerciseCard from './CurrentExerciseCard';
import ExerciseFilters from './ExerciseFilters';
import ViewSetsButton from './ViewSetsButton';

const ExerciseGrid = ({ addToWorkout }) => {
  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentExercise, setCurrentExercise] = useState(null);

  useEffect(() => {
    retrieveAllExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [filters, allExercises]);

  const retrieveAllExercises = () => {
    ExerciseDataService.getAll()
      .then(response => {
        setAllExercises(response.data);
        setExercises(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const filterExercises = () => {
    let filteredExercises = allExercises;

    if (filters.muscle) {
      filteredExercises = filteredExercises.filter(exercise =>
        exercise.main_muscle === filters.muscle
      );
    }

    if (filters.equipment) {
      filteredExercises = filteredExercises.filter(exercise =>
        exercise.equipment === filters.equipment
      );
    }

    if (filters.level) {
      filteredExercises = filteredExercises.filter(exercise =>
        exercise.level === filters.level
      );
    }

    console.log(filteredExercises);
    setExercises(filteredExercises);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRowClick = (params) => {
    const updatedRow = {
      ...params.row,
      rating: Number(params.row.rating),
    };

    setCurrentExercise(updatedRow);
    CurrentExerciseCard.exercise = currentExercise;
    console.log(updatedRow);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 240 },
    { field: 'main_muscle', headerName: 'Main Muscle', width: 120 },
    { field: 'equipment', headerName: 'Equipment', width: 120 },
    { field: 'level', headerName: 'Level', width: 120 },
    { field: 'rating', headerName: 'Rating', type: 'number', width: 100 },
  ];

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
      <Box mb={3}>
        <CurrentExerciseCard exercise={currentExercise} />
        <AddToWorkoutButton exercise={currentExercise} onAddToWorkout={addToWorkout} />
        <ViewSetsButton exercise={currentExercise}/>
      </Box>

      <ExerciseFilters onFiltersChange={handleFiltersChange} />

      <Typography variant="h5" gutterBottom>
        Exercise List
      </Typography>

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={exercises}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
        />
      </Box>
    </Container>
  );
};

ExerciseGrid.propTypes = {
  addToWorkout: PropTypes.func.isRequired,
};

export default ExerciseGrid;