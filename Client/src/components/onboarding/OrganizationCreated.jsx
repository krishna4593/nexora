import { useState } from 'react';
import { useNavigate } from 'react-router';

const OrganizationCreated = ({ organization }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(organization.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full text-center">
      <div className="w-20 h-20 mx-auto bg-success/10 text-success rounded-full flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 rounded-full border-2 border-success/30 animate-ping opacity-20"></div>
        <span className="material-symbols-outlined text-4xl">check_circle</span>
      </div>
      
      <h2 className="text-2xl font-headline-xl font-bold text-on-surface mb-2 tracking-tight">Your college workspace is ready.</h2>
      <p className="text-on-surface-variant text-sm font-body-md mb-8">
        The core infrastructure for <span className="font-semibold text-on-surface">{organization.name}</span> has been deployed successfully.
      </p>

      <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-6 mb-8 text-left">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary text-xl">vpn_key</span>
          <h3 className="font-headline-sm font-semibold text-on-surface">Organization Referral Code</h3>
        </div>
        <p className="text-sm text-on-surface-variant font-body-sm mb-4">
          Share this secure code with students, faculty, and staff so they can join your college workspace.
        </p>
        
        <div className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-3 group">
          <span className="font-mono text-lg font-bold tracking-widest text-primary selection:bg-primary-container">
            {organization.referralCode}
          </span>
          <button 
            onClick={handleCopy}
            className="p-2 rounded-md hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary flex items-center justify-center"
            title="Copy referral code"
          >
            <span className="material-symbols-outlined text-[20px]">
              {copied ? 'check' : 'content_copy'}
            </span>
          </button>
        </div>
        {copied && (
          <div className="text-success text-xs font-medium mt-2 flex items-center gap-1 animate-fade-in">
            <span className="material-symbols-outlined text-[14px]">done_all</span>
            Referral code copied to clipboard
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/college')}
        className="w-full px-6 py-3.5 bg-primary text-on-primary font-label-md font-semibold rounded-lg hover:bg-primary-hover shadow-sm transition-all flex items-center justify-center gap-2"
      >
        Continue to College Dashboard
        <span className="material-symbols-outlined text-[18px]">dashboard</span>
      </button>
    </div>
  );
};

export default OrganizationCreated;
