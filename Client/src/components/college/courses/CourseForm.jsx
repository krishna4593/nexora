import { useState, useEffect } from 'react';

const CourseForm = ({ initialData, departments, facultyList, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    name: '',
    description: '',
    department: '',
    credits: 3,
    semester: 1,
    academicYear: '2026-27',
    courseType: 'CORE',
    assignedFaculty: ''
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        courseCode: initialData.courseCode || '',
        name: initialData.name || '',
        description: initialData.description || '',
        department: initialData.department?._id || initialData.department || '',
        credits: initialData.credits || 3,
        semester: initialData.semester || 1,
        academicYear: initialData.academicYear || '2026-27',
        courseType: initialData.courseType || 'CORE',
        assignedFaculty: initialData.assignedFaculty?._id || initialData.assignedFaculty || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: name === 'courseCode' ? value.toUpperCase() : parsedValue
      };
      
      // If department changes, reset assignedFaculty if the previous faculty isn't in this new department
      if (name === 'department') {
        newData.assignedFaculty = '';
      }
      
      return newData;
    });
    
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.department) {
      setError('Department is required');
      return;
    }
    
    // Remove empty assignedFaculty to prevent CastError if it's an empty string
    const submitData = { ...formData };
    if (!submitData.assignedFaculty) {
      delete submitData.assignedFaculty;
    }
    
    onSubmit(submitData, (errorMsg) => {
      setError(errorMsg);
    });
  };

  const activeDepartments = departments.filter(d => d.isActive);
  
  // Only show faculty from the selected department
  const availableFaculty = formData.department 
    ? facultyList.filter(f => f.isActive && (f.department?._id === formData.department || f.department === formData.department))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm"
        onClick={!isSubmitting ? onCancel : undefined}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-headline-md font-bold text-on-surface tracking-tight">
            {initialData ? 'Edit Course' : 'Add Course'}
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

          <form id="course-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Course Information */}
            <div>
              <h3 className="text-xs font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                Course Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Course Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="e.g. Data Structures"
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="courseCode" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Course Code <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="courseCode"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    disabled={isSubmitting || !!initialData}
                    placeholder="e.g. CS301"
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all uppercase disabled:opacity-60"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    rows="3"
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-xs font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                Academic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
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
                  <label htmlFor="courseType" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Course Type <span className="text-error">*</span>
                  </label>
                  <select
                    id="courseType"
                    name="courseType"
                    value={formData.courseType}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  >
                    <option value="CORE">CORE</option>
                    <option value="ELECTIVE">ELECTIVE</option>
                    <option value="LAB">LAB</option>
                    <option value="PROJECT">PROJECT</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="credits" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Credits <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    id="credits"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    min="1"
                    max="10"
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
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
                    max="10"
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
              </div>
            </div>
            
            {/* Faculty Assignment */}
            <div>
              <h3 className="text-xs font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                Faculty Assignment
              </h3>
              <div>
                <label htmlFor="assignedFaculty" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                  Assigned Faculty
                </label>
                <select
                  id="assignedFaculty"
                  name="assignedFaculty"
                  value={formData.assignedFaculty}
                  onChange={handleChange}
                  disabled={isSubmitting || !formData.department}
                  className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                >
                  <option value="">Unassigned</option>
                  {availableFaculty.map(f => (
                    <option key={f._id} value={f._id}>
                      {f.firstName} {f.lastName} ({f.employeeId})
                    </option>
                  ))}
                  {initialData?.assignedFaculty && !availableFaculty.find(f => f._id === (initialData.assignedFaculty._id || initialData.assignedFaculty)) && (
                    <option value={initialData.assignedFaculty._id || initialData.assignedFaculty}>
                      {initialData.assignedFaculty.firstName} {initialData.assignedFaculty.lastName} (Current/Inactive)
                    </option>
                  )}
                </select>
                {!formData.department && (
                  <p className="mt-1 text-[11px] text-on-surface-variant font-medium">Select a department first to see available faculty.</p>
                )}
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
            form="course-form"
            disabled={isSubmitting || (activeDepartments.length === 0 && !initialData)}
            className="px-5 py-2 text-sm font-label-md font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              initialData ? 'Update Course' : 'Create Course'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
