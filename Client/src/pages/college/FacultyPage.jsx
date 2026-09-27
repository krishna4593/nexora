import { useEffect, useState, useCallback } from 'react';
import { useFaculty } from '../../hooks/useFaculty';
import { useDepartments } from '../../hooks/useDepartments';
import FacultyFilters from '../../components/college/faculty/FacultyFilters';
import FacultyTable from '../../components/college/faculty/FacultyTable';
import FacultyEmptyState from '../../components/college/faculty/FacultyEmptyState';
import FacultyForm from '../../components/college/faculty/FacultyForm';
import FacultyDeleteDialog from '../../components/college/faculty/FacultyDeleteDialog';

const FacultyPage = () => {
  const {
    faculty,
    pagination,
    loading,
    error,
    fetchFaculty,
    createFaculty,
    updateFaculty,
    updateFacultyStatus,
    deleteFaculty
  } = useFaculty();

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
    designation: 'all'
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [deletingFaculty, setDeletingFaculty] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch departments without pagination (all active ones) for the dropdowns
    // Realistically you'd have an endpoint or specific query for dropdowns, 
    // but here we just fetch a large limit of active departments
    fetchDepartments({ limit: 100, status: 'active' });
  }, [fetchDepartments]);

  useEffect(() => {
    fetchFaculty(queryParams);
  }, [fetchFaculty, queryParams]);

  const handleSearch = useCallback((search) => {
    setQueryParams(prev => ({ ...prev, search, page: 1 }));
  }, []);

  const handleStatusChange = useCallback((status) => {
    setQueryParams(prev => ({ ...prev, status, page: 1 }));
  }, []);

  const handleDepartmentChange = useCallback((department) => {
    setQueryParams(prev => ({ ...prev, department, page: 1 }));
  }, []);

  const handleDesignationChange = useCallback((designation) => {
    setQueryParams(prev => ({ ...prev, designation, page: 1 }));
  }, []);

  const handlePageChange = (newPage) => {
    setQueryParams(prev => ({ ...prev, page: newPage }));
  };

  const handleOpenAddForm = () => {
    setEditingFaculty(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (member) => {
    setEditingFaculty(member);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingFaculty(null);
  };

  const handleSubmitForm = async (formData, setError) => {
    setIsSubmitting(true);
    try {
      if (editingFaculty) {
        await updateFaculty(editingFaculty._id, formData);
      } else {
        await createFaculty(formData);
      }
      handleCloseForm();
      fetchFaculty(queryParams);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (member) => {
    try {
      await updateFacultyStatus(member._id, !member.isActive);
      fetchFaculty(queryParams);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleOpenDelete = (member) => {
    setDeletingFaculty(member);
  };

  const handleConfirmDelete = async (id) => {
    await deleteFaculty(id);
    setDeletingFaculty(null);
    
    if (faculty.length === 1 && queryParams.page > 1) {
      setQueryParams(prev => ({ ...prev, page: prev.page - 1 }));
    } else {
      fetchFaculty(queryParams);
    }
  };

  const activeDepartments = departments.filter(d => d.isActive);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 rounded bg-surface-container border border-outline-variant/40 text-xs text-primary font-semibold tracking-wide uppercase">
            <span className="material-symbols-outlined text-[14px]">groups</span>
            <span>Academic Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface tracking-tight">
            Faculty
          </h1>
          <p className="text-sm font-body-md text-on-surface-variant mt-1 max-w-xl">
            Manage faculty members, academic staff, and their departmental assignments.
          </p>
        </div>
        
        <button 
          onClick={handleOpenAddForm}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-hover text-on-primary text-sm font-label-md font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add Faculty
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-error-container/20 border border-error/40 text-on-surface flex items-start gap-3">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5 shrink-0">error</span>
          <div className="flex-1 text-sm">
            <div className="font-semibold text-error text-sm">Unable to load faculty</div>
            <div className="text-on-surface-variant mt-0.5">{error}</div>
          </div>
          <button onClick={() => fetchFaculty(queryParams)} className="text-sm font-semibold text-primary hover:underline">Retry</button>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-4">
        
        <FacultyFilters 
          departments={activeDepartments}
          onSearch={handleSearch} 
          onDepartmentChange={handleDepartmentChange}
          onDesignationChange={handleDesignationChange}
          onStatusChange={handleStatusChange} 
        />

        {loading && faculty.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary mb-4"></div>
            <p className="text-sm font-medium text-on-surface-variant">Loading faculty...</p>
          </div>
        ) : faculty.length === 0 ? (
          <FacultyEmptyState onAddClick={handleOpenAddForm} />
        ) : (
          <>
            <FacultyTable 
              faculty={faculty} 
              onEdit={handleOpenEditForm}
              onToggleStatus={handleToggleStatus}
              onDelete={handleOpenDelete}
            />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
                <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">
                  Showing {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} faculty
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
        <FacultyForm 
          initialData={editingFaculty} 
          departments={activeDepartments}
          onSubmit={handleSubmitForm} 
          onCancel={handleCloseForm} 
          isSubmitting={isSubmitting} 
        />
      )}

      {deletingFaculty && (
        <FacultyDeleteDialog 
          faculty={deletingFaculty} 
          onConfirm={handleConfirmDelete} 
          onCancel={() => setDeletingFaculty(null)} 
        />
      )}
    </div>
  );
};

export default FacultyPage;
