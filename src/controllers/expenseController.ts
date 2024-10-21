import { Request, Response } from "express";
import { ExpenseService } from "../services/index";
import { HTTP_STATUS_CODES,SUCCESS_MESSAGES } from "../constants/common";
import { sendResponse } from "../utils/responseUtil";

class ExpenseController {
  public async getExpenses(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      const expenses = await ExpenseService.getExpenses(userId);
      sendResponse(res, HTTP_STATUS_CODES.OK, SUCCESS_MESSAGES.FETCHED, expenses);
    } catch (error) {
      sendResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, (error as Error).message);
    }
  }

  public async createExpense(req: Request, res: Response): Promise<void> {
    try {
      const expense = await ExpenseService.createExpense(req.body);
      sendResponse(res, HTTP_STATUS_CODES.CREATED, SUCCESS_MESSAGES.CREATED, expense);
    } catch (error) {
      sendResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, (error as Error).message);
    }
  }

  public async updateExpense(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedExpense = await ExpenseService.updateExpense(id, req.body);
      sendResponse(res, HTTP_STATUS_CODES.OK, SUCCESS_MESSAGES.UPDATED, updatedExpense);
    } catch (error) {
      sendResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, (error as Error).message);
    }
  }

  public async deleteExpense(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const result = await ExpenseService.deleteExpense(id, userId);
      sendResponse(res, HTTP_STATUS_CODES.OK, SUCCESS_MESSAGES.DELETED, result);
    } catch (error) {
      sendResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, (error as Error).message);
    }
  }
}

export default new ExpenseController();
