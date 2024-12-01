import { Request, Response } from 'express';
import AuthController from '../controllers/authController';
import { HTTP_STATUS_CODES, SUCCESS_MESSAGES } from '../constants/common';
import { AuthService } from '../services/index';
import { testUser } from '../mocks/index';

jest.mock('../services/index');

describe('AuthController', () => {
  const { user, mail, password, wrongpassword } = testUser;
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
    it('should register a new user', async () => {
      const mockUserData = { email: mail, username: user };
      req.body = {
        username: user,
        password: password,
        email: mail,
      };

      (AuthService.register as jest.Mock).mockResolvedValue(mockUserData);

      await AuthController.register(req as Request, res as Response);

      expect(AuthService.register).toHaveBeenCalledWith(user, mail, password);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        message: SUCCESS_MESSAGES.CREATED,
        data: mockUserData,
      });
    });

    it('should registration fails', async () => {
      req.body = {
        username: user,
        password: password,
        email: mail,
      };

      (AuthService.register as jest.Mock).mockRejectedValue(
        new Error('User already exists')
      );

      await AuthController.register(req as Request, res as Response);

      expect(AuthService.register).toHaveBeenCalledWith(user, mail, password);
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
      req.body = { email: mail, password };
      (AuthService.login as jest.Mock).mockResolvedValue(mockTokenData);
      await AuthController.login(req as Request, res as Response);
      expect(AuthService.login).toHaveBeenCalledWith(mail, password);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.OK);
      expect(res.json).toHaveBeenCalledWith({
        error: false,
        message: SUCCESS_MESSAGES.LOGGED_IN,
        data: mockTokenData,
      });
    });

    it('should login fails', async () => {
      req.body = {
        email: mail,
        password: wrongpassword,
      };

      (AuthService.login as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials')
      );

      await AuthController.login(req as Request, res as Response);

      expect(AuthService.login).toHaveBeenCalledWith(mail, wrongpassword);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        message: 'Invalid credentials',
      });
    });
  });
});
