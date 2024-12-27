import { env } from '@/lib/config/env'
import { APP_CONSTANTS } from '@/lib/config/constants'

interface SocialLinks {
  github: string
  linkedin: string
  twitter: string
}

interface Author {
  name: string
  url: string
  avatar?: string
  role?: string
}

interface SiteConfigType {
  name: string
  description: string
  url: string
  ogImage: string
  links: SocialLinks
  creator: string
  keywords: readonly string[]
  authors: readonly Author[]
  defaultLocale: string
  themeColor: string
  metadata: {
    title: string
    template: string
    robots: string
    manifest: string
    icons: {
      icon: string
      apple: string
      shortcut: string
    }
  }
}

export const siteConfig: SiteConfigType = {
  name: APP_CONSTANTS.APP_NAME,
  description: 'A showcase of my work and professional experience',
  url: env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
  links: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },
  creator: APP_CONSTANTS.APP_NAME,
  keywords: [
    'Portfolio',
    'Web Development',
    'Full Stack Developer',
    'Software Engineer',
    'React',
    'Next.js',
    'TypeScript',
  ],
  authors: [
    {
      name: APP_CONSTANTS.APP_NAME,
      url: env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      role: 'Developer',
    },
  ],
  defaultLocale: APP_CONSTANTS.DEFAULT_LOCALE,
  themeColor: '#000000',
  metadata: {
    title: APP_CONSTANTS.APP_NAME,
    template: '%s | ' + APP_CONSTANTS.APP_NAME,
    robots: 'index, follow',
    manifest: '/site.webmanifest',
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
      shortcut: '/favicon-16x16.png',
    },
  },
} as const

export type SiteConfig = typeof siteConfig
export type { SiteConfigType, Author, SocialLinks }