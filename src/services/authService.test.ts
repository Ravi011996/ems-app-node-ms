import { AuthService } from "../services/index";
import {UserModel} from "../models/index";
import {ERROR_MESSAGES} from "../constants/common";
import { mockExistingUser, mockNewUser, mockToken, mockUserForLogin,testUser} from "../mocks/index"

import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../utils/index";

jest.mock("../models/auth");
jest.mock("../utils/authUtils");

describe("AuthService", () => {
  const {hashedpassword,user,mail,password,nonexistentuser,wrongpassword} = testUser;
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue(hashedpassword);

      (UserModel as unknown as jest.Mock).mockImplementation(() => mockNewUser);

      await AuthService.register(
        user,
        mail,
        password
      );

      expect(UserModel.findOne).toHaveBeenCalledWith({
        $or: [{ email: mail }, { username: user }],
      });
      expect(hashPassword).toHaveBeenCalledWith(password);
      expect(mockNewUser.save).toHaveBeenCalled();
    });

    it("should throw an error if user already exists", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({
        email: mockExistingUser.email,
      });

      await expect(
        AuthService.register(user, mockExistingUser.email, password)
      ).rejects.toThrow(ERROR_MESSAGES.ALREADY_EXITS);

      expect(UserModel.findOne).toHaveBeenCalledWith({
        $or: [{ email: mockExistingUser.email }, { username: user }],
      });
      expect(hashPassword).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login a user with valid credentials", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUserForLogin);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue(mockToken);

      const result = await AuthService.login(
        mail,
        password
      );

      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: mail
      });
      expect(comparePassword).toHaveBeenCalledWith(
        password,
        hashedpassword
      );
      expect(generateToken).toHaveBeenCalledWith(mockUserForLogin._id);
      expect(result).toEqual({ token: mockToken });
    });

    it("should throw an error if the user is not found", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login(nonexistentuser, password)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);

      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: nonexistentuser,
      });
      expect(comparePassword).not.toHaveBeenCalled();
    });

    it("should throw an error if password does not match", async () => {
      
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUserForLogin);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        AuthService.login(mail, wrongpassword)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);

      expect(comparePassword).toHaveBeenCalledWith(
        wrongpassword,
        hashedpassword
      );
    });
  });
});
