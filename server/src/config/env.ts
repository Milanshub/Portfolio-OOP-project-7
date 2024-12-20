// Import the dotenv package to load environment variables from a .env file
import dotenv from 'dotenv'

// Load environment variables from .env file into process.env
dotenv.config({ path: '.env.local' })

// Check if required Supabase environment variables exist
// If they don't exist, throw an error
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

// Export configuration object containing Supabase credentials
export const config = {
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  }
}
