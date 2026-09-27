import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {errorMsg && (
        <div className="mb-6 p-4 rounded-lg bg-error-container/20 border border-error/40 text-on-surface flex items-start gap-3 transition-all duration-200">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5 shrink-0">warning</span>
          <div className="flex-1 text-sm">
            <div className="font-semibold text-error text-sm">Authentication failed</div>
            <div className="text-on-surface-variant mt-0.5">{errorMsg}</div>
          </div>
          <button className="text-outline hover:text-on-surface" type="button" onClick={() => setErrorMsg(null)}>
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-on-surface" htmlFor="email">Work Email Address</label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[18px]">alternate_email</span>
            </div>
            <input 
              id="email" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={`w-full pl-10 pr-4 py-2.5 bg-surface-container/60 border ${errorMsg ? 'border-error' : 'border-outline-variant/40'} rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container text-sm transition-all duration-150`}
              placeholder="name@enterprise.corp" 
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-on-surface" htmlFor="password">Master Enterprise Password</label>
            <a href="#" className="text-xs text-primary hover:underline hover:text-primary-container transition-colors">Forgot password?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[18px]">key</span>
            </div>
            <input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className={`w-full pl-10 pr-12 py-2.5 bg-surface-container/60 border ${errorMsg ? 'border-error' : 'border-outline-variant/40'} rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container text-sm transition-all duration-150`}
              placeholder="••••••••••••••••••••" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-surface-container border-outline-variant/60 text-primary-container focus:ring-0 focus:ring-offset-0 cursor-pointer" />
            <span className="text-xs text-on-surface-variant">Remember sovereign session</span>
          </label>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full relative group overflow-hidden py-3 px-4 rounded-lg bg-gradient-to-r from-primary-container via-primary to-secondary text-surface-container-lowest font-semibold tracking-tight shadow-lg hover:shadow-cyan-500/20 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 ${isLoading ? 'opacity-80' : ''}`}
          >
            {!isLoading && <span className="absolute inset-x-0 bottom-0 h-[2px] shimmer-line"></span>}
            
            {isLoading ? (
              <span className="flex items-center gap-2.5">
                <svg className="animate-spin h-4 w-4 text-surface-container-lowest" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Verifying credentials...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Sign In to Workspace</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
