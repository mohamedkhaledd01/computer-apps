import api from "./api";

export const authService = {
  register: (data) => api.post("auth/register", data),
  login: (data) => api.post("auth/login", data)
};

const crud = (resource) => ({
  getAll: () => api.get(resource),
  getById: (id) => api.get(`${resource}/${id}`),
  create: (data) => api.post(resource, data),
  update: (id, data) => api.put(`${resource}/${id}`, data),
  remove: (id) => api.delete(`${resource}/${id}`)
});

export const userService = crud("users");
export const courseService = crud("courses");
export const enrollmentService = crud("enrollments");
export const assignmentService = crud("assignments");
export const submissionService = crud("submissions");
export const quizService = crud("quizzes");
export const gradeService = crud("grades");
export const announcementService = crud("announcements");
