import { createClient } from '@supabase/supabase-js';
import { config } from './env';

// Create a Supabase client with service role key
export const supabase = createClient(
    config.supabase.url, 
    config.supabase.serviceRoleKey,  // Use service role key instead of anon key
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);