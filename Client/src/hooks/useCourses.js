import { useState, useCallback } from 'react';
import { courseService } from '../services/course.service';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseService.getCourses(params);
      if (res.success) {
        setCourses(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = async (data) => {
    const res = await courseService.createCourse(data);
    return res;
  };

  const updateCourse = async (id, data) => {
    const res = await courseService.updateCourse(id, data);
    return res;
  };

  const updateCourseStatus = async (id, isActive) => {
    const res = await courseService.updateCourseStatus(id, isActive);
    return res;
  };

  const deleteCourse = async (id) => {
    const res = await courseService.deleteCourse(id);
    return res;
  };

  return {
    courses,
    pagination,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    updateCourseStatus,
    deleteCourse
  };
};
