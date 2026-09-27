import { Link } from 'react-router';

const AttendanceStatusBadge = ({ status }) => {
  const styles = {
    OPEN: 'bg-primary-container/50 text-primary border-primary/20',
    COMPLETED: 'bg-success/10 text-success border-success/20',
    CANCELLED: 'bg-error-container/20 text-error border-error/20'
  };

  const style = styles[status] || styles.OPEN;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-label-md font-bold tracking-widest uppercase border ${style}`}>
      {status === 'OPEN' && <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot"></span>}
      {status}
    </span>
  );
};

const AttendanceSessionTable = ({ sessions }) => {
  return (
    <>
      <div className="hidden lg:block w-full overflow-x-auto bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Course</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Faculty</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Topic</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider text-center">Attendance</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-label-md font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {sessions.map((session) => (
              <tr key={session._id} className="hover:bg-surface-container/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="text-sm font-headline-sm font-semibold text-on-surface">
                    {new Date(session.date).toLocaleDateString('en-GB')}
                  </div>
                  <div className="text-xs text-on-surface-variant mt-0.5">
                    {session.startTime} {session.endTime ? `- ${session.endTime}` : ''}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-headline-sm font-semibold text-on-surface line-clamp-1" title={session.course?.name}>
                    {session.course?.name}
                  </div>
                  <div className="text-[11px] font-mono text-on-surface-variant mt-0.5 tracking-wide">
                    {session.course?.courseCode}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-body-sm text-on-surface">
                    {session.faculty?.firstName} {session.faculty?.lastName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-body-sm text-on-surface truncate max-w-[150px]" title={session.topic}>
                    {session.topic || <span className="text-on-surface-variant italic">No topic</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="font-mono text-sm font-bold text-on-surface">{session.attendanceSummary?.attended || 0}</span>
                    <span className="text-on-surface-variant text-xs">/ {session.attendanceSummary?.total || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AttendanceStatusBadge status={session.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    to={`/college/attendance/sessions/${session._id}`}
                    className="px-3 py-1.5 text-xs font-label-md font-semibold text-primary bg-primary-container/20 hover:bg-primary-container border border-primary/20 rounded-md transition-colors"
                  >
                    View & Mark
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="lg:hidden space-y-4">
        {sessions.map((session) => (
          <div key={session._id} className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-headline-sm font-bold text-on-surface leading-tight">
                  {session.course?.name}
                </h4>
                <div className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                  {session.course?.courseCode}
                </div>
              </div>
              <AttendanceStatusBadge status={session.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Date & Time</div>
                <div className="text-xs font-bold text-on-surface">
                  {new Date(session.date).toLocaleDateString('en-GB')}<br/>
                  <span className="font-normal text-on-surface-variant">{session.startTime}</span>
                </div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30">
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Attendance</div>
                <div className="text-xs font-bold text-on-surface mt-1">
                  {session.attendanceSummary?.attended || 0} / {session.attendanceSummary?.total || 0} Present
                </div>
              </div>
            </div>
            
            <div className="pt-3 mt-1 border-t border-outline-variant/30 flex justify-end">
              <Link 
                to={`/college/attendance/sessions/${session._id}`}
                className="px-4 py-2 text-sm font-label-md font-semibold text-primary bg-primary-container/20 hover:bg-primary-container border border-primary/20 rounded-lg transition-colors text-center w-full sm:w-auto"
              >
                View & Mark Attendance
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AttendanceSessionTable;
