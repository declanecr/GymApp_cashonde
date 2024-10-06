import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import '../Exercise.css';
import ExerciseDataService from "../services/ExerciseDataService";

const ExercisesList = () => {
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    retrieveExercises();
  }, []);


  
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
  const refreshList = () => {
    retrieveExercises();
    setCurrentExercise(null);
    setCurrentIndex(-1);
  };

  const setActiveExercise = (exercise, index) => {
    setCurrentExercise(exercise);
    setCurrentIndex(index);
  };

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

  const addToWorkout = (exercise) => {
    ExerciseDataService.addToWorkout(exercise);
    // Implement the logic to add the exercise to the workout
    // This could involve storing the exercise in local storage or making an API call
    console.log("Adding exercise to workout:", exercise);
    // For now, we'll just log the action. You'll need to implement the actual functionality.
  };

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