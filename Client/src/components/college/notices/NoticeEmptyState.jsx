
const NoticeEmptyState = ({ onAddClick, isFilterEmpty }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="text-6xl text-primary/30">
        <span className="material-symbols-outlined">campaign</span>
      </div>
      <h2 className="text-xl font-semibold text-on-surface">
        {isFilterEmpty ? 'No notices yet' : 'No results found'}
      </h2>
      <p className="text-sm text-on-surface-variant max-w-md text-center">
        {isFilterEmpty ?
          'Create a notice to keep the college community informed.' :
          'Try adjusting or clearing the filters.'
        }
      </p>
      {isFilterEmpty && (
        <button
          onClick={onAddClick}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-on-primary rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Notice
        </button>
      )}
    </div>
  );
};

export default NoticeEmptyState;
