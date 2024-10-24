import { Box, Container, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css'; //removing this removes  the css for the data grid

import ExerciseDataService from "../services/ExerciseDataService";
import AddToWorkoutButton from './AddToWorkoutButton';
import ExerciseFilters from './ExerciseFilters';
import TestCurrentExercise from './testCurrentExercise';
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

  const handleCellClick = (args) => {
    const { row } = args;
    const updatedRow = {
      ...row,
      rating: Number(row.rating),
    };

    setCurrentExercise(updatedRow);
    TestCurrentExercise.exercise = currentExercise;
    console.log(updatedRow);
  };

  const columns = [
    { key: 'name', name: 'Name', sortable: true, width: 240 },
    { key: 'main_muscle', name: 'Main Muscle', width: 120 },
    { key: 'equipment', name: 'Equipment', width: 120 },
    { key: 'level', name: 'Level', width: 120 },
    { key: 'rating', name: 'Rating', sortable: true, width: 100 },
  ];

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
      <Box mb={3}>
        <TestCurrentExercise exercise={currentExercise} />
        <AddToWorkoutButton exercise={currentExercise} onAddToWorkout={addToWorkout} />
        <ViewSetsButton exercise={currentExercise}/>
      </Box>

      <ExerciseFilters onFiltersChange={handleFiltersChange} />

      <Typography variant="h5" gutterBottom>
        Exercise List
      </Typography>

      <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <div style={{ background: 'transparent', maxWidth: 'fit-content', margin: 'auto' }}>
          <DataGrid
            columns={columns}
            rows={exercises}
            defaultColumnOptions={{ sortable: false }}
            onCellClick={handleCellClick}
          />
        </div>
      </Box>
    </Container>
  );
};

ExerciseGrid.propTypes = {
  addToWorkout: PropTypes.func.isRequired,
};

export default ExerciseGrid;
