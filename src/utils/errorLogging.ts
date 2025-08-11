
/**
 * Basic error logging and monitoring utilities
 */

export interface ErrorContext {
  user?: string;
  route?: string;
  action?: string;
  environment?: string;
  production?: boolean;
  metadata?: Record<string, any>;
}

export class ErrorLogger {
  private static instance: ErrorLogger;
  
  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  logError(error: Error, context?: ErrorContext): void {
    const timestamp = new Date().toISOString();
    const errorData = {
      timestamp,
      message: error.message,
      stack: error.stack,
      name: error.name,
      context
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group(`🚨 Error: ${error.message}`);
      console.error('Error object:', error);
      if (context) {
        console.log('Context:', context);
      }
      console.groupEnd();
    }

    // In production, you could send to an error tracking service
    if (import.meta.env.PROD) {
      // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
      console.error('Error logged:', errorData);
    }
  }

  logWarning(message: string, context?: ErrorContext): void {
    const timestamp = new Date().toISOString();
    const warningData = {
      timestamp,
      message,
      level: 'warning',
      context
    };

    if (import.meta.env.DEV) {
      console.warn(`⚠️ Warning: ${message}`, context);
    }

    if (import.meta.env.PROD) {
      console.warn('Warning logged:', warningData);
    }
  }

  logInfo(message: string, context?: ErrorContext): void {
    const timestamp = new Date().toISOString();
    const infoData = {
      timestamp,
      message,
      level: 'info',
      context
    };

    console.log(`ℹ️ ${message}`, context);
  }
}

export const errorLogger = ErrorLogger.getInstance();

// Global error handler
export const setupGlobalErrorHandling = (): void => {
  // Handle unhandled promises
  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.logError(
      new Error(`Unhandled promise rejection: ${event.reason}`),
      { action: 'unhandled_promise_rejection' }
    );
  });

  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    errorLogger.logError(
      new Error(event.message),
      { 
        action: 'javascript_error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      }
    );
  });
};
