import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack); 
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default globalErrorHandler;
