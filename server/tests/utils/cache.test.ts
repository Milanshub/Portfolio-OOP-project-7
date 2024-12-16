// tests/utils/cache.test.ts
import { Cache } from '../../src/utils/cache';

describe('Cache', () => {
    let cache: Cache<any>;
    const defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds

    beforeEach(() => {
        cache = new Cache();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('constructor', () => {
        it('should initialize with default TTL', () => {
            expect(cache['ttl']).toBe(defaultTTL);
        });

        it('should initialize with custom TTL', () => {
            const customTTL = 1000;
            const customCache = new Cache(customTTL);
            expect(customCache['ttl']).toBe(customTTL);
        });
    });

    describe('set', () => {
        it('should store value with timestamp', () => {
            const now = Date.now();
            jest.setSystemTime(now);

            cache.set('key', 'value');
            const stored = cache['cache'].get('key');

            expect(stored).toEqual({
                data: 'value',
                timestamp: now
            });
        });

        it('should override existing value', () => {
            cache.set('key', 'value1');
            cache.set('key', 'value2');

            expect(cache.get('key')).toBe('value2');
        });
    });

    describe('get', () => {
        it('should return null for non-existent key', () => {
            expect(cache.get('nonexistent')).toBeNull();
        });

        it('should return value for valid non-expired key', () => {
            cache.set('key', 'value');
            expect(cache.get('key')).toBe('value');
        });

        it('should return null for expired key and remove it', () => {
            const now = Date.now();
            jest.setSystemTime(now);
            
            cache.set('key', 'value');
            
            // Advance time beyond TTL
            jest.setSystemTime(now + defaultTTL + 1);
            
            expect(cache.get('key')).toBeNull();
            expect(cache['cache'].has('key')).toBeFalsy();
        });

        it('should handle different data types', () => {
            const testData = {
                string: 'test',
                number: 123,
                boolean: true,
                object: { test: 'value' },
                array: [1, 2, 3]
            };

            Object.entries(testData).forEach(([key, value]) => {
                cache.set(key, value);
                expect(cache.get(key)).toEqual(value);
            });
        });
    });

    describe('delete', () => {
        it('should remove specified key', () => {
            cache.set('key', 'value');
            cache.delete('key');
            expect(cache.get('key')).toBeNull();
        });

        it('should handle non-existent key', () => {
            expect(() => cache.delete('nonexistent')).not.toThrow();
        });
    });

    describe('clear', () => {
        it('should remove all cached items', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.clear();

            expect(cache.get('key1')).toBeNull();
            expect(cache.get('key2')).toBeNull();
            expect(cache['cache'].size).toBe(0);
        });
    });

    describe('edge cases', () => {
        it('should handle undefined values', () => {
            cache.set('key', undefined);
            expect(cache.get('key')).toBeUndefined();
        });

        it('should handle null values', () => {
            cache.set('key', null);
            expect(cache.get('key')).toBeNull();
        });

        it('should handle empty string keys', () => {
            cache.set('', 'value');
            expect(cache.get('')).toBe('value');
        });

        it('should handle multiple operations in sequence', () => {
            cache.set('key', 'value1');
            cache.set('key', 'value2');
            cache.delete('key');
            cache.set('key', 'value3');
            expect(cache.get('key')).toBe('value3');
        });
    });
});