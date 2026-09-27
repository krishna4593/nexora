import { useState, useEffect, useCallback } from 'react';
import { organizationService } from '../services/organization.service';
import { useAuth } from './useAuth';

export const useOrganization = () => {
  const { isAuthenticated } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [onboardingRequired, setOnboardingRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrganization = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const res = await organizationService.getMyOrganization();
      if (res.success) {
        setOrganization(res.data.organization);
        setOnboardingRequired(res.data.onboardingRequired);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load organization');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrganization();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, loadOrganization]);

  return { 
    organization, 
    onboardingRequired, 
    loading, 
    error, 
    reloadOrganization: loadOrganization 
  };
};
