import { useState, useEffect } from 'react';

const EnrollmentForm = ({ students, courses, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    academicYear: '2026-27',
    semester: 1
  });
  
  const [error, setError] = useState('');
  
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    // When student changes, filter courses by student's department
    if (formData.student) {
      const selectedStudent = students.find(s => s._id === formData.student);
      if (selectedStudent) {
        const studentDeptId = selectedStudent.department?._id || selectedStudent.department;
        const filteredCourses = courses.filter(c => {
          const courseDeptId = c.department?._id || c.department;
          return courseDeptId === studentDeptId && c.isActive;
        });
        setAvailableCourses(filteredCourses);
        // Reset course if it doesn't belong to new student's dept
        const isCurrentCourseValid = filteredCourses.find(c => c._id === formData.course);
        if (!isCurrentCourseValid) {
          setFormData(prev => ({ ...prev, course: '' }));
        }
      }
    } else {
      setAvailableCourses(courses.filter(c => c.isActive));
    }
  }, [formData.student, students, courses, formData.course]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.student) {
      setError('Student is required');
      return;
    }
    if (!formData.course) {
      setError('Course is required');
      return;
    }
    
    onSubmit(formData, (errorMsg) => {
      setError(errorMsg);
    });
  };

  const activeStudents = students.filter(s => s.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm"
        onClick={!isSubmitting ? onCancel : undefined}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-headline-md font-bold text-on-surface tracking-tight">
            Enroll Student
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

          <form id="enrollment-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <div>
                <label htmlFor="student" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                  Student <span className="text-error">*</span>
                </label>
                <select
                  id="student"
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  required
                >
                  <option value="">Select Student</option>
                  {activeStudents.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.firstName} {student.lastName} ({student.studentId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="course" className="block text-sm font-label-md font-medium text-on-surface mb-1.5">
                  Course <span className="text-error">*</span>
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  disabled={isSubmitting || !formData.student}
                  className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  required
                >
                  <option value="">Select Course</option>
                  {availableCourses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.name} ({course.courseCode}) - {course.credits} Credits
                    </option>
                  ))}
                </select>
                {formData.student && availableCourses.length === 0 && (
                  <p className="mt-1 text-[11px] text-error font-medium">No active courses found for this student's department.</p>
                )}
                {!formData.student && (
                  <p className="mt-1 text-[11px] text-on-surface-variant">Select a student first to see available courses.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    max="8"
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
            form="enrollment-form"
            disabled={isSubmitting || !formData.student || !formData.course}
            className="px-5 py-2 text-sm font-label-md font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                Enrolling...
              </>
            ) : (
              'Enroll Student'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;
