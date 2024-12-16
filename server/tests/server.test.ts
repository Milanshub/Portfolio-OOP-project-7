// tests/server.test.ts
import { Logger } from '../src/utils/logger';

// Mock the entire app module
jest.mock('../src/app', () => ({
    listen: jest.fn()
}));

// Mock Logger
jest.mock('../src/utils/logger', () => ({
    Logger: {
        getInstance: jest.fn().mockReturnValue({
            info: jest.fn(),
            error: jest.fn()
        })
    }
}));

describe('Server', () => {
    const originalEnv = process.env;
    let app: any;
    let logger: any;

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset env
        process.env = {
            ...originalEnv,
            NODE_ENV: 'test',
            PORT: '5001'
        } as NodeJS.ProcessEnv;
        
        // Import mocked modules
        app = require('../src/app');
        logger = Logger.getInstance();
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.resetModules();
    });

    it('should attempt to start server', () => {
        require('../src/server');
        expect(app.listen).toHaveBeenCalledWith('5001', expect.any(Function));
    });
});