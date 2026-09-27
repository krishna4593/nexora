import { useState, useEffect } from 'react';

const DepartmentForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase() : value
    }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Department Name is required');
      return;
    }
    if (!formData.code.trim()) {
      setError('Department Code is required');
      return;
    }
    onSubmit(formData, (errorMsg) => {
      setError(errorMsg);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm"
        onClick={!isSubmitting ? onCancel : undefined}
      ></div>
      
      <div className="relative w-full max-w-md bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-headline-md font-bold text-on-surface tracking-tight">
            {initialData ? 'Edit Department' : 'Add Department'}
          </h2>
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-error-container/20 border border-error/30 text-error text-sm font-medium flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          <form id="department-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                Department Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g. Computer Science and Engineering"
                className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                Department Code <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g. CSE"
                className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all uppercase"
                required
              />
              <p className="mt-1 text-[11px] text-on-surface-variant">Code must be unique within your organization.</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                Description <span className="text-on-surface-variant font-normal">(Optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Brief description of the department..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all resize-none"
              ></textarea>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-outline-variant/30 bg-surface-container-low flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-label-md font-medium text-on-surface hover:bg-surface-container rounded-lg transition-colors border border-outline-variant/50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="department-form"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-label-md font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              initialData ? 'Update Department' : 'Create Department'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentForm;
