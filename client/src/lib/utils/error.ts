import { toast } from 'sonner'
import { ZodError } from 'zod'

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'APP_ERROR',
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 503)
    this.name = 'NetworkError'
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function handleError(error: unknown): string {
  // Log the error for debugging
  console.error('Error caught:', error)

  // Handle different types of errors
  if (error instanceof ZodError) {
    const firstError = error.errors[0]
    return firstError?.message || 'Validation failed'
  }

  if (error instanceof AuthError) {
    return error.message
  }

  if (error instanceof ValidationError) {
    return error.message
  }

  if (error instanceof NetworkError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

interface ToastErrorOptions {
  title?: string
  description?: string
}

export function toastError(error: unknown, options: ToastErrorOptions = {}) {
  const message = handleError(error)
  toast.error(options.title || 'Error', {
    description: options.description || message,
  })
}

export function toastSuccess(title: string, description?: string) {
  toast.success(title, {
    description,
  })
}

export function toastInfo(title: string, description?: string) {
  toast.info(title, {
    description,
  })
}

export function toastWarning(title: string, description?: string) {
  toast.warning(title, {
    description,
  })
} 