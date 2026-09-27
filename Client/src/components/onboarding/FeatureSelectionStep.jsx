
const availableFeatures = [
  {
    id: 'ERP',
    title: 'ERP',
    description: 'Manage your core college administration.',
    icon: 'sync_alt',
    required: true
  },
  {
    id: 'RAG',
    title: 'AI Assistant',
    description: "Ask questions and retrieve information from your organization's knowledge base.",
    icon: 'neurology',
    required: false
  },
  {
    id: 'QUEUE',
    title: 'Queue Management',
    description: 'Manage queues and waiting processes.',
    icon: 'queue',
    required: false
  },
  {
    id: 'CAMERA',
    title: 'Camera Intelligence',
    description: 'AI-powered visual monitoring capabilities.',
    icon: 'visibility',
    required: false
  },
  {
    id: 'SCHEDULING',
    title: 'Smart Scheduling',
    description: 'Intelligent scheduling and resource planning.',
    icon: 'calendar_month',
    required: false
  },
  {
    id: 'ANALYTICS',
    title: 'Analytics',
    description: 'Understand organization activity through analytics.',
    icon: 'analytics',
    required: false
  }
];

const FeatureSelectionStep = ({ formData, setFormData, onNext, onBack }) => {
  const toggleFeature = (featureId) => {
    if (featureId === 'ERP') return; // Cannot toggle required features

    setFormData(prev => {
      const isSelected = prev.enabledFeatures.includes(featureId);
      if (isSelected) {
        return { ...prev, enabledFeatures: prev.enabledFeatures.filter(f => f !== featureId) };
      } else {
        return { ...prev, enabledFeatures: [...prev.enabledFeatures, featureId] };
      }
    });
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-headline-xl font-bold text-on-surface mb-2 tracking-tight">Choose your capabilities</h2>
        <p className="text-on-surface-variant text-sm font-body-md leading-relaxed">
          Configure which platform capabilities are enabled for the college. Additional features can be unlocked later.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {availableFeatures.map(feature => {
          const isSelected = formData.enabledFeatures.includes(feature.id);
          return (
            <div 
              key={feature.id}
              onClick={() => toggleFeature(feature.id)}
              className={`relative p-5 rounded-xl border transition-all duration-200 flex flex-col gap-3
                ${feature.required ? 'bg-surface-container border-primary/50 cursor-not-allowed opacity-90' : 
                  isSelected ? 'bg-primary-container/10 border-primary cursor-pointer shadow-sm' : 
                  'bg-surface-container-lowest border-outline-variant/40 hover:border-outline cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-[20px]">{feature.icon}</span>
                </div>
                
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                  {isSelected && <span className="material-symbols-outlined text-[14px] text-on-primary font-bold">check</span>}
                </div>
              </div>
              
              <div>
                <h3 className="font-headline-md text-base font-semibold text-on-surface mb-1 flex items-center gap-2">
                  {feature.title}
                  {feature.required && <span className="px-1.5 py-0.5 rounded-sm bg-surface-variant text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Required</span>}
                </h3>
                <p className="text-sm font-body-sm text-on-surface-variant line-clamp-2">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4 border-t border-outline-variant/30">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 bg-surface text-on-surface font-label-md font-medium border border-outline-variant hover:bg-surface-container rounded-lg transition-all"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-primary text-on-primary font-label-md font-semibold rounded-lg hover:bg-primary-hover shadow-sm transition-all inline-flex items-center gap-2"
        >
          Continue
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default FeatureSelectionStep;
