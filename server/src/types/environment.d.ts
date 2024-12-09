declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT: string;
            JWT_SECRET: string;
            SUPABASE_URL: string;
            SUPABASE_KEY: string;
        }
    }
}

export {};