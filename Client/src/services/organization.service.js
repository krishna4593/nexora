import api from './api';

export const organizationService = {
  createOrganization: async (data) => {
    const response = await api.post('/organizations', data);
    return response.data;
  },
  
  getMyOrganization: async () => {
    const response = await api.get('/organizations/me');
    return response.data;
  }
};
