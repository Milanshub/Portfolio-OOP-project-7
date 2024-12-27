import registry from '@/registry/default'

export async function GET(request: Request) {
  if (!registry.features.isAuthEnabled()) {
    return new Response('Auth is disabled', { status: 404 })
  }
  
  // Handle auth request
} 