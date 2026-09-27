import { useState, useEffect } from 'react';

const FacultyForm = ({ initialData, departments, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    designation: '',
    qualification: '',
    joiningDate: ''
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        employeeId: initialData.employeeId || '',
        department: initialData.department?._id || initialData.department || '',
        designation: initialData.designation || '',
        qualification: initialData.qualification || '',
        joiningDate: initialData.joiningDate ? new Date(initialData.joiningDate).toISOString().split('T')[0] : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'employeeId' ? value.toUpperCase() : value
    }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.department) {
      setError('Department is required');
      return;
    }
    onSubmit(formData, (errorMsg) => {
      setError(errorMsg);
    });
  };

  const activeDepartments = departments.filter(d => d.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm"
        onClick={!isSubmitting ? onCancel : undefined}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-headline-md font-bold text-on-surface tracking-tight">
            {initialData ? 'Edit Faculty Member' : 'Add Faculty Member'}
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

          <form id="faculty-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Information */}
            <div>
              <h3 className="text-xs font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    First Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Last Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Email <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Phone <span className="text-error">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-xs font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                Professional Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Employee ID <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    disabled={isSubmitting || !!initialData}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all uppercase disabled:opacity-60"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Department <span className="text-error">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  >
                    <option value="">Select Department</option>
                    {activeDepartments.map(dept => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                    {/* Add current department if it is inactive to allow editing other fields without forcing change */}
                    {initialData?.department && !activeDepartments.find(d => d._id === (initialData.department._id || initialData.department)) && (
                      <option value={initialData.department._id || initialData.department}>
                        {initialData.department.name || 'Current Department'} ({initialData.department.code || 'Inactive'})
                      </option>
                    )}
                  </select>
                  {activeDepartments.length === 0 && !initialData && (
                    <p className="mt-1 text-[11px] text-error font-medium">No active departments found. Please create one first.</p>
                  )}
                </div>
                <div>
                  <label htmlFor="designation" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Designation <span className="text-error">*</span>
                  </label>
                  <select
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  >
                    <option value="">Select Designation</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="HOD">Head of Department (HOD)</option>
                    <option value="Visiting Faculty">Visiting Faculty</option>
                    <option value="Lab Assistant">Lab Assistant</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="qualification" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Qualification <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="e.g. PhD, M.Tech"
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="joiningDate" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Joining Date <span className="text-error">*</span>
                  </label>
                  <input
                    type="date"
                    id="joiningDate"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
              </div>
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
            form="faculty-form"
            disabled={isSubmitting || (activeDepartments.length === 0 && !initialData)}
            className="px-5 py-2 text-sm font-label-md font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              initialData ? 'Update Faculty' : 'Create Faculty'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyForm;
