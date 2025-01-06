type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogConfig {
  level: LogLevel;
  enabled: boolean;
  prefix?: string;
}

class Logger {
  private static instance: Logger;
  private config: LogConfig = {
    level: 'info',
    enabled: process.env.NODE_ENV !== 'production',
    prefix: '🚀 [Portfolio]'
  };

  private readonly levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return (
      this.config.enabled &&
      this.levelPriority[level] >= this.levelPriority[this.config.level]
    );
  }

  private formatMessage(message: string): string {
    return `${this.config.prefix} ${message}`;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage(message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage(message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(message), ...args);
    }
  }

  error(message: string, error?: Error, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage(message), error, ...args);
    }
  }

  setConfig(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export const logger = Logger.getInstance(); 