export class Cache<T> {
    private cache: Map<string, { data: T; timestamp: number }>;
    private ttl: number; // Time to live in milliseconds

    constructor(ttl: number = 5 * 60 * 1000) { // Default 5 minutes
        this.cache = new Map();
        this.ttl = ttl;
    }

    set(key: string, value: T): void {
        this.cache.set(key, {
            data: value,
            timestamp: Date.now()
        });
    }

    get(key: string): T | null {
        const item = this.cache.get(key);
        
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}