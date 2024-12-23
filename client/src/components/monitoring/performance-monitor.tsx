import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

type MetricType = 'CLS' | 'FID' | 'LCP' | 'FCP' | 'TTFB' | 'INP'

interface WebVitalsMetric {
  id: string
  name: MetricType
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

interface NetworkInformation extends EventTarget {
  effectiveType: string
  saveData: boolean
  readonly downlink: number
  readonly downlinkMax: number
  readonly rtt: number
  readonly type: ConnectionType
}

type ConnectionType =
  | 'bluetooth'
  | 'cellular'
  | 'ethernet'
  | 'none'
  | 'wifi'
  | 'wimax'
  | 'other'
  | 'unknown'

declare global {
  interface Navigator {
    connection?: NetworkInformation
  }
}

function getConnectionSpeed(): string {
  if (typeof navigator !== 'undefined' && navigator.connection) {
    return navigator.connection.effectiveType
  }
  return ''
}

async function sendWebVitals(metric: WebVitalsMetric, path: string) {
  if (!process.env.NEXT_PUBLIC_ANALYTICS_ID) return

  const searchParams = new URLSearchParams({
    dsn: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    id: metric.id,
    page: path,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  })

  try {
    const blob = new Blob([searchParams.toString()], {
      type: 'application/x-www-form-urlencoded',
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon('https://vitals.vercel-analytics.com/v1/vitals', blob)
    } else {
      await fetch('https://vitals.vercel-analytics.com/v1/vitals', {
        body: blob,
        method: 'POST',
        credentials: 'omit',
        keepalive: true,
      })
    }
  } catch (error) {
    console.error('Error sending web vitals:', error)
  }
}

export function PerformanceMonitor() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleWebVitals = (metric: WebVitalsMetric) => {
      // Get the current path including search params
      const path = pathname + searchParams.toString()
      sendWebVitals(metric, path)
    }

    // Report First Input Delay
    const reportFID = (metric: PerformanceEventTiming) => {
      const value = metric.processingStart - metric.startTime
      handleWebVitals({
        id: metric.entryType + '_' + Date.now(),
        name: 'FID',
        value,
        rating: value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor',
      })
    }

    // Report Largest Contentful Paint
    const reportLCP = (metric: PerformanceEntry) => {
      const value = (metric as any).renderTime || metric.startTime
      handleWebVitals({
        id: metric.entryType + '_' + Date.now(),
        name: 'LCP',
        value,
        rating: value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor',
      })
    }

    // Report Cumulative Layout Shift
    const reportCLS = (metric: PerformanceEntry) => {
      const value = (metric as any).value
      handleWebVitals({
        id: metric.entryType + '_' + Date.now(),
        name: 'CLS',
        value,
        rating: value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor',
      })
    }

    // Set up performance observers
    const observers: PerformanceObserver[] = []

    if (PerformanceObserver.supportedEntryTypes.includes('first-input')) {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          reportFID(entry as PerformanceEventTiming)
        }
      })
      observer.observe({ type: 'first-input', buffered: true })
      observers.push(observer)
    }

    if (PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          reportLCP(entry)
        }
      })
      observer.observe({ type: 'largest-contentful-paint', buffered: true })
      observers.push(observer)
    }

    if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          reportCLS(entry)
        }
      })
      observer.observe({ type: 'layout-shift', buffered: true })
      observers.push(observer)
    }

    // Cleanup observers on unmount
    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [pathname, searchParams])

  return null
} 