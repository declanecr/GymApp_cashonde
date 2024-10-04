import React, { useState } from "react";
import '../Exercise.css';
import ExerciseDataService from "../services/ExerciseDataService";

const AddExercise = () => {
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
  const [exercise, setExercise] = useState(initialExerciseState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setExercise({ ...exercise, [name]: value });
  };

  const saveExercise = () => {
    var data = {
      name: exercise.name,
      description: exercise.description,
      type: exercise.type,
      main_muscle: exercise.main_muscle,
      equipment: exercise.equipment,
      level: exercise.level,
      rating: exercise.rating
    };

    ExerciseDataService.create(data)
      .then(response => {
        setExercise({
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          type: response.data.type,
          main_muscle: response.data.main_muscle,
          equipment: response.data.equipment,
          level: response.data.level,
          rating: response.data.rating
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newExercise = () => {
    setExercise(initialExerciseState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newExercise}>
            Add Another
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              value={exercise.name}
              onChange={handleInputChange}
              name="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              required
              value={exercise.description}
              onChange={handleInputChange}
              name="description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input
              type="text"
              className="form-control"
              id="type"
              required
              value={exercise.type}
              onChange={handleInputChange}
              name="type"
            />
          </div>

          <div className="form-group">
            <label htmlFor="main_muscle">Main Muscle</label>
            <input
              type="text"
              className="form-control"
              id="main_muscle"
              required
              value={exercise.main_muscle}
              onChange={handleInputChange}
              name="main_muscle"
            />
          </div>

          <div className="form-group">
            <label htmlFor="equipment">Equipment</label>
            <input
              type="text"
              className="form-control"
              id="equipment"
              required
              value={exercise.equipment}
              onChange={handleInputChange}
              name="equipment"
            />
          </div>

          <div className="form-group">
            <label htmlFor="level">Level</label>
            <input
              type="text"
              className="form-control"
              id="level"
              required
              value={exercise.level}
              onChange={handleInputChange}
              name="level"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              className="form-control"
              id="rating"
              required
              value={exercise.rating}
              onChange={handleInputChange}
              name="rating"
            />
          </div>

          <button onClick={saveExercise} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddExercise;