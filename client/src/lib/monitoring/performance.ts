import { useEffect, useRef, useState } from 'react';

// ===== PERFORMANCE MONITORING =====
// This file contains the performance monitoring for our application
// It includes the PerformanceMonitor class and the PerformanceData interface
// The PerformanceMonitor class is used to monitor the performance of the user
// The PerformanceData interface is used to define the structure of the performance data

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
}

export interface PerformanceMetrics {
  fcp: number;  // First Contentful Paint
  lcp: number;  // Largest Contentful Paint
  fid: number;  // First Input Delay
  cls: number;  // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

interface PerformanceData {
  metrics: PerformanceMetric[];
  resources: ResourceTiming[];
  navigation?: PerformanceNavigationTiming;
  paint: PerformanceEntryList;
  memory?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  deviceMemory?: number;
  hardwareConcurrency: number;
  url: string;
  timestamp: number;
}

// Main Performance Monitor Class
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private onMetricsCollectedCallback?: (data: PerformanceData) => void;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers(): void {
    this.observePaint();
    this.observeLargestContentfulPaint();
    this.observeFirstInputDelay();
    this.observeCumulativeLayoutShift();
    this.observeTimeToFirstByte();
    this.observeResourceTiming();
  }

  private observePaint(): void {
    const observer = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.recordMetric('FCP', entry.startTime);
        }
      });
    });

    observer.observe({ entryTypes: ['paint'] });
    this.observers.push(observer);
  }

  private observeLargestContentfulPaint(): void {
    const observer = new PerformanceObserver((entries) => {
      const lcp = entries.getEntries().at(-1);
      if (lcp) {
        this.metrics.lcp = lcp.startTime;
        this.recordMetric('LCP', lcp.startTime);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(observer);
  }

  private observeFirstInputDelay(): void {
    const observer = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        const fidEntry = entry as PerformanceEventTiming;
        this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
        this.recordMetric('FID', this.metrics.fid);
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.push(observer);
  }

  private observeCumulativeLayoutShift(): void {
    const observer = new PerformanceObserver((entries) => {
      let cls = 0;
      entries.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
      this.metrics.cls = cls;
      this.recordMetric('CLS', cls);
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(observer);
  }

  private observeTimeToFirstByte(): void {
    const observer = new PerformanceObserver((entries) => {
      const navigation = entries.getEntries()[0] as PerformanceNavigationTiming;
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
      this.recordMetric('TTFB', this.metrics.ttfb);
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.push(observer);
  }

  private observeResourceTiming(): void {
    const observer = new PerformanceObserver((entries) => {
      const resources = entries.getEntries().map((entry): ResourceTiming => {
        const resource = entry as PerformanceResourceTiming;
        return {
          name: resource.name,
          duration: resource.duration,
          size: resource.encodedBodySize,
          type: resource.initiatorType
        };
      });

      if (this.onMetricsCollectedCallback) {
        this.onMetricsCollectedCallback(this.collectPerformanceData());
      }
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  private recordMetric(name: string, value: number): void {
    const rating = getRating(name, value);
    const metric: PerformanceMetric = { name, value, rating };
    
    if (this.onMetricsCollectedCallback) {
      this.onMetricsCollectedCallback(this.collectPerformanceData());
    }
  }

  private collectPerformanceData(): PerformanceData {
    const metrics = measurePageLoad();
    const resources = trackResourceLoading();
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      metrics,
      resources,
      navigation,
      paint,
      memory: (performance as any).memory,
      connection: (navigator as any).connection,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      url: window.location.href,
      timestamp: Date.now(),
    };
  }

  public onMetricsCollected(callback: (data: PerformanceData) => void): void {
    this.onMetricsCollectedCallback = callback;
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React Hook for Performance Monitoring
export function usePerformanceMonitor(): PerformanceData | null {
  const performanceData = useRef<PerformanceData | null>(null);

  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    
    const handleMetricsCollected = (data: PerformanceData) => {
      performanceData.current = data;
      reportPerformanceToAnalytics(data.metrics);
    };

    monitor.onMetricsCollected(handleMetricsCollected);

    return () => {
      monitor.disconnect();
    };
  }, []);

  return performanceData.current;
}

// Utility functions
export function measurePageLoad(): PerformanceMetric[] {
  const metrics: PerformanceMetric[] = [];
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (navigationEntry) {
    metrics.push({
      name: 'Page Load Time',
      value: navigationEntry.loadEventEnd - navigationEntry.startTime,
      rating: getRating('load', navigationEntry.loadEventEnd - navigationEntry.startTime)
    });
  }

  return metrics;
}

export function trackResourceLoading(): ResourceTiming[] {
  return performance.getEntriesByType('resource').map((entry) => {
    const resource = entry as PerformanceResourceTiming;
    return {
      name: resource.name,
      duration: resource.duration,
      size: resource.encodedBodySize,
      type: resource.initiatorType
    };
  });
}

export function prefetchResources(urls: string[]): void {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}

export function useLazyLoad(ref: React.RefObject<HTMLElement>, options = {}): boolean {
  const [isInView, setIsInView] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}

// Helper function
function getRating(metric: string, value: number): PerformanceMetric['rating'] {
  const thresholds: Record<string, [number, number]> = {
    FCP: [1800, 3000],
    LCP: [2500, 4000],
    FID: [100, 300],
    CLS: [0.1, 0.25],
    TTFB: [600, 1000],
    load: [3000, 6000]
  };

  const [good, poor] = thresholds[metric] || [1000, 3000];

  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

export function reportPerformanceToAnalytics(metrics: PerformanceMetric[]): void {
  // Implementation depends on your analytics service
  console.log('Performance metrics:', metrics);
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();