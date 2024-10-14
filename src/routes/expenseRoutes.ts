import express from "express";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expenseController";
import { authenticate } from "../middlewares/authMiddleware";
import { expenseValidator } from "../validators/expenseValidator";
import { validateResult } from "../middlewares/validateResult";

const router = express.Router();

router.get("/expenses", authenticate, getExpenses); // GET all expenses for the user
router.post(
  "/expenses",
  expenseValidator,
  validateResult,
  authenticate,
  createExpense
); // POST create a new expense
router.put("/expenses/:id", authenticate, updateExpense); // PUT update an expense by ID
router.delete("/expenses/:id", authenticate, deleteExpense); // DELETE an expense by ID

export default router;
