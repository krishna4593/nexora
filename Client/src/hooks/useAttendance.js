import { useState, useCallback } from 'react';
import { attendanceService } from '../services/attendance.service';

export const useAttendance = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await attendanceService.getSessions(params);
      if (res.success) {
        setSessions(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessionById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await attendanceService.getSessionById(id);
      if (res.success) {
        setCurrentSession(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch session details');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessionRecords = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await attendanceService.getSessionRecords(id);
      if (res.success) {
        setRecords(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch session records');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = async (data) => {
    const res = await attendanceService.createSession(data);
    return res;
  };

  const updateSessionStatus = async (id, status) => {
    const res = await attendanceService.updateSessionStatus(id, status);
    return res;
  };

  const bulkMarkAttendance = async (id, data) => {
    const res = await attendanceService.bulkMarkAttendance(id, data);
    return res;
  };

  return {
    sessions,
    currentSession,
    records,
    pagination,
    loading,
    error,
    fetchSessions,
    fetchSessionById,
    fetchSessionRecords,
    createSession,
    updateSessionStatus,
    bulkMarkAttendance
  };
};
