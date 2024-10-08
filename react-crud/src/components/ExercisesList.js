/**
 * ExercisesList Component
 * 
 * This component manages the display and interaction with a list of exercises.
 * It includes functionality for filtering, searching, and managing individual exercises.
 */

import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import '../Exercise.css';
import ExerciseDataService from "../services/ExerciseDataService.js";
import "./ExerciseList.css";


const ExercisesList = () => {
    // State declarations for managing exercises and filters
    const [exercises, setExercises] = useState([]);
    const [currentExercise, setCurrentExercise] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchName, setSearchName] = useState("");
    const [muscleGroupFilter, setMuscleGroupFilter] = useState([]);
    const [equipmentFilter, setEquipmentFilter] = useState([]);
    const [levelFilter, setLevelFilter] = useState([]);

  useEffect(() => {
    // Fetch exercises and filter values when component mounts
    retrieveExercises();
    retrieveFilterValues();
  }, []);

  /**
   * Retrieves filter values for muscle groups, equipment, and levels
   * Purpose: Populate filter dropdowns
   * Inputs: None
   * Outputs: Updates state with filter values
   * API Calls: ExerciseDataService.getMuscleGroups, getEquipment, getLevels
   */
  const retrieveFilterValues = () => {
    ExerciseDataService.getMuscleGroups()
      .then(response => {
        setMuscleGroupFilter(response.data);
      })
      .catch(e => {
        console.log(e);
      });

    ExerciseDataService.getEquipment()
      .then(response => {
        setEquipmentFilter(response.data);
      })
      .catch(e => {
        console.log(e);
      });

    ExerciseDataService.getLevels()
      .then(response => {
        setLevelFilter(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  /**
   * Filters exercises based on selected criteria
   * Purpose: Apply filters to the exercise list
   * Inputs: None (uses state values)
   * Outputs: Filtered array of exercises
   */
  const filterExercises = () => {
    return exercises.filter(exercise => 
      (muscleGroupFilter === "" || exercise.main_muscle === muscleGroupFilter) &&
      (equipmentFilter === "" || exercise.equipment === equipmentFilter) &&
      (levelFilter === "" || exercise.level === levelFilter)
    );
  };
  
  /**
   * Retrieves all exercises from the server
   * Purpose: Populate the exercise list
   * Inputs: None
   * Outputs: Updates exercises state
   * API Calls: ExerciseDataService.getAll
   */
  const retrieveExercises = () => {
    ExerciseDataService.getAll()
      .then(response => {
        setExercises(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  // eslint-disable-next-line
  /**
   * Refreshes the exercise list
   * Purpose: Update the list after changes
   * Inputs: None
   * Outputs: Resets current exercise and updates list
   */
  const refreshList = () => {
    retrieveExercises();
    setCurrentExercise(null);
    setCurrentIndex(-1);
  };

  /**
   * Sets the active exercise
   * Purpose: Display details of selected exercise
   * Inputs: exercise - The selected exercise object, index - The index in the list
   * Outputs: Updates currentExercise and currentIndex states
   */
  const setActiveExercise = (exercise, index) => {
    setCurrentExercise(exercise);
    setCurrentIndex(index);
  };

  /**
   * Searches for exercises by name
   * Purpose: Filter exercises based on search input
   * Inputs: None (uses searchName state)
   * Outputs: Updates exercises state with search results
   * API Calls: ExerciseDataService.findByName
   */
  const searchExercise = () => {
    ExerciseDataService.findByName(searchName)
      .then(response => {
        setExercises(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  /**
   * Deletes an exercise
   * Purpose: Remove an exercise from the database
   * Inputs: id - The ID of the exercise to delete
   * Outputs: Refreshes the exercise list on success
   * API Calls: ExerciseDataService.delete
   */
  const deleteExercise = (id) => {
    ExerciseDataService.delete(id)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };

  /**
   * Adds an exercise to the workout
   * Purpose: Include selected exercise in the current workout
   * Inputs: exercise - The exercise object to add
   * Outputs: Logs addition to console (actual addition handled in service)
   * Service Call: ExerciseDataService.addToWorkout
   */
  const addToWorkout = (exercise) => {
    ExerciseDataService.addToWorkout(exercise);
    console.log("Adding exercise to workout:", exercise);
  };

  // Component's JSX return statement
  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={searchExercise}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Exercises List</h4>
        <div>
            <select className="filter-select" onChange={e => setMuscleGroupFilter(e.target.value)}>
                <option value="">All Muscle Groups</option>
                {muscleGroupFilter.map((group, index) => (
                    <option key={index} value={group}>{group}</option>
                ))}
            </select>
            <select className="filter-select"onChange={e => setEquipmentFilter(e.target.value)}>
                <option value="">All Equipment</option>
                {equipmentFilter.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                ))}
            </select>
            <select className="filter-select" onChange={e => setLevelFilter(e.target.value)}>
                <option value="">All Levels</option>
                {levelFilter.map((level, index) => (
                    <option key={index} value={level}>{level}</option>
                ))}
            </select>
        </div>
        <ul className="exercise-list">
            {filterExercises().map((exercise, index) => (
            <li key={index}>{exercise.name}</li>
            ))}
        </ul>
        <ul className="list-group">
          {exercises &&
            exercises.map((exercise, index) => (
              <li
                className={
                  "list-group-item " +
                  (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveExercise(exercise, index)}
                key={index}
              >
                {exercise.name}
              </li>
            ))}
        </ul>
      </div>
      <div className="col-md-6">
        {currentExercise ? (
          <div>
            <h4>Exercise</h4>
            <div>
              <label>
                <strong>Name:</strong>
              </label>{" "}
              {currentExercise.name}
            </div>
            <div>
              <label>
                <strong>Description:</strong>
              </label>{" "}
              {currentExercise.description}
            </div>
            <div>
              <label>
                <strong>Type:</strong>
              </label>{" "}
              {currentExercise.type}
            </div>
            <div>
              <label>
                <strong>Main Muscle:</strong>
              </label>{" "}
              {currentExercise.main_muscle}
            </div>
            <div>
              <label>
                <strong>Equipment:</strong>
              </label>{" "}
              {currentExercise.equipment}
            </div>
            <div>
              <label>
                <strong>Level:</strong>
              </label>{" "}
              {currentExercise.level}
            </div>
            <div>
              <label>
                <strong>Rating:</strong>
              </label>{" "}
              {currentExercise.rating}
            </div>
            <Link
              to={"/exercises/" + currentExercise.id}
              className="badge badge-warning"
            >
              Edit
            </Link>
            <button
                className="badge badge-success"
                onClick={() => addToWorkout(currentExercise)}
            >
                Add to Workout
            </button>
            <button
              className="badge badge-danger mr-2"
              onClick={() => deleteExercise(currentExercise.id)}
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on an Exercise...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesList;