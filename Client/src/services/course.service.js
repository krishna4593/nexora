import api from './api';

export const courseService = {
  getCourses: async (params) => {
    const { data } = await api.get('/courses', { params });
    return data;
  },

  getCourseById: async (id) => {
    const { data } = await api.get(`/courses/${id}`);
    return data;
  },

  createCourse: async (courseData) => {
    const { data } = await api.post('/courses', courseData);
    return data;
  },

  updateCourse: async (id, updateData) => {
    const { data } = await api.patch(`/courses/${id}`, updateData);
    return data;
  },

  updateCourseStatus: async (id, isActive) => {
    const { data } = await api.patch(`/courses/${id}/status`, { isActive });
    return data;
  },

  deleteCourse: async (id) => {
    const { data } = await api.delete(`/courses/${id}`);
    return data;
  }
};
