import { Inter, Roboto_Mono } from 'next/font/google'
import localFont from 'next/font/local'

// Main font
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

// Monospace font
export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  preload: true,
})

// Custom font (if needed)
export const customFont = localFont({
  src: [
    {
      path: '../../assets/fonts/custom-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/custom-medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/custom-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-custom',
  preload: true,
  fallback: ['system-ui', 'arial'],
}) 