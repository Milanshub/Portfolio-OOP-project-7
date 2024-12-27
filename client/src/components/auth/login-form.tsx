import { useRegistry } from '@/hooks/useRegistry'
import type { Registry } from '@/registry/default'
import { useState } from 'react'

export function LoginForm() {
  const registry = useRegistry() as Registry
  const { features, session } = registry
  const [isLoading, setIsLoading] = useState(false)
  
  // Check if GitHub auth is enabled
  const githubEnabled = features.isAuthEnabled('github')
  
  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true)
      await session.signInWithGithub()
    } catch (error) {
      console.error('Failed to sign in with GitHub:', error)
      // Handle error (show toast, error message, etc.)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
      {/* Regular login form */}
      
      {githubEnabled && (
        <button 
          onClick={handleGithubSignIn}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in with GitHub'}
        </button>
      )}
    </div>
  )
} 