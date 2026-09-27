import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

const CollegeTopbar = ({ onMenuClick, title }) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <h1 className="text-lg font-headline-md font-semibold text-on-surface tracking-tight truncate">
          {title || 'College ERP'}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <ThemeToggle />
        
        <div className="flex items-center gap-4 border-l border-outline-variant/30 pl-4 sm:pl-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-on-surface leading-tight">{currentUser?.name}</span>
            <span className="text-[10px] font-mono font-medium text-primary bg-primary-container/20 px-1.5 rounded uppercase tracking-wider mt-0.5">{currentUser?.role}</span>
          </div>
          
          <div className="relative group">
            <button className="w-9 h-9 rounded-full bg-primary-container/30 border border-primary/20 text-primary flex items-center justify-center hover:bg-primary-container/50 transition-colors">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </button>
            
            {/* Simple dropdown menu on hover for desktop (click for mobile usually requires state, but hover is sufficient for simple demonstration) */}
            <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50">
              <div className="p-3 border-b border-outline-variant/30 sm:hidden">
                <p className="text-sm font-semibold text-on-surface truncate">{currentUser?.name}</p>
                <p className="text-xs text-on-surface-variant truncate">{currentUser?.email}</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-error hover:bg-error-container/20 rounded-md transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CollegeTopbar;
