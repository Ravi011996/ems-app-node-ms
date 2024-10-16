import { Expense } from "../models/expenseModel";
import { ERROR_MESSAGES,SUCCESS_MESSAGES } from "../constants";

class ExpenseService {
  public async getExpenses(userId: string): Promise<any> {
    try {
      const expenses = await Expense.find({ userId });
      return expenses;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.SERVER_ERROR);
    }
  }

  public async createExpense(data: any): Promise<any> {
    try {
      const { title, amount, category, date, userId } = data;
      const newExpense = new Expense({
        title,
        amount,
        category,
        date,
        userId,
      });
      const expense = await newExpense.save();
      return expense;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.SERVER_ERROR);
    }
  }

  public async updateExpense(id: string, data: any): Promise<any> {
    try {
      const { title, amount, category, date, userId } = data;
      const expense = await Expense.findById(id);

      if (!expense) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      }

      if (expense.userId !== userId) {
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
      }

      expense.title = title || expense.title;
      expense.amount = amount || expense.amount;
      expense.category = category || expense.category;
      expense.date = date || expense.date;

      const updatedExpense = await expense.save();
      return updatedExpense;
    } catch (error) {
      throw new Error((error as Error).message || ERROR_MESSAGES.SERVER_ERROR);
    }
  }

  public async deleteExpense(id: string, userId: string): Promise<any> {
    try {
      const expense = await Expense.findById(id);

      if (!expense) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      }

      if (expense.userId !== userId) {
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
      }

      await expense.deleteOne();
      return { message: SUCCESS_MESSAGES.DELETED };
    } catch (error) {
      throw new Error((error as Error).message || ERROR_MESSAGES.SERVER_ERROR);
    }
  }
}

export default new ExpenseService();
