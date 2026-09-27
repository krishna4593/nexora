import api from './api';

export const studentService = {
  getStudents: async (params) => {
    const { data } = await api.get('/students', { params });
    return data;
  },

  getStudentById: async (id) => {
    const { data } = await api.get(`/students/${id}`);
    return data;
  },

  createStudent: async (studentData) => {
    const { data } = await api.post('/students', studentData);
    return data;
  },

  updateStudent: async (id, updateData) => {
    const { data } = await api.patch(`/students/${id}`, updateData);
    return data;
  },

  updateStudentStatus: async (id, isActive) => {
    const { data } = await api.patch(`/students/${id}/status`, { isActive });
    return data;
  },

  deleteStudent: async (id) => {
    const { data } = await api.delete(`/students/${id}`);
    return data;
  }
};
