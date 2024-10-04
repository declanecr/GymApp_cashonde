import http from "../http-common";

const ExerciseDataService = {
  getAll: () => {
    return http.get("/exercises");
  },

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
  }
};

export default ExerciseDataService;