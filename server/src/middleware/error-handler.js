import { ZodError } from 'zod';

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    });
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message:
      statusCode === 500
        ? 'Something went wrong while processing your request'
        : error.message
  });
}
