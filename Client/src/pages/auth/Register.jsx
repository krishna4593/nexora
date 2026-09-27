import { Link } from 'react-router';
import RegisterForm from '../../components/auth/RegisterForm';
import TopNavBar from '../../components/common/TopNavBar';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      <TopNavBar />
      
      {/* Ambient Substrate Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 mt-[60px]">
        <div className="absolute -top-[15%] right-1/4 w-[700px] h-[550px] rounded-full bg-primary-container/15 blur-[140px]"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-secondary-container/10 blur-[160px]"></div>
        <div className="absolute inset-0 bg-mesh-grid opacity-50"></div>
      </div>

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-lg">
          <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/60 rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Subtle Top Border Luminescent Accent */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container border border-outline-variant/40 text-xs text-secondary font-semibold tracking-wide">
                  <span className="material-symbols-outlined text-[14px]">shield_person</span>
                  <span>PLATFORM ADMIN</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-on-surface tracking-tight font-headline-xl">Register Account</h1>
              <p className="text-sm text-on-surface-variant mt-2">
                Create your administrator account to configure and manage your organization's workspace.
              </p>
            </div>

            <RegisterForm />

            <div className="mt-8 pt-6 border-t border-outline-variant/30 flex flex-col items-center justify-center gap-2 text-sm">
              <div className="text-on-surface-variant">Already have an enterprise account?</div>
              <Link to="/login" className="inline-flex items-center gap-1 text-primary font-medium hover:text-primary-hover transition-colors">
                <span>Sign in instead</span>
                <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
