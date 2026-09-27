import { useState } from 'react';

const AttendanceFilters = ({ 
  courses, 
  onCourseChange, 
  onDateChange,
  onStatusChange,
  onClearFilters
}) => {
  const [status, setStatus] = useState('all');
  const [course, setCourse] = useState('all');
  const [date, setDate] = useState('');

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  const handleCourseChange = (e) => {
    const val = e.target.value;
    setCourse(val);
    onCourseChange(val);
  };

  const handleDateChange = (e) => {
    const val = e.target.value;
    setDate(val);
    onDateChange(val);
  };

  const handleClear = () => {
    setStatus('all');
    setCourse('all');
    setDate('');
    onClearFilters();
  };

  const hasActiveFilters = status !== 'all' || course !== 'all' || date !== '';

  return (
    <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm mb-6">
      
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
        <select
          value={course}
          onChange={handleCourseChange}
          className="px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all max-w-[200px]"
        >
          <option value="all">All Courses</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>{c.courseCode}</option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
        />

        <div className="flex items-center gap-1.5 p-1 bg-surface-container border border-outline-variant/50 rounded-lg shrink-0">
          <button
            onClick={() => handleStatusChange('all')}
            className={`px-3 py-1 rounded-md text-xs font-label-md font-semibold transition-colors ${status === 'all' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusChange('OPEN')}
            className={`px-3 py-1 rounded-md text-xs font-label-md font-semibold transition-colors ${status === 'OPEN' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Open
          </button>
          <button
            onClick={() => handleStatusChange('COMPLETED')}
            className={`px-3 py-1 rounded-md text-xs font-label-md font-semibold transition-colors ${status === 'COMPLETED' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Completed
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="px-3 py-2 text-xs font-label-md font-semibold text-error hover:bg-error-container/20 rounded-md transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default AttendanceFilters;
