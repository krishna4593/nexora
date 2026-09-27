import api from './api';

export const attendanceService = {
  getSessions: async (params) => {
    const { data } = await api.get('/attendance/sessions', { params });
    return data;
  },

  getSessionById: async (id) => {
    const { data } = await api.get(`/attendance/sessions/${id}`);
    return data;
  },

  createSession: async (sessionData) => {
    const { data } = await api.post('/attendance/sessions', sessionData);
    return data;
  },

  updateSessionStatus: async (id, status) => {
    const { data } = await api.patch(`/attendance/sessions/${id}/status`, { status });
    return data;
  },

  getSessionRecords: async (id) => {
    const { data } = await api.get(`/attendance/sessions/${id}/records`);
    return data;
  },

  bulkMarkAttendance: async (id, records) => {
    const { data } = await api.post(`/attendance/sessions/${id}/records/bulk`, { records });
    return data;
  }
};
