import { Request, Response } from 'express';
import AuthController from '../controllers/authController';
import { HTTP_STATUS_CODES, SUCCESS_MESSAGES } from "../constants";
import { AuthService } from '../services/index';

jest.mock('../services/index');

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return 201 status', async () => {
      const mockUserData = { email: 'test@example.com', username: 'testUser' };
      req.body = {
        username: 'testUser',
        password: 'password123',
        email: 'test@example.com',
      };

      (AuthService.register as jest.Mock).mockResolvedValue(mockUserData);

      await AuthController.register(req as Request, res as Response);

      expect(AuthService.register).toHaveBeenCalledWith(
        'testUser',
        'test@example.com',
        'password123'
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        message: SUCCESS_MESSAGES.CREATED,
        data: mockUserData,
      });
    });

    it('should return 400 if registration fails', async () => {
      req.body = {
        username: 'testUser',
        password: 'password123',
        email: 'test@example.com',
      };

      (AuthService.register as jest.Mock).mockRejectedValue(new Error('User already exists'));

      await AuthController.register(req as Request, res as Response);

      expect(AuthService.register).toHaveBeenCalledWith(
        'testUser',
        'test@example.com',
        'password123'
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        message: 'User already exists',
      });
    });
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      const mockTokenData = { token: 'mockToken' };
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      (AuthService.login as jest.Mock).mockResolvedValue(mockTokenData);

      await AuthController.login(req as Request, res as Response);

      expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.OK);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        message: SUCCESS_MESSAGES.LOGGED_IN,
        data: mockTokenData,
      });
    });

    it('should return 401 if login fails', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      (AuthService.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      await AuthController.login(req as Request, res as Response);

      expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'wrongPassword');
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        message: 'Invalid credentials',
      });
    });
  });
});
