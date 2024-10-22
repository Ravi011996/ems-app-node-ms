import express from "express";
import { ExpenseController } from "../controllers/index";
import { authenticate,validateResult } from "../middlewares/index";
import { expenseValidator } from "../validators/expenseValidator";

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
