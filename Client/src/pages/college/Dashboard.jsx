import { useOutletContext, Link } from 'react-router';
import RecentNotices from '../../components/college/notices/RecentNotices';
import { useAuth } from '../../hooks/useAuth';

const erpModules = [
  { id: 'students', name: 'Students', path: '/college/students', icon: 'school', description: 'Manage student records and profiles' },
  { id: 'enrollments', name: 'Enrollments', path: '/college/enrollments', icon: 'how_to_reg', description: 'Manage student course registrations' },
  { id: 'faculty', name: 'Faculty', path: '/college/faculty', icon: 'badge', description: 'Manage staff and faculty details' },
  { id: 'departments', name: 'Departments', path: '/college/departments', icon: 'domain', description: 'Department and program configuration' },
  { id: 'courses', name: 'Courses', path: '/college/courses', icon: 'menu_book', description: 'Course catalogs and assignments' },
  { id: 'attendance', name: 'Attendance', path: '/college/attendance', icon: 'rule', description: 'Track and monitor daily attendance' },
  { id: 'notices', name: 'Notices', path: '/college/notices', icon: 'campaign', description: 'Publish announcements and circulars' },
];

const capabilityDetails = {
  'ERP': { name: 'Core ERP', icon: 'sync_alt', description: 'Base college administration modules' },
  'RAG': { name: 'AI Assistant', icon: 'neurology', description: 'Knowledge base AI integration' },
  'QUEUE': { name: 'Queue Management', icon: 'queue', description: 'Digital waiting line system' },
  'CAMERA': { name: 'Camera Intel', icon: 'visibility', description: 'AI visual monitoring' },
  'SCHEDULING': { name: 'Smart Scheduling', icon: 'calendar_month', description: 'Automated timetable generation' },
  'ANALYTICS': { name: 'Analytics', icon: 'analytics', description: 'Advanced reporting and insights' }
};

const Dashboard = () => {
  const { organization } = useOutletContext();
  const { currentUser } = useAuth();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Welcome Banner */}
      <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-outline-variant/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface mb-2 tracking-tight">
            Welcome back, {currentUser?.name.split(' ')[0]}
          </h2>
          <p className="text-on-surface-variant font-body-md max-w-2xl">
            Manage your college operations, capabilities, and settings from one centralized workspace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Organization Overview */}
          <section>
            <h3 className="text-sm font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
              Organization Overview
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 shadow-sm">
                <div className="text-xs text-on-surface-variant font-label-sm uppercase tracking-wider mb-1">College Name</div>
                <div className="font-headline-md text-lg text-on-surface font-semibold truncate" title={organization.name}>
                  {organization.name}
                </div>
              </div>
              
              <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 shadow-sm">
                <div className="text-xs text-on-surface-variant font-label-sm uppercase tracking-wider mb-1">Type</div>
                <div className="font-mono text-sm text-secondary bg-secondary-container/20 px-2 py-0.5 rounded inline-flex border border-secondary/20">
                  {organization.type}
                </div>
              </div>
              
              <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 shadow-sm">
                <div className="text-xs text-on-surface-variant font-label-sm uppercase tracking-wider mb-1">Status</div>
                <div className="inline-flex items-center gap-1.5 font-label-md text-sm text-success bg-success/10 px-2.5 py-1 rounded border border-success/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot"></span>
                  {organization.isActive ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>
              
              <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 shadow-sm">
                <div className="text-xs text-on-surface-variant font-label-sm uppercase tracking-wider mb-1">Referral Code</div>
                <div className="font-mono text-base font-bold text-primary tracking-widest">
                  {organization.referralCode}
                </div>
              </div>
            </div>
          </section>

          {/* ERP Modules */}
          <section className="pt-4">
            <h3 className="text-sm font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">apps</span>
              College ERP Modules
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {erpModules.map((module) => {
                const isActiveModule = module.id === 'departments' || module.id === 'faculty' || module.id === 'courses' || module.id === 'students' || module.id === 'enrollments' || module.id === 'attendance';
                
                return (
                  <Link 
                    key={module.id} 
                    to={module.path}
                    className={`group border rounded-xl p-5 transition-all shadow-sm flex flex-col justify-between min-h-[120px] ${isActiveModule ? 'bg-surface-container-lowest border-primary/40 hover:border-primary/80 hover:bg-surface-container-low/80' : 'bg-surface-container-lowest border-outline-variant/50 hover:border-primary/50 hover:bg-surface-container-low/50'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isActiveModule ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface group-hover:bg-primary group-hover:text-on-primary'}`}>
                        <span className="material-symbols-outlined">{module.icon}</span>
                      </div>
                      {isActiveModule ? (
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-success/10 text-success border border-success/20">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{module.name}</h4>
                      <p className="text-xs font-body-sm text-on-surface-variant mt-1 line-clamp-1">{module.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
          <RecentNotices organization={organization} />
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <section>
            <h3 className="text-sm font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              Quick Actions
            </h3>
            
            <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm overflow-hidden">
              <div className="flex flex-col divide-y divide-outline-variant/30">
                {erpModules.slice(0, 4).map(action => (
                  <Link 
                    key={`qa-${action.id}`} 
                    to={action.path}
                    className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors group"
                  >
                    <div className="flex items-center gap-3 text-on-surface-variant group-hover:text-on-surface">
                      <span className="material-symbols-outlined text-[18px]">{action.icon}</span>
                      <span className="font-label-md text-sm font-medium">{action.name}</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Enabled Capabilities */}
          <section className="pt-2">
            <h3 className="text-sm font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">extension</span>
              Enabled Capabilities
            </h3>
            
            <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm p-2 flex flex-col gap-2">
              {organization.enabledFeatures.map(featureKey => {
                const details = capabilityDetails[featureKey] || { name: featureKey, icon: 'extension', description: 'Organization capability' };
                const isERP = featureKey === 'ERP';
                
                return (
                  <div key={featureKey} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low/50 hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant/30">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${isERP ? 'bg-primary-container/20 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-[18px]">{details.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-label-md text-sm font-semibold text-on-surface truncate">{details.name}</span>
                        <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded ${isERP ? 'bg-success/10 text-success' : 'bg-surface-variant text-on-surface-variant'}`}>
                          {isERP ? 'ACTIVE' : 'CONFIGURED'}
                        </span>
                      </div>
                      <p className="text-[11px] font-body-sm text-on-surface-variant truncate">{details.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
