/**
 * AddExercise Component
 * 
 * This component provides a form for adding new exercises to the database.
 * It handles user input, form submission, and displays a success message upon submission.
 */
import React, { useState } from "react";
import { TextField, Button, Typography, Grid, Paper } from "@mui/material";
import '../Exercise.css';
import ExerciseDataService from "../services/ExerciseDataService";

const AddExercise = () => {
  // Initial state for a new exercise
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

  const handleInputChange = (event) => {
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
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Add New Exercise
      </Typography>
      {submitted ? (
        <div>
          <Typography variant="h6" color="success.main">
            You submitted successfully!
          </Typography>
          <Button variant="contained" color="primary" onClick={newExercise}>
            Add Another
          </Button>
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              required
              value={exercise.name}
              onChange={handleInputChange}
              name="name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              required
              value={exercise.description}
              onChange={handleInputChange}
              name="description"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Type"
              variant="outlined"
              required
              value={exercise.type}
              onChange={handleInputChange}
              name="type"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Main Muscle"
              variant="outlined"
              required
              value={exercise.main_muscle}
              onChange={handleInputChange}
              name="main_muscle"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Equipment"
              variant="outlined"
              required
              value={exercise.equipment}
              onChange={handleInputChange}
              name="equipment"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Level"
              variant="outlined"
              required
              value={exercise.level}
              onChange={handleInputChange}
              name="level"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Rating"
              variant="outlined"
              required
              value={exercise.rating}
              onChange={handleInputChange}
              name="rating"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" backgrounColor="#1976d2" onClick={saveExercise}>
              Submit
            </Button>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default AddExercise;
