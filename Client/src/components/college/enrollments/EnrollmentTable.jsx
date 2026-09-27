
const EnrollmentStatusBadge = ({ status }) => {
  const styles = {
    ENROLLED: 'bg-success/10 text-success border-success/20',
    COMPLETED: 'bg-primary-container/50 text-primary border-primary/20',
    DROPPED: 'bg-error-container/20 text-error border-error/20'
  };

  const style = styles[status] || styles.ENROLLED;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-label-md font-bold tracking-widest uppercase border ${style}`}>
      {status === 'ENROLLED' && <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot"></span>}
      {status}
    </span>
  );
};

const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '?';
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

const EnrollmentTable = ({ enrollments, onUpdateStatus, onDelete }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block w-full overflow-x-auto bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Course</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider text-center">Sem</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Ac Year</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {enrollments.map((enrollment) => (
              <tr key={enrollment._id} className="hover:bg-surface-container/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                      {getInitials(enrollment.student?.firstName, enrollment.student?.lastName)}
                    </div>
                    <div>
                      <div className="text-sm font-headline-sm font-semibold text-on-surface">
                        {enrollment.student?.firstName} {enrollment.student?.lastName}
                      </div>
                      <div className="text-xs font-mono text-on-surface-variant mt-0.5">
                        {enrollment.student?.studentId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-headline-sm font-semibold text-on-surface line-clamp-1" title={enrollment.course?.name}>
                    {enrollment.course?.name}
                  </div>
                  <div className="text-[11px] font-mono text-on-surface-variant mt-0.5 tracking-wide">
                    {enrollment.course?.courseCode}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-body-sm text-on-surface truncate max-w-[120px]" title={enrollment.course?.department?.name}>
                    {enrollment.course?.department?.name || 'Unknown'}
                  </div>
                  {enrollment.course?.department?.code && (
                    <div className="text-xs text-on-surface-variant mt-0.5">{enrollment.course.department.code}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex w-7 h-7 rounded-md bg-surface-container border border-outline-variant/50 items-center justify-center text-xs font-bold text-on-surface">
                    {enrollment.semester}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-body-sm font-medium text-on-surface">{enrollment.academicYear}</div>
                </td>
                <td className="px-6 py-4">
                  <EnrollmentStatusBadge status={enrollment.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {enrollment.status === 'ENROLLED' && (
                      <>
                        <button 
                          onClick={() => onUpdateStatus(enrollment, 'COMPLETED')}
                          className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                          title="Mark Completed"
                        >
                          <span className="material-symbols-outlined text-[18px]">done_all</span>
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(enrollment, 'DROPPED')}
                          className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
                          title="Drop Course"
                        >
                          <span className="material-symbols-outlined text-[18px]">disabled_by_default</span>
                        </button>
                      </>
                    )}
                    {enrollment.status === 'DROPPED' && (
                      <button 
                        onClick={() => onUpdateStatus(enrollment, 'ENROLLED')}
                        className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-success hover:bg-success/10 transition-colors"
                        title="Re-enroll"
                      >
                        <span className="material-symbols-outlined text-[18px]">settings_backup_restore</span>
                      </button>
                    )}
                    <button 
                      onClick={() => onDelete(enrollment)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
                      title="Delete Enrollment (Permanent)"
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
        {enrollments.map((enrollment) => (
          <div key={enrollment._id} className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                  {getInitials(enrollment.student?.firstName, enrollment.student?.lastName)}
                </div>
                <div>
                  <h4 className="text-base font-headline-sm font-bold text-on-surface leading-tight">
                    {enrollment.student?.firstName} {enrollment.student?.lastName}
                  </h4>
                  <div className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                    {enrollment.student?.studentId}
                  </div>
                </div>
              </div>
              <EnrollmentStatusBadge status={enrollment.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30 col-span-2">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Course</div>
                <div className="text-xs font-bold text-on-surface">{enrollment.course?.name} <span className="font-mono font-medium text-on-surface-variant ml-1">({enrollment.course?.courseCode})</span></div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Semester</div>
                <div className="text-xs font-bold text-on-surface">Sem {enrollment.semester}</div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Academic Year</div>
                <div className="text-xs font-bold text-on-surface">{enrollment.academicYear}</div>
              </div>
            </div>
            
            <div className="pt-3 mt-1 border-t border-outline-variant/30 flex flex-col sm:flex-row justify-end gap-3">
              <div className="flex items-center justify-end gap-1">
                {enrollment.status === 'ENROLLED' && (
                  <>
                    <button 
                      onClick={() => onUpdateStatus(enrollment, 'COMPLETED')}
                      className="flex-1 sm:flex-none px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:bg-surface-container transition-colors bg-surface-container/50 border border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined text-[16px]">done_all</span>
                      <span>Complete</span>
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(enrollment, 'DROPPED')}
                      className="flex-1 sm:flex-none px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 text-xs font-bold text-error hover:bg-error-container/20 transition-colors bg-error-container/10 border border-error/20"
                    >
                      <span className="material-symbols-outlined text-[16px]">disabled_by_default</span>
                      <span>Drop</span>
                    </button>
                  </>
                )}
                {enrollment.status === 'DROPPED' && (
                  <button 
                    onClick={() => onUpdateStatus(enrollment, 'ENROLLED')}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 text-xs font-bold text-success hover:bg-success/10 transition-colors bg-success/10 border border-success/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">settings_backup_restore</span>
                    <span>Re-enroll</span>
                  </button>
                )}
                <button 
                  onClick={() => onDelete(enrollment)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-error hover:bg-error-container/20 transition-colors bg-error-container/10 border border-error/20 sm:ml-2"
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

export default EnrollmentTable;
