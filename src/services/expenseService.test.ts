import {ExpenseService} from "../services/index";
import { Expense } from "../models/index";
import {ERROR_MESSAGES,SUCCESS_MESSAGES } from "../constants";
import { IExpense } from "../types";

jest.mock("../models/expenseModel", () => ({
  Expense: {
    find: jest.fn(),
    prototype: {
      save: jest.fn(), 
    },
    findById: jest.fn(),
  },
}));

describe("ExpenseService", () => {

  const mockUpdateData = {
    title: "Updated Expense",
    amount: 200,
    category: "Food",
    date: "2024-10-14",
    userId: "testUserId",
  };

  describe("getExpenses", () => {
    it("should return expenses for the given userId", async () => {
      const mockExpenses = [{ title: "Expense 1", amount: 100 }];
      (Expense.find as jest.Mock).mockResolvedValue(mockExpenses);

      const result = await ExpenseService.getExpenses("testUserId");

      expect(Expense.find).toHaveBeenCalledWith({ userId: "testUserId" });
      expect(result).toEqual(mockExpenses);
    });

    it("should throw an error if there is a server error", async () => {
      (Expense.find as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(ExpenseService.getExpenses("testUserId")).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR);
    });
  });

  describe("createExpense", () => {

    it("should throw an error if there is a server error", async () => {
      (Expense.prototype.save as jest.Mock).mockRejectedValue(new Error("Database error"));
      const sampleExpense: IExpense = {
        title: "Grocery Shopping",
        amount: 150.75,
        category: "Food",
        date: "2024-10-21",
        userId: "testUserId123",
    };
      await expect(ExpenseService.createExpense(sampleExpense)).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR);
    });
  });

  describe("updateExpense", () => {
    it("should update and return the updated expense", async () => {
      const mockExistingExpense = {
        _id: "testId",
        title: "Old Expense",
        amount: 150,
        category: "Shopping",
        date: "2024-10-10",
        userId: "testUserId",
        save: jest.fn().mockResolvedValue({
          _id: "testId",
          title: "Updated Expense",
          amount: 200,
          category: "Food",
          date: "2024-10-14",
        }),
      };

      (Expense.findById as jest.Mock).mockResolvedValue(mockExistingExpense);

    

      const result = await ExpenseService.updateExpense("testId", mockUpdateData);

      expect(Expense.findById).toHaveBeenCalledWith("testId");
      expect(mockExistingExpense.save).toHaveBeenCalled();
      expect(result).toEqual({
        _id: "testId",
        title: "Updated Expense",
        amount: 200,
        category: "Food",
        date: "2024-10-14",
      });
    });

    it("should throw an error if the expense is not found", async () => {
      (Expense.findById as jest.Mock).mockResolvedValue(null);

      await expect(ExpenseService.updateExpense("nonExistentId", mockUpdateData)).rejects.toThrow(ERROR_MESSAGES.NOT_FOUND);
    });

    it("should throw an error if the user is unauthorized", async () => {
      const mockExistingExpense = {
        _id: "testId",
        userId: "differentUserId", 
        save: jest.fn(),
      };

      (Expense.findById as jest.Mock).mockResolvedValue(mockExistingExpense);

      await expect(ExpenseService.updateExpense("testId", { userId: "testUserId" })).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });
  });

  describe("deleteExpense", () => {
    it("should delete the expense and return a success message", async () => {
      const mockExistingExpense = {
        _id: "testId",
        userId: "testUserId",
        deleteOne: jest.fn().mockResolvedValue({}),
      };

      (Expense.findById as jest.Mock).mockResolvedValue(mockExistingExpense);

      const result = await ExpenseService.deleteExpense("testId", "testUserId");

      expect(Expense.findById).toHaveBeenCalledWith("testId");
      expect(mockExistingExpense.deleteOne).toHaveBeenCalled();
      expect(result).toEqual({ message: SUCCESS_MESSAGES.DELETED});
    });

    it("should throw an error if the expense is not found", async () => {
      (Expense.findById as jest.Mock).mockResolvedValue(null);

      await expect(ExpenseService.deleteExpense("nonExistentId", "testUserId")).rejects.toThrow(ERROR_MESSAGES.NOT_FOUND);
    });

    it("should throw an error if the user is unauthorized", async () => {
      const mockExistingExpense = {
        _id: "testId",
        userId: "differentUserId", 
        deleteOne: jest.fn(),
      };

      (Expense.findById as jest.Mock).mockResolvedValue(mockExistingExpense);

      await expect(ExpenseService.deleteExpense("testId", "testUserId")).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });
  });
});
