import { UserModel } from '../models/index';
import { ERROR_MESSAGES } from '../constants/common';
import { hashPassword, comparePassword, generateToken } from '../utils/index';

class AuthService {
  public async register(username: string, email: string, password: string) {
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.ALREADY_EXITS);
    }

    const hashedPassword = await hashPassword(password);
    const user = new UserModel({ username, email, password: hashedPassword });
    await user.save();

    return {
      email,
      password,
    };
  }

  public async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const token = generateToken(`${user._id}`);
    return { token };
  }
}

export default new AuthService();
