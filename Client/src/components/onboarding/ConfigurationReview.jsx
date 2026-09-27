
const featureNames = {
  'ERP': 'ERP',
  'RAG': 'AI Assistant',
  'QUEUE': 'Queue Management',
  'CAMERA': 'Camera Intelligence',
  'SCHEDULING': 'Smart Scheduling',
  'ANALYTICS': 'Analytics'
};

const ConfigurationReview = ({ formData, onBack, onSubmit, isSubmitting, error }) => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-headline-xl font-bold text-on-surface mb-2 tracking-tight">Review Configuration</h2>
        <p className="text-on-surface-variant text-sm font-body-md leading-relaxed">
          Verify your organization settings before finalizing the deployment of your sovereign workspace.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-error-container/20 border border-error/40 text-on-surface flex items-start gap-3">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5 shrink-0">error</span>
          <div className="flex-1 text-sm">
            <div className="font-semibold text-error text-sm">Deployment Failed</div>
            <div className="text-on-surface-variant mt-0.5">{error}</div>
          </div>
        </div>
      )}

      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden mb-8">
        <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center">
          <div>
            <div className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Organization Name</div>
            <div className="font-headline-md text-lg text-on-surface font-semibold">{formData.name}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">corporate_fare</span>
          </div>
        </div>
        
        <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center">
          <div>
            <div className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Organization Type</div>
            <div className="font-headline-md text-base text-on-surface font-medium">{formData.type}</div>
          </div>
          <div className="px-2.5 py-1 rounded bg-secondary-container/20 border border-secondary/30 text-xs font-mono text-secondary">
            TYPE_01
          </div>
        </div>

        <div className="p-5 bg-surface-container/20">
          <div className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider mb-3">Enabled Capabilities</div>
          <ul className="space-y-2.5">
            {formData.enabledFeatures.map(feat => (
              <li key={feat} className="flex items-center gap-2.5 text-sm text-on-surface font-medium">
                <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                {featureNames[feat] || feat}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-outline-variant/30">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-surface text-on-surface font-label-md font-medium border border-outline-variant hover:bg-surface-container rounded-lg transition-all disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 relative overflow-hidden bg-primary text-on-primary font-label-md font-semibold rounded-lg hover:bg-primary-hover shadow-sm transition-all inline-flex items-center justify-center min-w-[160px]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-on-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deploying...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Create College
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfigurationReview;
