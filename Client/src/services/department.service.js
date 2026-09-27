import api from './api';

export const departmentService = {
  getDepartments: async (params) => {
    const { data } = await api.get('/departments', { params });
    return data;
  },

  getDepartment: async (id) => {
    const { data } = await api.get(`/departments/${id}`);
    return data;
  },

  createDepartment: async (departmentData) => {
    const { data } = await api.post('/departments', departmentData);
    return data;
  },

  updateDepartment: async (id, updateData) => {
    const { data } = await api.patch(`/departments/${id}`, updateData);
    return data;
  },

  updateDepartmentStatus: async (id, isActive) => {
    const { data } = await api.patch(`/departments/${id}/status`, { isActive });
    return data;
  },

  deleteDepartment: async (id) => {
    const { data } = await api.delete(`/departments/${id}`);
    return data;
  }
};
