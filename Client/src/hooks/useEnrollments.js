import { useState, useCallback } from 'react';
import { enrollmentService } from '../services/enrollment.service';

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEnrollments = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await enrollmentService.getEnrollments(params);
      if (res.success) {
        setEnrollments(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch enrollments');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEnrollment = async (data) => {
    const res = await enrollmentService.createEnrollment(data);
    return res;
  };

  const updateEnrollmentStatus = async (id, status) => {
    const res = await enrollmentService.updateEnrollmentStatus(id, status);
    return res;
  };

  const deleteEnrollment = async (id) => {
    const res = await enrollmentService.deleteEnrollment(id);
    return res;
  };

  return {
    enrollments,
    pagination,
    loading,
    error,
    fetchEnrollments,
    createEnrollment,
    updateEnrollmentStatus,
    deleteEnrollment
  };
};
