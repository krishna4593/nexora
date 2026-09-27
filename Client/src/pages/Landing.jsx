import { Link } from 'react-router';
import TopNavBar from '../components/common/TopNavBar';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNavBar />
      
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-24 border-b border-outline-variant bg-surface-container-low overflow-hidden">
          <div className="absolute inset-0 bg-mesh-grid pointer-events-none opacity-40"></div>
          <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-surface-container border border-outline-variant">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              <span className="font-label-sm text-xs text-primary font-semibold tracking-wide">
                NEXT-GENERATION INSTITUTIONAL INFRASTRUCTURE
              </span>
            </div>
            
            <h1 className="font-display-lg text-4xl md:text-6xl text-primary tracking-tight font-extrabold mb-6 leading-tight">
              One Intelligent Platform.<br className="hidden sm:block" />Built Around Your Organization.
            </h1>
            
            <p className="font-body-lg text-lg text-on-surface-variant max-w-3xl mx-auto mb-10">
              A unified enterprise operating system designed to configure, automate, and orchestrate administrative workflows across complex academic campuses, multi-site healthcare networks, and global enterprises.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-on-primary font-label-md font-semibold rounded-lg shadow-sm hover:bg-primary-hover transition-all">
                <span>Get Started</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </Link>
              <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-surface text-on-surface font-label-md font-medium border border-outline-variant hover:bg-surface-container rounded-lg transition-all">
                <span className="material-symbols-outlined text-[18px] text-primary">key</span>
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </section>

        {/* PLATFORM CONCEPT */}
        <section id="platform" className="py-24 border-b border-outline-variant bg-surface">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-secondary font-label-md font-semibold tracking-wide uppercase">Unified Architecture</span>
              <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-primary mt-2">
                Adaptive Administrative Workspaces
              </h2>
              <p className="font-body-lg text-lg text-on-surface-variant mt-4">
                Configure sovereign administrative engines within minutes. Select your organization type and capabilities to deploy a custom operational environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['College', 'Hospital', 'Global Enterprise'].map((type, idx) => (
                <div key={idx} className="border border-outline-variant rounded-xl p-8 bg-surface-container-lowest hover:border-primary transition-all">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined text-[26px]">
                      {idx === 0 ? 'school' : idx === 1 ? 'local_hospital' : 'corporate_fare'}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-xl font-bold text-primary mb-3">{type}</h3>
                  <p className="font-body-sm text-on-surface-variant">
                    {idx === 0 && "Orchestrate multi-college registrar records and automated student academic advising pipelines."}
                    {idx === 1 && "Real-time clinical workforce scheduling, algorithmic bed allocation, and emergency triage load balancing."}
                    {idx === 2 && "Federate legacy ERP footprints, deploy sovereign knowledge engines, and enforce granular policies worldwide."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section id="capabilities" className="py-24 border-b border-outline-variant bg-surface-container-low">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="mb-16">
              <span className="text-secondary font-label-md font-semibold tracking-wide uppercase">Platform Capabilities</span>
              <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-primary mt-2">
                Engineered for High-Stakes Precision
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Enterprise ERP', icon: 'sync_alt' },
                { title: 'Contextual AI & RAG', icon: 'neurology' },
                { title: 'Dynamic Queue Management', icon: 'queue' },
                { title: 'Smart Scheduling', icon: 'calendar_month' },
                { title: 'Institutional Space Vision', icon: 'visibility' },
                { title: 'Operational Analytics', icon: 'analytics' }
              ].map((cap, i) => (
                <div key={i} className="border border-outline-variant p-6 rounded-xl bg-surface flex items-start gap-4 hover:shadow-sm">
                  <span className="material-symbols-outlined text-primary text-2xl">{cap.icon}</span>
                  <div>
                    <h4 className="font-headline-sm font-bold text-on-surface mb-1">{cap.title}</h4>
                    <p className="font-body-sm text-on-surface-variant text-sm">Capability module available for independent or orchestrated deployment.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* PRE-FOOTER CTA */}
        <section className="py-24 bg-surface text-center">
          <div className="max-w-[800px] mx-auto px-6">
            <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-primary mb-6">Build your organization's intelligent workspace.</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="px-8 py-3.5 bg-primary text-on-primary font-label-md font-semibold rounded-lg shadow-sm hover:bg-primary-hover transition-all">Get Started</Link>
              <Link to="/join" className="px-8 py-3.5 bg-surface-container text-on-surface font-label-md font-semibold rounded-lg hover:bg-outline-variant transition-all">Join an Organization</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest border-t border-outline-variant py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">shield</span>
            <span className="font-headline-sm font-bold text-on-surface">Aegis Intelligence</span>
          </div>
          <div className="text-sm font-body-sm text-on-surface-variant">
            © 2026 Aegis Intelligence Systems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
