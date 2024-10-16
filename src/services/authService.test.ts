import { AuthService } from "../services/index";
import UserModel from "../models/User";
import {ERROR_MESSAGES,SUCCESS_MESSAGES } from "../constants";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../utils/authUtils";

jest.mock("../models/User");
jest.mock("../utils/authUtils");

describe("AuthService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const mockUser = {
        username: "testuser",
        email: "testuser@example.com",
        password: "hashedpassword",
        save: jest.fn(),
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue("hashedpassword");

      (UserModel as unknown as jest.Mock).mockImplementation(() => mockUser);

      const result = await AuthService.register(
        "testuser",
        "testuser@example.com",
        "password123"
      );

      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: "testuser@example.com",
      });
      expect(hashPassword).toHaveBeenCalledWith("password123");
      expect(mockUser.save).toHaveBeenCalled();
    });

    it("should throw an error if user already exists", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({
        email: "existinguser@example.com",
      });

      await expect(
        AuthService.register("testuser", "existinguser@example.com", "password")
      ).rejects.toThrow(ERROR_MESSAGES.ALREADY_EXITS);

      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: "existinguser@example.com",
      });
      expect(hashPassword).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login a user with valid credentials", async () => {
      const mockUser = {
        _id: "user_id_123",
        email: "testuser@example.com",
        password: "hashedpassword",
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue("mocked-token");

      const result = await AuthService.login(
        "testuser@example.com",
        "password123"
      );

      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: "testuser@example.com",
      });
      expect(comparePassword).toHaveBeenCalledWith(
        "password123",
        "hashedpassword"
      );
      expect(generateToken).toHaveBeenCalledWith("user_id_123");
      expect(result).toEqual({ token: "mocked-token" });
    });

    it("should throw an error if the user is not found", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login("nonexistentuser@example.com", "password123")
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);

      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: "nonexistentuser@example.com",
      });
      expect(comparePassword).not.toHaveBeenCalled();
    });

    it("should throw an error if password does not match", async () => {
      const mockUser = {
        _id: "user_id_123",
        email: "testuser@example.com",
        password: "hashedpassword",
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        AuthService.login("testuser@example.com", "wrongpassword")
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);

      expect(comparePassword).toHaveBeenCalledWith(
        "wrongpassword",
        "hashedpassword"
      );
    });
  });
});
