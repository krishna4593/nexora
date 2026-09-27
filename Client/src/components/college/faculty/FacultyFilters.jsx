import { useState, useEffect } from 'react';

const FacultyFilters = ({ departments, onSearch, onDepartmentChange, onDesignationChange, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [department, setDepartment] = useState('all');
  const [designation, setDesignation] = useState('all');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  const handleDepartmentChange = (e) => {
    const val = e.target.value;
    setDepartment(val);
    onDepartmentChange(val);
  };

  const handleDesignationChange = (e) => {
    const val = e.target.value;
    setDesignation(val);
    onDesignationChange(val);
  };

  const designations = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'HOD',
    'Visiting Faculty',
    'Lab Assistant'
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm mb-6">
      
      <div className="relative w-full xl:max-w-xs shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
          <span className="material-symbols-outlined text-[18px]">search</span>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search faculty..."
          className="w-full pl-10 pr-4 py-2 bg-surface-container/50 border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
        <select
          value={department}
          onChange={handleDepartmentChange}
          className="px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all max-w-[180px] sm:max-w-[200px]"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept._id} value={dept._id}>{dept.name} ({dept.code})</option>
          ))}
        </select>

        <select
          value={designation}
          onChange={handleDesignationChange}
          className="px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
        >
          <option value="all">All Designations</option>
          {designations.map(desig => (
            <option key={desig} value={desig}>{desig}</option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 p-1 bg-surface-container border border-outline-variant/50 rounded-lg shrink-0">
          <button
            onClick={() => handleStatusChange('all')}
            className={`px-3 py-1 rounded-md text-xs font-label-md font-semibold transition-colors ${status === 'all' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusChange('active')}
            className={`px-3 py-1 rounded-md text-xs font-label-md font-semibold transition-colors ${status === 'active' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Active
          </button>
          <button
            onClick={() => handleStatusChange('inactive')}
            className={`px-3 py-1 rounded-md text-xs font-label-md font-semibold transition-colors ${status === 'inactive' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Inactive
          </button>
        </div>
      </div>

    </div>
  );
};

export default FacultyFilters;
