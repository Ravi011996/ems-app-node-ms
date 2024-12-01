import { body } from 'express-validator';

export const expenseValidator = [
    body('title')
        .isString().withMessage('Title must be a string')
        .notEmpty().withMessage('Title is required'),
    
    body('amount')
        .isNumeric().withMessage('Amount must be a number')
        .custom(value => value > 0).withMessage('Amount must be greater than 0'),
    
    body('category')
        .isString().withMessage('Category must be a string')
        .notEmpty().withMessage('Category is required'),
    
    body('date')
        .isISO8601().withMessage('Date must be in ISO8601 format (YYYY-MM-DD)')
        .toDate().withMessage('Invalid date format'),
];
