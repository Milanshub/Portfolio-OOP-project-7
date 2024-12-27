'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-background px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
          <div className="mx-auto max-w-max">
            <main className="sm:flex">
              <p className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                500
              </p>
              <div className="sm:ml-6">
                <div className="sm:border-l sm:border-muted-foreground/20 sm:pl-6">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Something went wrong!
                  </h1>
                  <p className="mt-3 text-base text-muted-foreground">
                    {error.message || 'An unexpected error occurred'}
                    {process.env.NODE_ENV === 'development' && (
                      <pre className="mt-2 text-sm text-destructive">
                        {error.stack}
                      </pre>
                    )}
                  </p>
                </div>
                <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                  <Button onClick={() => reset()}>Try again</Button>
                  <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Go back home
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
} 