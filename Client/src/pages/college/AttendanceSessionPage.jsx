import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useAttendance } from '../../hooks/useAttendance';

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

const AttendanceSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentSession, 
    records, 
    loading, 
    error, 
    fetchSessionById, 
    fetchSessionRecords, 
    bulkMarkAttendance,
    updateSessionStatus
  } = useAttendance();

  const [localRecords, setLocalRecords] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchSessionById(id);
      fetchSessionRecords(id);
    }
  }, [id, fetchSessionById, fetchSessionRecords]);

  useEffect(() => {
    if (records) {
      setLocalRecords(records.map(r => ({
        ...r,
        status: r.status || 'PRESENT', // Default to PRESENT if uninitialized
        remarks: r.remarks || ''
      })));
    }
  }, [records]);

  const handleStatusChange = (studentId, newStatus) => {
    if (currentSession?.status === 'COMPLETED' || currentSession?.status === 'CANCELLED') return;
    
    setLocalRecords(prev => prev.map(r => 
      r.student._id === studentId ? { ...r, status: newStatus } : r
    ));
  };

  const handleRemarksChange = (studentId, remarks) => {
    if (currentSession?.status === 'COMPLETED' || currentSession?.status === 'CANCELLED') return;
    
    setLocalRecords(prev => prev.map(r => 
      r.student._id === studentId ? { ...r, remarks } : r
    ));
  };

  const markAll = (status) => {
    if (currentSession?.status === 'COMPLETED' || currentSession?.status === 'CANCELLED') return;
    
    setLocalRecords(prev => prev.map(r => ({ ...r, status })));
  };

  const handleSave = async (completeSession = false) => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // 1. Bulk Save
      const payload = localRecords.map(r => ({
        student: r.student._id,
        enrollment: r.enrollment,
        status: r.status,
        remarks: r.remarks
      }));
      
      await bulkMarkAttendance(id, payload);
      
      // 2. Complete Session if requested
      if (completeSession) {
        await updateSessionStatus(id, 'COMPLETED');
        navigate('/college/attendance');
      } else {
        // Just refresh the data
        fetchSessionById(id);
        fetchSessionRecords(id);
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !currentSession) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary mb-4"></div>
        <p className="text-sm font-medium text-on-surface-variant">Loading session details...</p>
      </div>
    );
  }

  if (error && !currentSession) {
    return (
      <div className="p-4 rounded-lg bg-error-container/20 border border-error/40 text-on-surface">
        <div className="font-semibold text-error">Error loading session</div>
        <div className="text-sm text-on-surface-variant mt-1">{error}</div>
        <Link to="/college/attendance" className="text-sm text-primary hover:underline mt-2 inline-block">
          &larr; Back to Attendance
        </Link>
      </div>
    );
  }

  if (!currentSession) return null;

  const isEditable = currentSession.status === 'OPEN';

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/college/attendance" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface tracking-tight">
          Mark Attendance
        </h1>
      </div>

      {saveError && (
        <div className="p-4 rounded-lg bg-error-container/20 border border-error/40 text-on-surface flex items-start gap-3">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5 shrink-0">error</span>
          <div className="flex-1 text-sm">
            <div className="font-semibold text-error text-sm">Failed to save</div>
            <div className="text-on-surface-variant mt-0.5">{saveError}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Session Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-label-md font-bold uppercase tracking-widest text-primary">Session Details</h3>
              <AttendanceStatusBadge status={currentSession.status} />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-[11px] text-on-surface-variant uppercase tracking-wider mb-1">Course</div>
                <div className="text-sm font-bold text-on-surface">{currentSession.course?.name}</div>
                <div className="text-xs font-mono text-on-surface-variant">{currentSession.course?.courseCode}</div>
              </div>
              
              <div>
                <div className="text-[11px] text-on-surface-variant uppercase tracking-wider mb-1">Faculty</div>
                <div className="text-sm font-bold text-on-surface">{currentSession.faculty?.firstName} {currentSession.faculty?.lastName}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] text-on-surface-variant uppercase tracking-wider mb-1">Date</div>
                  <div className="text-sm font-bold text-on-surface">{new Date(currentSession.date).toLocaleDateString('en-GB')}</div>
                </div>
                <div>
                  <div className="text-[11px] text-on-surface-variant uppercase tracking-wider mb-1">Time</div>
                  <div className="text-sm font-bold text-on-surface">{currentSession.startTime} {currentSession.endTime ? `- ${currentSession.endTime}` : ''}</div>
                </div>
              </div>

              {currentSession.topic && (
                <div>
                  <div className="text-[11px] text-on-surface-variant uppercase tracking-wider mb-1">Topic</div>
                  <div className="text-sm font-medium text-on-surface">{currentSession.topic}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-label-md font-bold uppercase tracking-widest text-primary mb-4">Summary</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface-container-low rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-on-surface">{currentSession.summary?.totalStudents || 0}</div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Total Enrolled</div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary">{currentSession.summary?.attendancePercentage?.toFixed(1) || '0.0'}%</div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Attendance</div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 rounded hover:bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-on-surface-variant">Present</span>
                </div>
                <span className="font-bold text-on-surface">{currentSession.summary?.present || 0}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded hover:bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-error"></div>
                  <span className="text-on-surface-variant">Absent</span>
                </div>
                <span className="font-bold text-on-surface">{currentSession.summary?.absent || 0}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded hover:bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                  <span className="text-on-surface-variant">Late</span>
                </div>
                <span className="font-bold text-on-surface">{currentSession.summary?.late || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Attendance Sheet */}
        <div className="lg:col-span-2">
          
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low/30">
              <h2 className="text-lg font-headline-md font-bold text-on-surface">Attendance Sheet</h2>
              
              {isEditable && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => markAll('PRESENT')}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-label-md font-semibold text-primary bg-primary-container/20 hover:bg-primary-container border border-primary/20 rounded-md transition-colors"
                  >
                    Mark All Present
                  </button>
                  <button 
                    onClick={() => markAll('ABSENT')}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-label-md font-semibold text-error bg-error-container/20 hover:bg-error-container border border-error/20 rounded-md transition-colors"
                  >
                    Mark All Absent
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto flex-1">
              {localRecords.length === 0 ? (
                <div className="p-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">group_off</span>
                  <p className="text-sm font-medium">This course has no active enrolled students.</p>
                  <p className="text-xs mt-1">The attendance session cannot be marked until eligible students exist.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
                      <th className="px-4 py-3 text-[11px] font-label-md font-bold text-on-surface-variant uppercase tracking-wider w-1/2">Student</th>
                      <th className="px-4 py-3 text-[11px] font-label-md font-bold text-on-surface-variant uppercase tracking-wider w-1/4">Status</th>
                      <th className="px-4 py-3 text-[11px] font-label-md font-bold text-on-surface-variant uppercase tracking-wider w-1/4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {localRecords.map(record => (
                      <tr key={record.student._id} className="hover:bg-surface-container/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="text-sm font-headline-sm font-semibold text-on-surface">
                            {record.student.firstName} {record.student.lastName}
                          </div>
                          <div className="text-xs font-mono text-on-surface-variant mt-0.5">
                            {record.student.studentId}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {isEditable ? (
                            <select
                              value={record.status}
                              onChange={(e) => handleStatusChange(record.student._id, e.target.value)}
                              className={`w-full px-2.5 py-1.5 rounded-md text-xs font-bold border focus:outline-none focus:ring-1 transition-colors ${
                                record.status === 'PRESENT' ? 'bg-success/10 text-success border-success/30 focus:border-success focus:ring-success' :
                                record.status === 'ABSENT' ? 'bg-error-container/20 text-error border-error/30 focus:border-error focus:ring-error' :
                                record.status === 'LATE' ? 'bg-tertiary-container/30 text-tertiary border-tertiary/30 focus:border-tertiary focus:ring-tertiary' :
                                'bg-surface-container border-outline-variant/50 text-on-surface-variant focus:border-primary focus:ring-primary'
                              }`}
                            >
                              <option value="PRESENT">Present</option>
                              <option value="ABSENT">Absent</option>
                              <option value="LATE">Late</option>
                              <option value="EXCUSED">Excused</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                              record.status === 'PRESENT' ? 'text-success bg-success/10' :
                              record.status === 'ABSENT' ? 'text-error bg-error-container/20' :
                              record.status === 'LATE' ? 'text-tertiary bg-tertiary-container/30' :
                              'text-on-surface-variant bg-surface-container'
                            }`}>
                              {record.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditable ? (
                            <input
                              type="text"
                              value={record.remarks}
                              onChange={(e) => handleRemarksChange(record.student._id, e.target.value)}
                              placeholder="Optional remarks..."
                              className="w-full px-2.5 py-1.5 bg-surface-container border border-outline-variant/50 rounded-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs transition-all"
                            />
                          ) : (
                            <span className="text-xs text-on-surface-variant truncate block w-full max-w-[120px]" title={record.remarks}>
                              {record.remarks || '-'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {isEditable && localRecords.length > 0 && (
              <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low flex flex-col sm:flex-row justify-end gap-3 shrink-0">
                <button
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-label-md font-medium text-primary bg-primary-container/20 hover:bg-primary-container border border-primary/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Progress'}
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  className="px-5 py-2 text-sm font-label-md font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? (
                    <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">done_all</span>
                  )}
                  Save & Complete Session
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AttendanceSessionPage;
