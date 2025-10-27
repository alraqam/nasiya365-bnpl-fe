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

  private writeLog(level: LogLevel, ...args: any[]): void {
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

<<<<<<< HEAD
  // log(...args: any[]): void {
  //   this.log('log', ...args)
  // }
=======
  log(...args: any[]): void {
    this.writeLog('log', ...args)
  }
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)

  info(...args: any[]): void {
    this.writeLog('info', ...args)
  }

  warn(...args: any[]): void {
    this.writeLog('warn', ...args)
  }

  error(...args: any[]): void {
    this.writeLog('error', ...args)
  }

  debug(...args: any[]): void {
    this.writeLog('debug', ...args)
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
