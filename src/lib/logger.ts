import { env } from './env'

export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  userId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  url?: string
  error?: Error
  metadata?: Record<string, unknown>
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    const levels = ['error', 'warn', 'info', 'debug']
    const currentLevel = env.NODE_ENV === 'production' ? 'warn' : 'debug'
    return levels.indexOf(level) <= levels.indexOf(currentLevel)
  }

  private createLogEntry(level: LogLevel, message: string, metadata?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    }
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, userId, sessionId, ip, userAgent, url, error } = entry
    
    let logString = `[${timestamp}] ${level.toUpperCase()}: ${message}`
    
    if (userId) logString += ` | User: ${userId}`
    if (sessionId) logString += ` | Session: ${sessionId}`
    if (ip) logString += ` | IP: ${ip}`
    if (url) logString += ` | URL: ${url}`
    if (userAgent) logString += ` | UA: ${userAgent}`
    if (error) logString += ` | Error: ${error.message} | Stack: ${error.stack}`
    
    return logString
  }

  private writeLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return

    const formattedLog = this.formatLog(entry)
    
    // Console output with colors
    const colors = {
      error: '\x1b[31m',
      warn: '\x1b[33m',
      info: '\x1b[36m',
      debug: '\x1b[90m'
    }
    const reset = '\x1b[0m'
    
    console.log(`${colors[entry.level]}${formattedLog}${reset}`)
    
    // In production, you might want to send to external logging service
    if (env.NODE_ENV === 'production') {
      // TODO: Send to external logging service (e.g., Sentry, LogRocket, etc.)
    }
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry('error', message, metadata)
    this.writeLog(entry)
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry('warn', message, metadata)
    this.writeLog(entry)
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry('info', message, metadata)
    this.writeLog(entry)
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry('debug', message, metadata)
    this.writeLog(entry)
  }

  // Security-specific logging
  security(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry('warn', `[SECURITY] ${message}`, metadata)
    this.writeLog(entry)
  }

  // API request logging
  apiRequest(method: string, url: string, userId?: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry('info', `${method} ${url}`, {
      userId,
      url,
      ...metadata
    })
    this.writeLog(entry)
  }

  // Database operation logging
  dbOperation(operation: string, table: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry('debug', `DB: ${operation} on ${table}`, metadata)
    this.writeLog(entry)
  }
}

export const logger = new Logger()

// Utility function to create request context for logging
export function createRequestContext(request: Request) {
  return {
    ip: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    url: request.url
  }
}