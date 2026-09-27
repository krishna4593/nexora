
const StudentStatusBadge = ({ isActive }) => {
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

const StudentTable = ({ students, onEdit, onToggleStatus, onDelete }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block w-full overflow-x-auto bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">ID & Adm No.</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider text-center">Sem</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Ac Year</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-surface-container/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                      {getInitials(student.firstName, student.lastName)}
                    </div>
                    <div>
                      <div className="text-sm font-headline-sm font-semibold text-on-surface">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-xs text-on-surface-variant mt-0.5">
                        {student.email || student.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-mono font-medium text-on-surface">{student.studentId}</div>
                  <div className="text-[11px] font-mono text-on-surface-variant mt-0.5 tracking-wide">{student.admissionNumber}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-body-sm text-on-surface truncate max-w-[150px]" title={student.department?.name}>
                    {student.department?.name || 'Unknown'}
                  </div>
                  {student.department?.code && (
                    <div className="text-xs text-on-surface-variant mt-0.5">{student.department.code}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex w-7 h-7 rounded-md bg-surface-container border border-outline-variant/50 items-center justify-center text-xs font-bold text-on-surface">
                    {student.semester}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-body-sm font-medium text-on-surface">{student.academicYear}</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">Adm: {student.admissionYear}</div>
                </td>
                <td className="px-6 py-4">
                  <StudentStatusBadge isActive={student.isActive} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(student)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      title="Edit Student"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={() => onToggleStatus(student)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      title={student.isActive ? "Deactivate" : "Activate"}
                    >
                      <span className="material-symbols-outlined text-[18px]">{student.isActive ? 'block' : 'check_circle'}</span>
                    </button>
                    <button 
                      onClick={() => onDelete(student)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
                      title="Delete Student"
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
        {students.map((student) => (
          <div key={student._id} className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                  {getInitials(student.firstName, student.lastName)}
                </div>
                <div>
                  <h4 className="text-base font-headline-sm font-bold text-on-surface leading-tight">
                    {student.firstName} {student.lastName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono font-bold text-on-surface-variant tracking-wide">
                      {student.studentId}
                    </span>
                    <StudentStatusBadge isActive={student.isActive} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Sem & Ac. Yr</div>
                <div className="text-xs font-bold text-on-surface">S{student.semester} • {student.academicYear}</div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Adm Number</div>
                <div className="text-xs font-bold font-mono text-on-surface truncate">{student.admissionNumber}</div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30 col-span-2">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Department</div>
                <div className="text-xs font-medium text-on-surface truncate">{student.department?.name || 'Unknown'}</div>
              </div>
            </div>
            
            <div className="pt-3 mt-1 border-t border-outline-variant/30 flex flex-col sm:flex-row justify-end gap-3">
              <div className="flex items-center justify-end gap-1">
                <button 
                  onClick={() => onEdit(student)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors bg-surface-container/50 border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
                <button 
                  onClick={() => onToggleStatus(student)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors bg-surface-container/50 border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">{student.isActive ? 'block' : 'check_circle'}</span>
                </button>
                <button 
                  onClick={() => onDelete(student)}
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

export default StudentTable;
