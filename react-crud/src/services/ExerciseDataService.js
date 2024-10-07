import http from "../http-common.js";

const ExerciseDataService = {
  getAll: () => {
    return http.get("/exercises");
  },

  // New methods for fetching filter values
  getMuscleGroups() {
    return http.get("/exercises/muscle-groups");
  },

  getEquipment() {
    return http.get("/exercises/equipment");
  },

  getLevels() {
    return http.get("/exercises/levels");
  },
  // End of filter methods

  get: id => {
    return http.get(`/exercises/${id}`);
  },

  create: data => {
    return http.post("/exercises", data);
  },

  update: (id, data) => {
    return http.put(`/exercises/${id}`, data);
  },

  delete: id => {
    return http.delete(`/exercises/${id}`);
  },

  deleteAll: () => {
    return http.delete(`/exercises`);
  },

  findByName: name => {
    return http.get(`/exercises?name=${name}`);
  },

  addToWorkout(exercise) {
    let workout = JSON.parse(localStorage.getItem("currentWorkout")) || [];
    workout.push(exercise);
    localStorage.setItem("currentWorkout", JSON.stringify(workout));
  },

  removeFromWorkout(exerciseId) {
    let workout = JSON.parse(localStorage.getItem("currentWorkout")) || [];
    workout = workout.filter(ex => ex.id !== exerciseId);
    localStorage.setItem("currentWorkout", JSON.stringify(workout));
  },

  getCurrentWorkout() {
    return JSON.parse(localStorage.getItem("currentWorkout")) || [];
  }
};

export default ExerciseDataService;