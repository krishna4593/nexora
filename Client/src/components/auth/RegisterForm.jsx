import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (formData.password !== formData.confirmPassword) {
      return setErrorMsg('Passwords do not match');
    }

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Registration failed. Please try again.');
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
            <div className="font-semibold text-error text-sm">Registration failed</div>
            <div className="text-on-surface-variant mt-0.5">{errorMsg}</div>
          </div>
          <button className="text-outline hover:text-on-surface" type="button" onClick={() => setErrorMsg(null)}>
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="name">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <input 
              id="name" 
              type="text" 
              required 
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full pl-10 pr-4 py-2.5 bg-surface-container/60 border ${errorMsg ? 'border-error' : 'border-outline-variant/40'} rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container text-sm transition-all duration-150`}
              placeholder="Admin Name" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="email">Work Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[18px]">alternate_email</span>
            </div>
            <input 
              id="email" 
              type="email" 
              required 
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full pl-10 pr-4 py-2.5 bg-surface-container/60 border ${errorMsg ? 'border-error' : 'border-outline-variant/40'} rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container text-sm transition-all duration-150`}
              placeholder="name@enterprise.corp" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="password">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[18px]">key</span>
            </div>
            <input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              required 
              value={formData.password}
              onChange={handleChange}
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

        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <input 
              id="confirmPassword" 
              type={showPassword ? "text" : "password"} 
              required 
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full pl-10 pr-12 py-2.5 bg-surface-container/60 border ${errorMsg ? 'border-error' : 'border-outline-variant/40'} rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container text-sm transition-all duration-150`}
              placeholder="••••••••••••••••••••" 
            />
          </div>
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
                <span>Creating profile...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Register Platform Admin</span>
                <span className="material-symbols-outlined text-[18px]">person_add</span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
