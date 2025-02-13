import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from './authMiddleware';

jest.mock('jsonwebtoken'); // Mock the jsonwebtoken library

describe('authenticate middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      header: jest.fn(),
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  it('should return 401 if no token is provided', () => {
    // Arrange
    (req.header as jest.Mock).mockReturnValue(undefined); // No Authorization header

    // Act
    authenticate(req as Request, res as Response, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next and attach userId to req.body if the token is valid', () => {
    // Arrange
    const token = 'validToken';
    (req.header as jest.Mock).mockReturnValue(`Bearer ${token}`);
    
    const decoded = { userId: '12345' };
    (jwt.verify as jest.Mock).mockReturnValue(decoded); // Mock valid token decoding

    // Act
    authenticate(req as Request, res as Response, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(req.body.userId).toBe(decoded.userId);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 401 if the token is invalid', () => {
    // Arrange
    const token = 'invalidToken';
    (req.header as jest.Mock).mockReturnValue(`Bearer ${token}`);
    
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Act
    authenticate(req as Request, res as Response, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
    expect(next).not.toHaveBeenCalled();
  });
});
