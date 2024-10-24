import http from "../http-common";

const SetDataService = {
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
     * Fetches all sets for an exercise
     * Purpose: Get all sets from a specified workout
     * Inputs: workoutId - The ID of the workout
     * Outputs: Promise resolving to the fetched sets
     * API Call: Get /workouts/:workoutId/sets
     */
    getWorkoutSets: (workoutId) => {
        return http.get(`/workouts/${workoutId}/sets`);
    },

    /**
   * Retrieves a single set
   * Purpose: Get details of a specific set for an exercise
   * Inputs: exerciseId - The ID of the exercise, setId - The ID of the set
   * Outputs: Promise resolving to the set object
   * API Call: GET /exercises/:exerciseId/sets/:setId
   */
    getSet: (exerciseId, setId) => {
        return http.get(`/exercises/${exerciseId}/sets/${setId}`);
    }
};

export default SetDataService;