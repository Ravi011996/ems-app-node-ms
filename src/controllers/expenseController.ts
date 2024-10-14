import { Request, Response } from "express";
import { Expense } from "../models/expenseModel";

// GET all expenses for the authenticated user
export const getExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { body } = req;
    const expenses = await Expense.find({ userId: body.userId });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// POST create a new expense
export const createExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, amount, category, date } = req.body;

  try {
    const newExpense = new Expense({
      title,
      amount,
      category,
      date,
      userId: req?.body?.userId, // Attach authenticated user ID
    });

    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// PUT update an expense
export const updateExpense = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const { title, amount, category, date, userId } = req.body;
  const { id } = req.params;

  try {
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Ensure the expense belongs to the authenticated user
    if (expense.userId !== userId) {
      res.status(403).json({ message: "Unauthorized" });
    }

    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;

    const updatedExpense = await expense.save();
    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE an expense
export const deleteExpense = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const { id } = req.params;

  try {
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Ensure the expense belongs to the authenticated user
    if (expense.userId !== req.body.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
