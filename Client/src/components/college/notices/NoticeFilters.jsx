import { useState, useEffect } from 'react';

const NoticeFilters = ({
  departments = [],
  categories = [],
  audiences = [],
  query,
  onSearch,
  onCategoryChange,
  onPriorityChange,
  onAudienceChange,
  onDepartmentChange,
  onPublicationStatusChange,
  onActiveStatusChange,
  onDateChange,
  onClear
}) => {
  const [searchTerm, setSearchTerm] = useState(query.search || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onClear();
  };

  const hasActiveFilters = Object.values(query).some(v => v && v !== 'all' && v !== '' && v !== 10);

  return (
    <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm mb-6">
      {/* Search */}
      <div className="relative w-full xl:max-w-xs shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
          <span className="material-symbols-outlined text-[18px]">search</span>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search notices..."
          className="w-full pl-10 pr-4 py-2 bg-surface-container/50 border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
        {/* Category */}
        <select
          value={query.category}
          onChange={e => onCategoryChange(e.target.value)}
          className="px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all max-w-[150px]"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {/* Priority */}
        <select
          value={query.priority}
          onChange={e => onPriorityChange(e.target.value)}
          className="px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all max-w-[130px]"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {/* Audience */}
        <select
          value={query.audience}
          onChange={e => onAudienceChange(e.target.value)}
          className="px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all max-w-[150px]"
        >
          <option value="all">All Audiences</option>
          {audiences.map(aud => (
            <option key={aud} value={aud}>{aud}</option>
          ))}
        </select>
        {/* Department */}
        <select
          value={query.department}
          onChange={e => onDepartmentChange(e.target.value)}
          className="px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all max-w-[150px]"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept._id} value={dept._id}>{dept.code}</option>
          ))}
        </select>
        {/* Publication Status */}
        <select
          value={query.publicationStatus}
          onChange={e => onPublicationStatusChange(e.target.value)}
          className="px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all max-w-[150px]"
        >
          <option value="all">All Publish States</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        {/* Active Status */}
        <select
          value={query.activeStatus}
          onChange={e => onActiveStatusChange(e.target.value)}
          className="px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all max-w-[130px]"
        >
          <option value="all">All Activity</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {/* Date */}
        <input
          type="date"
          value={query.date || ''}
          onChange={e => onDateChange(e.target.value)}
          className="px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
        />
        {/* Clear Filters */}
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

export default NoticeFilters;
