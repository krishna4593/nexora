import { useEffect, useState, useCallback } from 'react';
import { useDepartments } from '../../hooks/useDepartments';
import DepartmentFilters from '../../components/college/departments/DepartmentFilters';
import DepartmentTable from '../../components/college/departments/DepartmentTable';
import DepartmentEmptyState from '../../components/college/departments/DepartmentEmptyState';
import DepartmentForm from '../../components/college/departments/DepartmentForm';
import DepartmentDeleteDialog from '../../components/college/departments/DepartmentDeleteDialog';

const DepartmentsPage = () => {
  const {
    departments,
    pagination,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    updateDepartmentStatus,
    deleteDepartment
  } = useDepartments();

  const [queryParams, setQueryParams] = useState({ page: 1, limit: 10, search: '', status: 'all' });
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deletingDept, setDeletingDept] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments(queryParams);
  }, [fetchDepartments, queryParams]);

  const handleSearch = useCallback((search) => {
    setQueryParams(prev => ({ ...prev, search, page: 1 }));
  }, []);

  const handleStatusChange = useCallback((status) => {
    setQueryParams(prev => ({ ...prev, status, page: 1 }));
  }, []);

  const handlePageChange = (newPage) => {
    setQueryParams(prev => ({ ...prev, page: newPage }));
  };

  const handleOpenAddForm = () => {
    setEditingDept(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (dept) => {
    setEditingDept(dept);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDept(null);
  };

  const handleSubmitForm = async (formData, setError) => {
    setIsSubmitting(true);
    try {
      if (editingDept) {
        await updateDepartment(editingDept._id, formData);
      } else {
        await createDepartment(formData);
      }
      handleCloseForm();
      fetchDepartments(queryParams);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (dept) => {
    try {
      await updateDepartmentStatus(dept._id, !dept.isActive);
      fetchDepartments(queryParams);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleOpenDelete = (dept) => {
    setDeletingDept(dept);
  };

  const handleConfirmDelete = async (id) => {
    await deleteDepartment(id);
    setDeletingDept(null);
    
    // If we deleted the last item on a page > 1, go back one page
    if (departments.length === 1 && queryParams.page > 1) {
      setQueryParams(prev => ({ ...prev, page: prev.page - 1 }));
    } else {
      fetchDepartments(queryParams);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 rounded bg-surface-container border border-outline-variant/40 text-xs text-primary font-semibold tracking-wide uppercase">
            <span className="material-symbols-outlined text-[14px]">domain</span>
            <span>Academic Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface tracking-tight">
            Departments
          </h1>
          <p className="text-sm font-body-md text-on-surface-variant mt-1 max-w-xl">
            Manage academic departments, faculties, and internal divisions across your college.
          </p>
        </div>
        
        <button 
          onClick={handleOpenAddForm}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-hover text-on-primary text-sm font-label-md font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Department
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-error-container/20 border border-error/40 text-on-surface flex items-start gap-3">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5 shrink-0">error</span>
          <div className="flex-1 text-sm">
            <div className="font-semibold text-error text-sm">Unable to load departments</div>
            <div className="text-on-surface-variant mt-0.5">{error}</div>
          </div>
          <button onClick={() => fetchDepartments(queryParams)} className="text-sm font-semibold text-primary hover:underline">Retry</button>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-4">
        
        <DepartmentFilters onSearch={handleSearch} onStatusChange={handleStatusChange} />

        {loading && departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary mb-4"></div>
            <p className="text-sm font-medium text-on-surface-variant">Loading departments...</p>
          </div>
        ) : departments.length === 0 ? (
          <DepartmentEmptyState onAddClick={handleOpenAddForm} />
        ) : (
          <>
            <DepartmentTable 
              departments={departments} 
              onEdit={handleOpenEditForm}
              onToggleStatus={handleToggleStatus}
              onDelete={handleOpenDelete}
            />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
                <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">
                  Showing {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} departments
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
        <DepartmentForm 
          initialData={editingDept} 
          onSubmit={handleSubmitForm} 
          onCancel={handleCloseForm} 
          isSubmitting={isSubmitting} 
        />
      )}

      {deletingDept && (
        <DepartmentDeleteDialog 
          department={deletingDept} 
          onConfirm={handleConfirmDelete} 
          onCancel={() => setDeletingDept(null)} 
        />
      )}
    </div>
  );
};

export default DepartmentsPage;
