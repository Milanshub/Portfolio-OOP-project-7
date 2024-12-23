import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/services/analyticsService';
import { Analytics } from '@/types';

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const trackPageView = useCallback(async (page: string) => {
    try {
      await analyticsService.trackPageView(page);
    } catch (err: any) {
      console.error('Failed to track page view:', err);
    }
  }, []);

  const trackEvent = useCallback(async (eventName: string, eventData: any = {}) => {
    try {
      await analyticsService.trackEvent(eventName, eventData);
    } catch (err: any) {
      console.error('Failed to track event:', err);
    }
  }, []);

  const generateReport = async () => {
    try {
      setLoading(true);
      const report = await analyticsService.generateReport();
      return report;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMostViewedProjects = async () => {
    try {
      setLoading(true);
      const projectIds = await analyticsService.getMostViewedProjects();
      return projectIds;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    analytics,
    loading,
    error,
    trackPageView,
    trackEvent,
    generateReport,
    getMostViewedProjects,
    refreshAnalytics: fetchAnalytics,
  };
} 