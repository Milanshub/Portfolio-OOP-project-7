import { useState } from 'react';
import { analyticsService } from '@/services';
import { Analytics, PageView, AnalyticsReport, ApiError } from '@/types';
import { logger } from '@/config/logger';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [latestAnalytics, setLatestAnalytics] = useState<Analytics | null>(null);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchAllAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getAllAnalytics();
      setAnalytics(data);
      logger.debug('Analytics fetched successfully');
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError);
      logger.error('Failed to fetch analytics:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLatestAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getLatestAnalytics();
      setLatestAnalytics(data);
      logger.debug('Latest analytics fetched successfully');
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError);
      logger.error('Failed to fetch latest analytics:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.generateReport();
      setReport(data);
      logger.debug('Analytics report generated successfully');
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError);
      logger.error('Failed to generate report:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const trackPageView = async (page: string) => {
    try {
      await analyticsService.recordPageView(page);
      logger.debug(`Page view recorded: ${page}`);
    } catch (error) {
      const apiError = error as ApiError;
      logger.error('Failed to record page view:', apiError);
    }
  };

  const getMostViewedProjects = async () => {
    try {
      setIsLoading(true);
      const projects = await analyticsService.getMostViewedProjects();
      logger.debug('Most viewed projects fetched successfully');
      return projects;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError);
      logger.error('Failed to fetch most viewed projects:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analytics,
    latestAnalytics,
    report,
    isLoading,
    error,
    fetchAllAnalytics,
    fetchLatestAnalytics,
    generateReport,
    trackPageView,
    getMostViewedProjects
  };
};