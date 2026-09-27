import { Link } from 'react-router';
import TopNavBar from '../components/common/TopNavBar';

const Join = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNavBar />
      <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-grid pointer-events-none opacity-40"></div>
        
        <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-8 relative z-10 text-center">
          <div className="w-16 h-16 mx-auto bg-surface-container flex items-center justify-center rounded-full mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">corporate_fare</span>
          </div>
          <h1 className="font-headline-xl text-2xl font-bold text-on-surface mb-3">Join Your Organization</h1>
          <p className="font-body-md text-on-surface-variant mb-8">
            Organization joining is currently by invitation only. You will need a referral code provided by your Enterprise Administrator to join an existing workspace.
          </p>
          <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface-variant font-body-sm mb-8">
            This functionality will be activated in an upcoming platform update.
          </div>
          <Link to="/" className="inline-flex items-center justify-center w-full py-2.5 font-label-md font-semibold text-primary border border-outline-variant rounded-lg hover:bg-surface-container transition-all">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Join;
