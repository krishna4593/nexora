import { useState, useEffect } from 'react';

const AttendanceSessionForm = ({ courses, facultyList, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    course: '',
    faculty: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    topic: '',
    notes: ''
  });
  
  const [error, setError] = useState('');
  const [availableFaculty, setAvailableFaculty] = useState([]);

  useEffect(() => {
    if (formData.course) {
      const selectedCourse = courses.find(c => c._id === formData.course);
      if (selectedCourse) {
        const courseDeptId = selectedCourse.department?._id || selectedCourse.department;
        const filteredFaculty = facultyList.filter(f => {
          const facultyDeptId = f.department?._id || f.department;
          return facultyDeptId === courseDeptId && f.isActive;
        });
        setAvailableFaculty(filteredFaculty);
        
        const isCurrentFacultyValid = filteredFaculty.find(f => f._id === formData.faculty);
        if (!isCurrentFacultyValid) {
          setFormData(prev => ({ ...prev, faculty: '' }));
        }
      }
    } else {
      setAvailableFaculty([]);
    }
  }, [formData.course, courses, facultyList, formData.faculty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.course || !formData.faculty || !formData.date || !formData.startTime) {
      setError('Please fill all required fields');
      return;
    }
    
    onSubmit(formData, (errorMsg) => {
      setError(errorMsg);
    });
  };

  const activeCourses = courses.filter(c => c.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm"
        onClick={!isSubmitting ? onCancel : undefined}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-headline-md font-bold text-on-surface tracking-tight">
            Create Attendance Session
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

          <form id="session-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <div>
                <label htmlFor="course" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                  Course <span className="text-error">*</span>
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  required
                >
                  <option value="">Select Course</option>
                  {activeCourses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.name} ({course.courseCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="faculty" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                  Faculty <span className="text-error">*</span>
                </label>
                <select
                  id="faculty"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  disabled={isSubmitting || !formData.course}
                  className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  required
                >
                  <option value="">Select Faculty</option>
                  {availableFaculty.map(faculty => (
                    <option key={faculty._id} value={faculty._id}>
                      {faculty.firstName} {faculty.lastName} ({faculty.employeeId})
                    </option>
                  ))}
                </select>
                {formData.course && availableFaculty.length === 0 && (
                  <p className="mt-1 text-[11px] text-error font-medium">No active faculty found for this course's department.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Date <span className="text-error">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="startTime" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    Start Time <span className="text-error">*</span>
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="topic" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                  Topic Covered
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. Binary Trees"
                  className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                />
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
            form="session-form"
            disabled={isSubmitting || !formData.course || !formData.faculty}
            className="px-5 py-2 text-sm font-label-md font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                Creating...
              </>
            ) : (
              'Create Session'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSessionForm;
