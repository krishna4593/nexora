import { NavLink } from 'react-router';

const navItems = [
  { name: 'Dashboard', path: '/college', icon: 'dashboard' },
  { name: 'Students', path: '/college/students', icon: 'school' },
  { name: 'Faculty', path: '/college/faculty', icon: 'badge' },
  { name: 'Departments', path: '/college/departments', icon: 'domain' },
  { name: 'Courses', path: '/college/courses', icon: 'menu_book' },
  { name: 'Attendance', path: '/college/attendance', icon: 'rule' },
  { name: 'Notices', path: '/college/notices', icon: 'campaign' },
];

const CollegeSidebar = ({ organization, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-surface-container-lowest/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface-container-lowest border-r border-outline-variant/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-72 lg:flex-shrink-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary text-on-primary flex items-center justify-center rounded-lg shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-sm font-bold text-primary tracking-tight leading-tight">Aegis Intelligence</span>
              <span className="font-label-sm text-[9px] text-outline tracking-widest uppercase">COLLEGE ERP</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Organization Info */}
        {organization && (
          <div className="px-6 py-5 border-b border-outline-variant/30 bg-surface-container-low/30">
            <div className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Active Workspace</div>
            <div className="font-headline-md text-base text-on-surface font-semibold truncate" title={organization.name}>
              {organization.name}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if(window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive && item.path === '/college' ? 'bg-primary-container/20 text-primary border border-primary/20' : 
                  isActive && item.path !== '/college' ? 'bg-surface-container text-primary border border-outline-variant/30' :
                  'text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-transparent'
                }`
              }
              end={item.path === '/college'}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-outline-variant/30 text-center">
          <div className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider opacity-70">
            Enterprise System V1.0.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default CollegeSidebar;
