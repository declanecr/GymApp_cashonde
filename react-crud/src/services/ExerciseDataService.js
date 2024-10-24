import http from "../http-common";

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
};

export default ExerciseDataService;