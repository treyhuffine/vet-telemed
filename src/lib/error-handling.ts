import { toast } from 'sonner';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

// Error handler for API calls
export async function handleApiError(error: any): Promise<never> {
  console.error('API Error:', error);

  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        throw new ValidationError(data.message || 'Invalid request', data.errors);
      case 401:
        throw new AuthenticationError(data.message);
      case 403:
        throw new AuthorizationError(data.message);
      case 404:
        throw new NotFoundError(data.resource || 'Resource');
      default:
        throw new AppError(
          data.message || 'An error occurred',
          data.code,
          status,
          data
        );
    }
  } else if (error.request) {
    // Request made but no response
    throw new NetworkError('Unable to connect to server');
  } else {
    // Something else happened
    throw new AppError(error.message || 'An unexpected error occurred');
  }
}

// User-friendly error messages
export function getErrorMessage(error: any): string {
  if (error instanceof ValidationError) {
    return error.message;
  }
  
  if (error instanceof AuthenticationError) {
    return 'Please log in to continue';
  }
  
  if (error instanceof AuthorizationError) {
    return 'You do not have permission to perform this action';
  }
  
  if (error instanceof NotFoundError) {
    return error.message;
  }
  
  if (error instanceof NetworkError) {
    return 'Please check your internet connection and try again';
  }
  
  if (error instanceof AppError) {
    return error.message;
  }
  
  // Generic error
  return 'An unexpected error occurred. Please try again.';
}

// Toast notification helper
export function showErrorToast(error: any) {
  const message = getErrorMessage(error);
  
  toast.error(message);
}

// Retry logic for failed operations
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on validation or auth errors
      if (
        error instanceof ValidationError ||
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }
  
  throw lastError;
}

// Form validation helper
export function validateRequired(value: any, fieldName: string): void {
  if (!value || (typeof value === 'string' && !value.trim())) {
    throw new ValidationError(`${fieldName} is required`);
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email address');
  }
}

export function validatePhone(phone: string): void {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
    throw new ValidationError('Invalid phone number');
  }
}

// Safe async operation wrapper
export async function safeAsync<T>(
  operation: () => Promise<T>,
  options?: {
    onError?: (error: any) => void;
    showToast?: boolean;
    fallback?: T;
  }
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    console.error('Safe async error:', error);
    
    if (options?.onError) {
      options.onError(error);
    }
    
    if (options?.showToast !== false) {
      showErrorToast(error);
    }
    
    return options?.fallback;
  }
}