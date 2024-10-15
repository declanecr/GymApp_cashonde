import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ExerciseDataService from "../services/ExerciseDataService.js";
import { FormControl, InputLabel, MenuItem, Select, Button, Box, Typography } from '@mui/material';

const ExerciseFilters = ({ onFiltersChange }) => {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

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

  const handleFilterChange = () => {
    const filters = {
      muscle: selectedMuscle,
      equipment: selectedEquipment,
      level: selectedLevel,
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
      <Typography variant="h6" gutterBottom>
        Exercise Filters
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column', maxWidth: 400 }}>
        {/* Muscle Group Filter */}
        <FormControl fullWidth>
          <InputLabel id="muscle-group-label">Muscle Group</InputLabel>
          <Select
            labelId="muscle-group-label"
            id="muscle-group-select"
            value={selectedMuscle}
            label="Muscle Group"
            onChange={(e) => setSelectedMuscle(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {muscleGroups.map((muscle, index) => (
              <MenuItem key={index} value={muscle}>
                {muscle}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Equipment Filter */}
        <FormControl fullWidth>
          <InputLabel id="equipment-label">Equipment</InputLabel>
          <Select
            labelId="equipment-label"
            id="equipment-select"
            value={selectedEquipment}
            label="Equipment"
            onChange={(e) => setSelectedEquipment(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {equipment.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Level Filter */}
        <FormControl fullWidth>
          <InputLabel id="level-label">Level</InputLabel>
          <Select
            labelId="level-label"
            id="level-select"
            value={selectedLevel}
            label="Level"
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {levels.map((level, index) => (
              <MenuItem key={index} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Apply Filters Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilterChange}
          sx={{ alignSelf: 'flex-start' }}
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
};

ExerciseFilters.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
};

export default ExerciseFilters;
