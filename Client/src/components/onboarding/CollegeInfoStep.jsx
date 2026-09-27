
import { useState } from 'react';

const CollegeInfoStep = ({ formData, setFormData, onNext }) => {
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || formData.name.trim().length < 2) {
      setError('College name must be at least 2 characters');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-headline-xl font-bold text-on-surface mb-2 tracking-tight">Set up your college</h2>
        <p className="text-on-surface-variant text-sm font-body-md leading-relaxed">
          Create your college workspace to start managing your organization from one platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="collegeName" className="block text-sm font-label-md font-medium text-on-surface mb-2">
            College Name
          </label>
          <input
            type="text"
            id="collegeName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-3 bg-surface-container/60 border ${error ? 'border-error' : 'border-outline-variant/40'} rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container transition-all`}
            placeholder="e.g. ABC College"
          />
          {error && <p className="mt-2 text-sm text-error font-body-sm">{error}</p>}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-on-primary font-label-md font-semibold rounded-lg hover:bg-primary-hover shadow-sm transition-all inline-flex items-center gap-2"
          >
            Continue
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollegeInfoStep;
