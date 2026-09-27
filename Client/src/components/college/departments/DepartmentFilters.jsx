import { useState, useEffect } from 'react';

const DepartmentFilters = ({ onSearch, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');

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

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm mb-6">
      
      <div className="relative w-full sm:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
          <span className="material-symbols-outlined text-[18px]">search</span>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search departments..."
          className="w-full pl-10 pr-4 py-2 bg-surface-container/50 border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
        />
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <button
          onClick={() => handleStatusChange('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-label-md font-semibold transition-colors whitespace-nowrap border ${status === 'all' ? 'bg-primary-container/20 text-primary border-primary/30' : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-transparent hover:border-outline-variant/50'}`}
        >
          All
        </button>
        <button
          onClick={() => handleStatusChange('active')}
          className={`px-4 py-1.5 rounded-full text-xs font-label-md font-semibold transition-colors whitespace-nowrap border ${status === 'active' ? 'bg-primary-container/20 text-primary border-primary/30' : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-transparent hover:border-outline-variant/50'}`}
        >
          Active
        </button>
        <button
          onClick={() => handleStatusChange('inactive')}
          className={`px-4 py-1.5 rounded-full text-xs font-label-md font-semibold transition-colors whitespace-nowrap border ${status === 'inactive' ? 'bg-primary-container/20 text-primary border-primary/30' : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-transparent hover:border-outline-variant/50'}`}
        >
          Inactive
        </button>
      </div>

    </div>
  );
};

export default DepartmentFilters;
