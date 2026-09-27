import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useOrganization } from '../../hooks/useOrganization';
import { organizationService } from '../../services/organization.service';
import TopNavBar from '../../components/common/TopNavBar';
import CollegeInfoStep from '../../components/onboarding/CollegeInfoStep';
import FeatureSelectionStep from '../../components/onboarding/FeatureSelectionStep';
import ConfigurationReview from '../../components/onboarding/ConfigurationReview';
import OrganizationCreated from '../../components/onboarding/OrganizationCreated';

const CollegeSetup = () => {
  const navigate = useNavigate();
  const { organization, onboardingRequired, loading, reloadOrganization } = useOrganization();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'COLLEGE',
    enabledFeatures: ['ERP']
  });

  const [createdOrganization, setCreatedOrganization] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (organization && !onboardingRequired) {
        // User already has an organization, redirect
        navigate('/college');
      }
    }
  }, [organization, onboardingRequired, loading, navigate]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await organizationService.createOrganization(formData);
      if (res.success) {
        setCreatedOrganization(res.data);
        await reloadOrganization(); // Refresh global organization state
        setStep(4);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organization. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || (organization && !onboardingRequired)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-outline-variant border-t-primary animate-spin"></div>
          <div className="text-sm font-label-md text-on-surface-variant uppercase tracking-widest">Loading Workspace</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      <TopNavBar hideLinks={true} />
      
      {/* Ambient Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 mt-[60px]">
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] rounded-full bg-secondary-container/10 blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-primary-container/10 blur-[150px]"></div>
        <div className="absolute inset-0 bg-mesh-grid opacity-40"></div>
      </div>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-2xl">
          
          {step < 4 && (
            <div className="mb-8 flex items-center justify-between px-2">
              <div className="flex gap-2 items-center text-xs font-label-md font-bold uppercase tracking-wider text-primary">
                <span className="material-symbols-outlined text-[16px]">account_tree</span>
                Infrastructure Deployment
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(s => (
                  <div 
                    key={s} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-primary' : s < step ? 'w-4 bg-primary/40' : 'w-4 bg-outline-variant/40'}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/60 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            
            <div className="animate-fade-in">
              {step === 1 && (
                <CollegeInfoStep 
                  formData={formData} 
                  setFormData={setFormData} 
                  onNext={handleNext} 
                />
              )}
              {step === 2 && (
                <FeatureSelectionStep 
                  formData={formData} 
                  setFormData={setFormData} 
                  onNext={handleNext} 
                  onBack={handleBack} 
                />
              )}
              {step === 3 && (
                <ConfigurationReview 
                  formData={formData} 
                  onBack={handleBack} 
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  error={error}
                />
              )}
              {step === 4 && createdOrganization && (
                <OrganizationCreated organization={createdOrganization} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollegeSetup;
