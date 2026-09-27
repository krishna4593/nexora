import { useState, useCallback } from 'react';
import { noticeService } from '../services/notice.service';

export const useNotices = () => {
  const [notices, setNotices] = useState([]);
  const [currentNotice, setCurrentNotice] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotices = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await noticeService.getNotices(params);
      if (res.success) {
        setNotices(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNoticeById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await noticeService.getNoticeById(id);
      if (res.success) {
        setCurrentNotice(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notice details');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNotice = async (noticeData) => {
    const res = await noticeService.createNotice(noticeData);
    return res;
  };

  const updateNotice = async (id, noticeData) => {
    const res = await noticeService.updateNotice(id, noticeData);
    return res;
  };

  const publishNotice = async (id) => {
    const res = await noticeService.publishNotice(id);
    return res;
  };

  const unpublishNotice = async (id) => {
    const res = await noticeService.unpublishNotice(id);
    return res;
  };

  const toggleNoticeStatus = async (id) => {
    const res = await noticeService.toggleNoticeStatus(id);
    return res;
  };

  const deleteNotice = async (id) => {
    const res = await noticeService.deleteNotice(id);
    return res;
  };

  return {
    notices,
    currentNotice,
    pagination,
    loading,
    error,
    fetchNotices,
    fetchNoticeById,
    createNotice,
    updateNotice,
    publishNotice,
    unpublishNotice,
    toggleNoticeStatus,
    deleteNotice
  };
};
