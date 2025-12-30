/**
 * API Error Classes
 * Custom error types for different API failure scenarios.
 */

import type { ApiErrorCode, ApiErrorResponse } from './types'

/**
 * Base API Error class
 * All API errors extend this class for consistent handling.
 */
export class ApiError extends Error implements ApiErrorResponse {
  public readonly code: ApiErrorCode
  public readonly statusCode: number
  public readonly details?: Record<string, string[]>
  public readonly timestamp: string

  constructor(
    code: ApiErrorCode,
    message: string,
    statusCode: number,
    details?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date().toISOString()

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  toJSON(): ApiErrorResponse {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    }
  }
}

/**
 * Validation Error (400)
 * Thrown when request data fails validation rules.
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, string[]>) {
    super('VALIDATION_ERROR', message, 400, details)
    this.name = 'ValidationError'
  }

  /**
   * Create from field errors
   */
  static fromFields(errors: Record<string, string[]>): ValidationError {
    const fieldCount = Object.keys(errors).length
    const message = `Validation failed for ${fieldCount} field${fieldCount > 1 ? 's' : ''}`
    return new ValidationError(message, errors)
  }
}

/**
 * Not Found Error (404)
 * Thrown when requested resource doesn't exist.
 */
export class NotFoundError extends ApiError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`
    super('NOT_FOUND', message, 404)
    this.name = 'NotFoundError'
  }
}

/**
 * Conflict Error (409)
 * Thrown when operation conflicts with existing data (e.g., duplicate email).
 */
export class ConflictError extends ApiError {
  constructor(message: string, details?: Record<string, string[]>) {
    super('CONFLICT', message, 409, details)
    this.name = 'ConflictError'
  }

  /**
   * Create for duplicate field value
   */
  static duplicate(field: string, value: string): ConflictError {
    return new ConflictError(`${field} '${value}' already exists`, {
      [field]: [`This ${field} is already in use`],
    })
  }
}

/**
 * Unauthorized Error (401)
 * Thrown when authentication is required but missing/invalid.
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required') {
    super('UNAUTHORIZED', message, 401)
    this.name = 'UnauthorizedError'
  }
}

/**
 * Forbidden Error (403)
 * Thrown when user doesn't have permission for the action.
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'You do not have permission to perform this action') {
    super('FORBIDDEN', message, 403)
    this.name = 'ForbiddenError'
  }
}

/**
 * Network Error (0 / timeout)
 * Simulates network failures.
 */
export class NetworkError extends ApiError {
  constructor(message = 'Network request failed') {
    super('NETWORK_ERROR', message, 0)
    this.name = 'NetworkError'
  }
}

/**
 * Internal Error (500)
 * Simulates server-side errors.
 */
export class InternalError extends ApiError {
  constructor(message = 'An unexpected error occurred') {
    super('INTERNAL_ERROR', message, 500)
    this.name = 'InternalError'
  }
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/**
 * Extract error message safely from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
