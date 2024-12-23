interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
}

export class RateLimiter {
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly TIME_WINDOW = 5 * 60 * 1000; // 5 minutes
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private static readonly STORAGE_KEY = 'rate_limit_data';

  private static getRateLimitData(): Record<string, RateLimitEntry> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private static saveRateLimitData(data: Record<string, RateLimitEntry>): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private static cleanupOldEntries(data: Record<string, RateLimitEntry>): void {
    const now = Date.now();
    Object.entries(data).forEach(([key, entry]) => {
      if (now - entry.lastAttempt > this.LOCKOUT_DURATION) {
        delete data[key];
      }
    });
  }

  static checkRateLimit(key: string): { allowed: boolean; waitTime: number } {
    const now = Date.now();
    const data = this.getRateLimitData();
    this.cleanupOldEntries(data);

    const entry = data[key] || {
      attempts: 0,
      firstAttempt: now,
      lastAttempt: now,
    };

    // Check if in lockout period
    if (entry.attempts >= this.MAX_ATTEMPTS) {
      const timeSinceLastAttempt = now - entry.lastAttempt;
      if (timeSinceLastAttempt < this.LOCKOUT_DURATION) {
        return {
          allowed: false,
          waitTime: this.LOCKOUT_DURATION - timeSinceLastAttempt,
        };
      }
      // Reset after lockout period
      entry.attempts = 0;
      entry.firstAttempt = now;
    }

    // Check if we should reset the window
    if (now - entry.firstAttempt > this.TIME_WINDOW) {
      entry.attempts = 0;
      entry.firstAttempt = now;
    }

    // Update attempt count
    entry.attempts++;
    entry.lastAttempt = now;
    data[key] = entry;
    this.saveRateLimitData(data);

    return {
      allowed: entry.attempts <= this.MAX_ATTEMPTS,
      waitTime: entry.attempts >= this.MAX_ATTEMPTS ? this.LOCKOUT_DURATION : 0,
    };
  }

  static resetRateLimit(key: string): void {
    const data = this.getRateLimitData();
    delete data[key];
    this.saveRateLimitData(data);
  }
} 