import { useAuth } from '../../hooks/useAuth';
import TopNavBar from '../../components/common/TopNavBar';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <TopNavBar />
      
      <div className="absolute inset-0 mt-[60px] bg-mesh-grid pointer-events-none opacity-40"></div>
      
      <div className="flex-grow p-8 relative z-10">
        <div className="max-w-4xl mx-auto bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant/60 rounded-xl p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 rounded bg-surface-container border border-outline-variant/40 text-xs text-primary font-semibold tracking-wide">
                <span className="material-symbols-outlined text-[14px]">shield_person</span>
                <span>PLATFORM ADMIN</span>
              </div>
              <h1 className="text-2xl font-headline-xl font-bold tracking-tight text-on-surface">Enterprise Intelligence Platform</h1>
            </div>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-surface-container hover:bg-outline-variant/30 text-on-surface rounded-lg text-sm font-label-md font-medium transition-colors border border-outline-variant/50 inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign Out
            </button>
          </div>
          
          <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/50">
            <h2 className="text-xl font-headline-md font-semibold text-primary mb-2">
              Welcome, {currentUser?.name || 'Administrator'}
            </h2>
            <p className="text-on-surface-variant font-body-md mb-6">
              Your organization workspace will be configured next.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="inline-block px-3 py-1.5 rounded bg-surface border border-outline-variant/60 text-xs font-mono text-on-surface-variant">
                IDENTITY: <span className="text-secondary">{currentUser?.email}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary-container/20 border border-primary-container/40 text-xs font-mono text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot"></span>
                ROLE: {currentUser?.role || 'PLATFORM_ADMIN'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
