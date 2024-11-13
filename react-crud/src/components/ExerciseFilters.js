import { Box, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ExerciseDataService from "../services/ExerciseDataService.js";

const ExerciseFilters = ({ onFiltersChange }) => {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);

  useEffect(() => {
    retrieveMuscleGroups();
    retrieveEquipment();
    retrieveLevels();
  }, []);

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
      default:
        break;
    }
  };

  const handleFilterChange = () => {
    const filters = {
      muscles: selectedMuscles,
      equipment: selectedEquipment,
      levels: selectedLevels,
    };
    onFiltersChange(filters);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        mt: 4,
      }}
    >
      <Box sx={{ display: 'flex', gap: 3, flexDirection: 'row', maxWidth: '100%', width: '100%' }}>
        
        {/* Muscle Group Checkboxes */}
        <Box>
          <Typography variant="h6">Muscle Group</Typography>
          {muscleGroups.map((muscle, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedMuscles.includes(muscle)}
                  onChange={() => handleCheckboxChange('muscle', muscle)}
                />
              }
              label={muscle}
            />
          ))}
        </Box>

        {/* Equipment Checkboxes */}
        <Box>
          <Typography variant="h6">Equipment</Typography>
          {equipment.map((item, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedEquipment.includes(item)}
                  onChange={() => handleCheckboxChange('equipment', item)}
                />
              }
              label={item}
            />
          ))}
        </Box>

        {/* Level Checkboxes */}
        <Box>
          <Typography variant="h6">Level</Typography>
          {levels.map((level, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedLevels.includes(level)}
                  onChange={() => handleCheckboxChange('level', level)}
                />
              }
              label={level}
            />
          ))}
        </Box>
      </Box>

      {/* Apply Filters Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleFilterChange}
        sx={{ alignSelf: 'flex-start', mt: 2 }}
      >
        Apply Filters
      </Button>
    </Box>
  );
};

ExerciseFilters.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
};

export default ExerciseFilters;
