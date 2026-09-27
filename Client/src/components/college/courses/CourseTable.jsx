
const CourseStatusBadge = ({ isActive }) => {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-label-md font-bold tracking-widest uppercase bg-success/10 text-success border border-success/20">
        <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot"></span>
        ACTIVE
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-label-md font-bold tracking-widest uppercase bg-surface-variant text-on-surface-variant border border-outline-variant/40">
      INACTIVE
    </span>
  );
};

const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '?';
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

const CourseTable = ({ courses, onEdit, onToggleStatus, onDelete }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block w-full overflow-x-auto bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Course</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider text-center">Semester</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Type / Credits</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Faculty</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {courses.map((course) => (
              <tr key={course._id} className="hover:bg-surface-container/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="text-sm font-headline-sm font-semibold text-on-surface">{course.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-primary-container/30 text-primary border border-primary/20">
                      {course.courseCode}
                    </span>
                    <span className="text-[10px] font-medium text-on-surface-variant">
                      {course.academicYear}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-body-sm text-on-surface truncate max-w-[150px]" title={course.department?.name}>
                    {course.department?.name || 'Unknown'}
                  </div>
                  {course.department?.code && (
                    <div className="text-xs text-on-surface-variant mt-0.5">{course.department.code}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex w-7 h-7 rounded-md bg-surface-container border border-outline-variant/50 items-center justify-center text-xs font-bold text-on-surface">
                    {course.semester}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-body-sm font-medium text-on-surface">{course.courseType}</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">{course.credits} Credits</div>
                </td>
                <td className="px-6 py-4">
                  {course.assignedFaculty ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[9px] shrink-0 border border-primary/20">
                        {getInitials(course.assignedFaculty.firstName, course.assignedFaculty.lastName)}
                      </div>
                      <div className="text-xs font-medium text-on-surface">
                        {course.assignedFaculty.firstName} {course.assignedFaculty.lastName}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs italic text-on-surface-variant">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <CourseStatusBadge isActive={course.isActive} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(course)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      title="Edit Course"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={() => onToggleStatus(course)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      title={course.isActive ? "Deactivate" : "Activate"}
                    >
                      <span className="material-symbols-outlined text-[18px]">{course.isActive ? 'block' : 'check_circle'}</span>
                    </button>
                    <button 
                      onClick={() => onDelete(course)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
                      title="Delete Course"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Card List */}
      <div className="lg:hidden space-y-4">
        {courses.map((course) => (
          <div key={course._id} className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="text-base font-headline-sm font-bold text-on-surface leading-tight">{course.name}</h4>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-primary-container/30 text-primary border border-primary/20">
                    {course.courseCode}
                  </span>
                  <span className="text-[10px] font-medium text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                    {course.academicYear}
                  </span>
                  <CourseStatusBadge isActive={course.isActive} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Sem & Credits</div>
                <div className="text-xs font-bold text-on-surface">S{course.semester} • {course.credits} Cr</div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Type</div>
                <div className="text-xs font-bold text-on-surface">{course.courseType}</div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30 col-span-2">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Department</div>
                <div className="text-xs font-medium text-on-surface truncate">{course.department?.name || 'Unknown'}</div>
              </div>
            </div>
            
            <div className="pt-3 mt-1 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-surface-container-low px-2 py-1.5 rounded-md border border-outline-variant/20">
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">person</span>
                <span className="text-[11px] font-medium text-on-surface">
                  {course.assignedFaculty ? `${course.assignedFaculty.firstName} ${course.assignedFaculty.lastName}` : <span className="italic text-on-surface-variant">Unassigned</span>}
                </span>
              </div>
              
              <div className="flex items-center gap-1 self-end sm:self-auto">
                <button 
                  onClick={() => onEdit(course)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors bg-surface-container/50 border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
                <button 
                  onClick={() => onToggleStatus(course)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors bg-surface-container/50 border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">{course.isActive ? 'block' : 'check_circle'}</span>
                </button>
                <button 
                  onClick={() => onDelete(course)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-error hover:bg-error-container/20 transition-colors bg-error-container/10 border border-error/20"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CourseTable;
