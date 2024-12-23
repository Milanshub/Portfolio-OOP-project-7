import {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode
} from 'react'

interface LoadingContextType {
  isLoading: boolean
  loadingText?: string
  startLoading: (text?: string) => void
  stopLoading: () => void
  withLoading: <T>(promise: Promise<T>, text?: string) => Promise<T>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState<string>()

  const startLoading = useCallback((text?: string) => {
    setIsLoading(true)
    setLoadingText(text)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
    setLoadingText(undefined)
  }, [])

  const withLoading = useCallback(
    async <T,>(promise: Promise<T>, text?: string): Promise<T> => {
      try {
        startLoading(text)
        const result = await promise
        return result
      } finally {
        stopLoading()
      }
    },
    [startLoading, stopLoading]
  )

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingText,
        startLoading,
        stopLoading,
        withLoading
      }}
    >
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            {loadingText && (
              <p className="text-sm text-muted-foreground">{loadingText}</p>
            )}
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
} 