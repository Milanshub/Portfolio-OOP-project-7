import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { dashboardConfig } from '@/config/dashboard'

export default function DashboardPage() {
  return (
    // Wrap content with DashboardLayout
    <DashboardLayout>
      {/* Dashboard Content */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg">
            <h2 className="font-semibold">Total Projects</h2>
            <p className="text-2xl">12</p>
          </div>
          <div className="p-6 bg-card rounded-lg">
            <h2 className="font-semibold">Unread Messages</h2>
            <p className="text-2xl">5</p>
          </div>
          <div className="p-6 bg-card rounded-lg">
            <h2 className="font-semibold">Page Views</h2>
            <p className="text-2xl">1,234</p>
          </div>
        </div>

        {/* Recent Activity */}
        <section className="p-6 bg-card rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {/* Add activity list here */}
        </section>
      </div>
    </DashboardLayout>
  )
}