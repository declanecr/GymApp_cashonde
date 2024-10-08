import React, { useEffect, useState } from 'react';
import ExerciseDataService from "../services/ExerciseDataService";
import TestExerciseFilters from './testExerciseFilters';

const TestExerciseList = () => {
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

    setExercises(filteredExercises);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <h2>Exercise List</h2>
      <TestExerciseFilters onFiltersChange={handleFiltersChange} />
      <ul>
        {exercises.map((exercise, index) => (
          <li key={index}>
            {exercise.name} - {exercise.main_muscle} - {exercise.equipment} - {exercise.level}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestExerciseList;