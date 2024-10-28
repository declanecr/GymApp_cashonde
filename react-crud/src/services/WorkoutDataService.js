import http from "../http-common";

const WorkoutDataService = {
    /**
   * Creates a workout
   * Purpose: Create a workout
   * Inputs: workoutData - Object containing Name and Data 
   * (name and date can be same)
   * Outputs: None (creates a new workout)
   * API Call: POST /workouts/
   */
    createWorkout(workoutData){
        console.log("createWorkout: ", workoutData);
        return http.post(`/workouts/`,workoutData)
        .then(response =>{
            console.log("ExerciseDataService \nCreated workout:", response.data);
            return response.data;
        });
    },

    /**
   * Retrieves all workouts
   * Purpose: Get a list of all workouts
   * Inputs: None
   * Outputs: Promise resolving to an array of workout objects
   * API Call: GET /workouts
   */
    getAllWorkouts: () => {
        return http.get('/workouts');
    },

    /**
     * Retrieves a single workout by ID
     * Purpose: Get details of a specific workout
     * Inputs: id - The ID of the workout to fetch
     * Outputs: Promise resolving to the workout object
     * API Call: GET /workouts/:id
     */
    getWorkout: (id) => {
        return http.get(`/workouts/${id}`);
    },

    /**
     * Updates an existing workout
     * Purpose: Modify details of an existing workout
     * Inputs: id - The ID of the workout to update, data - Object with updated workout details
     * Outputs: Promise resolving to the updated workout object
     * API Call: PUT /workouts/:id
     */
    updateWorkout: (id, data) => {
        return http.put(`/workouts/${id}`, data);
    },

    /**
     * Deletes a workout
     * Purpose: Remove a workout from the database
     * Inputs: id - The ID of the workout to delete
     * Outputs: Promise resolving to the server response
     * API Call: DELETE /workouts/:id
     */
    deleteWorkout: (id) => {
        return http.delete(`/workouts/${id}`);
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
   * Fetches all workouts for an exercise
   * Purpose: Get all the workouts a specific
   * exercise appears in
   * Inputs: exerciseId - The ID of the exercise
   * Outputs: Promise resolving to the fetched workouts
   * API Call: GET /exercises/:exerciseId/workouts
   */
    getWorkouts: (exerciseId) => {
        return http.get(`/exercises/${exerciseId}/workouts`);
    },

    /**
     * Generates a workout based on number of days
     * Purpose: Create a workout plan for a specified number of days
     * Inputs: numDays - The number of days for the workout plan
     * Outputs: Promise resolving to an array of exercises for the generated workout
     * API Call: GET /workouts/generate/:numDays 
     */
    generateWorkout: (numDays) => {
        console.log('WDS.generateWorkout numDays: ',numDays);
        return http.get(`/workouts/generate/${numDays}`)
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    console.log('response.data: ', response.data);
                    return response.data;
                } else {
                    throw new Error("Invalid response format");
                }
            });
    }
};

export default WorkoutDataService;