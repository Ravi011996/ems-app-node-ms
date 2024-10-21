import { ExpenseService } from '../services/index';
import { Expense } from '../models/index';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import { IExpense } from '../types';
import { mockExpenseData } from '../mocks/index';

jest.mock('../models/expenseModel', () => ({
  Expense: {
    find: jest.fn(),
    prototype: {
      save: jest.fn(),
    },
    findById: jest.fn(),
  },
}));

describe('ExpenseService', () => {
  const { title, amount, category, date, userId, _id } = mockExpenseData;

  describe('getExpenses', () => {
    it('should return expenses for the given userId', async () => {
      const mockExpenses = [{ title: 'Expense 1', amount: 100 }];
      (Expense.find as jest.Mock).mockResolvedValue(mockExpenses);

      const result = await ExpenseService.getExpenses(userId);

      expect(Expense.find).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(mockExpenses);
    });

    it('should throw an error if there is a server error', async () => {
      (Expense.find as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(ExpenseService.getExpenses(userId)).rejects.toThrow(
        ERROR_MESSAGES.SERVER_ERROR
      );
    });
  });

  describe('createExpense', () => {
    it('should throw an error if there is a server error', async () => {
      (Expense.prototype.save as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );
      const sampleExpense: IExpense = mockExpenseData;
      await expect(ExpenseService.createExpense(sampleExpense)).rejects.toThrow(
        ERROR_MESSAGES.SERVER_ERROR
      );
    });
  });

  describe('updateExpense', () => {
    it('should update and return the updated expense', async () => {
      const mockExistingExpense = {
        _id,
        title: 'Old Expense',
        amount,
        category,
        date,
        userId,
        save: jest.fn().mockResolvedValue({
          _id,
          title,
          amount,
          category,
          date,
        }),
      };

      (Expense.findById as jest.Mock).mockResolvedValue(mockExistingExpense);

      const result = await ExpenseService.updateExpense(_id, mockExpenseData);

      expect(Expense.findById).toHaveBeenCalledWith('testId');
      expect(mockExistingExpense.save).toHaveBeenCalled();
      expect(result).toEqual({
        _id,
        title,
        amount,
        category,
        date,
      });
    });

    it('should throw an error if the expense is not found', async () => {
      (Expense.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        ExpenseService.updateExpense('nonExistentId', mockExpenseData)
      ).rejects.toThrow(ERROR_MESSAGES.NOT_FOUND);
    });

    it('should throw an error if the user is unauthorized', async () => {
      const mockExistingExpense = {
        _id,
        userId: 'differentUserId',
        save: jest.fn(),
      };

      (Expense.findById as jest.Mock).mockResolvedValue(mockExistingExpense);

      await expect(
        ExpenseService.updateExpense(_id, { userId })
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });
  });

  describe('deleteExpense', () => {
    it('should delete the expense and return a success message', async () => {
      const mockExistingExpense = {
        _id: 'testId',
        userId: 'testUserId',
        deleteOne: jest.fn().mockResolvedValue({}),
      };

      (Expense.findById as jest.Mock).mockResolvedValue(mockExistingExpense);

      const result = await ExpenseService.deleteExpense(_id, userId);

      expect(Expense.findById).toHaveBeenCalledWith(_id);
      expect(mockExistingExpense.deleteOne).toHaveBeenCalled();
      expect(result).toEqual({ message: SUCCESS_MESSAGES.DELETED });
    });

    it('should throw an error if the expense is not found', async () => {
      (Expense.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        ExpenseService.deleteExpense('nonExistentId', userId)
      ).rejects.toThrow(ERROR_MESSAGES.NOT_FOUND);
    });

    it('should throw an error if the user is unauthorized', async () => {
      const mockExistingExpense = {
        _id,
        userId: 'differentUserId',
        deleteOne: jest.fn(),
      };

      (Expense.findById as jest.Mock).mockResolvedValue(mockExistingExpense);

      await expect(
        ExpenseService.deleteExpense(_id, userId)
      ).rejects.toThrow(ERROR_MESSAGES.UNAUTHORIZED);
    });
  });
});
