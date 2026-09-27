import { useEffect, useState, useCallback } from 'react';
import { useNotices } from '../../hooks/useNotices';
import NoticeFilters from '../../components/college/notices/NoticeFilters';
import NoticeTable from '../../components/college/notices/NoticeTable';
import NoticeEmptyState from '../../components/college/notices/NoticeEmptyState';
import NoticeForm from '../../components/college/notices/NoticeForm';
import NoticeDeleteDialog from '../../components/college/notices/NoticeDeleteDialog';

const NoticesPage = () => {
  const {
    notices,
    pagination,
    loading,
    error,
    fetchNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    publishNotice,
    unpublishNotice,
    toggleNoticeStatus,
  } = useNotices();

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    category: 'all',
    priority: 'all',
    audience: 'all',
    department: 'all',
    publicationStatus: 'all',
    activeStatus: 'all',
    date: ''
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [deletingNotice, setDeletingNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load notices when query changes
  useEffect(() => {
    fetchNotices(queryParams);
  }, [fetchNotices, queryParams]);

  // Filter handlers
  const handleSearch = useCallback((search) => {
    setQueryParams(p => ({ ...p, search, page: 1 }));
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setQueryParams(p => ({ ...p, category, page: 1 }));
  }, []);

  const handlePriorityChange = useCallback((priority) => {
    setQueryParams(p => ({ ...p, priority, page: 1 }));
  }, []);

  const handleAudienceChange = useCallback((audience) => {
    setQueryParams(p => ({ ...p, audience, page: 1 }));
  }, []);

  const handleDepartmentChange = useCallback((department) => {
    setQueryParams(p => ({ ...p, department, page: 1 }));
  }, []);

  const handlePublicationStatusChange = useCallback((status) => {
    setQueryParams(p => ({ ...p, publicationStatus: status, page: 1 }));
  }, []);

  const handleActiveStatusChange = useCallback((status) => {
    setQueryParams(p => ({ ...p, activeStatus: status, page: 1 }));
  }, []);

  const handleDateChange = useCallback((date) => {
    setQueryParams(p => ({ ...p, date, page: 1 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setQueryParams({
      page: 1,
      limit: 10,
      search: '',
      category: 'all',
      priority: 'all',
      audience: 'all',
      department: 'all',
      publicationStatus: 'all',
      activeStatus: 'all',
      date: ''
    });
  }, []);

  const handlePageChange = (newPage) => {
    setQueryParams(p => ({ ...p, page: newPage }));
  };

  // Form handling
  const handleOpenAddForm = () => {
    setEditingNotice(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (notice) => {
    setEditingNotice(notice);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingNotice(null);
  };

  const handleSubmitForm = async (formData, setError) => {
    setIsSubmitting(true);
    try {
      if (editingNotice) {
        await updateNotice(editingNotice._id, formData);
      } else {
        await createNotice(formData);
      }
      handleCloseForm();
      fetchNotices(queryParams);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (notice) => {
    setDeletingNotice(notice);
  };

  const handleConfirmDelete = async (id) => {
    await deleteNotice(id);
    setDeletingNotice(null);
    if (notices.length === 1 && queryParams.page > 1) {
      setQueryParams(p => ({ ...p, page: p.page - 1 }));
    } else {
      fetchNotices(queryParams);
    }
  };

  const handlePublish = async (id) => {
    await publishNotice(id);
    fetchNotices(queryParams);
  };

  const handleUnpublish = async (id) => {
    await unpublishNotice(id);
    fetchNotices(queryParams);
  };

  const handleToggleStatus = async (id) => {
    await toggleNoticeStatus(id);
    fetchNotices(queryParams);
  };

  const hasActiveFilters = Object.values(queryParams).some(v => v && v !== 'all' && v !== '' && v !== 10);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 rounded bg-surface-container border border-outline-variant/40 text-xs text-primary font-semibold tracking-wide uppercase">
            <span className="material-symbols-outlined text-[14px]">campaign</span>
            <span>College Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface tracking-tight">Notices & Announcements</h1>
          <p className="text-sm font-body-md text-on-surface-variant mt-1 max-w-xl">
            Create, publish and manage official college communications.
          </p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-hover text-on-primary text-sm font-label-md font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Notice
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-error-container/20 border border-error/40 text-on-surface flex items-start gap-3">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5 shrink-0">error</span>
          <div className="flex-1 text-sm">
            <div className="font-semibold text-error text-sm">Unable to load notices</div>
            <div className="text-on-surface-variant mt-0.5">{error}</div>
          </div>
          <button onClick={() => fetchNotices(queryParams)} className="text-sm font-semibold text-primary hover:underline">Retry</button>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-4">
        <NoticeFilters
          query={queryParams}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onPriorityChange={handlePriorityChange}
          onAudienceChange={handleAudienceChange}
          onDepartmentChange={handleDepartmentChange}
          onPublicationStatusChange={handlePublicationStatusChange}
          onActiveStatusChange={handleActiveStatusChange}
          onDateChange={handleDateChange}
          onClear={handleClearFilters}
        />

        {loading && notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary mb-4" />
            <p className="text-sm font-medium text-on-surface-variant">Loading notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <NoticeEmptyState onAddClick={handleOpenAddForm} isFilterEmpty={hasActiveFilters} />
        ) : (
          <>
            <NoticeTable
              notices={notices}
              onEdit={handleOpenEditForm}
              onDelete={handleDelete}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onToggleStatus={handleToggleStatus}
            />
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
                <span className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider">
                  Showing {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} notices
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
        <NoticeForm
          initialData={editingNotice}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseForm}
          isSubmitting={isSubmitting}
        />
      )}

      {deletingNotice && (
        <NoticeDeleteDialog
          notice={deletingNotice}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingNotice(null)}
        />
      )}
    </div>
  );
};

export default NoticesPage;
