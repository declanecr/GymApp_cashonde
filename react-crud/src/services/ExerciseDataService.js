/**
 * ExerciseDataService.js
 * 
 * This file provides a service layer for handling exercise-related operations.
 * It includes methods for CRUD operations on exercises, managing workouts,
 * and fetching filter values for the exercise list.
 */

import http from "../http-common.js";

const ExerciseDataService = {
  /**
   * Fetches all exercises
   * Purpose: Retrieve the complete list of exercises from the server
   * Inputs: None
   * Outputs: Promise resolving to an array of exercise objects
   * API Call: GET /exercises
   */
  getAll: (filters = {}) => {
    let url = "/exercises";
    const params = new URLSearchParams();

    if (filters.muscle) params.append("muscle", filters.muscle);
    if (filters.equipment) params.append("equipment", filters.equipment);
    if (filters.level) params.append("level", filters.level);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return http.get(url);
  },

  /**
   * Fetches all unique muscle groups
   * Purpose: Retrieve list of muscle groups for filtering
   * Inputs: None
   * Outputs: Promise resolving to an array of muscle group names
   * API Call: GET /exercises/main_muscle
   */
  getMuscleGroups() {
    return http.get("/exercises/main_muscle");
  },

  /**
   * Fetches all unique equipment types
   * Purpose: Retrieve list of equipment for filtering
   * Inputs: None
   * Outputs: Promise resolving to an array of equipment names
   * API Call: GET /exercises/equipment
   */
  getEquipment() {
    return http.get("/exercises/equipment");
  },

  /**
   * Fetches all unique difficulty levels
   * Purpose: Retrieve list of levels for filtering
   * Inputs: None
   * Outputs: Promise resolving to an array of level names
   * API Call: GET /exercises/level
   */
  getLevels() {
    return http.get("/exercises/level");
  },

  /**
   * Fetches a single exercise by ID
   * Purpose: Retrieve details of a specific exercise
   * Inputs: id - The ID of the exercise to fetch
   * Outputs: Promise resolving to the exercise object
   * API Call: GET /exercises/:id
   */
  get: id => {
    return http.get(`/exercises/${id}`);
  },

  /**
   * Creates a new exercise
   * Purpose: Add a new exercise to the database
   * Inputs: data - Object containing exercise details
   * Outputs: Promise resolving to the created exercise object
   * API Call: POST /exercises
   */
  create: data => {
    return http.post("/exercises", data);
  },

  /**
   * Updates an existing exercise
   * Purpose: Modify details of an existing exercise
   * Inputs: id - The ID of the exercise to update, data - Object with updated exercise details
   * Outputs: Promise resolving to the updated exercise object
   * API Call: PUT /exercises/:id
   */
  update: (id, data) => {
    return http.put(`/exercises/${id}`, data);
  },

  /**
   * Deletes an exercise
   * Purpose: Remove an exercise from the database
   * Inputs: id - The ID of the exercise to delete
   * Outputs: Promise resolving to the server response
   * API Call: DELETE /exercises/:id
   */
  delete: id => {
    return http.delete(`/exercises/${id}`);
  },

  /**
   * Deletes all exercises
   * Purpose: Remove all exercises from the database
   * Inputs: None
   * Outputs: Promise resolving to the server response
   * API Call: DELETE /exercises
   */
  deleteAll: () => {
    return http.delete(`/exercises`);
  },

  /**
   * Searches for exercises by name
   * Purpose: Find exercises matching a given name
   * Inputs: name - The name to search for
   * Outputs: Promise resolving to an array of matching exercise objects
   * API Call: GET /exercises?name=:name
   */
  findByName: name => {
    return http.get(`/exercises?name=${name}`);
  },

  /**
   * Adds an exercise to the current workout
   * Purpose: Include an exercise in the user's workout
   * Inputs: exercise - The exercise object to add
   * Outputs: None (updates localStorage)
   * Storage: Saves to 'currentWorkout' in localStorage
   */
  addToWorkout(exercise) {
    let workout = JSON.parse(localStorage.getItem("currentWorkout")) || [];
    workout.push(exercise);
    localStorage.setItem("currentWorkout", JSON.stringify(workout));
  },

  /**
   * Removes an exercise from the current workout
   * Purpose: Exclude an exercise from the user's workout
   * Inputs: exerciseId - The ID of the exercise to remove
   * Outputs: None (updates localStorage)
   * Storage: Updates 'currentWorkout' in localStorage
   */
  removeFromWorkout(exerciseId) {
    let workout = JSON.parse(localStorage.getItem("currentWorkout")) || [];
    workout = workout.filter(ex => ex.id !== exerciseId);
    localStorage.setItem("currentWorkout", JSON.stringify(workout));
  },

  /**
   * Retrieves the current workout
   * Purpose: Get the list of exercises in the user's current workout
   * Inputs: None
   * Outputs: Array of exercise objects in the current workout
   * Storage: Reads from 'currentWorkout' in localStorage
   */
  getCurrentWorkout() {
    return JSON.parse(localStorage.getItem("currentWorkout")) || [];
  },
  /**
   * Creates a new set for an exercise
   * Purpose: Add a new set to a specific exercise
   * Inputs: exerciseId - The ID of the exercise, setData - Object containing set details
   * Outputs: Promise resolving to the created set object
   * API Call: POST /exercises/:id/sets
   */
  createSet: (exerciseId, setData) => {
    return http.post(`/exercises/${exerciseId}/sets`, setData);
  },

  /**
   * Fetches all sets for an exercise
   * Purpose: Retrieve all sets associated with a specific exercise
   * Inputs: exerciseId - The ID of the exercise
   * Outputs: Promise resolving to an array of set objects
   * API Call: GET /exercises/:id/sets
   */
  getSetsForExercise: (exerciseId) => {
    return http.get(`/exercises/${exerciseId}/sets`);
  },

  /**
   * Updates an existing set
   * Purpose: Modify details of an existing set for a specific exercise
   * Inputs: exerciseId - The ID of the exercise, setId - The ID of the set, setData - Object with updated set details
   * Outputs: Promise resolving to the updated set object
   * API Call: PUT /exercises/:exerciseId/sets/:setId
   */
  updateSet: (exerciseId, setId, setData) => {
    return http.put(`/exercises/${exerciseId}/sets/${setId}`, setData);
  },
   


  /**
   * Deletes a set
   * Purpose: Remove a set from a specific exercise
   * Inputs: exerciseId - The ID of the exercise, setId - The ID of the set to delete
   * Outputs: Promise resolving to the server response
   * API Call: DELETE /exercises/:exerciseId/sets/:setId
   */
  deleteSet: (exerciseId, setId) => {
    return http.delete(`/exercises/${exerciseId}/sets/${setId}`);
  },

  /**
   * Fetches all workouts for an exercise
   * Purpose: Get all the workouts a specific
   * exercise appears in
   * Inputs: exerciseId - The ID of the exercise
   * Outputs: Promise resolving to the fetched workouts
   * API Call: GET /exercises/:exerciseId/workouts
   */
  getWorkouts: (exerciseId)=>{
    return http.get(`/exercises/${exerciseId}/workouts`);
  }
};

export default ExerciseDataService;