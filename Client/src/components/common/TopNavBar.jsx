import { Link } from 'react-router';
import ThemeToggle from './ThemeToggle';

const TopNavBar = ({ hideLinks = false }) => {
  return (
    <header className="w-full sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant shadow-sm transition-all duration-150 ease-in-out">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary text-on-primary flex items-center justify-center rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-[22px]">shield</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md tracking-tight font-bold text-primary leading-tight">Aegis Intelligence</span>
            <span className="font-label-sm text-[10px] text-outline tracking-wider uppercase">Enterprise Systems</span>
          </div>
        </Link>

        {!hideLinks && (
          <nav className="hidden md:flex items-center gap-8">
            <a href="#platform" className="text-on-surface-variant hover:text-primary font-label-md transition-colors">Platform</a>
            <a href="#capabilities" className="text-on-surface-variant hover:text-primary font-label-md transition-colors">Capabilities</a>
            <a href="#organizations" className="text-on-surface-variant hover:text-primary font-label-md transition-colors">Organizations</a>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!hideLinks && (
            <>
              <Link to="/login" className="hidden sm:inline-flex items-center px-3.5 py-2 font-label-md text-primary font-medium hover:bg-surface-container rounded-lg border border-outline-variant transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="inline-flex items-center gap-1.5 px-4 py-2 font-label-md font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-lg shadow-sm transition-all">
                <span>Get Started</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
