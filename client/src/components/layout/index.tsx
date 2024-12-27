import React from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Add your header, sidebar, etc. here */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}

export type { DashboardLayoutProps } 