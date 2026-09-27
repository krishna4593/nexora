import { useEffect, useState, useCallback } from 'react';
import { useEnrollments } from '../../hooks/useEnrollments';
import { useStudents } from '../../hooks/useStudents';
import { useCourses } from '../../hooks/useCourses';
import { useDepartments } from '../../hooks/useDepartments';
import EnrollmentFilters from '../../components/college/enrollments/EnrollmentFilters';
import EnrollmentTable from '../../components/college/enrollments/EnrollmentTable';
import EnrollmentEmptyState from '../../components/college/enrollments/EnrollmentEmptyState';
import EnrollmentForm from '../../components/college/enrollments/EnrollmentForm';

const EnrollmentsPage = () => {
  const {
    enrollments,
    pagination,
    loading,
    error,
    fetchEnrollments,
    createEnrollment,
    updateEnrollmentStatus,
    deleteEnrollment
  } = useEnrollments();

  const { students, fetchStudents } = useStudents();
  const { courses, fetchCourses } = useCourses();
  const { departments, fetchDepartments } = useDepartments();

  const [queryParams, setQueryParams] = useState({ 
    page: 1, 
    limit: 10, 
    search: '', 
    status: 'all',
    department: 'all',
    semester: 'all',
    academicYear: 'all'
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments({ limit: 100, status: 'active' });
    fetchStudents({ limit: 500, status: 'active' }); // Pre-fetch for the dropdowns
    fetchCourses({ limit: 500, status: 'active' });
  }, [fetchDepartments, fetchStudents, fetchCourses]);

  useEffect(() => {
    fetchEnrollments(queryParams);
  }, [fetchEnrollments, queryParams]);

  const handleSearch = useCallback((search) => {
    setQueryParams(prev => ({ ...prev, search, page: 1 }));
  }, []);

  const handleStatusChange = useCallback((status) => {
    setQueryParams(prev => ({ ...prev, status, page: 1 }));
  }, []);

  const handleDepartmentChange = useCallback((department) => {
    setQueryParams(prev => ({ ...prev, department, page: 1 }));
  }, []);

  const handleSemesterChange = useCallback((semester) => {
    setQueryParams(prev => ({ ...prev, semester, page: 1 }));
  }, []);

  const handleAcademicYearChange = useCallback((academicYear) => {
    setQueryParams(prev => ({ ...prev, academicYear, page: 1 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setQueryParams(prev => ({ 
      ...prev, 
      search: '', 
      status: 'all', 
      department: 'all', 
      semester: 'all', 
      academicYear: 'all', 
      page: 1 
    }));
  }, []);

  const handlePageChange = (newPage) => {
    setQueryParams(prev => ({ ...prev, page: newPage }));
  };

  const handleOpenAddForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmitForm = async (formData, setError) => {
    setIsSubmitting(true);
    try {
      await createEnrollment(formData);
      handleCloseForm();
      fetchEnrollments(queryParams);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (enrollment, status) => {
    try {
      await updateEnrollmentStatus(enrollment._id, status);
      fetchEnrollments(queryParams);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (enrollment) => {
    if (window.confirm('Are you sure you want to permanently delete this enrollment record?')) {
      await deleteEnrollment(enrollment._id);
      
      if (enrollments.length === 1 && queryParams.page > 1) {
        setQueryParams(prev => ({ ...prev, page: prev.page - 1 }));
      } else {
        fetchEnrollments(queryParams);
      }
    }
  };

  const activeDepartments = departments.filter(d => d.isActive);
  
  const hasActiveFilters = queryParams.search !== '' || 
                           queryParams.status !== 'all' || 
                           queryParams.department !== 'all' || 
                           queryParams.semester !== 'all' || 
                           queryParams.academicYear !== 'all';

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 rounded bg-surface-container border border-outline-variant/40 text-xs text-primary font-semibold tracking-wide uppercase">
            <span className="material-symbols-outlined text-[14px]">menu_book</span>
            <span>Academic Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface tracking-tight">
            Course Enrollments
          </h1>
          <p className="text-sm font-body-md text-on-surface-variant mt-1 max-w-xl">
            Manage student course registrations and academic enrollment.
          </p>
        </div>
        
        <button 
          onClick={handleOpenAddForm}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-hover text-on-primary text-sm font-label-md font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Enroll Student
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-error-container/20 border border-error/40 text-on-surface flex items-start gap-3">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5 shrink-0">error</span>
          <div className="flex-1 text-sm">
            <div className="font-semibold text-error text-sm">Unable to load enrollments</div>
            <div className="text-on-surface-variant mt-0.5">{error}</div>
          </div>
          <button onClick={() => fetchEnrollments(queryParams)} className="text-sm font-semibold text-primary hover:underline">Retry</button>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-4">
        
        <EnrollmentFilters 
          departments={activeDepartments}
          onSearch={handleSearch} 
          onDepartmentChange={handleDepartmentChange}
          onSemesterChange={handleSemesterChange}
          onAcademicYearChange={handleAcademicYearChange}
          onStatusChange={handleStatusChange} 
          onClearFilters={handleClearFilters}
        />

        {loading && enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary mb-4"></div>
            <p className="text-sm font-medium text-on-surface-variant">Loading enrollments...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <EnrollmentEmptyState onAddClick={handleOpenAddForm} isFilterEmpty={hasActiveFilters} />
        ) : (
          <>
            <EnrollmentTable 
              enrollments={enrollments} 
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
            />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
                <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">
                  Showing {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} enrollments
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1.5 rounded-md border border-outline-variant/50 text-sm font-medium text-on-surface hover:bg-surface-container disabled:opacity-50 transition-colors flex items-center"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 rounded-md text-sm font-medium bg-surface-container text-on-surface">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1.5 rounded-md border border-outline-variant/50 text-sm font-medium text-on-surface hover:bg-surface-container disabled:opacity-50 transition-colors flex items-center"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {isFormOpen && (
        <EnrollmentForm 
          students={students}
          courses={courses}
          onSubmit={handleSubmitForm} 
          onCancel={handleCloseForm} 
          isSubmitting={isSubmitting} 
        />
      )}
    </div>
  );
};

export default EnrollmentsPage;
