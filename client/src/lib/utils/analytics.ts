import registry from '@/registry/default'

export function trackEvent(name: string, data: Record<string, any>) {
  if (registry.features.isEnabled('analytics')) {
    registry.monitoring.analytics.trackEvent(name, data)
  }
} 