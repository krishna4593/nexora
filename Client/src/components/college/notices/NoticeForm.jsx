import { useState, useEffect } from 'react';

const NoticeForm = ({ initialData, departments, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    priority: 'NORMAL',
    audience: 'ALL',
    department: '',
    publishAt: '',
    expiresAt: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        category: initialData.category || 'GENERAL',
        priority: initialData.priority || 'NORMAL',
        audience: initialData.audience || 'ALL',
        department: initialData.department ? initialData.department._id : '',
        publishAt: initialData.publishAt ? new Date(initialData.publishAt).toISOString().slice(0, 16) : '',
        expiresAt: initialData.expiresAt ? new Date(initialData.expiresAt).toISOString().slice(0, 16) : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return setError('Title is required');
    if (!formData.content.trim()) return setError('Content is required');
    if (formData.audience === 'DEPARTMENT' && !formData.department) {
      return setError('Department is required for DEPARTMENT audience');
    }
    // optional date validation
    if (formData.expiresAt && formData.publishAt && new Date(formData.expiresAt) <= new Date(formData.publishAt)) {
      return setError('Expiry must be after publish date');
    }
    const payload = { ...formData };
    if (!payload.publishAt) delete payload.publishAt;
    if (!payload.expiresAt) delete payload.expiresAt;
    if (payload.audience !== 'DEPARTMENT') delete payload.department;
    onSubmit(payload, (msg) => setError(msg));
  };

  const isDeptAudience = formData.audience === 'DEPARTMENT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm" onClick={!isSubmitting ? onCancel : undefined} />
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-headline-md font-bold text-on-surface tracking-tight">
            {initialData ? 'Edit Notice' : 'Create Notice'}
          </h2>
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-label-md font-medium text-on-surface mb-1.5" htmlFor="title">
                Title <span className="text-error">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                required
              />
            </div>
            {/* Content */}
            <div>
              <label className="block text-sm font-label-md font-medium text-on-surface mb-1.5" htmlFor="content">
                Content <span className="text-error">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows={4}
                value={formData.content}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all resize-none"
                required
              />
            </div>
            {/* Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-label-md font-medium text-on-surface mb-1.5" htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                >
                  <option value="GENERAL">General</option>
                  <option value="ACADEMIC">Academic</option>
                  <option value="EXAM">Exam</option>
                  <option value="EVENT">Event</option>
                  <option value="ADMINISTRATIVE">Administrative</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-label-md font-medium text-on-surface mb-1.5" htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="IMPORTANT">Important</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-label-md font-medium text-on-surface mb-1.5" htmlFor="audience">Audience</label>
                <select
                  id="audience"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                >
                  <option value="ALL">All</option>
                  <option value="STUDENTS">Students</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="DEPARTMENT">Department</option>
                </select>
              </div>
              {isDeptAudience && (
                <div>
                  <label className="block text-sm font-label-md font-medium text-on-surface mb-1.5" htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>{dept.name} ({dept.code})</option>
                    ))}
                  </select>
                </div>
              )}
              {/* Publish & Expire dates */}
              <div>
                <label className="block text-sm font-label-md font-medium text-on-surface mb-1.5" htmlFor="publishAt">Publish At</label>
                <input
                  id="publishAt"
                  name="publishAt"
                  type="datetime-local"
                  value={formData.publishAt}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-label-md font-medium text-on-surface mb-1.5" htmlFor="expiresAt">Expires At</label>
                <input
                  id="expiresAt"
                  name="expiresAt"
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onCancel} disabled={isSubmitting} className="px-4 py-2 text-sm font-label-md font-medium text-on-surface hover:bg-surface-container rounded-lg border border-outline-variant/50 disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-label-md font-semibold text-on-primary bg-primary hover:bg-primary-hover rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-70">
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                ) : (initialData ? 'Update Notice' : 'Create Notice')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoticeForm;
