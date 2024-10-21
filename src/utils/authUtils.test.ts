import { hashPassword, comparePassword, generateToken } from './authUtils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Password and Token Utilities', () => {
  describe('hashPassword', () => {
    it('should hash the password correctly', async () => {
      const password = 'myPassword';
      const hashedPassword = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePassword', () => {
    it('should return true if the password matches the hash', async () => {
      const password = 'myPassword';
      const hash = 'hashedPassword';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await comparePassword(password, hash);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('should return false if the password does not match the hash', async () => {
      const password = 'myPassword';
      const hash = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await comparePassword(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const userId = 'userId';
      const token = 'jwtToken';
      (jwt.sign as jest.Mock).mockReturnValue(token);
      process.env.JWT_SECRET = 'testSecret';
      const result = generateToken(userId);
      expect(jwt.sign).toHaveBeenCalledWith({ userId }, 'testSecret', {
        expiresIn: '1h',
      });
      expect(result).toBe(token);
    });
  });
});
