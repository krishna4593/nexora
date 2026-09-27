import { useEffect, useState, useCallback } from 'react';
import { useAttendance } from '../../hooks/useAttendance';
import { useCourses } from '../../hooks/useCourses';
import { useFaculty } from '../../hooks/useFaculty';
import AttendanceFilters from '../../components/college/attendance/AttendanceFilters';
import AttendanceSessionTable from '../../components/college/attendance/AttendanceSessionTable';
import AttendanceSessionForm from '../../components/college/attendance/AttendanceSessionForm';

const AttendancePage = () => {
  const {
    sessions,
    pagination,
    loading,
    error,
    fetchSessions,
    createSession
  } = useAttendance();

  const { courses, fetchCourses } = useCourses();
  const { facultyList, fetchFaculty } = useFaculty();

  const [queryParams, setQueryParams] = useState({ 
    page: 1, 
    limit: 10, 
    status: 'all',
    course: 'all',
    date: ''
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses({ limit: 500, status: 'active' });
    fetchFaculty({ limit: 500, status: 'active' });
  }, [fetchCourses, fetchFaculty]);

  useEffect(() => {
    fetchSessions(queryParams);
  }, [fetchSessions, queryParams]);

  const handleStatusChange = useCallback((status) => {
    setQueryParams(prev => ({ ...prev, status, page: 1 }));
  }, []);

  const handleCourseChange = useCallback((course) => {
    setQueryParams(prev => ({ ...prev, course, page: 1 }));
  }, []);

  const handleDateChange = useCallback((date) => {
    setQueryParams(prev => ({ ...prev, date, page: 1 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setQueryParams(prev => ({ 
      ...prev, 
      status: 'all', 
      course: 'all', 
      date: '', 
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

  const handleSubmitForm = async (formData, setErrorMsg) => {
    setIsSubmitting(true);
    try {
      await createSession(formData);
      handleCloseForm();
      fetchSessions(queryParams);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasActiveFilters = queryParams.status !== 'all' || queryParams.course !== 'all' || queryParams.date !== '';

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 rounded bg-surface-container border border-outline-variant/40 text-xs text-primary font-semibold tracking-wide uppercase">
            <span className="material-symbols-outlined text-[14px]">rule</span>
            <span>Academic Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface tracking-tight">
            Attendance
          </h1>
          <p className="text-sm font-body-md text-on-surface-variant mt-1 max-w-xl">
            Record and monitor student attendance across courses.
          </p>
        </div>
        
        <button 
          onClick={handleOpenAddForm}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-hover text-on-primary text-sm font-label-md font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Create Session
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-error-container/20 border border-error/40 text-on-surface flex items-start gap-3">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5 shrink-0">error</span>
          <div className="flex-1 text-sm">
            <div className="font-semibold text-error text-sm">Unable to load attendance sessions</div>
            <div className="text-on-surface-variant mt-0.5">{error}</div>
          </div>
          <button onClick={() => fetchSessions(queryParams)} className="text-sm font-semibold text-primary hover:underline">Retry</button>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-4">
        
        <AttendanceFilters 
          courses={courses.filter(c => c.isActive)}
          onCourseChange={handleCourseChange}
          onDateChange={handleDateChange}
          onStatusChange={handleStatusChange} 
          onClearFilters={handleClearFilters}
        />

        {loading && sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary mb-4"></div>
            <p className="text-sm font-medium text-on-surface-variant">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-sm text-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-[32px]">event_busy</span>
            </div>
            <h3 className="text-lg font-headline-md font-bold text-on-surface mb-2">No attendance sessions found</h3>
            <p className="text-sm text-on-surface-variant max-w-md mb-6">
              {hasActiveFilters 
                ? "Try adjusting your filters to find what you're looking for."
                : "Create an attendance session to begin tracking attendance."}
            </p>
            {hasActiveFilters ? (
              <button onClick={handleClearFilters} className="px-4 py-2 text-sm font-semibold text-primary bg-primary-container/20 hover:bg-primary-container rounded-lg transition-colors border border-primary/20">
                Clear Filters
              </button>
            ) : (
              <button onClick={handleOpenAddForm} className="px-4 py-2 text-sm font-semibold text-primary bg-primary-container/20 hover:bg-primary-container rounded-lg transition-colors border border-primary/20">
                Create Session
              </button>
            )}
          </div>
        ) : (
          <>
            <AttendanceSessionTable sessions={sessions} />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
                <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">
                  Showing {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} sessions
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
        <AttendanceSessionForm 
          courses={courses}
          facultyList={facultyList}
          onSubmit={handleSubmitForm} 
          onCancel={handleCloseForm} 
          isSubmitting={isSubmitting} 
        />
      )}
    </div>
  );
};

export default AttendancePage;
