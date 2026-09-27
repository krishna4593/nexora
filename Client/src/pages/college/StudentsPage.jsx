import { useEffect, useState, useCallback } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { useDepartments } from '../../hooks/useDepartments';
import StudentFilters from '../../components/college/students/StudentFilters';
import StudentTable from '../../components/college/students/StudentTable';
import StudentEmptyState from '../../components/college/students/StudentEmptyState';
import StudentForm from '../../components/college/students/StudentForm';
import StudentDeleteDialog from '../../components/college/students/StudentDeleteDialog';

const StudentsPage = () => {
  const {
    students,
    pagination,
    loading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    updateStudentStatus,
    deleteStudent
  } = useStudents();

  const {
    departments,
    fetchDepartments
  } = useDepartments();

  const [queryParams, setQueryParams] = useState({ 
    page: 1, 
    limit: 10, 
    search: '', 
    status: 'all',
    department: 'all',
    semester: 'all',
    academicYear: 'all',
    admissionYear: 'all'
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments({ limit: 100, status: 'active' });
  }, [fetchDepartments]);

  useEffect(() => {
    fetchStudents(queryParams);
  }, [fetchStudents, queryParams]);

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

  const handleAdmissionYearChange = useCallback((admissionYear) => {
    setQueryParams(prev => ({ ...prev, admissionYear, page: 1 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setQueryParams(prev => ({ 
      ...prev, 
      search: '', 
      status: 'all', 
      department: 'all', 
      semester: 'all', 
      academicYear: 'all', 
      admissionYear: 'all',
      page: 1 
    }));
  }, []);

  const handlePageChange = (newPage) => {
    setQueryParams(prev => ({ ...prev, page: newPage }));
  };

  const handleOpenAddForm = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleSubmitForm = async (formData, setError) => {
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, formData);
      } else {
        await createStudent(formData);
      }
      handleCloseForm();
      fetchStudents(queryParams);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (student) => {
    try {
      await updateStudentStatus(student._id, !student.isActive);
      fetchStudents(queryParams);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleOpenDelete = (student) => {
    setDeletingStudent(student);
  };

  const handleConfirmDelete = async (id) => {
    await deleteStudent(id);
    setDeletingStudent(null);
    
    if (students.length === 1 && queryParams.page > 1) {
      setQueryParams(prev => ({ ...prev, page: prev.page - 1 }));
    } else {
      fetchStudents(queryParams);
    }
  };

  const activeDepartments = departments.filter(d => d.isActive);
  
  const hasActiveFilters = queryParams.search !== '' || 
                           queryParams.status !== 'all' || 
                           queryParams.department !== 'all' || 
                           queryParams.semester !== 'all' || 
                           queryParams.academicYear !== 'all' || 
                           queryParams.admissionYear !== 'all';

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 rounded bg-surface-container border border-outline-variant/40 text-xs text-primary font-semibold tracking-wide uppercase">
            <span className="material-symbols-outlined text-[14px]">school</span>
            <span>Academic Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface tracking-tight">
            Students
          </h1>
          <p className="text-sm font-body-md text-on-surface-variant mt-1 max-w-xl">
            Manage student records, academic information, and enrollment details.
          </p>
        </div>
        
        <button 
          onClick={handleOpenAddForm}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-hover text-on-primary text-sm font-label-md font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add Student
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-error-container/20 border border-error/40 text-on-surface flex items-start gap-3">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5 shrink-0">error</span>
          <div className="flex-1 text-sm">
            <div className="font-semibold text-error text-sm">Unable to load students</div>
            <div className="text-on-surface-variant mt-0.5">{error}</div>
          </div>
          <button onClick={() => fetchStudents(queryParams)} className="text-sm font-semibold text-primary hover:underline">Retry</button>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-4">
        
        <StudentFilters 
          departments={activeDepartments}
          onSearch={handleSearch} 
          onDepartmentChange={handleDepartmentChange}
          onSemesterChange={handleSemesterChange}
          onAcademicYearChange={handleAcademicYearChange}
          onAdmissionYearChange={handleAdmissionYearChange}
          onStatusChange={handleStatusChange} 
          onClearFilters={handleClearFilters}
        />

        {loading && students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary mb-4"></div>
            <p className="text-sm font-medium text-on-surface-variant">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <StudentEmptyState onAddClick={handleOpenAddForm} isFilterEmpty={hasActiveFilters} />
        ) : (
          <>
            <StudentTable 
              students={students} 
              onEdit={handleOpenEditForm}
              onToggleStatus={handleToggleStatus}
              onDelete={handleOpenDelete}
            />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
                <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">
                  Showing {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} students
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
        <StudentForm 
          initialData={editingStudent} 
          departments={activeDepartments}
          onSubmit={handleSubmitForm} 
          onCancel={handleCloseForm} 
          isSubmitting={isSubmitting} 
        />
      )}

      {deletingStudent && (
        <StudentDeleteDialog 
          student={deletingStudent} 
          onConfirm={handleConfirmDelete} 
          onCancel={() => setDeletingStudent(null)} 
        />
      )}
    </div>
  );
};

export default StudentsPage;
