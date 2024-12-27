import { RegistryProvider } from './registry'
// ... other provider imports

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RegistryProvider>
      {/* Other providers */}
      {children}
    </RegistryProvider>
  )
} 