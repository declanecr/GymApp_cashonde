/**
 * Exercise Component
 * 
 * This component handles the display, update, and deletion of a single exercise.
 * It fetches exercise data based on the ID from the URL, allows editing of exercise details,
 * and provides options to update or delete the exercise.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import '../Exercise.css';
import ExerciseDataService from "../services/ExerciseDataService";

const Exercise = props => {
  const { id } = useParams();
  let navigate = useNavigate();

  // Initial state for the exercise
  const initialExerciseState = {
    id: null,
    name: "",
    description: "",
    type: "",
    main_muscle: "",
    equipment: "",
    level: "",
    rating: 0
  };
  const [currentExercise, setCurrentExercise] = useState(initialExerciseState);
  const [message, setMessage] = useState("");

  /**
   * Fetches exercise data from the server
   * Purpose: Retrieve exercise details based on the provided ID
   * Inputs: id - The ID of the exercise to fetch
   * Outputs: None (updates component state)
   * Sends: GET request to the server via ExerciseDataService
   */
  const getExercise = id => {
    ExerciseDataService.get(id)
      .then(response => {
        setCurrentExercise(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  // Fetch exercise data when component mounts or ID changes
  useEffect(() => {
    if (id)
      getExercise(id);
  }, [id]);

  /**
   * Handles input changes in the form
   * Purpose: Update the currentExercise state when form inputs change
   * Inputs: event - The input change event
   * Outputs: None (updates component state)
   */
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentExercise({ ...currentExercise, [name]: value });
  };

  /**
   * Updates the exercise in the database
   * Purpose: Send updated exercise data to the server
   * Inputs: None (uses currentExercise state)
   * Outputs: None (updates component state and displays message)
   * Sends: PUT request to the server via ExerciseDataService
   */
  const updateExercise = () => {
    ExerciseDataService.update(currentExercise.id, currentExercise)
      .then(response => {
        console.log(response.data);
        setMessage("The exercise was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  /**
   * Deletes the exercise from the database
   * Purpose: Remove the current exercise from the server
   * Inputs: None (uses currentExercise.id)
   * Outputs: None (navigates to exercise list on success)
   * Sends: DELETE request to the server via ExerciseDataService
   */
  const deleteExercise = () => {
    ExerciseDataService.delete(currentExercise.id)
      .then(response => {
        console.log(response.data);
        navigate("/exercises");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentExercise ? (
        <div className="edit-form">
          <h4>Exercise</h4>
          <form>
            {/* Form inputs for each exercise property */}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={currentExercise.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={currentExercise.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <input
                type="text"
                className="form-control"
                id="type"
                name="type"
                value={currentExercise.type}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="main_muscle">Main Muscle</label>
              <input
                type="text"
                className="form-control"
                id="main_muscle"
                name="main_muscle"
                value={currentExercise.main_muscle}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="equipment">Equipment</label>
              <input
                type="text"
                className="form-control"
                id="equipment"
                name="equipment"
                value={currentExercise.equipment}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="level">Level</label>
              <input
                type="text"
                className="form-control"
                id="level"
                name="level"
                value={currentExercise.level}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <input
                type="number"
                className="form-control"
                id="rating"
                name="rating"
                value={currentExercise.rating}
                onChange={handleInputChange}
              />
            </div>
          </form>

          <button className="badge badge-danger mr-2" onClick={deleteExercise}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateExercise}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on an Exercise...</p>
        </div>
      )}
    </div>
  );
};

export default Exercise;