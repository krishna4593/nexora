
const EnrollmentEmptyState = ({ onAddClick, isFilterEmpty }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-outline-variant/60 rounded-xl bg-surface-container-lowest/50">
      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-outline mb-4">
        <span className="material-symbols-outlined text-[32px]">menu_book</span>
      </div>
      <h3 className="text-lg font-headline-md font-semibold text-on-surface mb-2">
        {isFilterEmpty ? 'No enrollments found' : 'No course enrollments yet'}
      </h3>
      <p className="text-sm font-body-md text-on-surface-variant max-w-sm mb-6">
        {isFilterEmpty 
          ? 'No enrollments match your current filter criteria.' 
          : 'Enroll students into courses to begin tracking academic participation.'}
      </p>
      
      {!isFilterEmpty && (
        <button
          onClick={onAddClick}
          className="px-5 py-2.5 text-sm font-label-md font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Enroll Student
        </button>
      )}
    </div>
  );
};

export default EnrollmentEmptyState;
