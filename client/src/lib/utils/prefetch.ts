import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Critical resources that should be prefetched
const CRITICAL_RESOURCES = [
  '/api/projects',
  '/api/profile',
  '/images/hero.webp',
]

// Pages that should be prefetched
const PREFETCH_PAGES = [
  '/projects',
  '/about',
  '/contact',
]

export function usePrefetch() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Prefetch API endpoints and critical resources
    CRITICAL_RESOURCES.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = resource
      document.head.appendChild(link)
    })

    // Prefetch pages
    PREFETCH_PAGES.forEach(page => {
      router.prefetch(page)
    })

    // Prefetch images in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              const link = document.createElement('link')
              link.rel = 'prefetch'
              link.href = img.dataset.src
              document.head.appendChild(link)
              observer.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: '50px',
      }
    )

    document.querySelectorAll('img[data-src]').forEach(img => {
      observer.observe(img)
    })

    return () => {
      observer.disconnect()
    }
  }, [router])
}

// DNS prefetching for external resources
export function useDNSPrefetch() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net',
    ]

    domains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })
  }, [])
}

// Preconnect to critical origins
export function usePreconnect() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const origins = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ]

    origins.forEach(origin => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = origin
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }, [])
} 