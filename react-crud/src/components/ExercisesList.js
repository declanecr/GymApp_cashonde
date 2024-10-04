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