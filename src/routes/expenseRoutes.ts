import express from "express";
import ExpenseController from "../controllers/expenseController";
import { authenticate } from "../middlewares/authMiddleware";
import { expenseValidator } from "../validators/expenseValidator";
import { validateResult } from "../middlewares/validateResult";

const router = express.Router();

router.get("/expenses", authenticate, ExpenseController.getExpenses);

router.post(
  "/expenses",
  expenseValidator,
  validateResult,
  authenticate,
  ExpenseController.createExpense
);

router.put("/expenses/:id", authenticate, ExpenseController.updateExpense); 

router.delete("/expenses/:id", authenticate, ExpenseController.deleteExpense);

export default router;
