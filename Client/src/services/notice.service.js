import api from './api';

export const noticeService = {
  getNotices: async (params) => {
    const { data } = await api.get('/notices', { params });
    return data;
  },

  getNoticeById: async (id) => {
    const { data } = await api.get(`/notices/${id}`);
    return data;
  },

  createNotice: async (noticeData) => {
    const { data } = await api.post('/notices', noticeData);
    return data;
  },

  updateNotice: async (id, noticeData) => {
    const { data } = await api.patch(`/notices/${id}`, noticeData);
    return data;
  },

  publishNotice: async (id) => {
    const { data } = await api.patch(`/notices/${id}/publish`);
    return data;
  },

  unpublishNotice: async (id) => {
    const { data } = await api.patch(`/notices/${id}/unpublish`);
    return data;
  },

  toggleNoticeStatus: async (id) => {
    const { data } = await api.patch(`/notices/${id}/status`);
    return data;
  },

  deleteNotice: async (id) => {
    const { data } = await api.delete(`/notices/${id}`);
    return data;
  }
};
