import { Suspense } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Loading } from '@/components/ui/loading'

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
            <Loading size="lg" text="Loading..." />
          </div>
        }
      >
        {children}
      </Suspense>
    </DashboardLayout>
  )
}
