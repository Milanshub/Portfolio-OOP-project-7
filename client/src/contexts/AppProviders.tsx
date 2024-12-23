import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ProfileProvider } from './ProfileContext';
import { AnalyticsProvider } from './AnalyticsContext';
import { LoadingProvider } from './LoadingContext';
import { ErrorBoundary } from '@/components/error-boundary';
import { ThemeProvider } from 'next-themes';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
  Query,
  Mutation,
  QueryKey,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';

interface AppProvidersProps {
  children: ReactNode;
}

interface QueryMeta {
  skipErrorToast?: boolean;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Show toast notification on query error
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching data';
      const meta = query.meta as QueryMeta | undefined;
      if (!meta?.skipErrorToast) {
        toast.error('Query Error', {
          description: errorMessage,
        });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Show toast notification on mutation error
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while updating data';
      const meta = mutation.meta as QueryMeta | undefined;
      if (!meta?.skipErrorToast) {
        toast.error('Mutation Error', {
          description: errorMessage,
        });
      }
    },
  }),
});

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingProvider>
            <AuthProvider>
              <ProfileProvider>
                <AnalyticsProvider>
                  {children}
                </AnalyticsProvider>
              </ProfileProvider>
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
} 