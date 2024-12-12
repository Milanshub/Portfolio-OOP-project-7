import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({
  path: path.resolve(__dirname, '../.env.test')
});

// Set required environment variables directly
process.env.SUPABASE_URL = 'https://test-url.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-key';
process.env.JWT_SECRET = 'test-secret';

// Simplified Supabase mock
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
  })),
}));

// Simplified Analytics Service mock with just the required method
jest.mock('../src/services/AnalyticsService', () => ({
  AnalyticsService: {
    incrementPageViews: jest.fn().mockResolvedValue(undefined)
  }
}));