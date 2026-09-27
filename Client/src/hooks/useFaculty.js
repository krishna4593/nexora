import { useState, useCallback } from 'react';
import { facultyService } from '../services/faculty.service';

export const useFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFaculty = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await facultyService.getFaculty(params);
      if (res.success) {
        setFaculty(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch faculty');
    } finally {
      setLoading(false);
    }
  }, []);

  const createFaculty = async (data) => {
    const res = await facultyService.createFaculty(data);
    return res;
  };

  const updateFaculty = async (id, data) => {
    const res = await facultyService.updateFaculty(id, data);
    return res;
  };

  const updateFacultyStatus = async (id, isActive) => {
    const res = await facultyService.updateFacultyStatus(id, isActive);
    return res;
  };

  const deleteFaculty = async (id) => {
    const res = await facultyService.deleteFaculty(id);
    return res;
  };

  return {
    faculty,
    pagination,
    loading,
    error,
    fetchFaculty,
    createFaculty,
    updateFaculty,
    updateFacultyStatus,
    deleteFaculty
  };
};
