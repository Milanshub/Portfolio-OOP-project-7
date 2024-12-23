import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Metadata } from 'next';
import { generateMetadata } from '@/lib/utils/seo';
import { measurePageLoad, trackResourceLoading, reportPerformanceToAnalytics } from '@/lib/utils/performance';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

// Base metadata configuration
const baseMetadata = generateMetadata({
  title: 'Your Portfolio | Full Stack Developer',
  description: 'Full Stack Developer specializing in React, Node.js, and modern web technologies. View my projects and get in touch.',
});

export const metadata: Metadata = {
  ...baseMetadata,
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

function PerformanceMonitor() {
  useEffect(() => {
    // Measure initial page load
    const metrics = measurePageLoad();
    reportPerformanceToAnalytics(metrics);

    // Track resource loading
    trackResourceLoading();
  }, []);

  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LoadingProvider>
              <PerformanceMonitor />
              {children}
              <Toaster 
                position="top-right" 
                expand={true} 
                richColors 
                closeButton
                theme="system"
              />
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 