
const CourseEmptyState = ({ onAddClick, isFilterEmpty }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-outline-variant/60 rounded-xl bg-surface-container-lowest/50">
      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-outline mb-4">
        <span className="material-symbols-outlined text-[32px]">menu_book</span>
      </div>
      <h3 className="text-lg font-headline-md font-semibold text-on-surface mb-2">
        {isFilterEmpty ? 'No courses found' : 'No courses yet'}
      </h3>
      <p className="text-sm font-body-md text-on-surface-variant max-w-sm mb-6">
        {isFilterEmpty 
          ? 'No courses match your current filter criteria.' 
          : 'Create your first course to start building the academic structure.'}
      </p>
      
      {!isFilterEmpty && (
        <button
          onClick={onAddClick}
          className="px-5 py-2.5 text-sm font-label-md font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Course
        </button>
      )}
    </div>
  );
};

export default CourseEmptyState;
