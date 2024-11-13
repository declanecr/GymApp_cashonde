import { Box, Button, Checkbox, Divider, FormControlLabel, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ExerciseDataService from "../services/ExerciseDataService.js";

const ExerciseFilters = ({ onFiltersChange }) => {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [levels, setLevels] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const defaultFilters = {
    muscles: [],
    equipment: ['Body Only', 'Dumbbell', 'Cable', 'Barbell', 'Machine'],
    levels: ['Beginner'],
    types: ['Strength', 'Powerlifting', 'Bodyweight']
  };  
  useEffect(() => {
    retrieveMuscleGroups();
    retrieveEquipment();
    retrieveLevels();
    retrieveTypes();
  }, []);

  // Add event listener for page reload
  useEffect(() => {
    // Reset filters when component mounts
    resetToDefaultFilters();

    // Add event listener for page reload
    window.addEventListener('load', resetToDefaultFilters);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener('load', resetToDefaultFilters);
    };
  }, []);


  const resetToDefaultFilters = () => {
    setSelectedMuscles(defaultFilters.muscles);
    setSelectedEquipment(defaultFilters.equipment);
    setSelectedLevels(defaultFilters.levels);
    setSelectedTypes(defaultFilters.types);
    
    // Trigger filter change to update the main view
    const filters = {
      muscles: defaultFilters.muscles,
      equipment: defaultFilters.equipment,
      levels: defaultFilters.levels,
      types: defaultFilters.types,
    };
    onFiltersChange(filters);
  };
  const retrieveMuscleGroups = () => {
    ExerciseDataService.getMuscleGroups()
      .then(response => {
        setMuscleGroups(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveEquipment = () => {
    ExerciseDataService.getEquipment()
      .then(response => {
        setEquipment(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveLevels = () => {
    ExerciseDataService.getLevels()
      .then(response => {
        setLevels(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveTypes =() => {
    ExerciseDataService.getTypes()
      .then(response => {
        setTypes(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleCheckboxChange = (category, value) => {
    const updateSelected = (selectedArray, setSelectedArray) => {
      if (selectedArray.includes(value)) {
        setSelectedArray(selectedArray.filter(item => item !== value));
      } else {
        setSelectedArray([...selectedArray, value]);
      }
    };

    switch (category) {
      case 'muscle':
        updateSelected(selectedMuscles, setSelectedMuscles);
        break;
      case 'equipment':
        updateSelected(selectedEquipment, setSelectedEquipment);
        break;
      case 'level':
        updateSelected(selectedLevels, setSelectedLevels);
        break;
      case 'type':
        updateSelected(selectedTypes, setSelectedTypes);
        break;
      default:
        break;
    }
  };

  const handleFilterChange = () => {
    const filters = {
      muscles: selectedMuscles,
      equipment: selectedEquipment,
      levels: selectedLevels,
      types: selectedTypes,
    };
    onFiltersChange(filters);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left', 
        justifyContent: 'left', 
        mt: 4,
        mb: 2,
        width: '100%',
        maxWidth: '180px',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', maxWidth: '180px', width: '100%' }}>
        {/* Apply Filters Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilterChange}
          sx={{ alignSelf: 'flex-start', mt: 2 }}
        >
          Apply Filters
        </Button>
        <Divider sx={{
          my: 1,
          width: '100%',
          border: '1px solid',
          borderColor: 'divider',
        }} />
        {/* Muscle Group Checkboxes */}
        <Box sx={{minWidth:'180px'}}>
          <Typography variant="h6">Muscle Group</Typography>
          {muscleGroups.map((muscle, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', height: '25px'}}>
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    size='small'
                    checked={
                      selectedMuscles.includes(muscle)
                    }
                    onChange={() => handleCheckboxChange('muscle', muscle)}
                  />
                }
                label={muscle}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    typography:'body2', // Adjust font size here
                  }}}
              />
            </Box>
          ))}
        </Box>
        <Divider sx={{ 
          my: 1,
          width: '100%',
          border: '1px solid',
          borderColor: 'divider',
        }} />
        {/* Equipment Checkboxes */}
        <Box sx={{minWidth:'180px'}}>
          <Typography variant="h6">Equipment</Typography>
          {equipment.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', height: '25px'}}>
              <FormControlLabel
                control={
                  <Checkbox
                    size='small'
                    checked={selectedEquipment.includes(item)}
                    onChange={() => handleCheckboxChange('equipment', item)}
                  />
                }
                label={item}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    typography:'body2', // Adjust font size here
                  }}}
              />
            </Box>
          ))}
        </Box>
        <Divider sx={{ 
          my: 1,
          width: '100%',
          border: '1px solid',
          borderColor: 'divider',
        }} />
        {/* Level Checkboxes */}
        <Box sx={{minWidth:'180px'}}>
          <Typography variant="h6">Level</Typography>
          {levels.map((level, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', height: '25px'}}>
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  size='small'
                  checked={selectedLevels.includes(level)}
                  onChange={() => handleCheckboxChange('level', level)}
                />
              }
              label={level}
              sx={{
              '& .MuiFormControlLabel-label': {
                typography:'body2', // Adjust font size here
              }}}
            />
          </Box>
          ))}
        </Box>
        <Divider sx={{
          my: 1,
          width: '100%',
          border: '1px solid',
          borderColor: 'divider',
        }} />
        {/* Type Checkboxes */}
        <Box sx={{minWidth:'1180x'}}> 
          <Typography variant="h6">Type</Typography>
          {types.map((type, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', height: '25px'}}>
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    size='small'
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleCheckboxChange('type', type)}
                  />
                }
                label={type}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    typography:'body2', // Adjust font size here
                  }}}
              />
            </Box>
          ))}
        </Box>
      </Box>
        
      
    </Box>
  );
};

ExerciseFilters.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
  
};

export default ExerciseFilters;
