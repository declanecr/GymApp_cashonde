import { Box, Container, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import ExerciseDataService from "../services/ExerciseDataService";
import ExerciseFilters from './ExerciseFilters';

const ExerciseGrid = ({ handleRowClick }) => {
  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [filters, setFilters] = useState({});

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
  
    if (filters.muscles && filters.muscles.length > 0) {
      filteredExercises = filteredExercises.filter(exercise =>
        filters.muscles.includes(exercise.main_muscle)
      );
    }
  
    if (filters.equipment && filters.equipment.length > 0) {
      filteredExercises = filteredExercises.filter(exercise =>
        filters.equipment.includes(exercise.equipment)
      );
    }
  
    if (filters.levels && filters.levels.length > 0) {
      filteredExercises = filteredExercises.filter(exercise =>
        filters.levels.includes(exercise.level)
      );
    }

    console.log(filteredExercises);
    setExercises(filteredExercises);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
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
  handleRowClick: PropTypes.func.isRequired,
};

export default ExerciseGrid;