interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function measurePageLoad(): PerformanceMetric[] {
  const metrics: PerformanceMetric[] = [];

  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    // Time to First Byte (TTFB)
    metrics.push({
      name: 'TTFB',
      value: navigation.responseStart - navigation.requestStart,
      rating: getRating('ttfb', navigation.responseStart - navigation.requestStart),
    });

    // First Contentful Paint (FCP)
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
    if (fcp) {
      metrics.push({
        name: 'FCP',
        value: fcp.startTime,
        rating: getRating('fcp', fcp.startTime),
      });
    }

    // DOM Load Time
    metrics.push({
      name: 'DOM Load',
      value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      rating: getRating('domLoad', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
    });

    // Total Page Load Time
    metrics.push({
      name: 'Page Load',
      value: navigation.loadEventEnd - navigation.startTime,
      rating: getRating('pageLoad', navigation.loadEventEnd - navigation.startTime),
    });
  }

  return metrics;
}

function getRating(metric: string, value: number): PerformanceMetric['rating'] {
  const thresholds = {
    ttfb: { good: 100, poor: 600 },
    fcp: { good: 1800, poor: 3000 },
    domLoad: { good: 2000, poor: 4000 },
    pageLoad: { good: 3000, poor: 6000 },
  };

  const threshold = thresholds[metric as keyof typeof thresholds];
  if (!threshold) return 'needs-improvement';

  if (value <= threshold.good) return 'good';
  if (value >= threshold.poor) return 'poor';
  return 'needs-improvement';
}

export function trackResourceLoading(): void {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'resource') {
        const resourceEntry = entry as PerformanceResourceTiming;
        console.debug(`Resource loaded: ${resourceEntry.name}`, {
          duration: resourceEntry.duration,
          size: resourceEntry.transferSize,
          type: resourceEntry.initiatorType,
        });
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });
}

export function reportPerformanceToAnalytics(metrics: PerformanceMetric[]): void {
  // Send performance data to your analytics service
  // This is a placeholder - implement according to your analytics setup
  console.debug('Performance metrics:', metrics);
} 