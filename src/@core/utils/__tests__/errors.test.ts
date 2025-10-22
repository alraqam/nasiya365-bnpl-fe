import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  NetworkError,
  isAppError,
  getErrorMessage,
  parseApiError
} from '../errors'

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create error with correct properties', () => {
      const error = new AppError('Test error', 500)
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(500)
      expect(error.isOperational).toBe(true)
    })

    it('should be instance of Error', () => {
      const error = new AppError('Test error')
      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(AppError)
    })
  })

  describe('ValidationError', () => {
    it('should create validation error with errors object', () => {
      const errors = { email: ['Invalid email'], password: ['Too short'] }
      const error = new ValidationError('Validation failed', errors)
      
      expect(error.message).toBe('Validation failed')
      expect(error.statusCode).toBe(400)
      expect(error.errors).toEqual(errors)
    })
  })

  describe('AuthenticationError', () => {
    it('should create authentication error with 401 status', () => {
      const error = new AuthenticationError()
      expect(error.statusCode).toBe(401)
      expect(error.message).toBe('Authentication failed')
    })
  })

  describe('AuthorizationError', () => {
    it('should create authorization error with 403 status', () => {
      const error = new AuthorizationError()
      expect(error.statusCode).toBe(403)
      expect(error.message).toBe('Access denied')
    })
  })

  describe('NotFoundError', () => {
    it('should create not found error with 404 status', () => {
      const error = new NotFoundError()
      expect(error.statusCode).toBe(404)
      expect(error.message).toBe('Resource not found')
    })
  })

  describe('NetworkError', () => {
    it('should create network error', () => {
      const error = new NetworkError()
      expect(error.statusCode).toBe(0)
      expect(error.isOperational).toBe(false)
    })
  })
})

describe('Error Utilities', () => {
  describe('isAppError', () => {
    it('should return true for AppError instances', () => {
      const error = new AppError('Test')
      expect(isAppError(error)).toBe(true)
    })

    it('should return false for regular errors', () => {
      const error = new Error('Test')
      expect(isAppError(error)).toBe(false)
    })

    it('should return false for non-error values', () => {
      expect(isAppError('string')).toBe(false)
      expect(isAppError(null)).toBe(false)
      expect(isAppError(undefined)).toBe(false)
    })
  })

  describe('getErrorMessage', () => {
    it('should extract message from Error', () => {
      const error = new Error('Test error')
      expect(getErrorMessage(error)).toBe('Test error')
    })

    it('should return string as is', () => {
      expect(getErrorMessage('Error string')).toBe('Error string')
    })

    it('should extract message from object', () => {
      const error = { message: 'Test error' }
      expect(getErrorMessage(error)).toBe('Test error')
    })

    it('should return default message for unknown types', () => {
      expect(getErrorMessage(null)).toBe('An unknown error occurred')
      expect(getErrorMessage(undefined)).toBe('An unknown error occurred')
    })
  })

  describe('parseApiError', () => {
    it('should parse 401 error as AuthenticationError', () => {
      const apiError = { status: 401, message: 'Unauthorized' }
      const error = parseApiError(apiError)
      
      expect(error).toBeInstanceOf(AuthenticationError)
      expect(error.statusCode).toBe(401)
    })

    it('should parse 403 error as AuthorizationError', () => {
      const apiError = { status: 403, message: 'Forbidden' }
      const error = parseApiError(apiError)
      
      expect(error).toBeInstanceOf(AuthorizationError)
      expect(error.statusCode).toBe(403)
    })

    it('should parse 404 error as NotFoundError', () => {
      const apiError = { status: 404, message: 'Not found' }
      const error = parseApiError(apiError)
      
      expect(error).toBeInstanceOf(NotFoundError)
      expect(error.statusCode).toBe(404)
    })

    it('should parse validation errors', () => {
      const apiError = {
        status: 400,
        message: 'Validation failed',
        errors: { email: ['Invalid'] }
      }
      const error = parseApiError(apiError)
      
      expect(error).toBeInstanceOf(ValidationError)
      expect((error as ValidationError).errors).toEqual({ email: ['Invalid'] })
    })

    it('should parse generic errors', () => {
      const apiError = { status: 500, message: 'Server error' }
      const error = parseApiError(apiError)
      
      expect(error).toBeInstanceOf(AppError)
      expect(error.statusCode).toBe(500)
    })
  })
})

