import { Request, Response } from "express";
import ExpenseController from "../controllers/expenseController";
import { ExpenseService } from "../services";
import { HTTP_STATUS_CODES, SUCCESS_MESSAGES} from "../constants/common";
import { sendResponse } from "../utils/responseUtil";

jest.mock("../services", () => ({
  ExpenseService: {
    getExpenses: jest.fn(),
    createExpense: jest.fn(),
    updateExpense: jest.fn(),
    deleteExpense: jest.fn(),
  },
}));

jest.mock("../utils/responseUtil", () => ({
  sendResponse: jest.fn(),
}));

describe("ExpenseController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {} };
    res = {};
  });

  describe("getExpenses", () => {
    it("should return expenses with status 200", async () => {
      const mockExpenses = [{ title: "Expense 1", amount: 100 }];
      (ExpenseService.getExpenses as jest.Mock).mockResolvedValue(mockExpenses);

      req.body = { userId: "testUserId" };

      await ExpenseController.getExpenses(req as Request, res as Response);

      expect(ExpenseService.getExpenses).toHaveBeenCalledWith("testUserId");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        HTTP_STATUS_CODES.OK,
        SUCCESS_MESSAGES.FETCHED,
        mockExpenses
      );
    });

    it("should return 500 if there is an error", async () => {
      const mockError = new Error("Server error");
      (ExpenseService.getExpenses as jest.Mock).mockRejectedValue(mockError);

      await ExpenseController.getExpenses(req as Request, res as Response);

      expect(sendResponse).toHaveBeenCalledWith(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        mockError.message
      );
    });
  });

  describe("createExpense", () => {
    it("should create an expense and return status 201", async () => {
      const mockExpense = { title: "New Expense", amount: 200 };
      (ExpenseService.createExpense as jest.Mock).mockResolvedValue(mockExpense);

      req.body = mockExpense;

      await ExpenseController.createExpense(req as Request, res as Response);

      expect(ExpenseService.createExpense).toHaveBeenCalledWith(mockExpense);
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        HTTP_STATUS_CODES.CREATED,
        SUCCESS_MESSAGES.CREATED,
        mockExpense
      );
    });

    it("should return 500 if there is an error", async () => {
      const mockError = new Error("Server error");
      (ExpenseService.createExpense as jest.Mock).mockRejectedValue(mockError);

      await ExpenseController.createExpense(req as Request, res as Response);

      expect(sendResponse).toHaveBeenCalledWith(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        mockError.message
      );
    });
  });

  describe("updateExpense", () => {
    it("should update an expense and return status 200", async () => {
      const mockUpdatedExpense = { title: "Updated Expense", amount: 150 };
      (ExpenseService.updateExpense as jest.Mock).mockResolvedValue(mockUpdatedExpense);

      req.params = { id: "testExpenseId" };
      req.body = { title: "Updated Expense", amount: 150 };

      await ExpenseController.updateExpense(req as Request, res as Response);

      expect(ExpenseService.updateExpense).toHaveBeenCalledWith(
        "testExpenseId",
        req.body
      );
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        HTTP_STATUS_CODES.OK,
        SUCCESS_MESSAGES.UPDATED,
        mockUpdatedExpense
      );
    });

    it("should return 500 if there is an error", async () => {
      const mockError = new Error("Server error");
      (ExpenseService.updateExpense as jest.Mock).mockRejectedValue(mockError);

      req.params = { id: "testExpenseId" };

      await ExpenseController.updateExpense(req as Request, res as Response);

      expect(sendResponse).toHaveBeenCalledWith(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        mockError.message
      );
    });
  });

  describe("deleteExpense", () => {
    it("should delete an expense and return status 200", async () => {
      const mockResult = { message: "Expense deleted" };
      (ExpenseService.deleteExpense as jest.Mock).mockResolvedValue(mockResult);

      req.params = { id: "testExpenseId" };
      req.body = { userId: "testUserId" };

      await ExpenseController.deleteExpense(req as Request, res as Response);

      expect(ExpenseService.deleteExpense).toHaveBeenCalledWith(
        "testExpenseId",
        "testUserId"
      );
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        HTTP_STATUS_CODES.OK,
        SUCCESS_MESSAGES.DELETED,
        mockResult
      );
    });

    it("should return 500 if there is an error", async () => {
      const mockError = new Error("Server error");
      (ExpenseService.deleteExpense as jest.Mock).mockRejectedValue(mockError);

      req.params = { id: "testExpenseId" };

      await ExpenseController.deleteExpense(req as Request, res as Response);

      expect(sendResponse).toHaveBeenCalledWith(
        res,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        mockError.message
      );
    });
  });
});
