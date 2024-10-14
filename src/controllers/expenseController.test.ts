import request from "supertest";
import express from "express";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./expenseController";
import { Expense } from "../models/expenseModel";

jest.mock("../models/expenseModel"); // Mock the Expense model

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.get("/expenses", getExpenses);
app.post("/expenses", createExpense);
app.put("/expenses/:id", updateExpense);
app.delete("/expenses/:id", deleteExpense);

describe("Expense Controller", () => {
  const userId = "12345";

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe("GET /expenses", () => {
    it("should return all expenses for the authenticated user", async () => {
      const expenses = [
        {
          title: "Groceries",
          amount: 50,
          category: "Food",
          date: "2024-01-01",
          userId,
        },
      ];
      (Expense.find as jest.Mock).mockResolvedValue(expenses); // Mock the find method

      const response = await request(app).get("/expenses").send({ userId });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expenses);
      expect(Expense.find).toHaveBeenCalledWith({ userId });
    });

    it("should return a 500 error if there is a server error", async () => {
      (Expense.find as jest.Mock).mockRejectedValue(
        new Error("Database Error")
      );

      const response = await request(app).get("/expenses").send({ userId });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server Error" });
    });
  });

  describe("POST /expenses", () => {
    it("should create a new expense", async () => {
      const expenseData = {
        title: "Rent",
        amount: 1000,
        category: "Housing",
        date: "2024-01-01",
        userId,
      };
      const newExpense = { ...expenseData, _id: "1" };
      (Expense.prototype.save as jest.Mock).mockResolvedValue(newExpense); // Mock the save method

      const response = await request(app).post("/expenses").send(expenseData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newExpense);
    });

    it("should return a 500 error if there is a server error", async () => {
      (Expense.prototype.save as jest.Mock).mockRejectedValue(
        new Error("Database Error")
      );

      const expenseData = {
        title: "Rent",
        amount: 1000,
        category: "Housing",
        date: "2024-01-01",
        userId,
      };
      const response = await request(app).post("/expenses").send(expenseData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server Error" });
    });
  });

  describe("PUT /expenses/:id", () => {
    it("should update an expense", async () => {
      const expenseId = "1";
      const expenseData = {
        title: "Rent",
        amount: 1200,
        category: "Housing",
        date: "2024-01-01",
        userId,
      };
      const existingExpense = { _id: expenseId, ...expenseData };
      (Expense.findById as jest.Mock).mockResolvedValue(existingExpense); // Mock the findById method
      (Expense.prototype.save as jest.Mock).mockResolvedValue(existingExpense); // Mock the save method

      const response = await request(app)
        .put(`/expenses/${expenseId}`)
        .send(expenseData);

      expect(response.status).toBe(500);
      expect(Expense.findById).toHaveBeenCalledWith(expenseId);
    });

    it("should return a 404 error if the expense is not found", async () => {
      const expenseId = "1";
      (Expense.findById as jest.Mock).mockResolvedValue(null); // Mock expense not found

      const response = await request(app)
        .put(`/expenses/${expenseId}`)
        .send({ userId });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Expense not found" });
    });

    it("should return a 403 error if the user is unauthorized", async () => {
      const expenseId = "1";
      const existingExpense = { _id: expenseId, userId: "wrongUserId" }; // Simulate unauthorized user
      (Expense.findById as jest.Mock).mockResolvedValue(existingExpense);

      const response = await request(app)
        .put(`/expenses/${expenseId}`)
        .send({ userId: "12345" });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: "Unauthorized" });
    });

    it("should return a 500 error if there is a server error", async () => {
      const expenseId = "1";
      (Expense.findById as jest.Mock).mockRejectedValue(
        new Error("Database Error")
      );

      const response = await request(app)
        .put(`/expenses/${expenseId}`)
        .send({ userId });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server Error" });
    });
  });

  describe("DELETE /expenses/:id", () => {
    it("should delete an expense", async () => {
      const expenseId = "1";
      const existingExpense = { _id: expenseId, userId, deleteOne: jest.fn() }; // Add deleteOne as a mock function
      (Expense.findById as jest.Mock).mockResolvedValue(existingExpense); // Mock findById

      const response = await request(app)
        .delete(`/expenses/${expenseId}`)
        .send({ userId });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Expense deleted" });
      expect(existingExpense.deleteOne).toHaveBeenCalled(); // Ensure deleteOne was called
    });

    it("should return a 404 error if the expense is not found", async () => {
      const expenseId = "1";
      (Expense.findById as jest.Mock).mockResolvedValue(null); // Mock expense not found

      const response = await request(app)
        .delete(`/expenses/${expenseId}`)
        .send({ userId });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Expense not found" });
    });

    it("should return a 403 error if the user is unauthorized", async () => {
      const expenseId = "1";
      const existingExpense = {
        _id: expenseId,
        userId: "wrongUserId",
        deleteOne: jest.fn(),
      }; // Simulate unauthorized user
      (Expense.findById as jest.Mock).mockResolvedValue(existingExpense); // Mock findById

      const response = await request(app)
        .delete(`/expenses/${expenseId}`)
        .send({ userId: "12345" });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: "Unauthorized" });
      expect(existingExpense.deleteOne).not.toHaveBeenCalled(); // Ensure deleteOne was not called
    });

    it("should return a 500 error if there is a server error", async () => {
      const expenseId = "1";
      (Expense.findById as jest.Mock).mockRejectedValue(
        new Error("Database Error")
      );

      const response = await request(app)
        .delete(`/expenses/${expenseId}`)
        .send({ userId });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Server Error" });
    });
  });
});
