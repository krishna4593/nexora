import { useState, useCallback } from 'react';
import { departmentService } from '../services/department.service';

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await departmentService.getDepartments(params);
      if (res.success) {
        setDepartments(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDepartment = async (data) => {
    const res = await departmentService.createDepartment(data);
    return res;
  };

  const updateDepartment = async (id, data) => {
    const res = await departmentService.updateDepartment(id, data);
    return res;
  };

  const updateDepartmentStatus = async (id, isActive) => {
    const res = await departmentService.updateDepartmentStatus(id, isActive);
    return res;
  };

  const deleteDepartment = async (id) => {
    const res = await departmentService.deleteDepartment(id);
    return res;
  };

  return {
    departments,
    pagination,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    updateDepartmentStatus,
    deleteDepartment
  };
};
