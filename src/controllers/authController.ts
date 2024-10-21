import { Request, Response } from "express";
import { AuthService } from "../services/index";
import { HTTP_STATUS_CODES, SUCCESS_MESSAGES } from "../constants";
import { sendResponse } from "../utils/responseUtil";

class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    const { username, password, email } = req.body;

    try {
      const userData = await AuthService.register(username, email, password);
       sendResponse(
        res,
        HTTP_STATUS_CODES.CREATED,
        SUCCESS_MESSAGES.CREATED,
        userData
      );
    } catch (error) {
       sendResponse(
        res,
        HTTP_STATUS_CODES.BAD_REQUEST,
        (error as Error).message
      );
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const tokenData = await AuthService.login(email, password);
       sendResponse(
        res,
        HTTP_STATUS_CODES.OK,
        SUCCESS_MESSAGES.LOGGED_IN,
        tokenData
      );
    } catch (error) {
      sendResponse(
        res,
        HTTP_STATUS_CODES.UNAUTHORIZED,
        (error as Error).message
      );
    }
  }
}

export default new AuthController();
