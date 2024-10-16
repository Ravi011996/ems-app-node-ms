import mongoose, { Schema, Document } from 'mongoose';
import { IExpense } from '../types';

const ExpenseSchema: Schema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
});

export const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);
