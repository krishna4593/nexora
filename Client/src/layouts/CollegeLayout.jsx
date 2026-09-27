import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import CollegeSidebar from '../components/college/CollegeSidebar';
import CollegeTopbar from '../components/college/CollegeTopbar';
import { useOrganization } from '../hooks/useOrganization';

const pageTitles = {
  '/college': 'Dashboard',
  '/college/students': 'Students',
  '/college/faculty': 'Faculty',
  '/college/departments': 'Departments',
  '/college/courses': 'Courses',
  '/college/attendance': 'Attendance',
  '/college/notices': 'Notices',
};

const CollegeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { organization, loading } = useOrganization();

  if (loading || !organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentTitle = pageTitles[location.pathname] || 'College ERP';

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 z-0 bg-mesh-grid opacity-30 pointer-events-none"></div>
      
      {/* Sidebar */}
      <CollegeSidebar 
        organization={organization} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <CollegeTopbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          title={currentTitle} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet context={{ organization }} />
        </main>
      </div>
    </div>
  );
};

export default CollegeLayout;
