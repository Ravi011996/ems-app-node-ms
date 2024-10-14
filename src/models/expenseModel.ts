import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  title: string;
  amount: number;
  category: string;
  date: string;
  userId: string;
}

const ExpenseSchema: Schema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  userId: { type: String, required: true }, // Associated user ID
});

export const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);
