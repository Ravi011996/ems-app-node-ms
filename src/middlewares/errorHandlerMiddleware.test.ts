// error-handler.test.ts

import { Request, Response, NextFunction } from 'express';
import globalErrorHandler from './errorHandlerMiddleware';

// Mock the Request, Response, and NextFunction objects
const mockRequest = {} as Request;
const mockResponse = {} as Response;
mockResponse.status = jest.fn().mockReturnThis(); // Mock method chaining
mockResponse.json = jest.fn();
const mockNext = jest.fn() as NextFunction;

describe('globalErrorHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 500 and a default message when no status code is provided', () => {
    const error = new Error('Something went wrong') as any;

    globalErrorHandler(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong',
      stack: error.stack,
    });
  });

  it('should return the correct status code and message when provided in the error', () => {
    const error = {
      message: 'Not Found',
      statusCode: 404,
    } as any;

    globalErrorHandler(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Not Found',
      stack: error.stack,
    });
  });

  it('should hide the stack trace in production', () => {
    const error = new Error('Server Error') as any;
    process.env.NODE_ENV = 'production'; // Simulate production environment

    globalErrorHandler(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Server Error',
      stack: null,
    });

    process.env.NODE_ENV = 'test'; // Reset to test environment
  });
});
