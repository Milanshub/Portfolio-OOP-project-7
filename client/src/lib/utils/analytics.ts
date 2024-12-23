interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private static instance: Analytics;
  private initialized: boolean = false;
  private queue: AnalyticsEvent[] = [];
  private sessionStartTime: number = Date.now();

  private constructor() {
    this.initializeSession();
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  private initializeSession() {
    if (typeof window === 'undefined') return;
    
    // Track session start
    this.trackEvent('session_started', {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    });

    // Track when user leaves
    window.addEventListener('beforeunload', () => {
      this.trackEvent('session_ended', {
        duration: Date.now() - this.sessionStartTime,
      });
    });

    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.trackEvent('page_hidden');
      } else {
        this.trackEvent('page_visible');
      }
    });

    this.initialized = true;
  }

  trackEvent(name: string, properties: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      name,
      properties: {
        ...properties,
        path: window?.location?.pathname,
        timestamp: Date.now(),
      },
    };

    if (!this.initialized) {
      this.queue.push(event);
      return;
    }

    // Send to your analytics service
    this.sendToAnalytics(event);
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.debug('Analytics Event:', event);
    }
  }

  trackPageView(path: string = window?.location?.pathname) {
    this.trackEvent('page_view', { path });
  }

  trackProjectView(projectId: string, projectName: string) {
    this.trackEvent('project_view', { projectId, projectName });
  }

  trackProjectInteraction(projectId: string, interactionType: 'click' | 'hover' | 'scroll') {
    this.trackEvent('project_interaction', { projectId, interactionType });
  }

  trackContactFormSubmission(success: boolean) {
    this.trackEvent('contact_form_submission', { success });
  }

  trackExternalLink(url: string, type: 'github' | 'linkedin' | 'other') {
    this.trackEvent('external_link_click', { url, type });
  }

  private async sendToAnalytics(event: AnalyticsEvent) {
    try {
      // Replace with your analytics service implementation
      // Example: Google Analytics, Plausible, or custom backend
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }
}

export const analytics = Analytics.getInstance(); 