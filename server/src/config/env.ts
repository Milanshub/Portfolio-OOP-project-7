import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables')
}

export const config = {
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,         // Keep this for client-side
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY  // Add this for server-side
  }
}