import { Suspense } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Loader } from '@/components/ui/spinner-loader'

// Metadata for dashboard routes
export const metadata = {
  title: 'Dashboard',
  description: 'Portfolio admin dashboard',
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: DashboardLayoutProps) {
  return (
    <DashboardLayout>
      <Suspense 
        fallback={
          <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
            <Loader size="lg" text="Loading..." />
          </div>
        }
      >
        {children}
      </Suspense>
    </DashboardLayout>
  )
}
