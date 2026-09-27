import { useState, useCallback } from 'react';
import { studentService } from '../services/student.service';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await studentService.getStudents(params);
      if (res.success) {
        setStudents(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = async (data) => {
    const res = await studentService.createStudent(data);
    return res;
  };

  const updateStudent = async (id, data) => {
    const res = await studentService.updateStudent(id, data);
    return res;
  };

  const updateStudentStatus = async (id, isActive) => {
    const res = await studentService.updateStudentStatus(id, isActive);
    return res;
  };

  const deleteStudent = async (id) => {
    const res = await studentService.deleteStudent(id);
    return res;
  };

  return {
    students,
    pagination,
    loading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    updateStudentStatus,
    deleteStudent
  };
};
