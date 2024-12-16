// tests/utils/logger.test.ts
import { Logger } from '../../src/utils/logger';

describe('Logger', () => {
    let logger: Logger;
    const originalConsole = { ...console };

    beforeEach(() => {
        // Reset console methods before each test
        console.error = jest.fn();
        console.warn = jest.fn();
        console.info = jest.fn();
        console.debug = jest.fn();
        logger = Logger.getInstance();
    });

    afterEach(() => {
        // Restore original console methods
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;
        console.debug = originalConsole.debug;
    });

    describe('getInstance', () => {
        it('should return the same instance', () => {
            const instance1 = Logger.getInstance();
            const instance2 = Logger.getInstance();
            expect(instance1).toBe(instance2);
        });
    });

    describe('logging methods', () => {
        it('should log error messages', () => {
            const message = 'Test error';
            const args = [{ detail: 'error detail' }];
            
            logger.error(message, ...args);
            expect(console.error).toHaveBeenCalledWith('[ERROR] Test error', args[0]);
        });

        it('should log warn messages', () => {
            const message = 'Test warning';
            const args = [{ detail: 'warning detail' }];
            
            logger.warn(message, ...args);
            expect(console.warn).toHaveBeenCalledWith('[WARN] Test warning', args[0]);
        });

        it('should log info messages', () => {
            const message = 'Test info';
            const args = [{ detail: 'info detail' }];
            
            logger.info(message, ...args);
            expect(console.info).toHaveBeenCalledWith('[INFO] Test info', args[0]);
        });

        it('should log debug messages', () => {
            const message = 'Test debug';
            const args = [{ detail: 'debug detail' }];
            
            logger.setLevel(3); // Set to DEBUG level
            logger.debug(message, ...args);
            expect(console.debug).toHaveBeenCalledWith('[DEBUG] Test debug', args[0]);
        });
    });

    describe('log levels', () => {
        it('should not log debug messages when level is INFO', () => {
            logger.setLevel(2); // INFO level
            logger.debug('Debug message');
            expect(console.debug).not.toHaveBeenCalled();
        });

        it('should not log info messages when level is WARN', () => {
            logger.setLevel(1); // WARN level
            logger.info('Info message');
            expect(console.info).not.toHaveBeenCalled();
        });

        it('should not log warn messages when level is ERROR', () => {
            logger.setLevel(0); // ERROR level
            logger.warn('Warning message');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('should log all messages when level is DEBUG', () => {
            logger.setLevel(3); // DEBUG level
            
            logger.error('Error message');
            logger.warn('Warning message');
            logger.info('Info message');
            logger.debug('Debug message');

            expect(console.error).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalled();
            expect(console.info).toHaveBeenCalled();
            expect(console.debug).toHaveBeenCalled();
        });
    });

    describe('multiple arguments', () => {
        it('should handle multiple arguments for each log level', () => {
            const args = ['arg1', { key: 'value' }, [1, 2, 3]];
            
            logger.setLevel(3); // DEBUG level
            
            logger.error('Error message', ...args);
            logger.warn('Warning message', ...args);
            logger.info('Info message', ...args);
            logger.debug('Debug message', ...args);

            expect(console.error).toHaveBeenCalledWith('[ERROR] Error message', ...args);
            expect(console.warn).toHaveBeenCalledWith('[WARN] Warning message', ...args);
            expect(console.info).toHaveBeenCalledWith('[INFO] Info message', ...args);
            expect(console.debug).toHaveBeenCalledWith('[DEBUG] Debug message', ...args);
        });
    });

    describe('edge cases', () => {
        it('should handle empty messages', () => {
            logger.info('');
            expect(console.info).toHaveBeenCalledWith('[INFO] ');
        });

        it('should handle undefined arguments', () => {
            logger.info('Message', undefined);
            expect(console.info).toHaveBeenCalledWith('[INFO] Message', undefined);
        });

        it('should handle null arguments', () => {
            logger.info('Message', null);
            expect(console.info).toHaveBeenCalledWith('[INFO] Message', null);
        });
    });
});