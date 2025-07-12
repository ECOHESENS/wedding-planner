import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { logger } from './logger'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly code?: string

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.code = code
    
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 400, true, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, true, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, true, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, true, 'NOT_FOUND_ERROR')
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, true, 'CONFLICT_ERROR')
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, true, 'RATE_LIMIT_ERROR')
    this.name = 'RateLimitError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, true, 'DATABASE_ERROR')
    this.name = 'DatabaseError'
  }
}

export class FileUploadError extends AppError {
  constructor(message: string = 'File upload failed') {
    super(message, 400, true, 'FILE_UPLOAD_ERROR')
    this.name = 'FileUploadError'
  }
}

// Error handling utilities
export function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    case 'P2002':
      return new ConflictError('A record with this information already exists')
    case 'P2025':
      return new NotFoundError('The requested resource was not found')
    case 'P2003':
      return new ValidationError('Invalid reference to related data')
    case 'P2016':
      return new ValidationError('Query validation failed')
    case 'P2021':
      return new DatabaseError('Database table does not exist')
    case 'P2022':
      return new DatabaseError('Database column does not exist')
    default:
      return new DatabaseError(`Database operation failed: ${error.message}`)
  }
}

export function handleZodError(error: ZodError): ValidationError {
  const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  return new ValidationError(`Validation failed: ${messages.join(', ')}`)
}

// API Error Handler
export function handleApiError(error: unknown, request?: Request): NextResponse {
  let appError: AppError

  // Log the error with context
  const context = request ? {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries())
  } : undefined

  if (error instanceof AppError) {
    appError = error
  } else if (error instanceof ZodError) {
    appError = handleZodError(error)
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    appError = handlePrismaError(error)
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    appError = new ValidationError('Invalid query parameters')
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    appError = new DatabaseError('Database connection failed')
  } else if (error instanceof Error) {
    appError = new AppError(error.message, 500, false)
  } else {
    appError = new AppError('An unexpected error occurred', 500, false)
  }

  // Log the error
  logger.error(`API Error: ${appError.message}`, {
    code: appError.code,
    statusCode: appError.statusCode,
    isOperational: appError.isOperational,
    stack: appError.stack,
    ...context
  })

  // Security: Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  const message = appError.isOperational || isDevelopment 
    ? appError.message 
    : 'An unexpected error occurred'

  return NextResponse.json(
    {
      error: message,
      code: appError.code,
      ...(isDevelopment && { stack: appError.stack })
    },
    { status: appError.statusCode }
  )
}

// Async error wrapper for API routes
export function asyncErrorHandler(
  handler: (request: Request, params?: any) => Promise<Response | NextResponse>
) {
  return async (request: Request, params?: any) => {
    try {
      return await handler(request, params)
    } catch (error) {
      return handleApiError(error, request)
    }
  }
}

// Type guard for checking if error is operational
export function isOperationalError(error: unknown): error is AppError {
  return error instanceof AppError && error.isOperational
}

// Global error handler setup
export function setupGlobalErrorHandler() {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    logger.error('Unhandled Promise Rejection', {
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined
    })
    
    // In production, you might want to restart the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  })

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', {
      message: error.message,
      stack: error.stack
    })
    
    // Always exit on uncaught exception
    process.exit(1)
  })
}

// Initialize error handling
setupGlobalErrorHandler()