import { Box, Container } from '@mui/material';
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
        if (e instanceof Error) {
          console.log(e);
        }
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

    if (filters.types && filters.types.length > 0) {
      filteredExercises = filteredExercises.filter(exercise =>
        filters.types.includes(exercise.type)
      );
    }

    //console.log(filteredExercises);
    setExercises(filteredExercises);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

    
    
  const columns = [
    { 
      field: 'name', 
      headerName: 'Name',
      flex: 2, // Proportional width
      minWidth: 200,
      renderCell: (params) => (
        <div style={{ 
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {params.value}
        </div>
      )
    },
    { 
      field: 'main_muscle', 
      headerName: 'Main Muscle',
      flex: 1,
      minWidth: 120
    },
    { 
      field: 'rating', 
      headerName: 'Rating',
      flex: 1,
      minWidth: 100
    },
  ];

  return (
    <Container 
      maxWidth="xl"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        p: 2,
        height: '100%'
      }}
    >
      <Box sx={{ 
        width: { xs: '100%', md: '250px' },
        flexShrink: 0
      }}>
        <ExerciseFilters onFiltersChange={handleFiltersChange} />
      </Box>

      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: { xs: 'calc(100vh - 200px)', md: 'calc(100vh - 100px)' },
        minHeight: 400,
        width: '100%'
      }}>
        <DataGrid
          rows={exercises}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
          sx={{
            '& .MuiDataGrid-cell': {
              padding: '8px 16px',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        />
      </Box>
    </Container>
  );
};

ExerciseGrid.propTypes = {
  handleRowClick: PropTypes.func.isRequired,
};

export default ExerciseGrid;
    
