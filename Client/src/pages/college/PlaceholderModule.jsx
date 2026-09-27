import { useLocation } from 'react-router';

const pageInfo = {
  '/college/students': { title: 'Students', icon: 'school', description: 'Student management and administration will be available here.' },
  '/college/faculty': { title: 'Faculty', icon: 'badge', description: 'Faculty and staff management will be available here.' },
  '/college/departments': { title: 'Departments', icon: 'domain', description: 'Department configuration and overview will be available here.' },
  '/college/courses': { title: 'Courses', icon: 'menu_book', description: 'Course catalogs, syllabus, and assignments will be available here.' },
  '/college/attendance': { title: 'Attendance', icon: 'rule', description: 'Daily attendance tracking and reporting will be available here.' },
  '/college/notices': { title: 'Notices', icon: 'campaign', description: 'Publishing and managing announcements will be available here.' },
};

const PlaceholderModule = () => {
  const location = useLocation();
  const info = pageInfo[location.pathname] || { title: 'Module', icon: 'extension', description: 'This module is currently under development.' };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center animate-fade-in px-4">
      <div className="w-24 h-24 bg-surface-container-low rounded-full border border-outline-variant/30 flex items-center justify-center text-outline mb-6 relative">
        <div className="absolute inset-0 rounded-full border border-outline-variant/50 animate-ping opacity-20"></div>
        <span className="material-symbols-outlined text-[48px]">{info.icon}</span>
      </div>
      
      <h2 className="text-2xl font-headline-xl font-bold text-on-surface tracking-tight mb-2 text-center">
        {info.title}
      </h2>
      
      <p className="text-on-surface-variant font-body-md text-center max-w-md mb-8">
        {info.description}
      </p>
      
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/50 text-sm font-label-md font-medium text-on-surface-variant uppercase tracking-widest shadow-sm">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        Coming Soon
      </div>
    </div>
  );
};

export default PlaceholderModule;
