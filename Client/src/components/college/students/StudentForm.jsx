import { useState, useEffect } from 'react';

const StudentForm = ({ initialData, departments, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    admissionNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'PREFER_NOT_TO_SAY',
    department: '',
    semester: 1,
    academicYear: '2026-27',
    admissionYear: new Date().getFullYear(),
    guardianName: '',
    guardianPhone: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        admissionNumber: initialData.admissionNumber || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
        gender: initialData.gender || 'PREFER_NOT_TO_SAY',
        department: initialData.department?._id || initialData.department || '',
        semester: initialData.semester || 1,
        academicYear: initialData.academicYear || '2026-27',
        admissionYear: initialData.admissionYear || new Date().getFullYear(),
        guardianName: initialData.guardianName || '',
        guardianPhone: initialData.guardianPhone || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        postalCode: initialData.postalCode || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'admissionNumber' ? value.toUpperCase() : parsedValue
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
      
      <div className="relative w-full max-w-4xl bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-headline-md font-bold text-on-surface tracking-tight">
            {initialData ? 'Edit Student' : 'Add Student'}
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

          <form id="student-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Information */}
            <div>
              <h3 className="text-xs font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                  <label htmlFor="dateOfBirth" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Date of Birth <span className="text-error">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Gender <span className="text-error">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
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

            {/* Academic Information */}
            <div>
              <h3 className="text-xs font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="admissionNumber" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Admission Number <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="admissionNumber"
                    name="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={handleChange}
                    disabled={isSubmitting || !!initialData}
                    placeholder="e.g. ADM-2026-001"
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all uppercase disabled:opacity-60"
                    required
                  />
                </div>
                <div className="md:col-span-2">
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
                  <label htmlFor="semester" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Semester <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    min="1"
                    max="8"
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="academicYear" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Academic Year <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="academicYear"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="e.g. 2026-27"
                    pattern="\d{4}-\d{2}"
                    title="Format must be YYYY-YY (e.g., 2026-27)"
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="admissionYear" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Admission Year <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    id="admissionYear"
                    name="admissionYear"
                    value={formData.admissionYear}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    min="1900"
                    max="2100"
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Guardian Information */}
            <div>
              <h3 className="text-xs font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                Guardian Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="guardianName" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Guardian Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="guardianName"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="guardianPhone" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Guardian Phone <span className="text-error">*</span>
                  </label>
                  <input
                    type="tel"
                    id="guardianPhone"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xs font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
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
            form="student-form"
            disabled={isSubmitting || (activeDepartments.length === 0 && !initialData)}
            className="px-5 py-2 text-sm font-label-md font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              initialData ? 'Update Student' : 'Create Student'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
