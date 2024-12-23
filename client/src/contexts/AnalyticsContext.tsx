import { createContext, useContext, ReactNode } from 'react';
import { useAnalytics } from '@/hooks/analytics/useAnalytics';
import { Analytics } from '@/types';

interface AnalyticsContextType {
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;
  trackPageView: (page: string) => Promise<void>;
  trackEvent: (eventName: string, eventData?: any) => Promise<void>;
  generateReport: () => Promise<any>;
  getMostViewedProjects: () => Promise<string[]>;
  refreshAnalytics: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const analyticsData = useAnalytics();

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
} 