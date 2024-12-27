import React from 'react'
import { dashboardConfig } from '@/config/dashboard'
import Link from 'next/link'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="border-b">
        <nav>
          {dashboardConfig.mainNav.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className="px-4 py-2 hover:bg-gray-100"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </header>

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r">
        {dashboardConfig.sidebarNav.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className="flex items-center px-4 py-2 hover:bg-gray-100"
          >
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.title}
          </Link>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}