import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Users,
  MessageSquare,
  BarChart,
} from 'lucide-react'
import { APP_CONSTANTS } from '@/lib/config/constants'

// Types for navigation items
interface NavItem {
  title: string
  href: string
  icon?: typeof LayoutDashboard
  disabled?: boolean
  external?: boolean
}

interface DashboardConfigType {
  mainNav: NavItem[]
  sidebarNav: NavItem[]
  settingsNav: NavItem[]
}

// Routes specific to dashboard - extending from APP_CONSTANTS
const DASHBOARD_ROUTES = {
  DASHBOARD: APP_CONSTANTS.ROUTES.DASHBOARD,
  LOGIN: APP_CONSTANTS.ROUTES.LOGIN,
  REGISTER: APP_CONSTANTS.ROUTES.REGISTER,
  PROJECTS: `${APP_CONSTANTS.ROUTES.DASHBOARD}/projects`,
  MESSAGES: `${APP_CONSTANTS.ROUTES.DASHBOARD}/messages`,
  ANALYTICS: `${APP_CONSTANTS.ROUTES.DASHBOARD}/analytics`,
  PROFILE: `${APP_CONSTANTS.ROUTES.DASHBOARD}/profile`,
  SETTINGS: `${APP_CONSTANTS.ROUTES.DASHBOARD}/settings`,
} as const

// Settings routes - extending from DASHBOARD_ROUTES
const SETTINGS_ROUTES = {
  PROFILE: `${DASHBOARD_ROUTES.SETTINGS}/profile`,
  ACCOUNT: `${DASHBOARD_ROUTES.SETTINGS}/account`,
  APPEARANCE: `${DASHBOARD_ROUTES.SETTINGS}/appearance`,
  NOTIFICATIONS: `${DASHBOARD_ROUTES.SETTINGS}/notifications`,
  SECURITY: `${DASHBOARD_ROUTES.SETTINGS}/security`,
} as const

export const dashboardConfig: DashboardConfigType = {
  mainNav: [
    {
      title: 'Home',
      href: APP_CONSTANTS.ROUTES.HOME,
    },
    {
      title: 'Projects',
      href: APP_CONSTANTS.ROUTES.PROJECTS,
    },
    {
      title: 'About',
      href: APP_CONSTANTS.ROUTES.ABOUT,
    },
    {
      title: 'Contact',
      href: APP_CONSTANTS.ROUTES.CONTACT,
    },
  ],
  sidebarNav: [
    {
      title: 'Dashboard',
      href: DASHBOARD_ROUTES.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      title: 'Projects',
      href: DASHBOARD_ROUTES.PROJECTS,
      icon: FolderKanban,
    },
    {
      title: 'Messages',
      href: DASHBOARD_ROUTES.MESSAGES,
      icon: MessageSquare,
    },
    {
      title: 'Analytics',
      href: DASHBOARD_ROUTES.ANALYTICS,
      icon: BarChart,
    },
    {
      title: 'Profile',
      href: DASHBOARD_ROUTES.PROFILE,
      icon: Users,
    },
    {
      title: 'Settings',
      href: DASHBOARD_ROUTES.SETTINGS,
      icon: Settings,
    },
  ],
  settingsNav: [
    {
      title: 'Profile',
      href: SETTINGS_ROUTES.PROFILE,
    },
    {
      title: 'Account',
      href: SETTINGS_ROUTES.ACCOUNT,
    },
    {
      title: 'Appearance',
      href: SETTINGS_ROUTES.APPEARANCE,
    },
    {
      title: 'Notifications',
      href: SETTINGS_ROUTES.NOTIFICATIONS,
    },
    {
      title: 'Security',
      href: SETTINGS_ROUTES.SECURITY,
    },
  ],
} as const

export type DashboardConfig = typeof dashboardConfig
export type { NavItem, DashboardConfigType }
export { DASHBOARD_ROUTES, SETTINGS_ROUTES }