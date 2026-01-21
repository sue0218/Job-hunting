// Simple logger for the application
// In production, replace with a proper logging service (e.g., Pino, Winston, or a cloud logging service)

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
}

const isDevelopment = process.env.NODE_ENV === 'development'

function formatLog(entry: LogEntry): string {
  const dataStr = entry.data ? ` ${JSON.stringify(entry.data)}` : ''
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${dataStr}`
}

function createLogEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
  return {
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
  }
}

export const logger = {
  debug: (message: string, data?: unknown) => {
    if (isDevelopment) {
      const entry = createLogEntry('debug', message, data)
      console.debug(formatLog(entry))
    }
  },

  info: (message: string, data?: unknown) => {
    const entry = createLogEntry('info', message, data)
    if (isDevelopment) {
      console.info(formatLog(entry))
    }
    // In production, send to logging service
  },

  warn: (message: string, data?: unknown) => {
    const entry = createLogEntry('warn', message, data)
    console.warn(formatLog(entry))
  },

  error: (message: string, error?: unknown) => {
    const entry = createLogEntry('error', message, error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: isDevelopment ? error.stack : undefined,
    } : error)
    console.error(formatLog(entry))
  },
}
