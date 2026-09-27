
const FacultyStatusBadge = ({ isActive }) => {
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
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

const FacultyTable = ({ faculty, onEdit, onToggleStatus, onDelete }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Faculty</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Employee ID</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Designation</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {faculty.map((member) => (
              <tr key={member._id} className="hover:bg-surface-container/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                      {getInitials(member.firstName, member.lastName)}
                    </div>
                    <div>
                      <div className="text-sm font-headline-sm font-semibold text-on-surface">{member.firstName} {member.lastName}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-surface-variant text-on-surface-variant border border-outline-variant/40">
                    {member.employeeId}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-body-sm text-on-surface truncate max-w-[150px]" title={member.department?.name}>
                    {member.department?.name || 'Unknown'}
                  </div>
                  {member.department?.code && (
                    <div className="text-xs text-on-surface-variant mt-0.5">{member.department.code}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-body-sm text-on-surface">{member.designation}</div>
                </td>
                <td className="px-6 py-4">
                  <FacultyStatusBadge isActive={member.isActive} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(member)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      title="Edit Faculty"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={() => onToggleStatus(member)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      title={member.isActive ? "Deactivate" : "Activate"}
                    >
                      <span className="material-symbols-outlined text-[18px]">{member.isActive ? 'person_off' : 'how_to_reg'}</span>
                    </button>
                    <button 
                      onClick={() => onDelete(member)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
                      title="Delete Faculty"
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

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {faculty.map((member) => (
          <div key={member._id} className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                  {getInitials(member.firstName, member.lastName)}
                </div>
                <div>
                  <h4 className="text-base font-headline-sm font-bold text-on-surface">{member.firstName} {member.lastName}</h4>
                  <div className="text-xs text-on-surface-variant mt-0.5">{member.email}</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Employee ID</div>
                <div className="font-mono text-xs font-bold text-on-surface">{member.employeeId}</div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Status</div>
                <div className="mt-0.5"><FacultyStatusBadge isActive={member.isActive} /></div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30 col-span-2">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Department & Role</div>
                <div className="text-xs font-medium text-on-surface">{member.designation} • {member.department?.name || 'Unknown'}</div>
              </div>
            </div>
            
            <div className="pt-3 mt-1 border-t border-outline-variant/30 flex items-center justify-between">
              <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">call</span>
                {member.phone}
              </span>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => onEdit(member)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors bg-surface-container/50"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
                <button 
                  onClick={() => onToggleStatus(member)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors bg-surface-container/50"
                >
                  <span className="material-symbols-outlined text-[16px]">{member.isActive ? 'person_off' : 'how_to_reg'}</span>
                </button>
                <button 
                  onClick={() => onDelete(member)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-error hover:bg-error-container/20 transition-colors bg-error-container/10 border border-error/10"
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

export default FacultyTable;
