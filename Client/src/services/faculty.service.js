import api from './api';

export const facultyService = {
  getFaculty: async (params) => {
    const { data } = await api.get('/faculty', { params });
    return data;
  },

  getFacultyById: async (id) => {
    const { data } = await api.get(`/faculty/${id}`);
    return data;
  },

  createFaculty: async (facultyData) => {
    const { data } = await api.post('/faculty', facultyData);
    return data;
  },

  updateFaculty: async (id, updateData) => {
    const { data } = await api.patch(`/faculty/${id}`, updateData);
    return data;
  },

  updateFacultyStatus: async (id, isActive) => {
    const { data } = await api.patch(`/faculty/${id}/status`, { isActive });
    return data;
  },

  deleteFaculty: async (id) => {
    const { data } = await api.delete(`/faculty/${id}`);
    return data;
  }
};
