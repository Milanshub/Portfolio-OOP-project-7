declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';  // Added 'test'
            PORT: string;
            JWT_SECRET: string;
            SUPABASE_URL: string;
            SUPABASE_KEY: string;
            SUPABASE_ANON_KEY: string;  // Added this
        }
    }
}

export {};