import DepartmentStatusBadge from './DepartmentStatusBadge';

const DepartmentTable = ({ departments, onEdit, onToggleStatus, onDelete }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Code</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {departments.map((dept) => (
              <tr key={dept._id} className="hover:bg-surface-container/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="text-sm font-headline-sm font-semibold text-on-surface">{dept.name}</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">Created {new Date(dept.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-primary-container/20 text-primary border border-primary/20">
                    {dept.code}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-body-sm text-on-surface-variant max-w-xs truncate" title={dept.description}>
                    {dept.description || '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <DepartmentStatusBadge isActive={dept.isActive} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(dept)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      title="Edit Department"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={() => onToggleStatus(dept)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      title={dept.isActive ? "Deactivate" : "Activate"}
                    >
                      <span className="material-symbols-outlined text-[18px]">{dept.isActive ? 'block' : 'check_circle'}</span>
                    </button>
                    <button 
                      onClick={() => onDelete(dept)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
                      title="Delete Department"
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
        {departments.map((dept) => (
          <div key={dept._id} className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-headline-sm font-bold text-on-surface">{dept.name}</h4>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-primary-container/20 text-primary border border-primary/20">
                    {dept.code}
                  </span>
                  <DepartmentStatusBadge isActive={dept.isActive} />
                </div>
              </div>
            </div>
            
            {dept.description && (
              <p className="text-xs font-body-sm text-on-surface-variant line-clamp-2">
                {dept.description}
              </p>
            )}
            
            <div className="pt-3 mt-1 border-t border-outline-variant/30 flex items-center justify-between">
              <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
                {new Date(dept.createdAt).toLocaleDateString()}
              </span>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => onEdit(dept)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors bg-surface-container/50"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
                <button 
                  onClick={() => onToggleStatus(dept)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors bg-surface-container/50"
                >
                  <span className="material-symbols-outlined text-[16px]">{dept.isActive ? 'block' : 'check_circle'}</span>
                </button>
                <button 
                  onClick={() => onDelete(dept)}
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

export default DepartmentTable;
