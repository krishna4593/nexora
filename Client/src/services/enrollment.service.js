import api from './api';

export const enrollmentService = {
  getEnrollments: async (params) => {
    const { data } = await api.get('/enrollments', { params });
    return data;
  },

  getEnrollmentById: async (id) => {
    const { data } = await api.get(`/enrollments/${id}`);
    return data;
  },

  createEnrollment: async (enrollmentData) => {
    const { data } = await api.post('/enrollments', enrollmentData);
    return data;
  },

  updateEnrollmentStatus: async (id, status) => {
    const { data } = await api.patch(`/enrollments/${id}/status`, { status });
    return data;
  },

  deleteEnrollment: async (id) => {
    const { data } = await api.delete(`/enrollments/${id}`);
    return data;
  }
};
