import { createContext, useContext } from 'react'
import registry, { type Registry } from '@/registry/default'

export const RegistryContext = createContext<Registry>(registry)

export function RegistryProvider({ children }: { children: React.ReactNode }) {
  return (
    <RegistryContext.Provider value={registry}>
      {children}
    </RegistryContext.Provider>
  )
}

// Move the hook here to avoid circular dependencies
export function useRegistry(): Registry {
  const context = useContext(RegistryContext)
  if (!context) {
    throw new Error('useRegistry must be used within a RegistryProvider')
  }
  return context
} 