// frontend/src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/profile"),
};

export const courseAPI = {
  getCourses: () => api.get("/courses"),
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

export const cloAPI = {
  getCLOsByCourse: (courseId) => api.get(`/clos/course/${courseId}`),
  createCLO: (data) => api.post("/clos", data),
  updateCLO: (id, data) => api.put(`/clos/${id}`, data),
  mapCLOToPOPSO: (data) => api.post("/clos/mapping", data),
};

export const hodAPI = {
  // Faculty CRUD
  getAllFaculty: () => api.get("/hod/faculty"),
  createFaculty: (data) => api.post("/hod/faculty", data),
  updateFaculty: (id, data) => api.put(`/hod/faculty/${id}`, data),
  deleteFaculty: (id) => api.delete(`/hod/faculty/${id}`),

  // Get faculty by ID
  getFacultyById: (id) => api.get(`/hod/faculty/${id}`),

  // Get faculty by department
  getFacultyByDepartment: (departmentId) =>
    api.get(`/hod/faculty/department/${departmentId}`),

  // Faculty assigned courses
  getFacultyWithCourses: (id) => api.get(`/hod/faculty/${id}/courses`),

  // Assign / remove course for faculty
  assignCourseToFaculty: (data) => api.post("/hod/faculty/assign-course", data),
  getCoursesByFaculty: (facultyId) =>
    api.get(`/hod/faculty/${facultyId}/assigned-courses`),
  removeCourseFromFaculty: (data) =>
    api.delete("/hod/faculty/remove-course", { data }),

  // Course management through HOD
  createCourse: (data) => api.post("/hod/course", data),
  getCourses: () => api.get("/hod/courses"),
  getAllCourses: () => api.get("/hod/all-courses"),
  getCourseById: (id) => api.get(`/hod/course/${id}`),
  updateCourse: (id, data) => api.put(`/hod/course/${id}`, data),
  deleteCourse: (id) => api.delete(`/hod/course/${id}`),

  // CLO management
  createCLO: (data) => api.post("/hod/clo", data),
  updateCLO: (id, data) => api.put(`/hod/clo/${id}`, data),
  getCLOsByCourse: (courseId) => api.get(`/hod/clo/course/${courseId}`),

  // Map CLO to PO/PSO
  mapCLOToPOPSO: (data) => api.post("/hod/clo/map", data),

  // Get CLO mappings for a course
  getCLOMappings: (courseId) => api.get(`/hod/clo/mappings/${courseId}`),

  //GET DASHBOARD STATS
  getDashboardStats: () => api.get("/hod/dashboard/stats"),
};

export default api;
