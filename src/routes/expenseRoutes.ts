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

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Retrieve all expenses for the authenticated user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f5f1b2c001c8e4a3e"
 *                   title:
 *                     type: string
 *                     example: "Rent"
 *                   amount:
 *                     type: number
 *                     example: 1200
 *                   category:
 *                     type: string
 *                     example: "Housing"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-01-01"
 *                   userId:
 *                     type: string
 *                     example: "60c72b2f5f1b2c001c8e4a3d"
 *       401:
 *         description: Unauthorized, user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */


router.get("/expenses", authenticate, getExpenses); // GET all expenses for the user

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Rent"
 *               amount:
 *                 type: number
 *                 example: 1200
 *               category:
 *                 type: string
 *                 example: "Housing"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *  
 *     responses:
 *       201:
 *         description: Successfully created expense
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expense created successfully"
 *                 expense:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001c8e4a3e"
 *                     title:
 *                       type: string
 *                       example: "Rent"
 *                     amount:
 *                       type: number
 *                       example: 1200
 *                     category:
 *                       type: string
 *                       example: "Housing"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-01"
 *                     userId:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001c8e4a3d"
 *       400:
 *         description: Bad request if validation fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *       401:
 *         description: Unauthorized, user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */
router.post(
  "/expenses",
  expenseValidator,
  validateResult,
  authenticate,
  createExpense
); 

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update an existing expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the expense to update
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001c8e4a3e"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Rent"
 *               amount:
 *                 type: number
 *                 example: 1300
 *               category:
 *                 type: string
 *                 example: "Housing"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-05"
 *     responses:
 *       200:
 *         description: Successfully updated expense
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expense updated successfully"
 *                 expense:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f5f1b2c001c8e4a3e"
 *                     title:
 *                       type: string
 *                       example: "Rent"
 *                     amount:
 *                       type: number
 *                       example: 1300
 *                     category:
 *                       type: string
 *                       example: "Housing"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-05"
 *       400:
 *         description: Bad request if validation fails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *       401:
 *         description: Unauthorized, user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Expense not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expense not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */
router.put("/expenses/:id", authenticate, updateExpense); // PUT update an expense by ID

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete an existing expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the expense to delete
 *         schema:
 *           type: string
 *           example: "60c72b2f5f1b2c001c8e4a3e"
 *     responses:
 *       200:
 *         description: Successfully deleted expense
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expense deleted successfully"
 *       401:
 *         description: Unauthorized, user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Expense not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expense not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */
router.delete("/expenses/:id", authenticate, deleteExpense); // DELETE an expense by ID

export default router;
