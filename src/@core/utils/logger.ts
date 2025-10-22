/**
 * Centralized logging utility
 * Only logs in development environment
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private log(level: LogLevel, ...args: any[]): void {
    if (!this.isDevelopment && level !== 'error') {
      // In production, only log errors
      return
    }

    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`

    switch (level) {
      case 'error':
        console.error(prefix, ...args)
        break
      case 'warn':
        console.warn(prefix, ...args)
        break
      case 'info':
        console.info(prefix, ...args)
        break
      case 'debug':
        console.debug(prefix, ...args)
        break
      default:
        console.log(prefix, ...args)
    }
  }

  log(...args: any[]): void {
    this.log('log', ...args)
  }

  info(...args: any[]): void {
    this.log('info', ...args)
  }

  warn(...args: any[]): void {
    this.log('warn', ...args)
  }

  error(...args: any[]): void {
    this.log('error', ...args)
  }

  debug(...args: any[]): void {
    this.log('debug', ...args)
  }

  // Group related logs together
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(label)
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd()
    }
  }
}

export const logger = new Logger()

