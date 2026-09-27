import { useState } from 'react';

const FacultyDeleteDialog = ({ faculty, onConfirm, onCancel }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      await onConfirm(faculty._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete faculty member');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm"
        onClick={!isDeleting ? onCancel : undefined}
      ></div>
      
      <div className="relative w-full max-w-sm bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-error-container/20 text-error flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[24px]">person_remove</span>
          </div>
          
          <h3 className="text-lg font-headline-md font-bold text-on-surface mb-2 tracking-tight">
            Delete Faculty Member?
          </h3>
          
          <p className="text-sm font-body-md text-on-surface-variant leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-on-surface">{faculty?.firstName} {faculty?.lastName}</span> ({faculty?.employeeId})? 
            This action cannot be undone.
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-md bg-error-container/20 border border-error/30 text-error text-sm font-medium flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 border-t border-outline-variant/30 bg-surface-container-low flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-label-md font-medium text-on-surface hover:bg-surface-container rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-label-md font-semibold text-on-error bg-error hover:bg-error/90 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-on-error/30 border-t-on-error rounded-full animate-spin"></span>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyDeleteDialog;
