// error-handler.ts

import { Request, Response, NextFunction } from "express";

// Define an interface for custom error objects
interface CustomError extends Error {
  statusCode?: number;
}

// Global error handling middleware
const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack); // Log the error stack for debugging purposes

  const statusCode = err.statusCode || 500; // Use error status code, or default to 500 (Internal Server Error)
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    // Only show stack trace if not in production
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default globalErrorHandler;
