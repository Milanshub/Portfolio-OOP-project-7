import React, { createContext, useContext, useState, useCallback } from 'react';
import { Loader } from '@/components/ui/spinner-loader';

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string | null;
  withLoading: <T>(promise: Promise<T>, text?: string) => Promise<T>;
  startLoading: (text?: string) => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | null>(null);

  const startLoading = useCallback((text?: string) => {
    setIsLoading(true);
    setLoadingText(text || null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingText(null);
  }, []);

  const withLoading = useCallback(async <T,>(promise: Promise<T>, text?: string): Promise<T> => {
    try {
      startLoading(text);
      const result = await promise;
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingText,
        withLoading,
        startLoading,
        stopLoading,
      }}
    >
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader text={loadingText} />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
} 