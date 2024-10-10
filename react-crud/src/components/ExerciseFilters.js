import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ExerciseDataService from "../services/ExerciseDataService.js";

const ExerciseFilters = ({onFiltersChange}) => {
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
    //console.log("retrieving muscle groups");
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

  const getFilters = () => {
    console.log("getting filters");
    const filters = {
      muscle: selectedMuscle,
      equipment: selectedEquipment,
      level: selectedLevel
    };
    onFiltersChange(filters);
    return filters;
  };

  return (
    <div>
      <h2>Exercise Filters</h2>
      <div>
        <label>Muscle Group:</label>
        <select value={selectedMuscle} onChange={(e) => setSelectedMuscle(e.target.value)}>
          <option value="">All</option>
          {muscleGroups.map((muscle, index) => (
            <option key={index} value={muscle}>{muscle}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Equipment:</label>
        <select value={selectedEquipment} onChange={(e) => setSelectedEquipment(e.target.value)}>
          <option value="">All</option>
          {equipment.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Level:</label>
        <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
          <option value="">All</option>
          {levels.map((level, index) => (
            <option key={index} value={level}>{level}</option>
          ))}
        </select>
      </div>
      <button onClick={() => console.log(getFilters())}>Get Filters</button>
    </div>
  );
};

ExerciseFilters.propTypes={
    onFiltersChange: PropTypes.func.isRequired
};

export default ExerciseFilters;