import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { register, login } from './authController';
import UserModel from '../models/User';

const app = express();
app.use(express.json());
app.post('/register', register);
app.post('/login', login);

jest.mock('../models/User'); // Mock UserModel
jest.mock('bcryptjs'); // Mock bcrypt
jest.mock('jsonwebtoken'); // Mock jwt

describe('Auth Controller', () => {
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const mockUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(null); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword'); // Mock hashed password
      (UserModel.prototype.save as jest.Mock).mockResolvedValue(null); // Mock save

      const response = await request(app)
        .post('/register')
        .send(mockUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        error: false,
        message: 'User registered successfully',
        data: { email: mockUser.email, password: mockUser.password },
      });
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(UserModel.prototype.save).toHaveBeenCalled();
    });

    it('should return 400 if user already exists', async () => {
      const mockUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser); // Existing user

      const response = await request(app)
        .post('/register')
        .send(mockUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'User already exists' });
    });

    it('should return 500 on server error', async () => {
      const mockUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      (UserModel.findOne as jest.Mock).mockRejectedValue(new Error('DB Error')); // Mock error
      const response = await request(app)
        .post('/register')
        .send(mockUser);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });

  describe('POST /login', () => {
    it('should login a user and return a token', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'password123',
        _id: 'userId',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser); // Mock existing user
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Password matches
      (jwt.sign as jest.Mock).mockReturnValue('mockedToken'); // Mock JWT token

      const response = await request(app)
        .post('/login')
        .send({ email: mockUser.email, password: mockUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: 'mockedToken' });
    });

    it('should return 401 if user is not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null); // No user found

      const response = await request(app)
        .post('/login')
        .send({ email: 'notfound@example.com', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid credentials' });
    });

    it('should return 401 if password does not match', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser); // Mock existing user
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Password does not match

      const response = await request(app)
        .post('/login')
        .send({ email: mockUser.email, password: 'wrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid credentials' });
    });

    it('should return 500 on server error', async () => {
      (UserModel.findOne as jest.Mock).mockRejectedValue(new Error('DB Error')); // Mock error
      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Server error' });
    });
  });
});
