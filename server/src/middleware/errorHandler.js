import { ZodError } from 'zod';

/**
 * Central error handling middleware.
 * Returns consistent, clean JSON error responses across the entire application.
 */
export const errorHandler = (err, req, res, next) => {
  // Handle Zod schema validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Use existing status code if set, otherwise default to 500
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
