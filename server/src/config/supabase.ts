// Import the createClient function from the @supabase/supabase-js package
import { createClient } from '@supabase/supabase-js';
// Import the configuration object from the env.ts file
import { config } from './env';

// Create a Supabase client instance using the credentials from the config object
export const supabase = createClient(
    config.supabase.url, 
    config.supabase.key
);